import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if token exists
    if (!authHeader) return res.status(403).json({ message: "No token provided" });

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized Session" });
        
        req.userId = decoded.id;
        req.userRole = decoded.role; // This will now be 'admin' or 'student'
        next();
    });
};

export const isAdmin = (req, res, next) => {
    // We check if the role is 'admin' (which means Faculty)
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: "Access Denied: Faculty Only" });
    }
    next();
};