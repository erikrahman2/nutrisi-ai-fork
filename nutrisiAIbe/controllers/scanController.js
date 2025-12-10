const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const FoodLog = require('../models/FoodLog'); // Pastikan path ini benar

exports.scanImage = async (req, res) => {
    // 1. Cek apakah ada file
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            message: 'Tidak ada gambar yang diupload' 
        });
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    try {
        // 2. Kirim ke Python (AI Service)
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));

        console.log("🤖 Mengirim ke AI Service...");
        
        // Pastikan port Python benar (default 5001)
        const mlResponse = await axios.post('http://127.0.0.1:5001/predict', formData, {
            headers: { ...formData.getHeaders() }
        });

        const aiData = mlResponse.data;
        console.log("✅ Data dari AI:", aiData);

        // 3. Cek hasil deteksi
        if (aiData.food_name === "Tidak Dikenali") {
            // Hapus file agar tidak menumpuk (opsional)
            // fs.unlinkSync(imagePath); 
            
            return res.json({
                success: false,
                message: "Makanan tidak dikenali.",
                data: {
                    food_name: "Tidak Dikenali",
                    grade: "D",
                    image_url: imageUrl
                }
            });
        }

        // 4. SIMPAN KE DATABASE (Sesuai Model FoodLog Anda)
        const newLog = await FoodLog.create({
            user_id: req.user.id,        // Dari authMiddleware
            food_name: aiData.food_name,
            calories: aiData.calories,
            protein_g: aiData.protein_g, // Sesuai model
            carbs_g: aiData.carbs_g,     // Sesuai model
            fat_g: aiData.fat_g,         // Sesuai model
            sugar_g: aiData.sugar_g,     // Sesuai model
            salt_mg: aiData.salt_mg,     // Sesuai model
            fiber_g: aiData.fiber_g,     // Sesuai model
            grade: aiData.grade,
            image_url: imageUrl
        });

        // 5. Kirim Response Sukses
        return res.status(201).json({
            success: true,
            message: "Scan berhasil disimpan!",
            data: newLog
        });

    } catch (error) {
        console.error("❌ Error Scan:", error.message);
        
        // Tangani jika Server Python Mati
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                success: false, 
                message: "Layanan AI sedang offline. Pastikan 'python app.py' berjalan." 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Terjadi kesalahan server.",
            error: error.message
        });
    }
};