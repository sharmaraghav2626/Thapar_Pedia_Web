import React,{useEffect,useState} from 'react';
import './App.css';
import Thapar from './component/Thapar';
import { selectUser } from './features/userSlice';
import Login from './component/Login';
import {useSelector,useDispatch} from 'react-redux';
import db,{auth} from './component/firebase';
import { login, logout} from "./features/userSlice";

function App() {
  const dispatch=useDispatch();
  const user=useSelector(selectUser);
  
  


  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        db.collection('user').doc(authUser.uid)
          .onSnapshot((snapshot)=>{
            if(snapshot.data()){
            dispatch(
              login({
                uid: authUser.uid,
                email: snapshot.data().email,
                displayName:snapshot.data().name,
                photo: snapshot.data().imageUrl,
              }))
            }
          })
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <div className="App">
      { user?<Thapar/>:<Login/>
      }
    </div>
  );
}
export default App;
