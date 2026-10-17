class ApiError extends Error {
  constructor(statusCode, message, errors = [], options = {}) {
    super(message, options);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
  }
}

export default ApiError;