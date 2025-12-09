const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; 
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    console.log("=== DAFTAR MODEL YANG TERSEDIA ===");
    if (data.models) {
        data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log("- " + m.name.replace("models/", ""));
            }
        });
    } else {
        console.log("Tidak ada model ditemukan. Cek API Key.");
        console.log(data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();