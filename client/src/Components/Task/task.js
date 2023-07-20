import { useEffect, useState } from 'react';
import { faTrashAlt, faCheck, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/button.js';

import './task.css';

export default function Task({ curTask, setIsUpdated, cancelEditing }){  
    const [task, setTask] = useState(curTask);
    const [statusClass, setStatusClass] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if(task.status === "Successful") setStatusClass("badge bg-success");
        else if(task.status === "Failed") setStatusClass("badge bg-danger");
        else setStatusClass("badge bg-warning");
    }, []);

    useEffect(() => {
        if(isEditing) setIsEditing(false);
    }, [cancelEditing. isEditing])

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
                    isEditing ? 
                        <select name="status" value={task.status} onChange={handleChange}>
                            <option value="">Choose:</option>
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
                <Button
                    task={task} setTask={setTask} setStatusClass={setStatusClass} setIsUpdated={setIsUpdated} isEditing={isEditing} setIsEditing={setIsEditing}
                    title={isEditing? "Save": "Edit"} icon={isEditing? faSave: faEdit} color={isEditing? "black": "blue"} onClick={"handleUpdate"}
                />
                <Button 
                    task={task} setTask={setTask} setStatusClass={setStatusClass} setIsUpdated={setIsUpdated} isEditing={isEditing} setIsEditing={setIsEditing}
                    title={"Done"} icon={faCheck} color={"green"} onClick={"markDone"}
                />
                <Button task={task} setTask={setTask} setStatusClass={setStatusClass} setIsUpdated={setIsUpdated} isEditing={isEditing} setIsEditing={setIsEditing}
                    title={"Remove"} icon={faTrashAlt} color={"gray"} onClick={"del"} 
                />
            </td>
        </tr>
    );
};