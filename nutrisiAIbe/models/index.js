const sequelize = require('../config/database');
const User = require('./User');
const FoodLog = require('./FoodLog');
const DailyTracking = require('./DailyTracking');
const ChatHistory = require('./ChatHistory');

User.hasMany(FoodLog, { foreignKey: 'user_id' });
User.hasMany(DailyTracking, { foreignKey: 'user_id' });
User.hasMany(ChatHistory, { foreignKey: 'user_id' });

const db = { sequelize, User, FoodLog, DailyTracking, ChatHistory };
module.exports = db;