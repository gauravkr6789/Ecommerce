const isAdmin=(req,res,next)=>{
    try{
        if(!req.user){
            return res.status(401).json({
                status:401,
                message:"user unauthorized",
                success:false
            })
        }

        if(req.user.role !== 'admin'){
            return res.status(403).json({
                status:403,
                message:"access denied you are not admin !....",
                success:false

            })
        }
        next()

    }
    catch(error){
         return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}

export default isAdmin


