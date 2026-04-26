"""
Google Maps Multi-Modal Route Planner
======================================
Queries routes for 6 transportation combinations using the Google Maps Directions API.

Setup:
    pip install googlemaps requests
    export GOOGLE_MAPS_API_KEY="your_key_here"
"""

import os
import googlemaps
from datetime import datetime
from typing import Optional


# ── Config ────────────────────────────────────────────────────────────────────

API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY")
if not API_KEY:
    raise EnvironmentError("Set GOOGLE_MAPS_API_KEY environment variable.")

gmaps = googlemaps.Client(key=API_KEY)

# ── Helpers ───────────────────────────────────────────────────────────────────

def format_duration(seconds: int) -> str:
    h, m = divmod(seconds // 60, 60)
    return f"{h}h {m}m" if h else f"{m}m"


def format_distance(meters: int) -> str:
    return f"{meters / 1000:.1f} km" if meters >= 1000 else f"{meters} m"


def summarize_route(label: str, result: dict) -> dict:
    """Extract key info from a Directions API response leg."""
    if not result or not result.get("routes"):
        return {"label": label, "error": "No route found"}

    leg = result["routes"][0]["legs"][0]
    steps_summary = []
    for step in leg["steps"]:
        travel_mode = step.get("travel_mode", "UNKNOWN")
        instruction = step.get("html_instructions", "").replace("<b>", "").replace("</b>", "")
        transit_detail = ""
        if travel_mode == "TRANSIT" and "transit_details" in step:
            td = step["transit_details"]
            line = td.get("line", {})
            transit_detail = f"[{line.get('vehicle', {}).get('type', 'BUS')}: {line.get('short_name', line.get('name', ''))}]"
        steps_summary.append(f"  [{travel_mode}] {instruction[:80]} {transit_detail}".strip())

    return {
        "label": label,
        "duration": format_duration(leg["duration"]["value"]),
        "distance": format_distance(leg["distance"]["value"]),
        "steps": steps_summary,
    }


def find_transit_hub(location: str, hub_type: str = "bus_station") -> Optional[dict]:
    """Find the nearest transit hub (bus station, subway, etc.) near a location."""
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


def print_route(summary: dict):
    print(f"\n{'═' * 60}")
    print(f"  {summary['label']}")
    print(f"{'═' * 60}")
    if "error" in summary:
        print(f"  ⚠ {summary['error']}")
        return
    print(f"  Duration : {summary['duration']}")
    print(f"  Distance : {summary['distance']}")
    print(f"  Steps:")
    for step in summary["steps"]:
        print(f"    {step}")


# ── Route Queries ─────────────────────────────────────────────────────────────

def route_1_biking_walking(origin: str, destination: str) -> dict:
    """Route 1: Purely biking or walking (two separate calls, returns the faster)."""
    now = datetime.now()

    bike = gmaps.directions(origin, destination, mode="bicycling", departure_time=now)
    walk = gmaps.directions(origin, destination, mode="walking", departure_time=now)

    bike_dur = bike[0]["legs"][0]["duration"]["value"] if bike else float("inf")
    walk_dur = walk[0]["legs"][0]["duration"]["value"] if walk else float("inf")

    best = bike if bike_dur <= walk_dur else walk
    mode_label = "Biking" if bike_dur <= walk_dur else "Walking"
    return summarize_route(f"Route 1 — Purely {mode_label}", {"routes": best} if best else {})


def route_2_walk_bike_bus(origin: str, destination: str) -> dict:
    """Route 2: Walking/biking + Bus (Google transit with walking transfers)."""
    result = gmaps.directions(
        origin,
        destination,
        mode="transit",
        transit_mode=["bus"],
        transit_routing_preference="fewer_transfers",
        departure_time=datetime.now(),
    )
    return summarize_route("Route 2 — Walking/Biking + Bus", {"routes": result} if result else {})


def route_3_walk_bus_uber(origin: str, destination: str) -> dict:
    """
    Route 3: Walking + Bus + Uber.
    Strategy: Take transit to a point close to destination, then Uber the last leg.
    We split the trip at 80% of the straight-line distance.
    """
    # Geocode origin and destination
    orig_geo = gmaps.geocode(origin)[0]["geometry"]["location"]
    dest_geo = gmaps.geocode(destination)[0]["geometry"]["location"]

    # Midpoint biased toward destination (80%)
    mid_lat = orig_geo["lat"] + 0.8 * (dest_geo["lat"] - orig_geo["lat"])
    mid_lng = orig_geo["lng"] + 0.8 * (dest_geo["lng"] - orig_geo["lng"])
    midpoint = f"{mid_lat},{mid_lng}"

    transit_leg = gmaps.directions(
        origin, midpoint,
        mode="transit",
        transit_mode=["bus"],
        departure_time=datetime.now(),
    )
    uber_leg = gmaps.directions(midpoint, destination, mode="driving")

    if not transit_leg or not uber_leg:
        return {"label": "Route 3 — Walking + Bus + Uber", "error": "Could not compute a leg"}

    transit_s = summarize_route("Transit leg", {"routes": transit_leg})
    uber_s = summarize_route("Uber leg", {"routes": uber_leg})

    total_seconds = (
        transit_leg[0]["legs"][0]["duration"]["value"]
        + uber_leg[0]["legs"][0]["duration"]["value"]
    )
    total_meters = (
        transit_leg[0]["legs"][0]["distance"]["value"]
        + uber_leg[0]["legs"][0]["distance"]["value"]
    )

    return {
        "label": "Route 3 — Walking + Bus + Uber",
        "duration": format_duration(total_seconds),
        "distance": format_distance(total_meters),
        "steps": (
            ["── Transit segment ──"]
            + transit_s.get("steps", [])
            + ["── Uber segment ──"]
            + uber_s.get("steps", [])
        ),
    }


def route_4_walk_bike_uber(origin: str, destination: str) -> dict:
    """
    Route 4: Walking/biking + Uber.
    Strategy: Walk/bike the first portion, Uber the rest.
    We use 40% distance as the walk/bike cutoff.
    """
    orig_geo = gmaps.geocode(origin)[0]["geometry"]["location"]
    dest_geo = gmaps.geocode(destination)[0]["geometry"]["location"]

    mid_lat = orig_geo["lat"] + 0.4 * (dest_geo["lat"] - orig_geo["lat"])
    mid_lng = orig_geo["lng"] + 0.4 * (dest_geo["lng"] - orig_geo["lng"])
    midpoint = f"{mid_lat},{mid_lng}"

    walk_leg = gmaps.directions(origin, midpoint, mode="walking")
    uber_leg = gmaps.directions(midpoint, destination, mode="driving")

    if not walk_leg or not uber_leg:
        return {"label": "Route 4 — Walking/Biking + Uber", "error": "Could not compute a leg"}

    walk_s = summarize_route("Walk/Bike leg", {"routes": walk_leg})
    uber_s = summarize_route("Uber leg", {"routes": uber_leg})

    total_seconds = (
        walk_leg[0]["legs"][0]["duration"]["value"]
        + uber_leg[0]["legs"][0]["duration"]["value"]
    )
    total_meters = (
        walk_leg[0]["legs"][0]["distance"]["value"]
        + uber_leg[0]["legs"][0]["distance"]["value"]
    )

    return {
        "label": "Route 4 — Walking/Biking + Uber",
        "duration": format_duration(total_seconds),
        "distance": format_distance(total_meters),
        "steps": (
            ["── Walk/Bike segment ──"]
            + walk_s.get("steps", [])
            + ["── Uber segment ──"]
            + uber_s.get("steps", [])
        ),
    }


def route_5_uber_bus(origin: str, destination: str) -> dict:
    """
    Route 5: Uber + Bus.
    Strategy: Uber to the nearest bus station, then take transit to destination.
    """
    hub = find_transit_hub(origin, hub_type="bus_station")
    if not hub:
        return {"label": "Route 5 — Uber + Bus", "error": "No nearby bus station found"}

    hub_str = f"{hub['location']['lat']},{hub['location']['lng']}"

    uber_leg = gmaps.directions(origin, hub_str, mode="driving")
    transit_leg = gmaps.directions(
        hub_str, destination,
        mode="transit",
        transit_mode=["bus"],
        departure_time=datetime.now(),
    )

    if not uber_leg or not transit_leg:
        return {"label": "Route 5 — Uber + Bus", "error": "Could not compute a leg"}

    uber_s = summarize_route("Uber leg", {"routes": uber_leg})
    transit_s = summarize_route("Transit leg", {"routes": transit_leg})

    total_seconds = (
        uber_leg[0]["legs"][0]["duration"]["value"]
        + transit_leg[0]["legs"][0]["duration"]["value"]
    )
    total_meters = (
        uber_leg[0]["legs"][0]["distance"]["value"]
        + transit_leg[0]["legs"][0]["distance"]["value"]
    )

    return {
        "label": f"Route 5 — Uber + Bus (via {hub['name']})",
        "duration": format_duration(total_seconds),
        "distance": format_distance(total_meters),
        "steps": (
            [f"── Uber to {hub['name']} ──"]
            + uber_s.get("steps", [])
            + ["── Bus to destination ──"]
            + transit_s.get("steps", [])
        ),
    }


def route_6_purely_uber(origin: str, destination: str) -> dict:
    """Route 6: Purely Uber (driving mode is the Uber proxy)."""
    result = gmaps.directions(origin, destination, mode="driving", departure_time=datetime.now())
    return summarize_route("Route 6 — Purely Uber (Driving)", {"routes": result} if result else {})


# ── Main ──────────────────────────────────────────────────────────────────────

def get_all_routes(origin: str, destination: str):
    print(f"\n📍 Origin      : {origin}")
    print(f"📍 Destination : {destination}")

    routes = [
        route_1_biking_walking(origin, destination),
        route_2_walk_bike_bus(origin, destination),
        route_3_walk_bus_uber(origin, destination),
        route_4_walk_bike_uber(origin, destination),
        route_5_uber_bus(origin, destination),
        route_6_purely_uber(origin, destination),
    ]

    for r in routes:
        print_route(r)

    print(f"\n{'═' * 60}\n")
    return routes


if __name__ == "__main__":
    # ── Change these to your desired origin and destination ──
    ORIGIN = "Rillito Regional Park, Tucson, AZ"
    DESTINATION = "University of Arizona, Tucson, AZ"

    get_all_routes(ORIGIN, DESTINATION)