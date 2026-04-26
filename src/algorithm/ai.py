import os
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime
import json
from main import (
    route_1_walking,
    route_2_walk_bus,
    route_3_walk_bus_uber,
    route_4_walk_uber,
    route_5_uber_bus,
    route_6_purely_uber,
    route_7_biking,
)

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_ai_message(route_label, points):
    if points <= 0:
        prompt = (
            f"The user took '{route_label}' and earned {points} eco points. "
            f"That means they chose the most polluting option possible. "
            f"Write a single short, funny, and slightly sarcastic message roasting them for it. "
            f"Keep it under 2 sentences."
        )
    else:
        prompt = (
            f"The user took '{route_label}' and earned {points} eco points. "
            f"Each point represents 1 gram of CO2 saved compared to taking a car. "
            f"Write a single short, funny, and quirky message celebrating their eco savings. "
            f"Use a creative real-world comparison for the CO2 saved, like number of trees, "
            f"balloons, or cheeseburgers. Keep it under 2 sentences."
        )
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a witty and enthusiastic eco-friendly travel assistant. "
                    "You celebrate green choices with humor and creative comparisons. "
                    "Keep responses short, punchy, and fun."
                ),
            },
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content


def run_ai_summaries(origin, destination):
    dep = datetime.now()
    routes = [
        route_1_walking(origin, destination, dep),
        route_2_walk_bus(origin, destination, dep),
        route_3_walk_bus_uber(origin, destination, dep),
        route_4_walk_uber(origin, destination, dep),
        route_5_uber_bus(origin, destination, dep),
        route_6_purely_uber(origin, destination, dep),
        route_7_biking(origin, destination, dep),
    ]

    messages = []
    for route in routes:
        if "error" in route:
            messages.append({
                "label": route["label"],
                "ai_message": None,
            })
            continue

        messages.append({
            "label": route["label"],
            "ai_message": get_ai_message(route["label"], route["points"]),
        })

    print(json.dumps(messages, indent=2))
    return messages


if __name__ == "__main__":
    import sys
    if len(sys.argv) >= 3:
        ORIGIN      = sys.argv[1]
        DESTINATION = sys.argv[2]
    else:
        ORIGIN      = "Rillito Regional Park, Tucson, AZ"
        DESTINATION = "University of Arizona, Tucson, AZ"

    run_ai_summaries(ORIGIN, DESTINATION)