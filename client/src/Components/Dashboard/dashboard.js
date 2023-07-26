import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';

import GetAllTaskList from '../GetTaskList/getTaskList.js';
import Stats from '../Statistics/stats.js';
import settyl_logo from '../../assets/settyl_logo.jpg';
import TaskList from '../../assets/TaskList.webp';
import './dashboard.css';


export default function Dashboard(){
    const location = useLocation();
    let { msg, unauthorizedAccess } = location.state || {};
    const navigate = useNavigate();
    const ref = useRef(null);

    const [cancelEditing, setCancelEditing] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [taskList, setTaskList] = useState('fetchAllTasks');

    const [filter, setFilter] = useState({
        key: "", value: ""
    });

    useEffect(() => {
        if(unauthorizedAccess === undefined) navigate('/notFound');
        if(msg){ toast.success(msg); msg=null; }
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter({
            ...filter, [name]: value
        })
    }

    const handleApply = () => {
        setTaskList('fetchTasksWithFilter');
        setIsUpdated(true);
    }

    const handleCancel = () => {
        setTaskList('fetchAllTasks');
        setCancelEditing(! cancelEditing);
    };

    const addTask = async () => {
        if(isLoading) return;

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
                        <h2 style={{"textAlign": "center"}}> Welcome {"Admin"} ! </h2>
                    </div>
                    <div className='container col-md-1'>
                        {
                            <button className='button' onClick={ () => { navigate('/'); } } > LogOut </button>
                        }
                    </div>
                </nav>
            </header>

            <Stats />

            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center h-100">
                    <div className="col-md-12 col-xl-11">

                        <div className="card mask-custom">
                        <div className="card-body p-4">

                            <div className="text-center pt-3 pb-2">
                                <img src={TaskList} alt="Check" width="60"/>
                                <h2 className="my-4">Task List</h2>
                            </div>
                            <div className='text-end'>
                                <button id='filter' onClick={() => { ref.current.style.visibility = ref.current.style.visibility ? "": 'visible' } }> APPLY FILTER </button>
                            </div>
                            <div className='filter-block' ref={ref}>
                                <select className='choose-filter' name='key' value={filter.key} onChange={handleChange}>
                                    <option value=""> Choose: </option>
                                    <option value="title"> Title </option>
                                    <option value="description"> Description </option>
                                    <option value="dueDate"> Due Date </option>
                                    <option value="status"> Status </option>
                                    <option value="userName"> Assigned Member </option>
                                </select>
                                <input placeholder='value' name='value' value={filter.value} onChange={handleChange}/>
                                <div className='text-end'>
                                    <button type="submit" id="submit" onClick={handleApply}>APPLY</button>
                                </div>
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
                                <GetAllTaskList isUpdated={isUpdated} setIsUpdated={setIsUpdated} cancelEditing={cancelEditing} setCancelEditing={setCancelEditing} callFunction={taskList} filter={filter} />
                            </tbody>
                            </table>
                        </div>

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