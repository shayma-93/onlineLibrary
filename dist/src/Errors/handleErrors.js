export const handleError = (res, error) => {
    console.error("Error details:", error); 
    const status = error.statusCode || 500;
    const message = error.message || "An unexpected error occurred";
  
    res.status(status).json({ error: message });
  };
  export const handleSuccess = (res, data, message = null, status = 200) => {
    res.status(status).json(message ? { message, data } : data);
  };
  