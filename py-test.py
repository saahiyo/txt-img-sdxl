import requests
import json

url = "https://aiart-zroo.onrender.com/api/generate"
payload = {
    "video_description": "son wokong",
    "negative_prompt": "blurry, low quality, distorted faces, poor lighting",
    "style_preset": "neon-punk",
    "aspect_ratio": "16:9",
    "output_format": "png",
    "seed": 0
}

headers = {"Content-Type": "application/json"}
response = requests.post(url, headers=headers, json=payload)

if response.status_code == 200:
    result = response.json()
    print(f"Image URL: {result['image_url']}")
    # Download the image if needed
    # image_data = requests.get(result['image_url']).content
    # with open('generated_image.png', 'wb') as f:
    #     f.write(image_data)
else:
    print(f"Error: {response.text}")