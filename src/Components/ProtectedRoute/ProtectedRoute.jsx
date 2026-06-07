import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from "../Context/Authcontext";
import LoadingSpinner from "../UI/LoadingSpinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { user, profile, loading } = useAuth(); 

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  
  if (!profile) {
    return <LoadingSpinner />;
  }

  const userRole = profile?.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
  const isAuthorized = normalizedAllowedRoles.includes(userRole);

  // 4. Authorization Check: Check if the role matches the route
  if (!isAuthorized) {
    // Prevent the "Refresh Loop": If the user is on their allowed home base, don't redirect
    if (userRole === "admin") {
      return <Navigate to="/panel" replace />;
    } 
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;













// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from "../Context/Authcontext";
// import LoadingSpinner from "../UI/LoadingSpinner"

// const ProtectedRoute = ({ allowedRoles }) => {
//   const location = useLocation();
//   const { user, profile, loading } = useAuth(); 

//   // Keep the loading check so we don't redirect before Supabase responds
//   if (loading) {
//     return <LoadingSpinner />
//   } // Or your <LoadingSpinner />

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   const userRole = profile?.role?.toLowerCase();
//   const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
//   const isAuthorized = normalizedAllowedRoles.includes(userRole);

//   if (!isAuthorized) {
//     // If Admin tries to enter User pages or an invalid link, send back to Admin Panel
//     if (userRole === "admin") {
//       return <Navigate to="/panel" replace />;
//     } 
//     // If User tries to enter Admin pages, send back to Dashboard
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;