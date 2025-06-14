import React,{useState,useEffect} from 'react'
import Settings from './settingsPage';


function Header({setSettings,logged,userName,setSigned,setLogged,setCompletedTasksClicked,settings}){
    
    const [showDropdown,setShowDropDown]=useState(false);
    const [styleHome,setStyleHome]=useState('active:mt-2 bg-blue-200 hover:scale-105 transition-scale duration-150 cursor-pointer p-1 w-[2.5rem] lg:w-[3rem] shadow-md shadow-blue-200 rounded-xl');
    const [styleComplete,setStyleComplete]=useState("active:mt-2 bg-white hover:scale-105 transition-scale duration-150 cursor-pointer p-1 w-[2.5rem] lg:w-[3rem] shadow-md shadow-blue-200 rounded-xl");
    
    
    const [clickedHome,setClickedHome]=useState(true);
    const arrowDownSVG = <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"></path></g></svg>;
    const arrowUpSVG = <svg fill="#000000"  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier" transform="rotate(180 165 165)"><path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"></path></g></svg>;

    
    function handleNavClick(tab) {
        const baseStyle = 'active:mt-2 hover:scale-105 transition-scale duration-150 cursor-pointer p-1  w-[2.5rem] lg:w-[3rem] shadow-md shadow-blue-200 rounded-xl';
        const selectedStyle = `bg-blue-200 ${baseStyle}`;
        const unselectedStyle = `bg-white ${baseStyle}`;

        setClickedHome(tab === 'home');
        setSettings(tab === 'settings');
        setCompletedTasksClicked(tab === 'complete');

        setStyleHome(tab === 'home' ? selectedStyle : unselectedStyle);
        setStyleComplete(tab === 'complete' ? selectedStyle : unselectedStyle);
    }

    return (
        <header  
            className="flex bg-white items-center justify-between p-2 shadow shadow-blue-200 rounded-lg z-[9999] fixed top-0 left-0 right-0 ">
            <h1 
                className="text-xl lg:text-2xl">
                To-<b className="text-blue-500">Do</b> List
            </h1>
            {logged ? 
                (   <>
                        <div className="flex gap-2">
                            <button 
                                onClick={()=>handleNavClick('home')}
                                className={styleHome} >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z" fill="#080341" /></g></svg>
                            </button>

                            <button
                                onClick={()=>handleNavClick('complete')} 
                                className={styleComplete}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" /></g></svg>
                            </button>
                        </div>

                        <div className="flex gap-2 items-center relative">
                            <h2 
                                onClick={()=>setShowDropDown(!showDropdown)} 
                                className="flex gap-2  tems-center cursor-pointer text-md lg:text-lg" 
                                >
                                <span className='w-3 self-center' >{showDropdown? arrowUpSVG:arrowDownSVG}</span> {userName}
                            </h2>
                               {showDropdown&&
                                    <div className='ring-1 p-3 bg-white rounded-xl gap-2 absolute right-5 top-13 flex flex-col'>
                                        <button
                                            onClick={()=>{handleNavClick('settings');setShowDropDown(false)}}
                                            className='hover:bg-slate-500 hover:text-white active:scale-95 ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-3 text-lg text-slate-500'
                                            >
                                            Settings
                                        </button>
                                        <button 
                                            onClick={()=>{setLogged(false);setShowDropDown(false)}} 
                                            className='hover:bg-red-500 hover:text-white active:scale-95 ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-3 text-lg text-red-500'
                                            >Log out
                                        </button>
                                    </div>
                               } 
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <button onClick={()=>setSigned(false)} className='hover:scale-103 active:scale-95 ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-lg text-blue-500'>Sign In</button>
                        <h1 className="text-xl font-bold text-blue-800"> OR </h1>
                        <button onClick={()=>setSigned(true)} className='hover:scale-103 active:scale-95 ring-1 transition-scale duration-150 cursor-pointer rounded-2xl p-2 text-lg text-white bg-blue-500'>Sign Up</button>
                    </div>
                )
            }
        </header>   
    )
}

export default Header;