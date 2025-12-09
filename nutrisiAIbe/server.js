const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const path = require('path'); 
const fs = require('fs'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/apiRoutes'));

sequelize.sync({ alter: true }) 
    .then(() => console.log('✅ Database & Tables Synced!'))
    .catch(err => console.error('❌ DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));