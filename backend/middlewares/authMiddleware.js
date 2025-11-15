import jwt from 'jsonwebtoken'
// next - function provided by “I am done with my middleware work. Send the request to the NEXT step.”
const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers['authorization']
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "No token authorisation denied" })
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            // Attach the decoded token data (the user info) to the request object.
            console.log("The decoded user is :", req.user);
            next();
        }
        catch (error) {
            return res.status(400).json({ success: false, message: "Token is not valid" })
        }
    }
    else {
        return res.status(401).json({ success: false, message: "Authorization header missing" })
    }
};

export default verifyToken;
// Verify the JWT Token from client request
// Purpose: Protects backend API endpoints.
// If token invalid → request is blocked before it reaches your controller.
