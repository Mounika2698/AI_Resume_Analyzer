export const sendSuccess = (res, message, data, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
export const sendError = (res, message, errorCode, statusCode = 400) => {
    res.status(statusCode).json({
        success: false,
        message,
        errorCode,
    });
};
export const sendValidationError = (res, message, errors) => {
    res.status(400).json({
        success: false,
        message,
        errorCode: 'VALIDATION_ERROR',
        errors,
    });
};
//# sourceMappingURL=response.js.map