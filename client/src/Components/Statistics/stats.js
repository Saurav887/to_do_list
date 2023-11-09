import { useEffect, useState } from 'react';
import axios from 'axios';
import CompletionRate from '../Graphs/completionRate.js';
import Successful from '../Graphs/successful.js';
import TaskCount from '../Graphs/taskCount.js';

export default function Stats(){
    const [rate, setRate] = useState(0);
    const [successful, setSuccessful] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);

    const fetchStats = async () => {
        try{
            await axios.get("https://task-management-system-bay.vercel.app/getStats")
                .then( res => {
                        const {totalTasksCount, successfulCount} = res.data;
                        setSuccessful(successfulCount);
                        setTotalTasks(totalTasksCount);
                        let value = successfulCount * 100 / totalTasksCount;
                        setRate(value.toFixed(2));
                    });
        }catch(error){
            console.log("Error while Fetching Stats", error.message);
        }
    }

    useEffect(()=>{
        fetchStats();
    }, [])

    return (
        <section className='vh-30'>
                <div className='container py-4 h-100'>
                    <div className='row d-flex justify-content-center h-100 mybox flex-wrap'>

                        <div className='col-md-5 h-80 m-2'  style={{ minWidth: '350px'}}>
                            <div className='card mask-custom h-80' id='taskCount'>
                                <div className='card-body p-5 text-center d-flex flex-xl-row flex-column align-items-center justify-content-center'>
                                    <h2 style={{"color": "steelblue"}}>
                                        Total Tasks: {totalTasks}
                                    </h2>
                                    <TaskCount totalTasks={totalTasks}/>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-5 m-2'>
                            <div className='card mask-custom' id='arc' style={{ minWidth: '350px'}}>
                                <div className='card-body p-4 text-center'>
                                    <CompletionRate rate={rate}/>
                                </div>
                                <div className='col-md-6 h-100 w-100 d-flex justify-content-center align-items-center' style={{"zIndex": "1", "position": "absolute"}}>
                                    <div className='text-center' style={{"color": "blue"}}>
                                        <h4> Completion Rate</h4>
                                        <h5>{rate}%</h5>
                                    </div>
                                </div>
                            </div>

                            <div className='card mask-custom mybox' id='arc' style={{ minWidth: '350px'}}>    
                                <div className='card-body p-4 text-center align-items-center justify-content-center row w-100'>
                                    <h2 style={{"color": "steelblue"}}>
                                        Successful Tasks:
                                    </h2>
                                    <div style={{ width: '300px', marginTop: '-30px'}}>
                                        <h3 className='position-absolute' style={{"color": "steelblue", marginTop: '100px', marginLeft: '120px'}}>
                                            {successful}
                                        </h3>
                                        <Successful successful={successful} rate={rate}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}