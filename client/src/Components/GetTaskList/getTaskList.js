import { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import Task from '../Task/task.js';

export default function GetAllTaskList({ isUpdated, setIsUpdated, cancelEditing, callFunction, filter }){
    const [list, setList] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const loader = () => {
        return (
            <tr>
                <td></td><td></td><td></td>
                    <td>
                        <ThreeDots 
                            height="40" width="70" radius="7" color="#4fa94d" 
                            ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName=""visible={true}
                        />
                    </td>
                <td></td><td></td>
            </tr>
        );
    }

    async function fetchAllTasks(){
        setIsLoading(true);
        try{
            await axios.get("https://task-management-system-bay.vercel.app/showAllTasks")
                    .then(req => {
                        setList(req.data.allTasks.map((curTask) => (
                            <Task
                                key={curTask._id} curTask={curTask}
                                setIsUpdated={setIsUpdated} cancelEditing={cancelEditing}
                            />
                        )));
                    })
        }catch(error){
            console.log("Error while fetching all tasks", error.message);
        }
        setIsLoading(false);
    }

    async function fetchTasksWithFilter(){
        setIsLoading(true);
        try{
            await axios.post("https://task-management-system-bay.vercel.app/taskListFilter", filter)
            .then(req => {
                setList(req.data.allTasks.map((curTask) => (
                    <Task
                        key={curTask._id} curTask={curTask}
                        setIsUpdated={setIsUpdated} cancelEditing={cancelEditing}
                    />
                )));
            })
        }catch(error){
            console.log("Error while fetching with filter", error.message);
        }
        setIsLoading(false);
    }

    const fetch = () => {
        if(callFunction === "fetchAllTasks"){ fetchAllTasks(); return; }
        else if(callFunction === "fetchTasksWithFilter"){ fetchTasksWithFilter(); return; }
    }

    useEffect(() => {
        if(isUpdated){
            fetch();
            setIsUpdated(false);
        }
    }, [isUpdated]);

    useEffect(() => {
        fetch();
    }, [cancelEditing]);

    useEffect(() => {
        if(isLoading){
            setList(loader);
        }
    }, [isLoading]);

    return list;
}