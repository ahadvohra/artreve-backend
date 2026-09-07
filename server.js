require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const contactRoutes = require('./routes/contact');
const startAProjectRoutes = require('./routes/startAProject');

const app = express();

app.use(cors({ origin: '*' })); // TODO: lock this to your Vercel URL once deployed
app.use(express.json());

app.use('/api', contactRoutes);
app.use('/api', startAProjectRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));