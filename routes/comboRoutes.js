const express = require('express');
const router = express.Router();
const comboController = require('../controllers/ComboController');
const { uploadImageMiddleware } = require('../controllers/ImgController');

router.get('/', comboController.getCombos);
router.post('/', uploadImageMiddleware, comboController.createCombo);
router.put('/:id', uploadImageMiddleware, comboController.updateCombo);
router.delete('/:id', comboController.deleteCombo);

module.exports = router;
