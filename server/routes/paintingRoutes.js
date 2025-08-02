const express = require('express');
const router = express.Router();
const { addPainting, getPaintings, deletePainting, updatePainting } = require('../controllers/paintingController');
const auth = require('../middleware/auth');

router.post('/', auth, addPainting);
router.get('/', getPaintings);
router.delete('/:id', auth, deletePainting);
router.put('/:id', auth, updatePainting);

module.exports = router;