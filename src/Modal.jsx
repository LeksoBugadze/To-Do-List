

function Modal({addNewTask,newTaskDescription,modal,setNewTaskDescription,setNewTaskTitle}){
   return( 
    <form className='z-[9999] top-0 left-0 right-0 bottom-0 fixed bg-black/50 flex items-center justify-center'>
        <div className='gap-5 flex bg-white p-8 rounded-2xl flex-col'>
            <h1 className='self-center text-2xl text-blue-500'>Create New Task</h1>
            <textarea  
                className='resize-none w-[300px] h-[150px] rounded-2xl p-3 text-lg ring-1' 
                type='text' 
                placeholder='Enter Task'
                value={newTaskDescription}
                onChange={(e)=>setNewTaskDescription(e.target.value)}
                required
            />
            <button type='submit' onClick={addNewTask} className='active:scale-96 hover:bg-blue-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-blue-500'>Add Task</button>
            <button onClick={()=>modal(false)} className='active:scale-96 hover:bg-red-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-red-500'>Close</button>
        </div>
    </form>
   )

}

export default Modal;