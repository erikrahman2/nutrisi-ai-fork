const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyTracking = sequelize.define('DailyTracking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false }, 
    water_glasses: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'daily_tracking', timestamps: true });

module.exports = DailyTracking;