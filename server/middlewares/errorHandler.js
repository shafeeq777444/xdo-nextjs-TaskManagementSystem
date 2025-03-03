
import CustomError from "./customError.js";

export const errorHandler = (err, req, res, next) => {
    let customError = err;

    if (err instanceof CustomError) {
        customError.message = err.message || 'Something went wrong';
        customError.statusCode = err.statusCode || 500;
    } else {
        customError = new CustomError('Internal Server Error', 500);
        console.error('Unexpected Error:', err); // Log the error for debugging
    }

    res.status(customError.statusCode).json({
        success: false,
        message: customError.message,

    });
};


