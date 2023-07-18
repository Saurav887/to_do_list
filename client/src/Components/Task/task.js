import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

import 'mdb-ui-kit/css/mdb.min.css';
import './task.css';

export default function Task({ curTask, setIsUpdated }){  
    const [statusClass, setStatusClass] = useState("");
    const [task, setTask] = useState(curTask);
    const [isEditing, setIsEditing] = useState(false);
    
    const del = async () => {
        try{
            const path = `https://task-management-system-bay.vercel.app/delete/${task._id}`;
            await axios.post(path)
                    .then(req => {
                        toast.success(req.data.message);
                        setIsUpdated(true);
                    })
        }catch(error){
            console.log("Error while Deleting", error.message);
        }
    }

    const update = async () => {
        try{
            console.log(task);
            await axios.post(`https://task-management-system-bay.vercel.app/update/${task._id}`, task)
                    .then(req => {
                        toast.success(req.data.message);
                        
                        if(req.data.task.status === "Successful") setStatusClass("badge bg-success");
                        else if(req.data.task.status === "Failed") setStatusClass("badge bg-danger");
                        else setStatusClass("badge bg-warning");

                        setIsUpdated(true);
                    })
        }catch(error){
            console.log("Error while Updating", error.message);
        }
    }

    const markDone = async () => {
        try{
            await axios.post(`https://task-management-system-bay.vercel.app/markdone/${task._id}`)
                    .then(req => {
                        toast.success(req.data.message);
                        setStatusClass("badge bg-success");
                        setTask({
                            ...task, status:"Successful"
                        })
                        setIsUpdated(true);
                    })
        }catch(error){
            console.log("Error while Changing Status", error.message);
        }
    }

    useEffect(() => {
        if(task.status === "Successful") setStatusClass("badge bg-success");
        else if(task.status === "Failed") setStatusClass("badge bg-danger");
        else setStatusClass("badge bg-warning");
    }, []);

    const handleUpdate = async () => {
        if(isEditing) await update();
        setIsEditing(! isEditing);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task, [name]: value
        })
    }


    return (
        <tr className="fw-normal">
            <td className="align-middle">
                {
                    isEditing ? <input name="title" value={task.title} onChange={handleChange}/>
                    : <span>{task.title}</span>
                }
            </td>
            <td className="align-middle">
                {
                    isEditing ? <input name="description" value={task.description} onChange={handleChange}/>
                    : <span>{task.description}</span>
                }
            </td>
            <td className="align-middle">
                {
                    isEditing ? <select name="status" value={task.status} onChange={handleChange}>
                        <option value="Pending">Pending</option>
                        <option value="Successful">Successful</option>
                        <option value="Failed">Failed</option>
                    </select>
                    : <h6 className="mb-0"><span className={statusClass}>{task.status}</span></h6>
                }
            </td>
            <td className="align-middle">
                {
                    isEditing ? <input name="dueDate" value={task.dueDate} onChange={handleChange}/>
                    : <span>{task.dueDate}</span> 
                }
            </td>
            <th>
                <img src={task.userAv} alt="userAv" style={{"width": "45px", "height": "auto"}}/>
                {
                    isEditing ? <input name="userName" value={task.userName} onChange={handleChange}/>
                    : <span className="ms-2">{task.userName}</span>
                }
            </th>
            <td className="align-middle">
                <button data-mdb-toggle="tooltip" title={isEditing? "Save": "Edit"} className='mybtn' onClick={handleUpdate}>
                    <FontAwesomeIcon icon={isEditing? faSave: faEdit} className="fa-lg" style={isEditing? {"color": "black"} :{"color": "blue"}}></FontAwesomeIcon></button>  
                <button data-mdb-toggle="tooltip" title="Done" className='mybtn' onClick={markDone}>
                    <FontAwesomeIcon icon={faCheck} className="fa-lg" style={{"color":"green"}}></FontAwesomeIcon></button>
                <button data-mdb-toggle="tooltip" title="Remove" className='mybtn' onClick={del}>
                    <FontAwesomeIcon icon={faTrashAlt} className="fa-lg"  style={{"color":"gray"}}></FontAwesomeIcon></button>
            </td>
        </tr>
    );
};