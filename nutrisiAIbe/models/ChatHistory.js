const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatHistory = sequelize.define('ChatHistory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    sender: { type: DataTypes.ENUM('user', 'ai'), allowNull: false }, 
}, { tableName: 'chat_history', timestamps: true, updatedAt: false });

module.exports = ChatHistory;