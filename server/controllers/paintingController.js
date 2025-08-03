const Painting = require('../models/Painting');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

exports.addPainting = async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        public_id: `painting_${Date.now()}`,
        resource_type: 'image'
      });
      imageUrl = result.secure_url;
    }
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image is required. Please upload an image file.' });
    }

    const painting = new Painting({
      ...req.body,
      imageUrl,
      postedBy: req.user.username
    });

    await painting.save();
    res.status(201).json({ message: 'Painting added successfully', painting });
  } catch (error) {
    console.error('Error adding painting:', error);
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

    if (painting.imageUrl) {
      try {
        console.log('Deleting image from Cloudinary:', painting.imageUrl);
        await deleteFromCloudinary(painting.imageUrl);
      } catch (imageError) {
        console.error('Error deleting image from Cloudinary:', imageError);
      }
    }

    await painting.deleteOne();
    res.status(200).json({ message: 'Painting deleted successfully' });
  } catch (error) {
    console.error('Error deleting painting:', error);
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

    let updateData = { ...req.body };

    // If a new image file was uploaded, handle the image replacement
    if (req.file) {
      try {
        // Delete the old image from Cloudinary if it exists
        if (painting.imageUrl) {
          console.log('Deleting old image:', painting.imageUrl);
          await deleteFromCloudinary(painting.imageUrl);
        }

        // Upload the new image
        const result = await uploadToCloudinary(req.file.buffer, {
          public_id: `painting_${Date.now()}`,
          resource_type: 'image'
        });

        updateData.imageUrl = result.secure_url;
        console.log('New image uploaded:', result.secure_url);
      } catch (imageError) {
        console.error('Error handling image update:', imageError);
        return res.status(500).json({ error: 'Failed to update image. Please try again.' });
      }
    }

    const updatedPainting = await Painting.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    res.status(200).json({ message: 'Painting updated successfully', painting: updatedPainting });
  } catch (error) {
    console.error('Error updating painting:', error);
    res.status(400).json({ error: error.message });
  }
};
