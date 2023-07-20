import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Bars } from 'react-loader-spinner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, faTwitter} from '@fortawesome/free-brands-svg-icons';

import svg from '../../assets/login.svg';
import settyl_logo from '../../assets/settyl_logo.jpg';
import './login.css';

export default function Login(){
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e){
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    }

    async function login(){
        if(isLoading) return;

        let noError = true;
        if(! validator.isEmail(user.email)) {
            toast.error("Please Enter a valid Email!"); noError = false;
        }
        if(user.password === ""){ toast.error("Password cannot be empty"); noError=false; }

        if(! noError) return;

        console.log("logging in");

        setIsLoading(true);
        try{
            await axios.post("https://task-management-system-bay.vercel.app/login", user)
                .then( res => {
                        const msg = res.data.message;
                        if(msg === "User is not Registered, Please SignUp" || msg === "Invalid Username or Password") toast.error(msg);
                        else{
                            if(user.email === "admin@gmail.com") navigate('/dashboard', { state: {unauthorizedAccess: false, msg: msg} });
                            else navigate('/', { state: {user: res.data.user, msg: msg} });
                        }
                    });
        }catch(error){
            console.log("Error while Loggin In", error.message);
        }
        setIsLoading(false);
    }

    return (
        <> 
            {/* Navbar */}
            <header className="header">
                <nav className="navbar navbar-expand-lg navbar-light py-3">
                    <div className="container">
                        {/* Navbar Brand */}
                        <a href="https://settyl.com/" className="navbar-brand">
                            <img src={settyl_logo} alt="settyl_logo" width="150"/>
                        </a>
                    </div>
                    <div className='container col-md-1'>
                        <button className='button' onClick={ () => navigate('/') }> Home </button>
                    </div>
                </nav>
            </header>


            <section className="vh-100">
                <div className="container py-5 h-100">
                <div className="row d-flex align-items-center justify-content-center h-100">
                <div className="col-md-8 col-lg-7 col-xl-6">
                    <img src={svg} className="img-fluid" alt="Phone"></img>
                </div>
                <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">  
                    <form>
                        {/* Email */}
                        <div className="form-floating mb-4">
                            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" name="email" value={user.email} onChange={handleChange} />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>

                        {/* Password */}
                        <div className="form-floating mb-4">
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" name="password" value={user.password} onChange={handleChange} />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>

                        {/* Checkbox */}
                        <div className="d-flex justify-content-around align-items-center mb-4">
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="form1Example3" />
                            <label className="form-check-label" htmlFor="form1Example3"> Remember me </label>
                            </div>
                            <a href="#!">Forgot password?</a>
                        </div>

                        {/* Submit button */}
                        <div onClick = {login} className="btn btn-primary btn-lg btn-block">
                            {
                                isLoading? 
                                    <Bars
                                        height="18" width="100%" color="#eee"
                                        ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true}
                                    />
                                :
                                    "Sign In"
                            }
                        </div>

                        <div className="divider d-flex align-items-center my-4">
                            <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                        </div>
                        
                        <a className="btn btn-primary btn-lg btn-block" style={{"backgroundColor": "#FF3131"}} href="#!"
                            role="button">
                            <FontAwesomeIcon icon = {faGoogle} /> Continue with Google
                        </a>
                        <a className="btn btn-primary btn-lg btn-block" style={{"backgroundColor": "#3b5998"}} href="#!"
                            role="button">
                            <FontAwesomeIcon icon = {faFacebookF} /> Continue with Facebook
                        </a>
                        <a className="btn btn-primary btn-lg btn-block" style={{"backgroundColor": "#55acee"}} href="#!"
                            role="button">
                            <FontAwesomeIcon icon = {faTwitter} /> Continue with Twitter
                        </a>

                        <div className="text-center w-100">
                            <p className="text-muted font-weight-bold">Not Have an Account? <button onClick={ ()=> navigate('/signup') } className="text-primary ml-2 btn-signup">SignUp</button></p>
                        </div>
                    </form>
                </div>
                </div>
                </div>
            </section>


            <Toaster />
        </>
    );
}