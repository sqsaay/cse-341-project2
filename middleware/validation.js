const isObject = (value) => value !== null
    && typeof value === 'object'
    && !Array.isArray(value);

const isDateValue = (value) => {
    const dateString = isObject(value) && typeof value.$date === 'string'
        ? value.$date
        : value;
    return typeof dateString === 'string' && !Number.isNaN(Date.parse(dateString));
};

const isObjectIdValue = (value) => {
    const id = isObject(value) ? value.$oid : value;
    return typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
};

const validateBody = (resource, requiredFields, optionalChecks = {}) => (req, res, next) => {
    const body = req.body;
    const errors = [];

    if (!isObject(body) || Object.keys(body).length === 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: [`${resource} must be a non-empty JSON object`]
        });
    }

    for (const field of requiredFields) {
        if (typeof body[field] !== 'string' || !body[field].trim()) {
            errors.push(`${field} is required and must be a non-empty string`);
        }
    }

    for (const [field, validate] of Object.entries(optionalChecks)) {
        if (body[field] !== undefined && !validate(body[field])) {
            errors.push(`${field} has an invalid value`);
        }
    }

    if (resource === 'Owner'
        && typeof body.email === 'string'
        && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
        errors.push('email must be a valid email address');
    }

    if (resource === 'Pet'
        && body.ownerId !== undefined
        && !isObjectIdValue(body.ownerId)) {
        errors.push('ownerId must be a 24-character MongoDB ID or an Extended JSON $oid');
    }

    if (resource === 'Owner'
        && Array.isArray(body.petIds)
        && !body.petIds.every(isObjectIdValue)) {
        errors.push('petIds must contain valid MongoDB IDs');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    return next();
};

const validateId = (req, res, next) => {
    if (!/^[a-f\d]{24}$/i.test(req.params.id || '')) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: ['id must be a 24-character MongoDB ID']
        });
    }
    return next();
};

const validateOwner = validateBody('Owner', ['firstName', 'lastName', 'email'], {
    phone: (value) => typeof value === 'string',
    address: isObject,
    petIds: Array.isArray,
    createdAt: isDateValue
});

const validatePet = validateBody('Pet', ['name', 'species'], {
    breed: (value) => typeof value === 'string',
    sex: (value) => typeof value === 'string',
    neutered: (value) => typeof value === 'boolean',
    birthDate: isDateValue,
    weightKg: (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0,
    microchipNumber: (value) => value === null || typeof value === 'string',
    vaccinations: Array.isArray,
    status: (value) => typeof value === 'string'
});

module.exports = {
    validateId,
    validateOwner,
    validatePet
};