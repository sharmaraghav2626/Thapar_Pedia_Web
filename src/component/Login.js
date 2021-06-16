import React,{useState} from 'react';
import '../css/login.css';
import { auth, provider } from "./firebase";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import db from './firebase';
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount,isnewAccount]=useState(false);
    const [name,setName]=useState("");
    
    const handleSignIn=(e)=>{
        e.preventDefault();
        auth.signInWithEmailAndPassword(email,password)
        .then((data)=>{
            if(!data.user.emailVerified){
              auth.signOut();
              alert('Please verify your account before Log In');
            }
            console.log('Login Successful');    
        }).catch((e)=>alert(e.message));
        setEmail('');
        setPassword('');
    }
    const registerSignIn=(e)=>{
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email,password)
        .then((data)=>{
          data.user.sendEmailVerification(); 
        }).then(()=>{
          db.collection('user').doc(auth.currentUser.uid).set({
            email:auth.currentUser.email,
            name:name
          })  
        }).then(()=>{
          auth.currentUser.updateProfile({
            displayName:name
          })
        })
          .then(()=>{
            auth.signOut();
            alert('Validation link has been sent to ' + email + '.');
          }).catch((e)=>(alert(e.message)));
        setEmail('');
        setPassword('');
        setName('');
    }
    const signIn=(e)=>{
      e.preventDefault();
      auth.signInWithPopup(provider)
      .then(data => {  
        db.collection('user').doc(data.user.uid).set({
          email:data.user.email,
          name:data.user.displayName
        })
      }).catch(error => {console.log(error);});
    }

    return (
        <div className="login">
        <div className="login__container">
          <div className="login__logo">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/thapar-pedia.appspot.com/o/icon-removebg-preview.png?alt=media&token=15f99b25-874d-4a05-b1c5-1efe07010655"
              alt=""
            />
          </div>
          <div className="login__desc">
            <p>A Place to Share knowledge and better understand the world</p>
            <p style={{ color: "royalblue", fontSize: "25px" }}>
              HandCrafted with ❤️ by{" "}
            </p>
            <h3>Raghav Sharma</h3>
          </div>
          <div className="login__auth">
            <div className="login__authOptions">
              
            <button type="submit" onClick={()=>isnewAccount(true)}>Create New Account</button>

              <div className="login__authOption">
                <img
                  className="login__googleAuth"
                  src="https://media-public.canva.com/MADnBiAubGA/3/screen.svg"
                  alt=""
                />
                <p onClick={signIn}>Continue With Google</p>
              </div>
              
              <div className="login__authDesc">
                <p>
                  <span style={{ color: "blue", cursor: "pointer" }}>
                    Sign Up With Email
                  </span>
                  . By continuing you indicate that you have read and agree to
                  ThaparPedia's
                  <span style={{ color: "blue", cursor: "pointer" }}>
                    Terms of Service{" "}
                  </span>
                  and{" "}
                  <span style={{ color: "blue", cursor: "pointer" }}>
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          {!newAccount?  
            
            <div className="login__emailPass">            
              <div className="login__label">
                <h4>Login</h4>
              </div>
              <div className="login__inputFields">
                <div className="login__inputField">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="Email"
                  />
                </div>
                <div className="login__inputField">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="login__forgButt">
                <small onClick={()=>{auth.sendPasswordResetEmail(email).then(()=>{alert('Email has been sent for resetting the Password')})}}>Forgot Password?</small>
                <button type="submit" onClick={handleSignIn}>Login</button>
              </div>
            </div>
            
            
            :
            

            <div className="login__emailPass">            
              <div className="login__label">
                <h4>Sign Up</h4>
              </div>
              <div className="login__inputFields">
                <div className="login__inputField">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Name"
                  />
                </div>
                <div className="login__inputField">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                  />
                </div>
                <div className="login__inputField">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                  />
                </div>
              
              </div>
              <div className="login__forgButt">
                <button onClick={()=>isnewAccount(false)} variant="contained" >Back</button>
                <button type="submit" onClick={registerSignIn}>Sign Up</button>
              </div>
            </div>
            }
          </div>
          
          <div className="login__lang">
            <p>हिन्दी</p>
            <ArrowForwardIosIcon fontSize="small" />
          </div>
          <div className="login__footer">
            <p>About</p>
            <p>Languages</p>
            <p>Careers</p>
            <p>Businesses</p>
            <p>Privacy</p>
            <p>Terms</p>
            <p>Contact</p>
            <p>&copy; ThaparPedia Inc. 2021</p>
          </div>
        </div>
      </div>
    )
}

export default Login
