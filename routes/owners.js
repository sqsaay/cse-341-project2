const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/authenticate');

const ownersController = require('../controllers/owners');
const { validateId, validateOwner } = require('../middleware/validation');

router.get('/', ownersController.getAllOwners);
router.get('/:id', ownersController.getOwnerById);
router.post('/', isAuthenticated, validateOwner, ownersController.createOwner);
router.put('/:id', isAuthenticated, validateId, validateOwner, ownersController.updateOwner);
router.delete('/:id', isAuthenticated, validateId, ownersController.deleteOwner);

module.exports = router;