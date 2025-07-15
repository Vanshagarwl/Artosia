require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paintingRoutes = require('./routes/paintingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Artosia API is running');
});

app.use('/api/paintings', paintingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));