# Simple Weather App

A lightweight weather application that lets users search for a city and view current conditions plus a 5-day forecast. The project combines a React + Vite frontend with a small Python utility for fetching weather data from public APIs.

## Features

- Search for a city by name
- View current weather conditions
- See a 5-day forecast
- Toggle between Celsius and Fahrenheit
- Responsive, simple user interface

## Tech Stack

- React
- Vite
- JavaScript/JSX
- Python 3

## Project Structure

- src/App.jsx - Main weather app UI and forecast logic
- src/main.jsx - React entry point
- src/index.css - Styling for the app
- fetch_weather.py - Python script for fetching weather information from wttr.in
- package.json - Vite/React project configuration and scripts

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3

### Install Dependencies

```bash
npm install
```

### Run the App Locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

### Run the Python Weather Script

```bash
python fetch_weather.py "Seattle"
```

This prints a simple weather summary for the provided city.

## Usage

1. Start the Vite development server.
2. Open the app in your browser.
3. Enter a city name and click "Check Weather".
4. View the current temperature, weather condition, and forecast.

## Notes

The frontend uses the Open-Meteo API for geocoding and weather forecast data, while the Python script uses wttr.in for a simple command-line weather lookup.

## License

This project is available for educational and personal use.
