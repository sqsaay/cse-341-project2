const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const databaseName = new URL(process.env.MONGODB_URL).pathname.slice(1);
const getPetsCollection = () => mongodb.getDatabase().db(databaseName).collection('pets');
const isDocument = (value) => value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.keys(value).length > 0;

const getAllPets = async (req, res) => {
    //swagger.tags=['Pets']
    try {
        const pets = await getPetsCollection().find().toArray();
        return res.status(200).json(pets);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch pets' });
    }
};

const getPetById = async (req, res) => {
    //swagger.tags=['Pets']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid pet ID' });
    }

    try {
        const pet = await getPetsCollection().findOne({ _id: new ObjectId(req.params.id) });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        return res.status(200).json(pet);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch pet' });
    }
};

const createPet = async (req, res) => {
    //swagger.tags=['Pets']
    if (!isDocument(req.body)) {
        return res.status(400).json({ message: 'Pet must be a non-empty JSON object' });
    }

    const pet = { ...req.body };
    delete pet._id;

    try {
        const result = await getPetsCollection().insertOne(pet);
        return res.status(201).json({ _id: result.insertedId, ...pet });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create pet' });
    }
};

module.exports = {
    getAllPets,
    getPetById,
    createPet
};