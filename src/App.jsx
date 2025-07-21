import MainPage from "./MainPage";
import SignIn from "./SignIn";
import Header from "./Header";
import SignUp from "./SignUp";
import CompleteTaskPage from "./CompleteTaskPage";
import Settings from "./settingsPage";
import { UserContext } from "./SignIn";
import React,{useState,useEffect} from "react";

export const link="https://to-do-list-3hctow.fly.dev";

function App(){ 
  const [logged,setLogged]=useState(false);
  const [signed,setSigned]=useState(false);
  const [user, setUser] = useState('');
  const [userID,setUserID]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [completedTasksClicked,setCompletedTasksClicked]=useState(false);
  const [settings,setSettings]=useState(false);

  return( 
    <UserContext.Provider value={user} value2={password}>
      <div> 
        <Header settings={settings} setSettings={setSettings} setCompletedTasksClicked={setCompletedTasksClicked} logged={logged} userName={user} setLogged={setLogged} setSigned={setSigned}/> 
        {
          signed?
            <SignUp emailSetter={setEmail} logged={setLogged} signed={setSigned} setUser={setUser} setUserID={setUserID}/>
        :
          logged?(
            completedTasksClicked ?
              <CompleteTaskPage userID={userID}/>:settings ? <Settings userID={userID} setUser={setUser} userEmail={email} ></Settings>:
              <MainPage userName={user} userID={userID}/>
          ):(
            <SignIn 
              logIn={setLogged} 
              emailSetter={setEmail}
              setUser={setUser}
              setUserID={setUserID}
            />
          )
        }
      </div>
    </UserContext.Provider>
  )
    
}
export default App;