const authorizeRoles = (...allowedRoles)=>{
    return(req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({success:false,message:"Access denied"})
        }
        next();
    }
}
export default authorizeRoles;
// Check if user’s role (decoded from JWT) has permission
// Even if user has a valid token, it checks role-based access.
// E.g., only admins/managers can modify data.