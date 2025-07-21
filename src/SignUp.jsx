import React,{useState,useEffect} from "react";
import VerifModal from "./VerificationModal";
import ErrorMessage from "./ErrorMessage";
import { link } from "./App";

function SignUp({logged,signed,setUser,setUserID,emailSetter}){

    const [userName,setUserName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [repeatPassword,setRepeatPassword]=useState('');

    const [verifyCode,setVerifyCode]=useState('');
    const [verifyModal,setVerifyModal]=useState('');

    const [errorMessage,setErrorMessage]=useState(false);
    const [errorMessageText,setErrorMessageText]=useState('');

    const [passwordStrengthModal,setPasswordStrengthModal]=useState(false);

    const [strengthBarWidth,setStrengthBarWidth]=useState({});
    const [passwordStrengthText,setPasswordStrengthText]=useState('');
    const [passwordStrengthTextStyle,setPasswordStrengthTextStyle]=useState({});
    
    const [loading,setLoading]=useState(false);

    const show=<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="svgRepoBgCarrier" strokeWidth="0"></g><g id="svgRepoTracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="svgRepoIconCarrier"><path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>;
    const hide=<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="svgRepoBgCarrier" strokeWidth="0"></g><g id="svgRepoTracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="svgRepoIconCarrier"><path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>;

    const [type,setType]=useState('password');
    const [text,setText]=useState(show);
    
    const isMatch=password===repeatPassword;
    let currentStrength=0;
    
    useEffect(()=>{
        const tiemoutID=setTimeout(() => {
            setErrorMessage(false);
        }, 2000);
        
        return ()=>clearTimeout(tiemoutID);
    },[errorMessage])
    
    useEffect(()=>{
        if(!password)setPasswordStrengthText('');
        if (password.length >= 12) currentStrength++;
        if (/[a-z]/.test(password)) currentStrength++;
        if (/[A-Z]/.test(password)) currentStrength++;
        if (/\d/.test(password)) currentStrength++;
        if (/[\W_]/.test(password)) currentStrength++;

        setStrengthBarWidth({
            width: `${(currentStrength / 5) * 100}%`,
            height: '4px',
            borderRadius: '9999px',
            backgroundColor:
            currentStrength <= 2 ? 'red' : currentStrength < 5 ? 'orange' : 'green',
            transition: 'width 0.3s ease',
        });

        setPasswordStrengthTextStyle({
            fontSize: '1rem',
            color:
            currentStrength <=2 ? 'red' : currentStrength <5 ? 'orange' :'green',
            transition: 'color 0.3s ease',
        })

        if(currentStrength<=2&&currentStrength>=1){
            setPasswordStrengthText('Weak');
        } 
        if(currentStrength <5&&currentStrength>2){
            setPasswordStrengthText('Moderate');
        }
        if(currentStrength===5){
            setPasswordStrengthText('Strong');
        }
        
        setErrorMessageText('');
        
        

    },[password])

    function showPasswordFunc(){
       if(type!=='text'){
        setType('text');
        setText(hide);
       } else{
        setType('password');
        setText(show);
       }
    }

    async function signUpBtn(){
        setLoading(true);
        if(!email||!password||!userName){
            setErrorMessageText('Please fill out all required fields')
            setErrorMessage(true);
            setLoading(false);
            return;
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorMessageText('Invalid email format');
            setErrorMessage(true);
            setLoading(false);
            return; 
        }

        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/.test(password)){
            setErrorMessageText('Password is too weak');
            setErrorMessage(true);
            setLoading(false);
            return;
        }
        try{
            const response = await fetch(`${link}/sendCode`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },body:JSON.stringify({
                    email:email
                })
            })
            
            const data=await response.json();

            if(data.error){
                setErrorMessageText(data.error);
                setErrorMessage(true);
            }else{
                setVerifyModal(true)
            }
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }

    }

    async function handleVerifySubmit(){
        setLoading(true);
        try{
            console.log(verifyCode)

            const response= await fetch(`${link}/verify`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },body:JSON.stringify({
                    email:email,
                    code:verifyCode,
                    
                })
            })

            const data = await response.json();
            if(data.success){
                handleSubmit()
                setVerifyModal(false);
                setVerifyCode('');
            }else{
                setVerifyCode('');
                setErrorMessageText('Incorrect verification code');
                setErrorMessage(true);
            }

        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    async function handleSubmit() {
        try {
            const response = await fetch(`${link}/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    userName: userName
                })
            });

            const data=await response.json();
            if(data.error){
                setErrorMessageText('User with that email already exists');
                setErrorMessage(true);
            }else{
                signed(false);
                logged(true);
                setUser(userName);
                setUserID(data.id);
                emailSetter(email);
            }
            
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="flex h-screen items-center justify-center">
            {verifyModal&&(
                <VerifModal 
                    email={email} 
                    inputCode={verifyCode} 
                    setInputCode={setVerifyCode}
                    setVerfModal={setVerifyModal} 
                    func={handleVerifySubmit}
                />
             )
            }
            
            {errorMessage&& (
                <ErrorMessage message={errorMessageText} />
            )}
            <div className="flex flex-col gap-5 shadow-blue ring-1 p-13 lg:p-[4rem] rounded-2xl">
                <h1 className="text-center text-2xl lg:text-[2rem] lg:mb-10">Sign Up</h1>
                <input
                    className='rounded-2xl p-3 text-md lg:text-lg ring-1' 
                    type="email" 
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                    className='rounded-2xl p-3 text-md lg:text-lg ring-1'
                    type="text"
                    placeholder="Username"                       
                    value={userName}
                    onChange={(e)=>setUserName(e.target.value)}
                    required
                />
                <div className="flex flex-col lg:gap-5 lg:flex-row" >
                    <div className="relative flex flex-col items-center ">
                        <input 
                            className='rounded-2xl p-3 pr-18 text-md lg:text-lg ring-1'
                            type={type}
                            placeholder="Password"    
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />
                        <button
                            className="top-1.5 lg:top-2.5 right-10 absolute  cursor-pointer p-1 w-[2rem]"
                            onClick={()=>showPasswordFunc()}
                            >{text}
                        </button>
                        <div
                            onMouseEnter={()=>setPasswordStrengthModal(true)}
                            onMouseOut={()=>setPasswordStrengthModal(false)}
                            className="top-3 right-3 lg:top-4 lg:right-3 absolute cursor-pointer w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold"
                            >!
                        </div>
                        {passwordStrengthModal&&
                            <div className="rounded-lg ring-1 absolute top-[-13rem] p-2 bg-white z-[9999px]">
                                <h1 className="text-lg text-blue-500">Your password has to:</h1>
                                <ul className="font-bold list-disc list-inside pl-2">
                                    <li>Contain at least 12 characters</li>
                                    <li>Contain at least one lowercase letter</li>
                                    <li>Contain at least one uppercase letter</li>
                                    <li>Contain at least one digit</li>
                                    <li>Contain at least one special character (like !, @, #, _, etc.)</li>
                                </ul>
                            </div>
                        }
                        <div className="w-[90%] rounded-2xl overflow-hidden mt-2">
                            <div style={strengthBarWidth}></div>
                        </div>
                        <p style={passwordStrengthTextStyle}>{passwordStrengthText}</p>
                    </div>
                    <div className="flex flex-col items-start">
                        <input 
                        className='rounded-2xl p-3 pr-18  text-md lg:text-lg ring-1'
                        type="Password"
                        placeholder="Repeat password"    
                        onChange={(e)=>{setRepeatPassword(e.target.value)}}
                        value={repeatPassword}
                        required
                        />
                        {!isMatch&&repeatPassword&&
                            (
                                <p className="text-[1rem] mt-1 self-center text-red-500">Passwords dont match</p>
                            )
                        }
                    </div>
                
                </div>
                <button 
                onClick={()=>signUpBtn()} 
                type="button" 
                disabled={loading}
                className={
                `btn ${loading ? 'opacity-50 cursor-not-allowed ring-1 rounded-2xl p-2 text-xl text-blue-500' : 
                `active:scale-96 hover:bg-blue-500 hover:text-white ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-xl text-blue-500`}`}
                    >{loading ? (
                        <div className="flex items-center space-x-2 justify-center items-center">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            </svg>
                            <span>Signing up...</span>
                        </div>
                    ) :'Sign up'}
                </button>
            </div>
        </div>
    )
}

export default SignUp;