const DailyTracking = require('../models/DailyTracking');

exports.getWater = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [track, created] = await DailyTracking.findOrCreate({
            where: { user_id: req.user.id, date: today },
            defaults: { water_glasses: 0 }
        });
        res.json(track);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateWater = async (req, res) => {
    try {
        const { amount } = req.body; 
        const today = new Date().toISOString().split('T')[0];
        
        const track = await DailyTracking.findOne({ where: { user_id: req.user.id, date: today } });
        if(!track) return res.status(404).json({message: "Data hari ini belum ada"});

        let newAmount = track.water_glasses + amount;
        if(newAmount < 0) newAmount = 0;

        await track.update({ water_glasses: newAmount });
        res.json({ water_glasses: newAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};