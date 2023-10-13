const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/get_item', itemController.get_items);
router.get('/get_item_by_id/:id', itemController.get_item_by_id);
router.post('/insert_item', itemController.insert_item);
router.post('/update_item/:id', itemController.update_item);

module.exports = router;
