const express = require('express');
const router = express.Router();
const petsController = require('../controllers/pets');
const { validateId, validatePet } = require('../middleware/validation');

router.get('/', petsController.getAllPets);
router.get('/:id', validateId, petsController.getPetById);
router.post('/', validatePet, petsController.createPet);
router.put('/:id', validateId, validatePet, petsController.updatePet);
router.delete('/:id', validateId, petsController.deletePet);

module.exports = router;