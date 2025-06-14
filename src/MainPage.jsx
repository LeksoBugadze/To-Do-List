import TaskCard from "./Tasks";
import Modal from "./Modal";
import React,{useState,useEffect} from 'react'

function MainPage({userID}) {

    

    const [tasks,setTasks]=useState([]);
    const [newTaskDescription,setNewTaskDescription]=useState('');
    const [showModal,setShowModal]=useState(false);

    async function getUserTasks(){
        try{
            const response=await fetch('https://to-do-list-hbe2.onrender.com/getTasks',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },body:JSON.stringify({
                    id:userID,
                })        
            })
            
            const data=await response.json();
            setTasks(data);
        
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getUserTasks();
    },[])

    async function addNewTask(){
        if(newTaskDescription.trim()){  
            setTasks([...tasks,{description:newTaskDescription}]);
            
            setNewTaskDescription('');
            setShowModal(false);
            const response=await fetch(`https://to-do-list-hbe2.onrender.com/addTask`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },body:JSON.stringify({
                    id:userID,
                    taskDescription:newTaskDescription,
                })
            })
        }
    }



  return (
    <main className="absolute top-[10%]">
        {showModal&&<Modal 
            addNewTask={()=>addNewTask()}
            modal={setShowModal}
            newTaskDescription={newTaskDescription} 
            setNewTaskDescription={(e)=>setNewTaskDescription(e)} 
        />}

        
        <div className='flex m-5 gap-5 mt-10 justify-center sm:justify-start flex-wrap relative z-10'>
            <button 
                onClick={()=>setShowModal(true)} 
                className='active:mt-0.5 w-3xs h-[13rem] shadow-lg  shadow-blue-300 cursor-pointer rounded-lg p-3 text-lg text-blue-500'>
                + Add task
            </button>
            {tasks.map((e,i)=><TaskCard key={i} setTasks={setTasks} userID={userID} index={i} description={e.description}></TaskCard>)}
        </div>
    </main>
  )
}

export default MainPage;
