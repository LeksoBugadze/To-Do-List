import React,{useState,useEffect} from "react";
import ErrorMessage from "./ErrorMessage";
import { use } from "react";


function Settings({userID,setUser,userEmail}){
    const [twoFaActive,setTwoFaActive]=useState('');   
    const [email,setEmail]=useState('');
    const [userName,setUserName]=useState('');

    const [changeUserName,setChangeUserName]=useState(false);
    const [changeEmail,setChangeEmail]=useState(false);
    
    const [enableEditingEmail,setEnableEditingEmail]=useState(false);
    const [enableEditingUserName,setEnableEditingUserName]=useState(false);

    const [errorMessage,setErrorMessage]=useState(false);
    const [errorMessageText,setErrorMessageText]=useState(false);

    const [passwordField1,setPasswordField1]=useState('');
    const [passwordField2,setPasswordField2]=useState('');

    const [verifySwtich,setVerifySwtich]=useState(false);

    const [checkAndVerifyLoading,setCheckAndVerifyLoading]=useState(false);
    const [checkUserPasswordLoading,setCheckUserPasswordLoading]=useState(false);
    const [twoFaLoading,setTwoFaLoading]=useState(false);

    const [disable2FAModal,setDisable2FAModal]=useState(false);

    const [loading,setLoading]=useState(false);

    const [code,setCode]=useState('');
    
    
    useEffect(()=>{
        async function getData() {
            try{
                const response=await fetch(`http://localhost:8000/getUserData/id/${userID}`,{
                    method:'GET'
                });
                const data=await response.json();

                if(!data||data.error){
                    return console.log('User was not found');
                }else{
                    setEmail(data.email);
                    setUserName(data.userName);
                    setTwoFaActive(data.twoFA);
                }
            }catch(error){
                console.log(error);
            }
        }
        getData();
    },[userID])

    useEffect(()=>{
        if(errorMessage){
            const timeout=setTimeout(()=>{
                setErrorMessage(false);
            },2000)

            return ()=>clearTimeout(timeout);
        }
    },[errorMessage])

    useEffect(()=>{
        setUser(userName);
    },[userName])


    async function checkUserPassword(changedAtribute,value){
        setCheckUserPasswordLoading(true);
        try{
            const response=await fetch('http://localhost:8000/checkPassword',{
                method:'POST',
                headers:{
                    "Content-Type":'application/json'
                },body:JSON.stringify({
                    password:value,
                    userID:userID
                })
            })
            const data=await response.json();

            if(!data||data.error){
                setErrorMessageText('Wrong password');
                setErrorMessage(true);
                setCheckUserPasswordLoading(false);
                return;
            }else{
                console.log('success');
                if(changedAtribute==='email'){
                    setChangeEmail(false);
                    setEnableEditingEmail(true);
                }else{
                    setChangeUserName(false);
                    setEnableEditingUserName(true);
                }
            }

            setPasswordField1('');
            setPasswordField2('');

        }catch(error){

            console.log(error);

        }finally{
            setCheckUserPasswordLoading(false);
        }
    }

    async function handleVerifyButton(){
        setErrorMessage(false);
        setErrorMessageText('');
        setLoading(true);
        try{
            const response=await fetch('http://localhost:8000/verify',{
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },body:JSON.stringify({
                    email:email,
                    code:code
                })
            })

            const data= await response.json();

            if(data.success){
                setVerifySwtich(false);
                saveEmail();
            }else{
                setErrorMessageText('Incorrect verification code');
                setErrorMessage(true);
            }

        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    async function checkAndVerify(){
        setCheckAndVerifyLoading(true);
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorMessageText('Invalid email format');
            setErrorMessage(true);
            setCheckAndVerifyLoading(false);
            setEmail(userEmail);
            setEnableEditingEmail(false);
            return; 
        }

        try{
            const response =await fetch('http://localhost:8000/changeEmailCode',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },body:JSON.stringify({
                    email:email
                })
            })

            const data=await response.json();
            console.log(data);

            if(!data||data.error){
                setErrorMessageText(data.error);
                setErrorMessage(true);
                return;
            }

            setVerifySwtich(true);

        }catch(error){
            console.log(error)
        }finally{
            setCheckAndVerifyLoading(false);       
        }
        
    }

    async function saveEmail(){
        setLoading(true);
        try{
            const respone=await fetch(`http://localhost:8000/changeEmail/id/${userID}/${email}`);

            const data=await respone.json();

            if(!data||data.error){
                setErrorMessageText('Something went wrong');
                setErrorMessage(true);
                setEmail(userEmail);
                setEnableEditingEmail(false);
            }else{
                setEnableEditingEmail(false);
            }

        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    async function saveUserName(){
        setLoading(true);
        try{
            const respone=await fetch(`http://localhost:8000/changeUserName/id/${userID}/${userName}`);

            const data=await respone.json();

            if(!data||data.error){
                setErrorMessageText('Something went wrong');
                setErrorMessage(true);
                setUserName(data.userName);
                setChangeUserName(false);
            }else{
                setEnableEditingUserName(false);
            }

        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    async function twoFaActivation(arg){
        setTwoFaLoading(true);

        try{
            const response=await fetch(`http://localhost:8000/activete2FA/id/${userID}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },body:JSON.stringify({
                    twoFAarg:arg,
                    id:userID,
                })
            });

            const data=await response.json();
            console.log(data);
            if(!data||data.error){
                setErrorMessageText(data.error);
                setErrorMessage(true);
                return;
            }

            setTwoFaActive(data.res);
            console.log(twoFaActive);

        }catch(error){

            console.log(error)

        }finally{
            setTwoFaLoading(false);
        }
    }


    return(
        <div className="h-screen flex items-center justify-center z-[9999px] relative">
            {errorMessage&& <ErrorMessage message={errorMessageText} />}
            {verifySwtich&&
                <div className='z-[9999] top-0 left-0 right-0 bottom-0 fixed bg-black/50 flex items-center justify-center'>
                    <div className='gap-5 flex bg-white p-8 rounded-2xl flex-col'>
                        <h1 className="p-2 text-xl">Verification code was sent to <span className='text-blue-500'>{email}</span></h1>
                        <input 
                            type="text"
                            value={code}
                            onChange={(e)=>setCode(e.target.value)}
                            className='rounded-2xl p-3 text-lg ring-1'
                            required
                        />
                        <button
                            onClick={()=>handleVerifyButton()} 
                            disabled={loading}
                            className={
                            `btn ${loading ? 'opacity-50 cursor-not-allowed ring-1 rounded-2xl p-2 text-xl text-green-500' : 
                            'active:scale-96 hover:bg-green-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-green-500'}`
                            }>{loading ? (
                                <div className="flex items-center space-x-2 justify-center items-center">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    </svg>
                                    <span>Checking verification code...</span>
                                </div>
                            ) :'Verify'}
                        </button>
                        <button
                            onClick={()=>setVerifySwtich(false)}
                            className="active:scale-96 hover:bg-red-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-red-500"
                            >
                            Close
                        </button>
                    </div>
                </div>
            }
            {disable2FAModal&&
                <div className='z-[9999] top-0 left-0 right-0 bottom-0 fixed bg-black/50 flex items-center justify-center'>
                    <div className='gap-5 flex bg-white p-8 rounded-2xl flex-col'>
                            <h1 className="text-lg" >Are you sure you want to <span className="font-bold text-red-500" >disable</span> 2FA ?</h1>
                            <div className="flex w-full gap-3 justify-evenly">
                                <button
                                    onClick={()=>{
                                        setDisable2FAModal(false);
                                        twoFaActivation(false)
                                    }}
                                    className='flex-1 active:scale-96 hover:bg-green-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-green-500'
                                    >
                                    Yes
                                </button>
                                <button
                                    className="flex-1 active:scale-96 hover:bg-red-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-red-500"
                                    >
                                    Close
                                </button>
                            </div>    
                    </div>
                </div>
            }
            <div className="flex justify-center gap-5 w-1xs flex-col">
                <div className="relative flex flex-col gap-2">
                    <h1 className="p-2 text-xl text-blue-500 font-bold">Email</h1>
                    <input
                        value={email}
                        readOnly={!enableEditingEmail}
                        onChange={(e)=>setEmail(e.target.value)}
                        className='rounded-lg p-3 max-md:pr-15 text-lg ring-1'
                    />
                    {enableEditingEmail&&   
                        <button
                            onClick={() => checkAndVerify()}
                            disabled={checkAndVerifyLoading}
                            className={`absolute top-14.5 right-2 lg:top-13.5 lg:right-[-5rem] ${checkAndVerifyLoading ? 'opacity-50 cursor-not-allowed ring-1 rounded-md p-2.5 text-xl text-green-500' : 'active:scale-96 hover:bg-green-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-md p-2.5 text-md lg:text-xl text-green-500'}`}
                            >
                            {checkAndVerifyLoading ? (
                                <div className="flex items-center space-x-2 justify-center items-center">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    </svg>
                                    <span>Saving...</span>
                                </div>
                            ) : 'Save'}
                        </button>                
                    }
                    {changeEmail&&
                        <div className="flex gap-1">
                            <input
                                value={passwordField1}
                                placeholder="Input you password"
                                className='rounded-md p-1 w-[14rem] text-lg ring-1'
                                onChange={(e)=>setPasswordField1(e.target.value)}
                                type="password"
                            />
                            <button
                                onClick={() => checkUserPassword('email', passwordField1)}
                                disabled={checkUserPasswordLoading}
                                className={`${checkUserPasswordLoading ? 'opacity-50 cursor-not-allowed ring-1 rounded-md p-1 text-lg text-green-500' : 'active:scale-96 hover:bg-green-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-md p-1 text-lg text-green-500'}`}
                            >
                                {checkUserPasswordLoading ? (
                                    <div className="flex items-center space-x-2 justify-center items-center">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        </svg>
                                        <span>Confirming...</span>
                                    </div>
                                ) : 'Confirm'}
                            </button>
                        </div>
                    }
                    <button 
                        className="ml-2 self-start cursor-pointer underline text-md font-bold text-blue-500"
                        onClick={()=>setChangeEmail(!changeEmail)}
                        >
                        Change email
                    </button>
                </div>
                <div className="relative flex flex-col gap-2">
                    <h1 className="p-2 text-xl text-blue-500 font-bold">Username</h1>
                    <input
                        value={userName}
                        readOnly={!enableEditingUserName}
                        onChange={(e)=>setUserName(e.target.value)}
                        className='rounded-lg p-3 text-lg ring-1 max-md:pr-15'
                    />
                    {enableEditingUserName&&
                        <button
                            onClick={()=>saveUserName()}
                            className={`absolute top-14.5 right-2 lg:top-13.5 lg:right-[-5rem] 'active:scale-96 hover:bg-green-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-md p-2.5 text-md lg:text-xl text-green-500`}
                            >
                            Save
                        </button>
                    }
                    {changeUserName&&
                        <div className="flex gap-1">
                            <input
                                value={passwordField2}
                                placeholder="Input you password"
                                className='rounded-md p-1 w-[14rem] text-lg ring-1'
                                onChange={(e)=>setPasswordField2(e.target.value)}
                                type="password"
                            />
                            <button
                                onClick={() => checkUserPassword('userName', passwordField2)}
                                disabled={checkUserPasswordLoading}
                                className={`${checkUserPasswordLoading ? 'opacity-50 cursor-not-allowed ring-1 rounded-md p-1 text-lg text-green-500' : 'active:scale-96 hover:bg-green-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-md p-1 text-lg text-green-500'}`}
                            >
                                {checkUserPasswordLoading ? (
                                    <div className="flex items-center space-x-2 justify-center items-center">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        </svg>
                                        <span>Confirming...</span>
                                    </div>
                                ) : 'Confirm'}
                            </button>
                        </div>
                    }
                    <button
                        className="ml-2 self-start cursor-pointer underline text-md font-bold text-blue-500"
                        onClick={()=>setChangeUserName(!changeUserName)}
                        >
                        Change username
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="p-2 text-xl text-blue-500 font-bold text-center">2FA via Email</h1>
                    {twoFaActive?
                        <>  
                            <h1 className="text-lg text-center">Status: <span className="font-bold text-green-500">Active</span></h1>
                            <button
                                onClick={()=>setDisable2FAModal(true)}
                                className="active:scale-96 hover:bg-red-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-red-500"
                                >
                                Disable
                            </button>
                        </>
                        :
                        <>
                            <h1 className="text-lg text-center">Status: <span className="font-bold text-red-500">Disabled</span></h1>
                            <button
                                onClick={()=>twoFaActivation(true)}
                                className='active:scale-96 hover:bg-green-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-green-500'
                                >
                                Activate
                            </button>
                        </>
                    }
                </div>

            </div> 

        </div>
    )
}

export default Settings;