const express = require('express');
const router = express.Router();
const { addPainting, getPaintings, deletePainting,updatePainting } = require('../controllers/paintingController');

router.post('/', addPainting);
router.get('/', getPaintings);
router.delete('/:id', deletePainting);
router.put('/:id', updatePainting);

module.exports = router;