import './App.css';
import Login from './Components/Login/login.js';
import Signup from './Components/Signup/signup.js';
import HomePage from './Components/HomePage/homepage.js';
import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import ErrorPage from './Components/ErrorPage/errorpage';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      errorElement: <ErrorPage />
    },{
      path: "login",
      element: <Login />
    },{
      path: "signup",
      element: <Signup />
    }
  ]);
	 
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
