const FoodLog = require('../models/FoodLog');
const { Op } = require('sequelize');

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
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const logs = await FoodLog.findAll({
            where: {
                user_id: req.user.id,
                created_at: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            order: [['created_at', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};