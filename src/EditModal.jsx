import { useState } from "react";

function EditModal({setEditModal,task,setTasks,userID,index}){
    const [newTask,setNewTask]=useState(task);

    async function handleEdit(){
       
        try{
            const response=await fetch(`https://to-do-list-hbe2.onrender.com/edit/user/${userID}/task/${index}`,{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },body: JSON.stringify({
                    description:newTask,
                })
            })

            const data= await response.json();
            setTasks(data.tasks);
            setEditModal(false);
        }catch(error){
            console.log(error);
        }
    }

    return(
        <div className="z-[9999] top-0 left-0 right-0 bottom-0 fixed bg-black/50 flex items-center justify-center">
            <div className='gap-5 flex bg-white p-8 rounded-2xl flex-col'>
                <textarea  
                    className='resize-none w-[300px] h-[150px] rounded-2xl p-3 text-lg ring-1' 
                    value={newTask}
                    onChange={(e)=>setNewTask(e.target.value)} 
                    placeholder='Enter Task'
                    required
                />
                <button  onClick={()=>handleEdit()} className='active:scale-96 hover:bg-blue-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-blue-500'>Save</button>
                <button  onClick={()=>setEditModal(false)} className='active:scale-96 hover:bg-red-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-red-500'>Close</button>
            </div>
        </div>
    )
}

export default EditModal;