class ApiResponse 
{
    constructor(statusCode, data, message="success")
    {
        this.statusCode = this.statusCode,
        this.data = this.data,
        this.message = this.message,
        this.success = statusCode < 400
    }
}

export { ApiResponse };