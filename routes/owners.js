const express = require('express');
const router = express.Router();

const ownersController = require('../controllers/owners');

router.get('/', ownersController.getAllOwners);
router.get('/:id', ownersController.getOwnerById);
router.post('/', ownersController.createOwner);


module.exports = router;