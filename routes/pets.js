const express = require('express');
const router = express.Router();
const petsController = require('../controllers/pets');
const { validateId, validatePet } = require('../middleware/validation');
const {isAuthenticated} = require('../middleware/authenticate');
router.get('/', petsController.getAllPets);
router.get('/:id', validateId, petsController.getPetById);
router.post('/', isAuthenticated, validatePet, petsController.createPet);
router.put('/:id', isAuthenticated, validateId, validatePet, petsController.updatePet);
router.delete('/:id', isAuthenticated, validateId, petsController.deletePet);

module.exports = router;