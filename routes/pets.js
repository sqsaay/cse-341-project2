const express = require('express');
const router = express.Router();
const petsController = require('../controllers/pets');

router.get('/', petsController.getAllPets);
router.get('/:id', petsController.getPetById);
router.post('/', petsController.createPet);

module.exports = router;