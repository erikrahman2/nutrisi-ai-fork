const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { 
            email, password, full_name, 
            gender, weight_kg, height_cm, date_of_birth, medical_conditions 
        } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email sudah terdaftar' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            email,
            password_hash: hashedPassword,
            full_name,
            gender: gender || 'male',
            weight_kg: parseFloat(weight_kg) || 60,
            height_cm: parseFloat(height_cm) || 170,
            date_of_birth: date_of_birth || '2000-01-01',
            medical_conditions: medical_conditions ? JSON.stringify(medical_conditions) : '[]' 
        });

        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user || !await bcrypt.compare(password, user.password_hash)) {
            return res.status(400).json({ message: 'Email atau password salah' });
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        const userData = user.toJSON();
        delete userData.password_hash;

        res.json({ token, user: userData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};