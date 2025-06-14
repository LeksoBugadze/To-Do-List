import React,{useState,createContext,useEffect} from "react";
import ErrorMessage from "./ErrorMessage";
import RestorePassword from "./RestorePassword";
export const UserContext=createContext();


function SignIn({logIn,setUser,setUserID,emailSetter}){
    const [email, setEmail] = useState('');
    const [password,setPassword]=useState('');
    const [errorMessage,setErrorMessage]=useState(false);
    const [resotrePasswordError,setResotrePasswordError]=useState(false);
    const [passwordRestored,setPasswordRestored]=useState(false);
    const [resotrePassowrdModal,setRestorePasswordModal]=useState(false);
    const [twoFactor,setTwoFactor]=useState('');
    const [twoFactoPassed,setTwoFactorPassed]=useState('');
    const [loading,setLoading]=useState(false);
    const [code,setCode]=useState('');
    const [verifySwtich,setVerifySwtich]=useState(false);

    const show=<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="svgRepoBgCarrier" strokeWidth="0"></g><g id="svgRepoTracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="svgRepoIconCarrier"><path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>;
    const hide=<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="svgRepoBgCarrier" strokeWidth="0"></g><g id="svgRepoTracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="svgRepoIconCarrier"><path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>;

    const [type,setType]=useState('password');
    const [text,setText]=useState(show);

    const [errorMessageText,setErrorMessageText]=useState('');

    useEffect(()=>{
        if(errorMessage){
            const timeout= setTimeout(() => {
               setErrorMessage(false) 
            }, 2000);
            return ()=>clearTimeout(timeout);
        }
    },[errorMessage])

    useEffect(()=>{
        if(passwordRestored){
            const timeout=setTimeout(()=>{
                setPasswordRestored(false);
        
            },2000)
            return ()=>clearTimeout(timeout);
        }
    })

    function showPasswordFunc(){
       if(type!=='text'){
        setType('text');
        setText(hide);
       } else{
        setType('password');
        setText(show);
       }
    }

    async function handleSubmit (e) {
        e.preventDefault();
        setLoading(true);
        try{
            const response=await fetch(`https://to-do-list-hbe2.onrender.com/login`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },body:JSON.stringify({
                    email:email,
                    password:password,
                })
            })
            const data= await response.json();

            if(!response.ok){
                if(response.status===404){
                    setErrorMessageText('Wrong Password or Email');
                    setErrorMessage(true);
                    setPassword('');
                }else{
                    setPassword('');
                    console.log('something went wrong')
                }
            }else{
                if (data.twoFA) {
                    setTwoFactor(true);
                    setVerifySwtich(true);
                    await sendCode();
                    return;
                }
                setEmail(data.email);
                emailSetter(data.email);
                setUser(data.userName);
                setUserID(data.id);
                logIn(true);
            }
        }catch(error){
            
            console.log(error)

        }finally{
            setPassword('');
            setLoading(false);
        }
      };

    async function handleVerifyButton(e){
        setErrorMessage(false);
        setErrorMessageText('');
        setLoading(true);
        try{
            const response=await fetch('https://to-do-list-hbe2.onrender.com/verify',{
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
                setTwoFactorPassed(true);

                
                const loginResponse = await fetch('https://to-do-list-hbe2.onrender.com/getUserAfterVerification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email }) 
                });

                const userData = await loginResponse.json();

                if (loginResponse.ok) {
                    setEmail(userData.email);
                    emailSetter(userData.email);
                    setUser(userData.userName);
                    setUserID(userData.id);
                    logIn(true);
                } else {
                    setErrorMessageText("Login failed after verification");
                    setErrorMessage(true);
                }
            }else{
                setErrorMessageText('Incorrect verification code');
                setErrorMessage(true);
            }

        }catch(error){
            console.log(error);
        }finally{
            setTwoFactorPassed(false);
            setLoading(false);
        }
    }

    async function sendCode(){
        setErrorMessage(false); 
        setErrorMessageText('');
        setLoading(true);
        try{
            const respone=await fetch('https://to-do-list-hbe2.onrender.com/sendverifyCode',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },body:JSON.stringify({
                    email:email
                })
            })

            const data=await respone.json();
                
            if(!data||data.error){
                setErrorMessageText(`Account registered with that email wasn't found`);
                setErrorMessage(true);
                return;
            }

        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center">
            {errorMessage&& (
                <ErrorMessage message={errorMessageText}/>
            )}
            {passwordRestored&&
                <ErrorMessage message={'Password was successfully changed' } {...(passwordRestored ? { color: 'green', textColor: 'green' } : {})}/>
            }
            {resotrePassowrdModal&&
                <RestorePassword setRestorePasswordModal={setRestorePasswordModal} passwordRestored={passwordRestored} setPasswordRestored={setPasswordRestored} ErrorMessage={ErrorMessage} errorMessage={resotrePasswordError} setErrorMessage={setResotrePasswordError}/>
            }
            {verifySwtich&&
                <div className='z-[9999] top-0 left-0 right-0 bottom-0 fixed bg-black/50 flex items-center justify-center'>
                    <div className='gap-5 flex bg-white p-8 rounded-2xl flex-col'>
                        <h1 className="p-2 text-xl">Verification code was sent to <span className='text-blue-500'>{email}</span></h1>
                        <input 
                            type="text"
                            value={code}
                            onChange={(e)=>setCode(e.target.value)}
                            className='rounded-2xl p-3 text-xs ring-1'
                            required
                        />
                        <button
                            onClick={(e)=>handleVerifyButton(e)} 
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
            <div className="flex flex-col gap-3 shadow-blue ring-1 lg:p-[4rem] p-10 rounded-2xl">
            
                <h1 className="text-center text-[2rem] mb-10">Sign In</h1>
                <input className='rounded-2xl p-3 text-lg ring-1'
                    type="email"
                    placeholder="Email"    
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <div className="relative">
                    <input 
                        className='rounded-2xl p-3 pr-10 text-lg ring-1'
                        type={type}
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}    
                    />
                    <button
                        className="top-2.5 right-2 absolute  cursor-pointer p-1 w-[2rem]"
                        onClick={()=>showPasswordFunc()}
                        >{text}
                    </button>
                </div>

                <button onClick={()=>setRestorePasswordModal(true)} className="ml-2 self-start cursor-pointer underline text-md font-bold text-blue-500 " >Forgot password? </button>

                <button 
                    onClick={(e)=>{handleSubmit(e)}} 
                    disabled={loading}
                    className={
                    `btn ${loading ? 'opacity-50 cursor-not-allowed ring-1 rounded-2xl p-2 text-xl text-blue-500' : 
                    `active:scale-96 hover:bg-blue-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-blue-500`}`}
                    >{loading ? (
                        <div className="flex items-center space-x-2 justify-center items-center">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            </svg>
                            <span>Signing in...</span>
                        </div>
                    ) :'Sign in'}
                </button>
            </div>
        </div>
    )
}

export default SignIn;