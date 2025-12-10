from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import io
from food_data import get_nutrition_info

app = Flask(__name__)
model = YOLO('best.pt') 

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes))

    results = model(img)
    detected_food = "Tidak dikenali"
    highest_conf = 0.0

    for result in results:
        for box in result.boxes:
            conf = float(box.conf[0])
            cls = int(box.cls[0])
            label = model.names[cls]
            if conf > highest_conf:
                highest_conf = conf
                detected_food = label

    if highest_conf < 0.4:
        return jsonify({
            "food_name": "Tidak Dikenali",
            "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0,
            "sugar_g": 0, "salt_mg": 0, "fiber_g": 0, "grade": "D"
        })

    nutrition_info = get_nutrition_info(detected_food)
    response_data = {
        "food_name": detected_food.replace("_", " ").title(),
        **nutrition_info
    }
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)