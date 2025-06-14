import CompletedTasksCard from "./CompletedTasksCard";
import React,{useState,useEffect} from "react"

function CompleteTaskPage({userID}){
    const [completedTasks,setCompletedTasks]=useState([]);

    useEffect(()=>{
        async function fetchCompletedTasks(){
            try{
                const response=await fetch(`http://localhost:8000/completedTasks/user/${userID}`);
        
                const data= await response.json();
        
                setCompletedTasks(data.completedTasks);
            }catch(error){
                console.log(error)
            }
        }

        fetchCompletedTasks();
    },[userID])
    

     return (
        <>
        {completedTasks.length > 0 ? (
            <div className="absolute top-[10%] max-sm:h-screen max-sm:w-full">
                <div className="flex m-5 gap-5 mt-10 justify-center sm:justify-start flex-wrap">
                    {completedTasks.map((e, i) => (
                    <CompletedTasksCard
                        key={i}
                        userID={userID}
                        index={i}
                        description={e.description}
                        date={e.completionDate}
                        month={e.completionMonth}
                        day={e.completionDay}
                        setCompletedTasks={setCompletedTasks}
                    />
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-[3rem] text-gray-500 mt-10 text-center">No completed tasks</h1>
            </div>
        )}

        </>
    );
}

export default CompleteTaskPage;