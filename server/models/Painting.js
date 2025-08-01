const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  paperType: { type: String, required: true },
  description: { type: String, required: true },
  size: { type: String, required: true },
  artistName: { type: String, required: true },
  category: { type: String, required: true },
  postedBy: { type: String, required: true }
});

module.exports = mongoose.model('Painting', paintingSchema);