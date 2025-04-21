
export const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.name = "AppError";
    return error;
  };
  
  export const notFoundError = (message = "Resource not found") =>
    createError(404, message);
  
  export const forbiddenError = (message = "Forbidden") =>
    createError(403, message);
  
  export const unauthorizedError = (message = "Unauthorized") =>
    createError(401, message);
  