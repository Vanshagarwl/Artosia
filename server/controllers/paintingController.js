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

exports.getPaintings = async (req, res) => {
  try {
    const paintings = await Painting.find();
    res.status(200).json(paintings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePainting = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPainting = await Painting.findByIdAndDelete(id);
    if (!deletedPainting) {
      return res.status(404).json({ error: 'Painting not found' });
    }
    res.status(200).json({ message: 'Painting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
