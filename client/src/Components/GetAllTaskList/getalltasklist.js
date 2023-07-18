import { useState, useEffect } from 'react';
import axios from 'axios';
import Task from '../Task/task.js';

import 'mdb-ui-kit/css/mdb.min.css';

export default function GetAllTaskList({ isUpdated, setIsUpdated, cancelEditing, setCancelEditing }){
    const [allTasks, setAllTasks] = useState([]);
    const [list, setList] = useState();

    async function fetchAllTasks(){
        try{
            await axios.get("http://localhost:8000/showAllTasks")
                    .then(req => {
                        setAllTasks(req.data.allTasks);
                        setList(req.data.allTasks.map((curTask) => (
                            <Task key={curTask._id} curTask={curTask} setIsUpdated={setIsUpdated} />
                        )));
                    })
        }catch(error){
            console.log("Error while fetching all tasks", error.message);
        }
    }

    useEffect(() => {
        fetchAllTasks();
    }, []);

    useEffect(() => {
        if(isUpdated){
            fetchAllTasks();
            setIsUpdated(false);
        }
    }, [isUpdated]);

    useEffect(() => {
        if(cancelEditing){
            setIsUpdated(true);
            setCancelEditing(false);
        }
    }, [cancelEditing])

    return list;
}