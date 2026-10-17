import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apierror.js";
import { Client } from "../models/client.models.js";

// Taking data as input and sending it to the backend to create a new client
// input : {NAME , EMAIL , MESSAGE}

const createClient = asyncHandler(async (req, res) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        throw new ApiError(400, 'Request body must be an object');
    }

    const { name, email, message } = req.body;

    // validate all the fields
    if ([name, email, message].some(
        (field) => typeof field !== 'string' || field.trim() === '',
    )) {
        throw new ApiError(400, 'All Fields are required');
    }
    if( typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof message !== 'string'
    ) {
        throw new ApiError(400, 'Invalid field types');
    }

    // EMAIL validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new ApiError(400, 'Invalid Email address');
    }

    const client = await Client.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
    });

    return res.status(201).json({
        success: true,
        message: 'Client created successfully',
        data: client,
    });
});

export default createClient;