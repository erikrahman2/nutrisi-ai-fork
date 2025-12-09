const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FoodLog = sequelize.define('FoodLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    food_name: { type: DataTypes.STRING, allowNull: false },
    calories: { type: DataTypes.FLOAT, defaultValue: 0 },
    protein_g: { type: DataTypes.FLOAT, defaultValue: 0 },
    carbs_g: { type: DataTypes.FLOAT, defaultValue: 0 },
    fat_g: { type: DataTypes.FLOAT, defaultValue: 0 },
    sugar_g: { type: DataTypes.FLOAT, defaultValue: 0 },
    salt_mg: { type: DataTypes.FLOAT, defaultValue: 0 },
    fiber_g: { type: DataTypes.FLOAT, defaultValue: 0 },
    grade: { type: DataTypes.STRING(2) }, 
    image_url: { type: DataTypes.STRING },
}, { tableName: 'food_logs', timestamps: true, updatedAt: false });

module.exports = FoodLog;