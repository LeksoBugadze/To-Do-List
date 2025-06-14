import React,{useState} from 'react'
import EditModal from './EditModal';

function TaskCard({ setDesc, description, userID ,index,setTasks}) {
    const [dropDown,setDropDown]=useState(false);
    const [clicked,setClicked]=useState(false)
    const [editModal,setEditModal]=useState(false);

    function handleClick(){
      if(clicked){
        setClicked(false);
        setDropDown(false);
      }else{
        setClicked(true)
        setDropDown(true);
      }
    }

    async function completeTask(i){
      try{
        const response= await fetch(`https://to-do-list-hbe2.onrender.com/complete/user/${userID}/task/${i}`,{
            method:'PUT',
            headers:{
              'Content-Type':'application/json'
            },body:JSON.stringify({
              description:description
            })
          })
        const data=await response.json();
        setTasks(data.tasks);
        setDropDown(false);
        setClicked(false);
      }catch(error){
        console.log(error);
      }
    }

    async function deleteTask(index){
        const response=await fetch(`https://to-do-list-hbe2.onrender.com/user/${userID}/task/${index}`,{
            method:'DELETE',
        })

        const data=await response.json();
        setDropDown(false);
        setClicked(false);
        setTasks(data.tasks);
    }

    function editBtn(){
      setEditModal(true);
      setDropDown(false);
      setClicked(false);
    }

    return (
      <>
        {editModal&&
          <EditModal setEditModal={setEditModal} setTasks={setTasks} index={index} userID={userID} task={description} />
        }
      <div className='relative w-3xs h-[13rem] border-solid border-1 border-blue-500 z-10 p-4 rounded-xl flex flex-col justify-evenly'>
        {dropDown&&
            <div className="absolute p-2 gap-1 z-50 top-2.5 right-7 bg-white border-solid border-1 border-blue-500 rounded-xl flex flex-col " >
            <button 
               onClick={()=>completeTask(index)} 
              className='active:scale-96 hover:bg-green-500 hover:text-white border-solid border-1 border-green-500 transition-scale duration-150 cursor-pointer rounded-md p-0.5 text-lg text-green-500'
              >
              Complete
            </button>
            <button 
              onClick={()=>editBtn()} 
              className='active:scale-96 hover:bg-yellow-500 hover:text-white border-solid border-1 border-yellow-500 transition-scale duration-150 cursor-pointer rounded-md p-0.5 text-lg text-yellow-500'
              >
              Edit
            </button>
            <button 
              onClick={()=>deleteTask(index)} 
              className='active:scale-96 hover:bg-red-500 hover:text-white border-solid border-1 border-red-500 transition-scale duration-150 cursor-pointer rounded-md p-0.5 text-lg text-red-500'
              >
              Delete
            </button>
          </div>
        }
        <div className='overflow-hidden'>
          <div className="flex justify-end absolute top-3 right-3">
            <button 
              className='active:scale-96 hover:bg-blue-500 hover:text-white border-solid border-1 border-blue-500 transition-scale duration-150 cursor-pointer rounded-xl p-0.5 text-2xl text-blue-500'
              onClick={handleClick}
              >
              &#8942;
            </button>
          </div>
          <h3 className="p-2 text-xl text-center w-full break-words">
            {description}
          </h3>
        </div>
      </div>
      </> 
    );
  }
  export default TaskCard;