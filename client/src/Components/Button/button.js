import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BallTriangle } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './button.css';

export default function Button({ task, setTask, setStatusClass, setIsUpdated, isEditing, setIsEditing, onClick, title, color, icon}) {
    const [isLoading, setIsLoading] = useState(false);

    const del = async () => {
        setIsLoading(true);

        try{
            const path = `https://task-management-system-bay.vercel.app/delete/${task._id}`;
            await axios.post(path)
                    .then(req => {
                        setIsUpdated(true);
                        toast.success(req.data.message);
                    })
        }catch(error){
            console.log("Error while Deleting", error.message);
        }
        setIsLoading(false);
    }

    const update = async () => {
        setIsLoading(true);

        try{
            await axios.post(`https://task-management-system-bay.vercel.app/update/${task._id}`, task)
                    .then(req => {                        
                        if(req.data.task.status === "Successful") setStatusClass("badge bg-success");
                        else if(req.data.task.status === "Failed") setStatusClass("badge bg-danger");
                        else setStatusClass("badge bg-warning");

                        setTask(req.data.task);
                        toast.success(req.data.message);
                    })
        }catch(error){
            console.log("Error while Updating", error.message);
        }

        setIsLoading(false);
    }

    const markDone = async () => {
        if(task.status === "Successful"){
            toast.success("Successfully Marked Successful");
            return;
        }

        setIsLoading(true);
        try{
            await axios.post(`https://task-management-system-bay.vercel.app/markdone/${task._id}`)
                    .then(req => {
                        setTask({
                            ...task, status:"Successful"
                        })
                        setStatusClass("badge bg-success");
                        toast.success(req.data.message);
                    })
        }catch(error){
            console.log("Error while Changing Status", error.message);
        }
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        if(isEditing) await update();
        setIsEditing(! isEditing);
    }

    const onclick = () => {
        if(onClick === "handleUpdate"){ handleUpdate(); return; }
        else if(onClick === "markDone"){ markDone(); return; }
        else if(onClick === "del"){ del(); return; }
        onClick();
    }


    return (
        <button data-mdb-toggle="tooltip" title={title} className='mybtn' onClick={onclick}>
            {
                isLoading?
                    <BallTriangle
                        height={20} width={20} radius={5} color="black"
                        ariaLabel="ball-triangle-loading" wrapperClass={{}} wrapperStyle="" visible={true}
                    />
                :
                    <FontAwesomeIcon icon={icon} className="fa-lg" style={{"color": `${color}`}}></FontAwesomeIcon>
            }
        </button>
    );
};