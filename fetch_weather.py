import json
import sys
import urllib.error
import urllib.parse
import urllib.request


def format_weather_summary(city, temperature, condition):
    return f"{city}: {temperature}°F and {condition}"


def fetch_weather(city):
    encoded_city = urllib.parse.quote(city)
    url = f"https://wttr.in/{encoded_city}?format=j1"
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "python-weather-cli"},
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            data = json.load(response)
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, TimeoutError) as exc:
        raise RuntimeError(f"Unable to fetch weather for {city}: {exc}") from exc

    current_condition = data.get("current_condition", [{}])[0]
    condition = current_condition.get("weatherDesc", [{}])[0].get("value", "Unknown")
    temperature_c = current_condition.get("temp_C")
    temperature_f = int(round(int(temperature_c) * 9 / 5 + 32)) if temperature_c is not None else None

    return city, temperature_f, condition


def main(argv=None):
    args = sys.argv[1:] if argv is None else argv

    if not args:
        print("Usage: python fetch_weather.py <city>")
        return 1

    city = " ".join(args)
    try:
        city_name, temperature, condition = fetch_weather(city)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    print(format_weather_summary(city_name, temperature, condition))
    return 0


if __name__ == "__main__":
    sys.exit(main())
