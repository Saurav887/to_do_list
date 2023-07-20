import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import validator from "validator";
import { useNavigate } from 'react-router-dom';
import { Bars } from 'react-loader-spinner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhoneSquare, faLock, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';

import signupSvg from '../../assets/signup.svg';
import settyl_logo from '../../assets/settyl_logo.jpg';
import './signup.css';
import 'mdb-ui-kit/css/mdb.min.css';


export default function Signup(){
    const navigate = useNavigate();

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        jobTitle: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e){
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    }

    async function signup(){
        if(isLoading) return;

        let noError = true;

        if(user.firstName === ""){ toast.error("First Name cannot be empty"); noError=false; }
        if(user.lastName === ""){ toast.error("Last Name cannot be empty"); noError=false; }
        if(user.email === ""){ toast.error("Email cannot be empty"); noError=false; }
        if(user.jobTitle === ""){ toast.error("Please choose a job role"); noError=false; }
        if(user.password === "" || user.passwordConfirmation === ""){ toast.error("Password cannot be empty"); noError=false; }
        
        if(user.password !== user.passwordConfirmation){ toast.error("Password and Confirm Password should be same"); noError=false; }
        if(! validator.isEmail(user.email)) {
            toast.error("Please, enter a valid Email!"); noError = false;
        }

        if(! noError) return;

        console.log("signing up");
        
        setIsLoading(true);
        try{
            await axios.post("https://task-management-system-bay.vercel.app/signup", user)
                    .then( res => {
                        const msg = res.data.message;
                        if(msg === "User already Registered") toast.error(msg);
                        else{
                            navigate('/', { state: {user: res.data.user, msg: msg} });
                        }
                    });
        }catch(error){
            console.log("Error while Signing In", error.message);
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
            
            
            <div className="container">
                <div className="row py-5 mt-4 align-items-center">
                    <div className="col-md-5 pr-lg-6 mb-5 mb-md-0">
                        <img src={signupSvg} alt="" className="img-fluid mb-3 d-none d-md-block"/>
                        <h1> Create an Account </h1>
                        <p className="font-italic text-muted mb-0"> Successfully land your first steps in our portal. </p>
                   </div>

                   <div className='col-md-1 pr-lg-10'></div>

                      {/* Registeration Form */}
                    <div className="col-md-6 col-lg-5 ml-auto">
                        <form action="#">
                            <div className="row">
            
                                {/* First Name */}
                                <div className="input-group col-lg-6 mb-4">
                                    <div className="input-gorup-prepend">
                                        <span className="input-group-text bg-white px-4 border-md border-right-0">
                                            <FontAwesomeIcon icon = {faUser} className='text-muted'/>
                                        </span>
                                    </div>
                                    <input id="firstName" type="text" name="firstName" value = {user.firstName} placeholder="First Name" className="form-control bg-white border-left-0 border-md" onChange={handleChange} />
                                </div>
            
                                {/* Last Name */}
                                <div className="input-group col-lg-6 mb-4">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-white px-4 border-md border-right-0">
                                            <FontAwesomeIcon icon = {faUser} className='text-muted'/>
                                        </span>
                                    </div>
                                    <input id="lastName" type="text" name="lastName" value = {user.lastName} placeholder="Last Name" className="form-control bg-white border-left-0 border-md"onChange={handleChange} />
                                </div>
            
                                {/* Email Address */}
                                <div className="input-group col-lg-12 mb-4">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-white px-4 border-md border-right-0">
                                            <FontAwesomeIcon icon = {faEnvelope} className='text-muted'/>
                                        </span>
                                    </div>
                                    <input id="email" type="email" name="email" value = {user.email} placeholder="Email Address" className="form-control bg-white border-left-0 border-md" onChange={handleChange} />
                                </div>
            
                                {/* Job */}
                                <div className="input-group col-lg-12 mb-4">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-white px-4 border-md border-right-0">
                                            <FontAwesomeIcon icon = {faAddressCard} className='text-muted'/>
                                        </span>
                                    </div>
                                    <select id="job" name="jobTitle" value={user.jobTitle} onChange={handleChange} className="form-select form-select-sm custom-select bg-white border-left-0 border-md">
                                        <option value="">Choose your job role</option>
                                        <option value="Designer">Designer</option>
                                        <option value="Developer">Developer</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Accountant">Accountant</option>
                                    </select>
                                </div>
            
                                {/* Password */}
                                <div className="input-group col-lg-6 mb-4">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-white px-4 border-md border-right-0">
                                            <FontAwesomeIcon icon = {faLock} className='text-muted'/>
                                        </span>
                                    </div>
                                    <input id="password" type="password" name="password" value = {user.password} placeholder="Password" className="form-control bg-white border-left-0 border-md" onChange={handleChange} />
                                </div>
            
                                {/* Password Confirmation */}
                                <div className="input-group col-lg-6 mb-4">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-white px-4 border-md border-right-0">
                                            <FontAwesomeIcon icon = {faLock} className='text-muted'/>
                                        </span>
                                    </div>
                                    <input id="passwordConfirmation" type="text" name="passwordConfirmation" value = {user.passwordConfirmation} placeholder="Confirm Password" className="form-control bg-white border-left-0 border-md" onChange={handleChange} />
                                </div>
            
                                {/* Submit Button */}
                                <div className="form-group col-lg-12 mx-auto mb-0" onClick={signup} >
                                    <a href="#" className="btn btn-primary btn-block py-2">
                                        <span className="font-weight-bold">
                                            {
                                                isLoading? 
                                                    <Bars
                                                        height="18" width="100%" color="#eee"
                                                        ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true}
                                                    />
                                                :
                                                    "Create your account"
                                            }
                                        </span>
                                    </a>
                                    <Toaster reverseOrder={true}/>
                                </div>
            
                                {/* Divider Text */}
                                <div className="form-group col-lg-12 mx-auto d-flex align-items-center my-4">
                                    <div className="border-bottom w-100 ml-5"></div>
                                    <span className="px-2 small text-muted font-weight-bold text-muted">OR</span>
                                    <div className="border-bottom w-100 mr-5"></div>
                                </div>
            
                                {/* Social Login */}
                                <div className="form-group col-lg-12 mx-auto">
                                    <a href="#" className="btn btn-primary btn-block py-2" id='btn-google'>
                                        <FontAwesomeIcon icon = {faGoogle} />
                                        <span className="font-weight-bold">    Continue with Google</span>
                                    </a>
                                    <a href="#" className="btn btn-primary btn-block py-2" id="btn-facebook">
                                        <FontAwesomeIcon icon = {faFacebookF} />
                                        <span className="font-weight-bold">    Continue with Facebook</span>
                                    </a>
                                    <a href="#" className="btn btn-primary btn-block py-2" id="btn-twitter">
                                        <FontAwesomeIcon icon = {faTwitter} />
                                        <span className="font-weight-bold">    Continue with Twitter</span>
                                    </a>
                                </div>
            
                                {/* Already Registered */}
                                <div className="text-center w-100">
                                    <p className="text-muted font-weight-bold">Already Registered? <button onClick={ ()=> navigate('/login') } className="text-primary ml-2 btn-login">Login</button></p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>       
        </>
    );
}