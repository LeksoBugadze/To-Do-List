import { link } from "./App";

function CompletedTasksCard({date,month,day,description,index,setCompletedTasks,userID}){

    async function handleClick(){
        try{
            const response=await fetch(`${link}/delete/completedTasks/user/${userID}/index/${index}`,{
                method:'DELETE'
            })
            const data=await response.json();
            
            setCompletedTasks(data.completedTasks);

        }catch(error){
            console.log(error);
        }

    }

    return(
        <div 
            className='relative w-3xs h-[13rem] border-solid border-1 border-blue-500 z-10 p-4 rounded-xl flex flex-col justify-evenly'>
            <div 
                className='h-full flex flex-col justify-evenly overflow-hidden'>
                
                <h2 className="text-green-600 font-bold p-2 text-md text-center w-full break-words" >
                    Completed on {day}, {month} {date}
                </h2>
                <h3 className="p-2 text-xl text-center w-full break-words">
                    {description}
                </h3> 
                <button 
                    className='active:scale-96 hover:bg-red-500 hover:text-white border-solid border-1 border-red-500 transition-scale duration-150 cursor-pointer rounded-md p-0.5 text-lg text-red-500'
                    onClick={()=>handleClick()}
                    >
                    Delete
                </button>
            </div>
      </div>
    )
}

export default CompletedTasksCard;