const express = require('express');
const router = express.Router();
const { addPainting } = require('../controllers/paintingController');

router.post('/', addPainting);

module.exports = router;