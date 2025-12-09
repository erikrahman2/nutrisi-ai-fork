const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    full_name: { type: DataTypes.STRING },
    date_of_birth: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('male', 'female') },
    weight_kg: { type: DataTypes.FLOAT },
    height_cm: { type: DataTypes.FLOAT },
    activity_level: { type: DataTypes.FLOAT },
    medical_conditions: { type: DataTypes.TEXT } 
}, { tableName: 'users', timestamps: true, updatedAt: false });

module.exports = User;