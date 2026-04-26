import os
import requests
from datetime import datetime
from main import (
    gmaps,
    route_1_walking,
    route_2_walk_bus,
    route_3_walk_bus_uber,
    route_4_walk_uber,
    route_5_uber_bus,
    route_6_purely_uber,
    route_7_biking,
)

API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY")

ROUTE_STYLES = [
    {"color": "0xFF0000FF", "label": "1 - Walking"},           # bright red
    {"color": "0x00FF00FF", "label": "2 - Walk + Bus"},         # bright green
    {"color": "0xFF00FFFF", "label": "3 - Walk + Bus + Uber"},  # bright magenta
    {"color": "0x00FFFFFF", "label": "4 - Walk + Uber"},        # bright cyan
    {"color": "0xFF8000FF", "label": "5 - Uber + Bus"},         # bright orange
    {"color": "0xFF0000FF", "label": "6 - Purely Uber"},        # bright red
    {"color": "0xFF007FFF", "label": "7 - Biking"},             # bright pink/rose
]

def decode_polyline(encoded):
    points = []
    index, lat, lng = 0, 0, 0
    while index < len(encoded):
        result, shift = 0, 0
        while True:
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        lat += ~(result >> 1) if result & 1 else result >> 1
        result, shift = 0, 0
        while True:
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        lng += ~(result >> 1) if result & 1 else result >> 1
        points.append((lat / 1e5, lng / 1e5))
    return points


def get_polyline_for_route(origin, destination, mode, **kwargs):
    result = gmaps.directions(
        origin, destination,
        mode=mode,
        departure_time=datetime.now(),
        **kwargs,
    )
    if not result:
        print(f"  ⚠ No route found for mode={mode}")
        return None
    return result[0]["overview_polyline"]["points"]


def build_static_map_url(origin, destination, polyline_str, style, size="800x500"):
    decoded = decode_polyline(polyline_str)
    step = max(1, len(decoded) // 200)
    sampled = decoded[::step]
    if sampled[-1] != decoded[-1]:
        sampled.append(decoded[-1])

    origin_marker = f"color:green|label:A|{origin}"
    dest_marker   = f"color:red|label:B|{destination}"
    path_points   = "|".join(f"{lat},{lng}" for lat, lng in sampled)
    path_param    = f"color:{style['color']}|weight:5|{path_points}"

    parts = [
        f"size={size}",
        f"maptype=roadmap",
        f"markers={requests.utils.quote(origin_marker, safe='|:,')}",
        f"markers={requests.utils.quote(dest_marker,   safe='|:,')}",
        f"path={requests.utils.quote(path_param,       safe='|:,')}",
        f"key={API_KEY}",
    ]
    return f"https://maps.googleapis.com/maps/api/staticmap?{'&'.join(parts)}"


def save_static_map(url, filename):
    response = requests.get(url, timeout=10)
    if response.status_code == 200:
        with open(filename, "wb") as f:
            f.write(response.content)
        print(f"  ✔ Saved → {filename}")
    else:
        print(f"  ✘ HTTP {response.status_code}: {response.text[:200]}")


def generate_all_route_maps(origin, destination, output_dir="route_maps"):
    os.makedirs(output_dir, exist_ok=True)
    dep = datetime.now()

    # Each tuple: (route_function, mode_for_polyline, extra_kwargs, output_filename)
    # The route functions are imported directly from main.py, and are called here
    # only to confirm the route is valid before fetching the polyline separately
    route_configs = [
        (route_1_walking,       "walking",   {},                                        "route_1_walking.png"),
        (route_2_walk_bus,      "transit",   {"transit_mode": ["bus"],
                                              "transit_routing_preference":
                                              "fewer_transfers"},                        "route_2_walk_bus.png"),
        (route_3_walk_bus_uber, "transit",   {"transit_mode": ["bus"]},                "route_3_walk_bus_uber.png"),
        (route_4_walk_uber,     "walking",   {},                                        "route_4_walk_uber.png"),
        (route_5_uber_bus,      "transit",   {"transit_mode": ["bus"]},                "route_5_uber_bus.png"),
        (route_6_purely_uber,   "driving",   {},                                        "route_6_uber.png"),
        (route_7_biking,        "bicycling", {},                                        "route_7_biking.png"),
    ]

    for i, (route_fn, mode, kwargs, filename) in enumerate(route_configs):
        summary = route_fn(origin, destination, dep)
        if "error" in summary:
            print(f"  ⚠ Skipping {filename}: {summary['error']}")
            continue

        print(f"\nGenerating map for {summary['label']} ...")
        polyline = get_polyline_for_route(origin, destination, mode, **kwargs)
        if polyline is None:
            continue

        url = build_static_map_url(origin, destination, polyline, ROUTE_STYLES[i])
        save_static_map(url, os.path.join(output_dir, filename))


if __name__ == "__main__":
    ORIGIN      = "Rillito Regional Park, Tucson, AZ"
    DESTINATION = "University of Arizona, Tucson, AZ"
    generate_all_route_maps(ORIGIN, DESTINATION)
