require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paintingRoutes = require('./routes/paintingRoutes');
const authRoutes = require('./routes/authRoutes');
const os = require('os');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Artosia API is running');
});

app.use('/api/paintings', paintingRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`Server running on:`);
    console.log(`- Local:   http://localhost:${PORT}`);
    console.log(`- Network: http://${localIP}:${PORT}`);
});