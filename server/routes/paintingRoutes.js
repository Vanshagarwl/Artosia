const express = require('express');
const router = express.Router();
const { addPainting, getPaintings } = require('../controllers/paintingController');

router.post('/', addPainting);

router.get('/', getPaintings);

module.exports = router;