const FoodLog = require('../models/FoodLog');

exports.scanImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Tidak ada gambar diupload' });
        
        const imageUrl = `/uploads/${req.file.filename}`;

       
        const mockResult = {
            food_name: "Gado-gado (AI Scan)",
            calories: 320,
            protein_g: 18,
            carbs_g: 30,
            fat_g: 15,
            grade: "A",
            image_url: imageUrl
        };

       
        res.json(mockResult); 
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};