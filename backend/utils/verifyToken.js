import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next)=>{
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies?.accessToken;
    
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Access token not found. You're not authorized"
        })
    }
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
        if(err){
            console.error('JWT verification error:', err.message);
            return res.status(401).json({
                success: false,
                message: "Token is invalid or expired"
            })
        }

        req.user = user;
        next();
    })

}

export const verifyUser = (req, res, next) =>{
    verifyToken(req, res, () => {
        if(req.user.id == req.params.id || req.user.role == 'admin'){
            next();
        }else{
            return res.status(401).json({
                success: false,
                message: "You're not authenticated"
            })
        }
    })
}


export const verifyAdmin = (req, res, next) =>{
    verifyToken(req, res, () => {
        if(req.user.role == 'admin'){
            next();
        }else{
            return res.status(401).json({
                success: false,
                message: "You're not authorized (Admin access required)"
            })
        }
    })
}