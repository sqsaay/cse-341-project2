const mongoDb = require('../data/database');
const {ObjectId} = require('mongodb');
const database = new URL (process.env.MONGODB_URL).pathname.slice(1);
const isDocument = (value) => value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.keys(value).length > 0;

const getAllOwners = async (req, res) => {
    //swagger.tags=['Owners']
    try {
        const owners = await mongoDb.getDatabase()
            .db(database)
            .collection('owners')
            .find()
            .toArray();
        return res.status(200).json(owners);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch owners' });
    }
};

const getOwnerById = async (req, res) => {
    //swagger.tags=['Owners']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid owner ID' });
    }

    try {
        const owner = await mongoDb.getDatabase()
            .db(database)
            .collection('owners')
            .findOne({ _id: new ObjectId(req.params.id) });
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }
        return res.status(200).json(owner);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch owner' });
    }
};

const createOwner = async (req, res) => {
    //swagger.tags=['Owners']
    if (!isDocument(req.body)) {
        return res.status(400).json({ message: 'Owner must be a non-empty JSON object' });
    }

    const owner = { ...req.body };
    delete owner._id;

    try {
        const result = await mongoDb.getDatabase()
            .db(database)
            .collection('owners')
            .insertOne(owner);
        return res.status(201).json({ _id: result.insertedId, ...owner });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create owner' });
    }
};

module.exports = {
    getAllOwners,
    getOwnerById,
    createOwner
}   