# Calculation based on differece between the carbon emissions of the current route and the Uber Routes
def calculate_emissions(mode_of_transportation, distance):
    CAR = 192
    WALK = 35
    BUS = 105

    if mode_of_transportation == "car":
        return distance * CAR
    elif mode_of_transportation == "walk":
        return distance * WALK
    elif mode_of_transportation == "bus":
        return distance * BUS

def calculate_points(mode_of_transportation, distance):
    return (calculate_emissions("car", distance) - calculate_emissions(mode_of_transportation, distance))