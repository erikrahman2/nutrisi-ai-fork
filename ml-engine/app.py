from flask import Flask, request, jsonify
from flask_cors import CORS 
from ultralytics import YOLO
from PIL import Image
import io
import os
from food_data import get_nutrition_info

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

try:
    model = YOLO('best.pt') 
except:
    print("Warning: best.pt not found, using yolov8n.pt")
    model = YOLO('yolov8n.pt') 

@app.route('/', methods=['GET'])
def home():
    return "ML Engine is Running!", 200

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    img_bytes = file.read()

    try:
        img = Image.open(io.BytesIO(img_bytes))

        results = model(img, conf=0.50, iou=0.50, imgsz=640, agnostic_nms=True)
        
        detected_items = []
        for result in results:
            for box in result.boxes:
                cls = int(box.cls[0])
                label = model.names[cls]
                conf = float(box.conf[0])
                
                try:
                    nutrition = get_nutrition_info(label)
                except:
                    nutrition = {"kalori": 0, "info": "Data tidak ada"}
                
                detected_items.append({
                    "food_name": label,
                    "confidence": conf,
                    **nutrition
                })

        return jsonify({
            "success": True,
            "items": detected_items
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)