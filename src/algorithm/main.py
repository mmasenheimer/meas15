import os
import googlemaps
import re
from datetime import datetime, timedelta
import sys
import json
from dotenv import load_dotenv
sys.stdout.reconfigure(encoding='utf-8')

# API Configuration

load_dotenv() # Load environment variables from .env file

API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY")
if not API_KEY:
    raise EnvironmentError("Set GOOGfLE_MAPS_API_KEY environment variable.")

gmaps = googlemaps.Client(key=API_KEY)


# Time Functions
def parse_time():
    return datetime.now()


def add_seconds(time_obj, seconds): # Add a number of seconds to a datetime object
    return time_obj + timedelta(seconds=seconds)


def fmt_time(time_obj): # Format a datetime object to a readable time string
    return time_obj.strftime("%H:%M")


def fmt_duration(seconds): # Convert raw seconds to a readable duration
    h, m = divmod(seconds // 60, 60)
    return f"{h}h {m}m" if h else f"{m}m"


def fmt_distance(meters): # Convert meters to a readable distance string.
    return f"{meters / 1000:.1f} km" if meters >= 1000 else f"{meters} m"


def unix_to_datetime(unix_timestamp): # Convert Google's Transit Details time to datetime object time
    return datetime.fromtimestamp(unix_timestamp)


# Calculation based on difference between the carbon emissions of the current route and the Uber Routes
def calculate_emissions(mode_of_transportation, distance):
    CAR = 192
    WALK = 35
    BUS = 105
    BIKING = 21

    if mode_of_transportation == "car":
        return distance * CAR
    elif mode_of_transportation == "walk":
        return distance * WALK
    elif mode_of_transportation == "bus":
        return distance * BUS
    elif mode_of_transportation == "bicycling":
        return distance * BIKING


def calculate_points(mode_of_transportation, distance):
    return (calculate_emissions("car", distance) - calculate_emissions(mode_of_transportation, distance))


def build_steps_with_times(leg, departure_time_obj):
    """
    Takes a leg from the Google Maps response and a departure datetime object.
    Cascades the clock time through each step.

    For TRANSIT steps, uses the real scheduled departure/arrival times from
    transit_details instead of just adding durations — this accounts for
    waiting time at the bus stop.

    Returns:
        - steps_summary: list of formatted step strings with start/end times
        - arrival_time_obj: datetime of when you arrive at the end of this leg
    """

    current_time = departure_time_obj
    steps_summary = []

    i = 0
    while i < len(leg["steps"]):
        step = leg["steps"][i]
        travel_mode = step.get("travel_mode", "UNKNOWN")

        if travel_mode == "TRANSIT" and "transit_details" in step:
            td = step["transit_details"]
            line = td.get("line", {})
            transit_detail = f"[{line.get('vehicle', {}).get('type', 'BUS')}: {line.get('short_name', line.get('name', ''))}]"

            dep_unix = td.get("departure_time", {}).get("value")  # real bus departure time
            arr_unix = td.get("arrival_time", {}).get("value")    # real bus arrival time

            if dep_unix and arr_unix:
                step_start = unix_to_datetime(dep_unix)
                step_end = unix_to_datetime(arr_unix)

                # Show the wait time between when someone reaches the bus stop and the bus actually arrives
                wait_seconds = int((step_start - current_time).total_seconds())
                if wait_seconds > 60:
                    steps_summary.append(
                        f"[WAITING] {fmt_time(current_time)} → {fmt_time(step_start)}"
                        f"  Wait {fmt_duration(wait_seconds)} for bus at stop"
                    )
            else:
                # If Google doesn't return unix timestamps, just use the travel duration to print time
                step_start = current_time
                step_end = add_seconds(current_time, step["duration"]["value"])

            instruction = re.sub(r"<[^>]+>", "", step.get("html_instructions", ""))
            steps_summary.append(
                f"[TRANSIT] {fmt_time(step_start)} → {fmt_time(step_end)}  {instruction[:70]} {transit_detail}".strip()
            )
            current_time = step_end
            i += 1

        # For WALKING, BICYCLING, DRIVING — just add the travel duration
        else:
            # Collect all consecutive steps of the same non-transit mode
            block_mode = travel_mode
            block_start = current_time
            block_end = current_time
            block_instructions = []

            while i < len(leg["steps"]) and leg["steps"][i].get("travel_mode") == block_mode:
                s = leg["steps"][i]
                block_end = add_seconds(block_end, s["duration"]["value"])
                instruction = re.sub(r"<[^>]+>", "", s.get("html_instructions", ""))
                block_instructions.append(f"    {instruction[:70]}")
                i += 1

            # Print the mode summary line first
            steps_summary.append(f"[{block_mode}] {fmt_time(block_start)} → {fmt_time(block_end)}")
            # Then print each individual turn underneath
            steps_summary.extend(block_instructions)
            current_time = block_end

    return steps_summary, current_time  # current_time is now the arrival time


# Formatting all of the information into a dictionary to print
def summarize_route(label, result, departure_time_obj, points):
    if not result or not result.get("routes"):
        return {"label": label, "error": "No route found"}

    leg = result["routes"][0]["legs"][0]
    steps_summary, arrival_time_obj = build_steps_with_times(leg, departure_time_obj)

    return {
        "label": label,
        "departs": fmt_time(departure_time_obj),
        "arrives": fmt_time(arrival_time_obj),
        "duration": fmt_duration(leg["duration"]["value"]),
        "distance": fmt_distance(leg["distance"]["value"]),
        "points": round(points),
        "steps": steps_summary,
    }


# Find the bus nearest bus stop
def find_transit_hub(location, hub_type):
    places = gmaps.places_nearby(
        location=gmaps.geocode(location)[0]["geometry"]["location"],
        radius=1500,
        type=hub_type,
    )
    if places.get("results"):
        top = places["results"][0]
        return {
            "name": top["name"],
            "location": top["geometry"]["location"],
            "address": top.get("vicinity", ""),
        }
    return None


# Printing Route
def print_route(summary):
    print(f"\n{'═' * 65}")
    print(f"  {summary['label']}")
    print(f"{'═' * 65}")
    if "error" in summary:
        print(f"   {summary['error']}")
        return
    print(f"  Departs  : {summary['departs']}")
    print(f"  Arrives  : {summary['arrives']}")
    print(f"  Duration : {summary['duration']}")
    print(f"  Distance : {summary['distance']}")
    print(f"  Points   : {summary['points']}")
    print(f"  Steps:")
    for step in summary["steps"]:
        print(f"    {step}")


# Functions to generate the different routes with various modes of transportation

def route_1_walking(origin, destination, dep):
    walk = gmaps.directions(origin, destination, mode="walking", departure_time=dep)
    distance_km = walk[0]["legs"][0]["distance"]["value"] / 1000 if walk else 0
    points = calculate_points("walk", distance_km)

    return summarize_route(
        "Route 1 — Purely Walking",
        {"routes": walk} if walk else {},
        dep,
        points
    )


def route_2_walk_bus(origin, destination, dep):
    result = gmaps.directions(
        origin, destination,
        mode="transit",
        transit_mode=["bus"],
        transit_routing_preference="fewer_transfers",
        departure_time=dep,
    )
    distance_km = result[0]["legs"][0]["distance"]["value"] / 1000 if result else 0
    points = calculate_points("bus", distance_km)

    return summarize_route(
        "Route 2 — Walking + Bus",
        {"routes": result} if result else {},
        dep,
        points
    )


def route_3_walk_bus_uber(origin, destination, dep):
    # Route 3: Walking + Bus + Uber, transit to 80% of the way, Uber the rest
    orig_geo = gmaps.geocode(origin)[0]["geometry"]["location"]
    dest_geo = gmaps.geocode(destination)[0]["geometry"]["location"]

    mid_lat = orig_geo["lat"] + 0.8 * (dest_geo["lat"] - orig_geo["lat"])
    mid_lng = orig_geo["lng"] + 0.8 * (dest_geo["lng"] - orig_geo["lng"])
    midpoint = f"{mid_lat},{mid_lng}"

    transit_leg = gmaps.directions(
        origin, midpoint,
        mode="transit",
        transit_mode=["bus"],
        departure_time=dep,
    )
    # Uber departs from the time the transit ends
    if not transit_leg:
        return {"label": "Route 3 — Walking + Bus + Uber", "error": "Could not compute transit leg"}

    transit_steps, uber_dep = build_steps_with_times(transit_leg[0]["legs"][0], dep)

    uber_leg = gmaps.directions(midpoint, destination, mode="driving", departure_time=uber_dep)
    if not uber_leg:
        return {"label": "Route 3 — Walking + Bus + Uber", "error": "Could not compute Uber leg"}

    uber_steps, arrival = build_steps_with_times(uber_leg[0]["legs"][0], uber_dep)

    total_seconds = int((arrival - dep).total_seconds())
    transit_meters = transit_leg[0]["legs"][0]["distance"]["value"]
    uber_meters = uber_leg[0]["legs"][0]["distance"]["value"]
    total_meters = transit_meters + uber_meters

    # Points calculated as: bus savings on transit portion + car savings on uber portion (uber = car, so 0) + walk savings on walk portion
    points = calculate_points("bus", transit_meters / 1000)

    return {
        "label": "Route 3 — Walking + Bus + Uber",
        "departs": fmt_time(dep),
        "arrives": fmt_time(arrival),
        "duration": fmt_duration(total_seconds),
        "distance": fmt_distance(total_meters),
        "points": round(points),
        "steps": (
            [f"── Transit segment (departs {fmt_time(dep)}) ──"]
            + transit_steps
            + [f"── Uber segment (departs {fmt_time(uber_dep)}) ──"]
            + uber_steps
        ),
    }


def route_4_walk_uber(origin, destination, dep):
    # Route 4: Walking + Uber, walk 40% of the way, Uber the rest
    orig_geo = gmaps.geocode(origin)[0]["geometry"]["location"]
    dest_geo = gmaps.geocode(destination)[0]["geometry"]["location"]

    mid_lat = orig_geo["lat"] + 0.4 * (dest_geo["lat"] - orig_geo["lat"])
    mid_lng = orig_geo["lng"] + 0.4 * (dest_geo["lng"] - orig_geo["lng"])
    midpoint = f"{mid_lat},{mid_lng}"

    walk_leg = gmaps.directions(origin, midpoint, mode="walking", departure_time=dep)
    if not walk_leg:
        return {"label": "Route 4 — Walking + Uber", "error": "Could not compute walk leg"}

    walk_steps, uber_dep = build_steps_with_times(walk_leg[0]["legs"][0], dep)

    uber_leg = gmaps.directions(midpoint, destination, mode="driving", departure_time=uber_dep)
    if not uber_leg:
        return {"label": "Route 4 — Walking + Uber", "error": "Could not compute Uber leg"}

    uber_steps, arrival = build_steps_with_times(uber_leg[0]["legs"][0], uber_dep)

    total_seconds = int((arrival - dep).total_seconds())
    walk_meters = walk_leg[0]["legs"][0]["distance"]["value"]
    uber_meters = uber_leg[0]["legs"][0]["distance"]["value"]
    total_meters = walk_meters + uber_meters

    # Points only earned on the walking portion (uber = car, so 0 savings there)
    points = calculate_points("walk", walk_meters / 1000)

    return {
        "label": "Route 4 — Walking + Uber",
        "departs": fmt_time(dep),
        "arrives": fmt_time(arrival),
        "duration": fmt_duration(total_seconds),
        "distance": fmt_distance(total_meters),
        "points": round(points),
        "steps": (
            [f"── Walking segment (departs {fmt_time(dep)}) ──"]
            + walk_steps
            + [f"── Uber segment (departs {fmt_time(uber_dep)}) ──"]
            + uber_steps
        ),
    }


def route_5_uber_bus(origin, destination, dep):
    # Route 5: Uber + Bus, Uber to nearest bus station, transit to destination
    hub = find_transit_hub(origin, hub_type="bus_station")
    if not hub:
        return {"label": "Route 5 — Uber + Bus", "error": "No nearby bus station found"}

    hub_str = f"{hub['location']['lat']},{hub['location']['lng']}"

    uber_leg = gmaps.directions(origin, hub_str, mode="driving", departure_time=dep)
    if not uber_leg:
        return {"label": "Route 5 — Uber + Bus", "error": "Could not compute Uber leg"}

    uber_steps, transit_dep = build_steps_with_times(uber_leg[0]["legs"][0], dep)

    # Pass the real Uber arrival time as departure_time so Google finds a bus that actually departs after you arrive at the stop
    transit_leg = gmaps.directions(
        hub_str, destination,
        mode="transit",
        transit_mode=["bus"],
        departure_time=transit_dep,
    )
    if not transit_leg:
        return {"label": "Route 5 — Uber + Bus", "error": "Could not compute transit leg"}

    transit_steps, arrival = build_steps_with_times(transit_leg[0]["legs"][0], transit_dep)

    total_seconds = int((arrival - dep).total_seconds())
    uber_meters = uber_leg[0]["legs"][0]["distance"]["value"]
    transit_meters = transit_leg[0]["legs"][0]["distance"]["value"]
    total_meters = uber_meters + transit_meters

    # Points only earned on the bus portion (uber = car, so 0 savings there)
    points = calculate_points("bus", transit_meters / 1000)

    return {
        "label": f"Route 5 — Uber + Bus (via {hub['name']})",
        "departs": fmt_time(dep),
        "arrives": fmt_time(arrival),
        "duration": fmt_duration(total_seconds),
        "distance": fmt_distance(total_meters),
        "points": round(points),
        "steps": (
            [f"── Uber to {hub['name']} (departs {fmt_time(dep)}) ──"]
            + uber_steps
            + [f"── Bus segment (departs {fmt_time(transit_dep)}) ──"]
            + transit_steps
        ),
    }


def route_6_purely_uber(origin, destination, dep):
    # Route 6: Purely Uber
    result = gmaps.directions(origin, destination, mode="driving", departure_time=dep)
    distance_km = result[0]["legs"][0]["distance"]["value"] / 1000 if result else 0

    # Uber = car, so 0 points earned
    points = calculate_points("car", distance_km)

    return summarize_route(
        "Route 6 — Purely Uber (Driving)",
        {"routes": result} if result else {},
        dep,
        points
    )


def route_7_biking(origin, destination, dep):
    # Route 7: Purely biking
    result = gmaps.directions(origin, destination, mode="bicycling", departure_time=dep)
    distance_km = result[0]["legs"][0]["distance"]["value"] / 1000 if result else 0

    points = calculate_points("bicycling", distance_km)

    return summarize_route(
        "Route 7 — Purely Biking",
        {"routes": result} if result else {},
        dep,
        points
    )


def get_all_routes(origin, destination):
    dep = datetime.now()

    print(f"\n Origin      : {origin}")
    print(f" Destination : {destination}")
    print(f" Departing   : {fmt_time(dep)}")

    routes = [
        route_1_walking(origin, destination, dep),
        route_2_walk_bus(origin, destination, dep),
        route_3_walk_bus_uber(origin, destination, dep),
        route_4_walk_uber(origin, destination, dep),
        route_5_uber_bus(origin, destination, dep),
        route_6_purely_uber(origin, destination, dep),
        route_7_biking(origin, destination, dep)
    ]

    # for r in routes:
    #     print_route(r)
    
    for r in routes:
        print(json.dumps(r))

    print(f"\n{'═' * 65}\n")
    return routes


if __name__ == "__main__":

    ORIGIN = sys.argv[1]
    DESTINATION = sys.argv[2]

    #ORIGIN = "Rillito Regional Park, Tucson, AZ"
    #DESTINATION = "University of Arizona, Tucson, AZ"

    get_all_routes(ORIGIN, DESTINATION)
