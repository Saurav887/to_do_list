import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import GetAllTaskList from '../GetTaskList/getTaskList.js';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';

import settyl_logo from '../../assets/settyl_logo.jpg';
import TaskList from '../../assets/TaskList.webp';
import './homepage.css';
import 'mdb-ui-kit/css/mdb.min.css';


export default function HomePage(){
    const location = useLocation();
    let { user, msg } = location.state || {};
    const navigate = useNavigate();

    const [curUser, setCurUser] = useState({
        name: 'Guest'
    });

    const resetUser = () => setCurUser({
        name: "Guest"
    });

    const [cancelEditing, setCancelEditing] = useState(false);
    const [isUpdated, setIsUpdated] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(user) setCurUser(user);
        if(msg){ toast.success(msg); msg=null; }
    }, [user, msg]);


    const addTask = async () => {
        if(isLoading) return;

        if(curUser.name === "Guest"){
            toast.error("Please Login/SignUp first");
            return;
        }
        const task = {
            title: "",
            description: "",
            status: "",
            dueDate: "",
            userAv: "https://cdn.discordapp.com/attachments/1116447256929898559/1130521290055364618/default_userAv.png",
            userName: ""
        };

        setIsLoading(true);
        try{
            await axios.post("https://task-management-system-bay.vercel.app/add", task)
                    .then( res => {
                        const msg = res.data.message;
                        if(msg === "Same Title Entry Exists") toast.error(msg);
                        else{
                            toast.success(msg);
                            setIsUpdated(true);
                        }
                    });
        }catch(error){
            console.log("Error while adding the task into the database", error.message);
        }
        setIsLoading(false);
    }

    const handleCancel = () => {
        setCancelEditing(! cancelEditing);
    };
    

    return (
        <>
            {/* Navbar */}
            <header className="header">
                <nav className="navbar navbar-expand-lg navbar-light py-3">
                    <div className="container col-md-3">
                        {/* Navbar Brand */}
                        <a href="https://settyl.com/" className="navbar-brand">
                            <img src={settyl_logo} alt="settyl_logo" width="150"/>
                        </a>
                    </div>
                    <div className='container col-md-4'>
                        <h2 style={{"textAlign": "center"}}> Welcome {curUser.name} ! </h2>
                    </div>
                    <div className='container col-md-1'>
                        {
                            curUser.name === "Guest"?
                                <>
                                    <button className='button' onClick={ () => navigate('/login') }> Login </button>
                                    <button className='button' onClick={ () => navigate('/signup')}> SignUp </button>
                                </>
                            : 
                                <button className='button' onClick={ () => { resetUser(); navigate('/'); } } > LogOut </button>
                        }
                    </div>
                </nav>
            </header>

            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center h-100 mybox">
                    <div className="col-md-12 col-xl-11">

                        <div className="card mask-custom">
                        <div className="card-body p-4">

                            <div className="text-center pt-3 pb-2">
                                <img src={TaskList} alt="Check" width="60"/>
                                <h2 className="my-4">Task List</h2>
                            </div>
                            
                            <table className="table mb-0">
                            <thead>
                                <tr>
                                <th scope="col">Title</th>
                                <th scope="col" className='col-md-3'>Description</th>
                                <th scope="col">Status</th>
                                <th scope="col">Due Date</th>
                                <th scope="col">Assigned Member</th>
                                <th scope="col">Actions</th>
                                </tr>
                            </thead>

                            <tbody className=".overflow-auto">
                                {
                                    curUser.name !== "Guest"?
                                        <GetAllTaskList isUpdated={isUpdated} setIsUpdated={setIsUpdated} cancelEditing={cancelEditing} callFunction={'fetchAllTasks'}/>
                                    : <></>
                                }
                            </tbody>
                            </table>
                        </div>

                        {
                            curUser.name === "Guest"?
                                <div className="container text-center">
                                    <h2> Login/SignUp to see the Task List </h2>
                                </div>
                            : <></>
                        }

                        <div className="card-footer text-end p-3">
                                <button className="me-2 btn btn-link" onClick={handleCancel}>Cancel</button>
                                <button className="btn btn-primary" onClick={addTask}>
                                    {
                                        isLoading? 
                                            <Bars
                                                height="18" width="59" color="#eee"
                                                ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true}
                                            />
                                        :
                                            "Add Task"
                                    }
                                </button>
                            </div>
                        </div>

                    </div>
                    </div>
                </div>
                <Toaster position='top=right'/>
            </section>
        </>
    );
};