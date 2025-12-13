import dayjs from 'dayjs';

export const calculateNeeds = (user) => {
    if (!user) return { cal: 2000, protein: 100, carbs: 250, fat: 70, sugar: 50, salt: 2000, fiber: 30 };

    // 1. Hitung Usia
    const age = dayjs().diff(dayjs(user.date_of_birth), 'year');
    
    // 2. Hitung BMR (Mifflin-St Jeor Equation)
    let bmr;
    if (user.gender === 'male') {
        bmr = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * age + 5;
    } else {
        bmr = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * age - 161;
    }

    // 3. Hitung TDEE (Total Daily Energy Expenditure)
    const activityMultipliers = {
        1.2: 1.2, // Sedentary
        1.375: 1.375, // Light
        1.55: 1.55, // Moderate
        1.725: 1.725, // Active
        1.9: 1.9 // Very Active
    };
    const multiplier = activityMultipliers[user.activity_level] || 1.2;
    const tdee = Math.round(bmr * multiplier);

    let conditions = [];
    try {
        if (user.medical_conditions) {
            conditions = JSON.parse(user.medical_conditions);
            if (typeof conditions === 'string') conditions = [conditions];
        }
    } catch (e) {
        conditions = [];
    }
    const diseases = conditions.map(c => c.toLowerCase());

 
    let ratio = { c: 0.50, p: 0.20, f: 0.30 };

    if (diseases.includes('diabetes')) {
        ratio = { c: 0.45, p: 0.25, f: 0.30 }; // Kurangi karbo
    } else if (diseases.includes('kolesterol')) {
        ratio = { c: 0.55, p: 0.20, f: 0.25 }; // Kurangi lemak
    } else if (diseases.includes('asam_urat')) {
        ratio = { c: 0.55, p: 0.15, f: 0.30 }; // Kurangi protein (purin biasanya di protein hewani)
    }

    const protein = Math.round((tdee * ratio.p) / 4);
    const carbs = Math.round((tdee * ratio.c) / 4);
    const fat = Math.round((tdee * ratio.f) / 9);

    // --- LOGIKA MIKRO NUTRISI (Gula, Garam, Serat) ---

    // 5. GULA (Sugar)
    // WHO menyarankan < 10% total kalori. Untuk Diabetes < 5%.
    let sugarPercentage = 0.10; 
    if (diseases.includes('diabetes')) sugarPercentage = 0.05;
    
    // Obesitas juga disarankan kurangi gula
    if (user.bmi > 25) sugarPercentage = 0.07;

    const sugar = Math.round((tdee * sugarPercentage) / 4); // 1g gula = 4 kalori

    // 6. GARAM (Salt/Sodium)
    // Standar umum < 2300mg. Hipertensi < 1500mg.
    let salt = 2300; 
    if (diseases.includes('hipertensi') || diseases.includes('ginjal')) {
        salt = 1500;
    }

   
    let fiber = Math.round((tdee / 1000) * 14);
    
    if (diseases.includes('diabetes')) {
        fiber = Math.round(fiber * 1.2); 
    }

    return {
        cal: tdee,
        protein,
        carbs,
        fat,
        sugar,
        salt,
        fiber
    };
};