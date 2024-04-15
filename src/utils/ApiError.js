class ApiError extends Error{

    constructor(
        statuscode,
        message='Something went wrong',
        stack='',
        errors=[]
    )
    {
        super(message)
        this.statuscode = statuscode
        this.message = message
        this.success = false
        this.errors = errors
        this.data = null

        if(stack)
        this.stack = stack
        else
        Error.captureStackTrace(this, this.constructor)
    }
}

export {ApiError}