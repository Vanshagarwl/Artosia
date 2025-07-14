const Painting = require('../models/Painting');

exports.addPainting = async (req, res) => {
  try {
    const painting = new Painting(req.body);
    await painting.save();
    res.status(201).json({ message: 'Painting added successfully', painting });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};