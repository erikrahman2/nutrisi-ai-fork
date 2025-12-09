const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { weight_kg, height_cm, activity_level, medical_conditions } = req.body;
        
        await User.update({
            weight_kg, height_cm, activity_level,
            medical_conditions: JSON.stringify(medical_conditions) 
        }, {
            where: { id: req.user.id }
        });

        res.json({ message: 'Profil berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};