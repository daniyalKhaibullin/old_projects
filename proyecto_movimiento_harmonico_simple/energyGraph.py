"""
Name: Daniyal Khaibullin 
Class: IB Physics HL, year 1
Date: March 3rd, 2022 

Helped by teacher: Felipe Cambon
"""

import pandas as pd
import matplotlib.pyplot as plt

# Read the CSV file
data = pd.read_csv("simple_harmonic_motion_data.csv")

# Extracting time, position, velocity, and acceleration columns
time = data["Time (s)"]
position = data["Position (cm)"] / 100  # Convert position from cm to m
velocity = data["Velocity (m/s)"]
acceleration = data["Acceleration (m/s^2)"]

# Calculate kinetic energy (1/2 * mass * velocity^2)
mass = 0.125  # Mass in kg
kinetic_energy = 0.5 * mass * velocity**2

# Calculate potential energy (mass * gravity * height)
gravity = 9.81  # Acceleration due to gravity in m/s^2
height = position  # Height in m
potential_energy = mass * gravity * height

# Calculate total mechanical energy (kinetic energy + potential energy)
total_energy = kinetic_energy + potential_energy

# Plotting the energy-time graph
plt.plot(time, total_energy, color="blue", linestyle="-", marker="o")
plt.title("Energy-Time Graph")
plt.xlabel("Time (s)")
plt.ylabel("Total Mechanical Energy (J)")
plt.grid(True)
plt.show()