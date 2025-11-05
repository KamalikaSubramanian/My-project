import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children,allowedRoles}) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
 
    if(!token){
        return <Navigate to="/login" replace/>
    }
    if(!allowedRoles.includes(role)){
        return <Navigate to="/unauthorised" replace/>
    }
    return children
}

export default ProtectedRoute;
// REPLACE
// User goes to /admin

// ProtectedRoute redirects to /login, replacing /admin in history

// Now if user clicks Back, browser doesn’t go back to /admin.🌀 infinite loop (annoying)

// It goes back to the page before /admin (maybe the homepage)
// Children -  The component (page) you want to protect.
// allowed roles =  List of roles allowed to view that route.
 