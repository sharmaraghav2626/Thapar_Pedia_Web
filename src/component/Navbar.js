import React,{useState} from 'react';
import '../css/navbar.css';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentTurnedOutLinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import PepopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import NotificationOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import SearchIcon from '@material-ui/icons/Search';
import {Avatar,Button} from '@material-ui/core';
import {auth,storage} from './firebase';
import {useSelector,useDispatch} from 'react-redux';
import { selectUser } from '../features/userSlice';
import { selectQuestionModal,setQuestionModalTrue} from '../features/questionModalSlice';
import {selectNavbarState,setNavBarState} from '../features/navBarSlice';
import PersonIcon from '@material-ui/icons/Person';
import Modal from 'react-modal';
import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
import { setsearchTerm } from '../features/searchTerm';
function Navbar() {
    const user=useSelector(selectUser);
    const dispatch=useDispatch();
    const [profileModal,setProfileModal]=useState(false);
    const [file, setFile] = useState(null);
    const [searchTerm,setSearchTerm]=useState('');

    const handleUpload=(e)=>{
        e.preventDefault();
        setProfileModal(false); 
        storage.ref(`/images/${auth.currentUser.email}`).put(file)
        .then((response)=>{
            response.ref.getDownloadURL().then((link)=>{
                auth.currentUser.updateProfile({
                    photoURL:link 
                })
                setFile(link);
            })
        }).catch((e)=>alert(e.meassage))
    }
    function handleChange(e) {
        setFile(e.target.files[0]);
    }
    
    const handleSearch=(e)=>{
        e.preventDefault();
        if(searchTerm!==''){
        dispatch(setNavBarState('search'));
        dispatch(setsearchTerm(searchTerm));
        setSearchTerm('');
        }
    }

    return (
        <div className="theader">
            <div className="theader_logo" onClick={()=>{
                setSearchTerm('');
                dispatch(setsearchTerm(searchTerm));    
                dispatch(setNavBarState('home'));
            }}>
                <img 
                src="https://firebasestorage.googleapis.com/v0/b/thapar-pedia.appspot.com/o/icon-removebg-preview.png?alt=media&token=15f99b25-874d-4a05-b1c5-1efe07010655" 
                alt="" />
            </div>
            <div className="theader_icons">
                <div className="theader__icon" onClick={()=>{
                    setSearchTerm('');
                    dispatch(setsearchTerm(searchTerm));    
                    dispatch(setNavBarState('home'))}}>
                    <HomeIcon/>    
                </div>
                <div className="theader__icon" onClick={()=>{setSearchTerm('');
                    dispatch(setsearchTerm(searchTerm));    
                    dispatch(setNavBarState('profile'))}}>
                  <PersonIcon/>
                </div>
                <div className="theader__icon">
                    <TurnedInNotIcon onClick={()=>{setSearchTerm('');
                    dispatch(setsearchTerm(searchTerm));
                    dispatch(setNavBarState('saved_post'))}}/>               
                </div>
              
            </div>
            <form  onSubmit={handleSearch} className="theader_input">
                
                <SearchIcon/>
                  <input  type="text" placeholder="Search ThaparPedia" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/ >
                
            </form>
            <div className="theader_remain">
                <div className="theader_avatar">
                    <Avatar src={user.photo}/>
                    <div className="theader_avatardropdown">
                                <p onClick={()=>{setProfileModal(true)}}>Upload/Change Profile</p>
                                <p onClick={()=>{auth.signOut()}}>Log Out</p>
                    </div>
                </div>
                <Button onClick={() => dispatch(setQuestionModalTrue())}>Add Question</Button>
                

                {profileModal? 
                    <Modal 
                    class="profile_modal"
                    isOpen={profileModal}
                    onRequestClose={() => setProfileModal(false)}
                    shouldCloseOnOverlayClick={false}
                    style={{
                      overlay: {
                        width: 400,
                        height: 200,
                        backgroundColor: "rgba(0,0,0,0.8)",
                        zIndex: "1000",
                        top: "40%",
                        left: "40%",
                      },
                    }}
                    >
                        <form onSubmit={handleUpload}>
                            <input type="file" onChange={handleChange} />
                            <button disabled={!file} type="submit">Upload</button>
                            <button onClick={()=>{setProfileModal(false)}}> Cancel </button>
                        </form>
                    </Modal>
                :""}    
            </div>
        </div>
    )
}

export default Navbar
