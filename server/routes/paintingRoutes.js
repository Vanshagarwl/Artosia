const express = require('express');
const router = express.Router();
const { addPainting, getPaintings, deletePainting } = require('../controllers/paintingController');

router.post('/', addPainting);
router.get('/', getPaintings);
router.delete('/:id', deletePainting);

module.exports = router;