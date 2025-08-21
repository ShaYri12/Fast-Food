import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next)=>{
    console.log('=== Token Verification Debug ===');
    console.log('Cookies:', req.cookies);
    console.log('Authorization header:', req.headers.authorization);
    
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies?.accessToken;
    
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    console.log('Token found:', token ? 'Yes' : 'No');
    console.log('Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'None');

    if(!token){
        console.log('No token found, returning 401');
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

        console.log('Token verified successfully for user:', user);
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

export const verifyCartUser = (req, res, next) =>{
    verifyToken(req, res, () => {
        // For cart operations, check user ID from body or params
        const userIdToCheck = req.body.userId || req.params.id;
        console.log('=== Cart User Verification ===');
        console.log('Token user ID:', req.user.id);
        console.log('Request user ID:', userIdToCheck);
        console.log('User role:', req.user.role);
        console.log('Match:', req.user.id == userIdToCheck);
        
        if(req.user.id == userIdToCheck || req.user.role == 'admin'){
            console.log('Cart user verification: PASSED');
            next();
        }else{
            console.log('Cart user verification: FAILED');
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