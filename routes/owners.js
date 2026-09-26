const express = require('express');
const router = express.Router();

const ownersController = require('../controllers/owners');
const { validateId, validateOwner } = require('../middleware/validation');

router.get('/', ownersController.getAllOwners);
router.get('/:id', validateId, ownersController.getOwnerById);
router.post('/', validateOwner, ownersController.createOwner);
router.put('/:id', validateId, validateOwner, ownersController.updateOwner);
router.delete('/:id', validateId, ownersController.deleteOwner);

module.exports = router;