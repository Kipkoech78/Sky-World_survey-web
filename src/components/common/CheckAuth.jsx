import React from "react";
import {
  Navigate,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  console.log("check auth role", user?.role);
  user?.role == "admin";

  // Define public routes guests can access
  const publicRoutes = [
    "/", // main landing page
    "/exhibition/home",
    "/exhibition/listing",
  ];

  //  Allow event details page (dynamic route)
  const isEventDetailsRoute = path.startsWith("/exhibition/event/");

  // Check if this route is public
  const isPublicRoute = publicRoutes.includes(path) || isEventDetailsRoute;
  const redirectPath = searchParams.get("redirect") || "/exhibition/home";

  //  Allow guests to access public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  //  Protect private routes for unauthenticated users
  if (
    !isAuthenticated &&
    !path.includes("/login") &&
    !path.includes("/register")
  ) {
    return <Navigate to="/auth/login" replace />;
  }

  //  Redirect logged-in users away from login/register pages
  if (
    isAuthenticated &&
    (path.includes("/login") || path.includes("/register"))
  ) {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to={redirectPath} replace />
    );
  }

  // Prevent normal users from accessing admin pages
  if (isAuthenticated && user?.role !== "admin" && path.startsWith("/admin")) {
    return <Navigate to="/unauth-page" replace />;
  }

  //  Prevent admins from accessing exhibition user routes
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    path.startsWith("/exhibition")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;

// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";

// function CheckAuth({ isAuthenticated, user, children }) {
//   const location = useLocation();

//   if(location.pathname === '/'){
//     if(!isAuthenticated){
//       return <Navigate to='/auth/login' />
//     }else{
//      return user?.role === 'admin' ?  <Navigate to='/admin/dashboard' /> :
//       <Navigate to='/exhibition/home' />
//     }
//   }

//   // Redirect unauthenticated users to login unless they're on the login or register page
//   if (!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
//     return <Navigate to='/auth/login' />
//   }

//   // Redirect authenticated users away from login or register
//   if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
//     return user?.role === 'admin' ? <Navigate to='/admin/dashboard' /> : <Navigate to='/exhibition/home' />
//   }

//   // Prevent regular users from accessing admin routes
//   if (isAuthenticated && user?.role !== 'admin' && location.pathname.includes('/admin')) {
//     return <Navigate to='/unauth-page' />
//   }

//   // Prevent admins from accessing exhibition routes
//   if (isAuthenticated && user?.role === 'admin' && location.pathname.includes('/exhibition')) {
//     return <Navigate to='/admin/dashboard' />
//   }

//   return <>{children}</>;
// }

// export default CheckAuth;
