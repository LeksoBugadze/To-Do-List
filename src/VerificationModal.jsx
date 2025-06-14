function VerifModal({email,inputCode,setInputCode,func,setVerfModal}){

    return(
        <form 
            onSubmit={(e) => {
                e.preventDefault();
                func(e);
            }} 
            className="z-[9999] top-0 left-0 right-0 bottom-0 fixed bg-black/50 flex items-center justify-center">
            <div className='gap-5 flex bg-white p-8 rounded-2xl flex-col'>
                <h3 
                    className="p-2 text-xl"
                    >Verification code was sent to <span className='text-blue-500'>{email}</span>
                </h3>
                <input 
                    className='rounded-2xl p-3 text-lg ring-1'
                    type="text" 
                    value={inputCode}
                    onChange={(e)=>setInputCode(e.target.value)}
                    required/>
                <button 
                    type="submit" 
                    className='active:scale-96 hover:bg-green-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-green-500'
                    >Verify
                </button>
                <button
                    onClick={()=>setVerfModal(false)}
                    className='active:scale-96 hover:bg-red-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-red-500'
                    >Close
                </button>
            </div>
        </form>
    )
}

export default VerifModal;