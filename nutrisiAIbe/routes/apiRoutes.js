const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const foodController = require('../controllers/foodController');
const userController = require('../controllers/userController');
const trackController = require('../controllers/trackController');
const chatController = require('../controllers/chatController');
const scanController = require('../controllers/scanController');


router.post('/food', authMiddleware, foodController.addFood);
router.get('/food/today', authMiddleware, foodController.getTodayLogs);

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);


router.get('/water', authMiddleware, trackController.getWater);
router.post('/water', authMiddleware, trackController.updateWater);

router.get('/chat', authMiddleware, chatController.getHistory);
router.post('/chat', authMiddleware, chatController.sendMessage);

router.post('/scan', authMiddleware, upload.single('image'), scanController.scanImage);

module.exports = router;