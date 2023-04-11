


export const asyncHandeler=(fn)=>{
    return (req,res,next)=>{
     fn(req,res,next).catch(error=>{
        return next(new Error(error,{cause:500}))
    })
    }}

export const globalError=(err,req,res,next)=>{
    if(err){
        if(process.env.MOOD=="dev"){
            return res.status(err.cause||500).json({message:err.message,error})
           }
           return res.status(err.cause||500).json({message:err.message})
         }
         next()
        
    }