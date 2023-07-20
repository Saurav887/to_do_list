import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import Login from './Components/Login/login.js';
import Signup from './Components/Signup/signup.js';
import HomePage from './Components/HomePage/homepage.js';
import Dashboard from './Components/Dashboard/dashboard.js';
import ErrorPage from './Components/ErrorPage/errorpage';

import './App.css';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      errorElement: <ErrorPage />
    },{
      path: "/login",
      element: <Login />
    },{
      path: "/signup",
      element: <Signup />
    },{
      path: "/dashboard",
      element: <Dashboard />
    }
  ]);
	 
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
