const FoodLog = require('../models/FoodLog');
const { Op } = require('sequelize'); // <--- WAJIB ADA! (Sering lupa)

exports.addFood = async (req, res) => {
    try {
        const newLog = await FoodLog.create({
            ...req.body,
            user_id: req.user.id 
        });
        res.status(201).json({ message: 'Makanan tercatat', data: newLog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTodayLogs = async (req, res) => {
    try {
        // Set range waktu hari ini (00:00 - 23:59)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const logs = await FoodLog.findAll({
            where: {
                user_id: req.user.id,
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay] // <--- Ini butuh variable Op di atas
                }
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        console.error("Error getTodayLogs:", error); // Biar error muncul di terminal
        res.status(500).json({ error: error.message });
    }
};