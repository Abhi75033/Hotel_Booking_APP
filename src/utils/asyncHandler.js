const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>{
            next(error)
        })
    }
}

// This is for error handling pourpose 

export {asyncHandler}