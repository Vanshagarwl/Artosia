const express = require('express');
const router = express.Router();
const { addPainting, getPaintings, deletePainting, updatePainting } = require('../controllers/paintingController');
const auth = require('../middleware/auth');
const { memoryUpload } = require('../middleware/upload');

router.post('/', auth, memoryUpload.single('image'), addPainting);
router.get('/', getPaintings);
router.delete('/:id', auth, deletePainting);
router.put('/:id', auth, memoryUpload.single('image'), updatePainting);

module.exports = router;