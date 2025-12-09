import dayjs from 'dayjs';


export const calculateNeeds = (user) => {
    if (!user) return { cal: 2000, protein: 60, carbs: 300, fat: 70, sugar: 50, salt: 2000, fiber: 30 };

    const weight = parseFloat(user.weight_kg) || 60;
    const height = parseFloat(user.height_cm) || 170;
    const age = user.date_of_birth ? dayjs().diff(dayjs(user.date_of_birth), 'year') : 25;
    const gender = user.gender || 'male';
    const activity = parseFloat(user.activity_level) || 1.2;

    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = Math.round(bmr * activity);

    return {
        cal: tdee,
        protein: Math.round((tdee * 0.15) / 4),
        fat: Math.round((tdee * 0.25) / 9),
        carbs: Math.round((tdee * 0.60) / 4),
        sugar: 50,   
        salt: 2000,  
        fiber: 30   
    };
};

export const checkMedicalRisk = (food, userConditions) => {
    const alerts = [];
    
    let conditions = [];
    if (Array.isArray(userConditions)) {
        conditions = userConditions;
    } else if (typeof userConditions === 'string') {
        try { conditions = JSON.parse(userConditions); } catch(e) { conditions = []; }
    }

  
    if (conditions.includes('Diabetes')) {
        if (food.sugar_g > 20) {
            alerts.push({
                type: 'Gula Tinggi',
                msg: `Kandungan gula (${food.sugar_g}g) cukup tinggi. Bahaya untuk gula darah.`,
                level: 'warning'
            });
        }
        if (food.carbs_g > 80) {
            alerts.push({
                type: 'Karbohidrat Berlebih',
                msg: 'Karbohidrat tinggi dapat memicu lonjakan gula darah.',
                level: 'warning'
            });
        }
    }

   
    if (conditions.includes('Hipertensi')) {
        if (food.salt_mg > 600) {
            alerts.push({
                type: 'Natrium Tinggi',
                msg: `Garam (${food.salt_mg}mg) melebihi batas aman sekali makan untuk Hipertensi.`,
                level: 'danger'
            });
        }
    }

    
    if (conditions.includes('Kolesterol')) {
        if (food.fat_g > 25) {
            alerts.push({
                type: 'Lemak Tinggi',
                msg: `Lemak (${food.fat_g}g) terlalu tinggi, berisiko menaikkan kolesterol jahat.`,
                level: 'warning'
            });
        }
    }

    return alerts;
};