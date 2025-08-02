const Painting = require('../models/Painting');

exports.addPainting = async (req, res) => {
  try {
    const painting = new Painting({
      ...req.body,
      postedBy: req.user.username
    });
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
    const painting = await Painting.findById(req.params.id);
    if (!painting) {
      return res.status(404).json({ error: 'Painting not found' });
    }
    if (painting.postedBy !== req.user.username) {
      return res.status(403).json({ error: 'You can only delete your own paintings' });
    }
    await painting.deleteOne();
    res.status(200).json({ message: 'Painting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePainting = async (req, res) => {
  try {
    const { id } = req.params;
    const painting = await Painting.findById(id);
    if (!painting) {
      return res.status(404).json({ error: 'Painting not found' });
    }
    if (painting.postedBy !== req.user.username) {
      return res.status(403).json({ error: 'You can only update your own paintings' });
    }
    const updatedPainting = await Painting.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.status(200).json({ message: 'Painting updated successfully', painting: updatedPainting });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
