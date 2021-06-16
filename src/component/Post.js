import React,{useState,useEffect} from 'react';
import '../css/post.css';
import {Avatar,Snackbar,Button} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Modal from 'react-modal';
import firebase from 'firebase';
import { selectUser} from '../features/userSlice';
import { useSelector,useDispatch} from 'react-redux';
import db from './firebase';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import DeleteIcon from '@material-ui/icons/Delete'
import {selectNavbarState} from '../features/navBarSlice';
import EjectIcon from '@material-ui/icons/Eject';
import {Card,CardContent} from '@material-ui/core';
import { Popover } from '@material-ui/core';
import  GetUserName from './GetUserInfo'

function Post({ Id, question, imageUrl, timestamp, users,likes,dislikes}) {
    const [IsmodalOpen, setIsModalOpen] = useState(false);
    const currentuser=useSelector(selectUser);
    const [questionId,setQuestionId]=useState(Id);
    const [answer,setAnswer]=useState('');
    const [getAnswers,setGetAnswers]=useState([]);
    const [savePost,IsSavePost]=useState(false);
    const [deletePost,IsDeletePost]=useState(false);
    const [removeSavedPost,IsRemoveSavedPost]=useState(false);
    const navBarState=useSelector(selectNavbarState);
    const [isPostLiked,setPostLiked]=useState(false);
    const [isPostDisLiked,setPostDisLiked]=useState(false);
    const [userProfile,showUserProfile]=useState(null);
    const user=useSelector(selectUser);
    const [postUser,setPostUser]=useState(null)
    const [isgetAnswer,setIsGetAnswer]=useState('')    


    useEffect(()=>{
        db.collection('user').doc(users.uid)
          .onSnapshot((snapshot)=>{
              if(snapshot.data()){
              setPostUser({
                uid: users.uid,
                email: snapshot.data().email,
                displayName:snapshot.data().name,
                photo: snapshot.data().imageUrl,
              })}
          })
    },[users])

    useEffect(() => {
        if (questionId) {
            db.collection("questions")
            .doc(questionId)
            .collection("answer")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
              setGetAnswers(
                snapshot.docs.map((doc) => ({ id: doc.id, answers: doc.data() }))
              )
            );
        }
      }, [questionId]);

    useEffect(()=>{
        db.collection('user').doc(currentuser.uid).collection('liked_post').doc(Id).onSnapshot((data)=>{
            if(data.data()===undefined || data.data().isLiked===false){
                setPostLiked(false);   
            }else setPostLiked(true);
        })
        db.collection('user').doc(currentuser.uid).collection('unliked_post').doc(Id).onSnapshot((data)=>{
            if(data.data()===undefined || data.data().isLiked===false){
                setPostDisLiked(false);   
            }else setPostDisLiked(true);
        })
    },[]);
    

    const handleAnswer=(e)=>{
        e.preventDefault();

        if (questionId) {
          db.collection("questions").doc(questionId).collection("answer").add({
            user: currentuser,
            answer: answer,
            questionId: questionId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          }).catch('Check your internet Connection');
        }
        setAnswer("");
        setIsModalOpen(false);
    }
    const handleSavePost=()=>{
        IsSavePost(false);
        db.collection("user").doc(currentuser.uid).collection('saved_post').doc(questionId).set({timestamp:firebase.firestore.FieldValue.serverTimestamp()})
    }
    const handleRemoveSavedPost=async(e)=>{
        db.collection("user").doc(currentuser.uid).collection('saved_post').doc(questionId).delete();
    }
    const handleDeletePost=async(e)=>{
        var savedPostRef=db.collection('user').doc(currentuser.uid).collection('saved_post').doc(questionId);
            savedPostRef.get().then((doc)=>{
                if(doc.exists){
                    savedPostRef.delete();
                }
            })
        await db.collection('questions').doc(questionId).delete()
    }
    
    const likePost=async(e)=>{
        if(questionId!==""){
        var isLike=true;
        var likestatus=await db.collection('user').doc(currentuser.uid).collection('liked_post').doc(questionId).get();
        if(likestatus.data()===undefined ||  likestatus.data().isLiked===false){
            isLike=false;
            if(likestatus.data()===undefined){
                db.collection("user").doc(currentuser.uid).collection("liked_post").doc(questionId).set({
                    isLiked:false
                })
            }
        }
        if(isLike===false){
            await db.collection("questions").doc(questionId).update({
                likes:firebase.firestore.FieldValue.increment(1)
            })
            db.collection("user").doc(currentuser.uid).collection("liked_post").doc(questionId).update({
                isLiked:true
            })
            setPostLiked(true);
            if(isPostDisLiked===true){
                db.collection("questions").doc(questionId).update({
                    dislikes:firebase.firestore.FieldValue.increment(-1)
                })
                db.collection("user").doc(currentuser.uid).collection("unliked_post").doc(questionId).update({
                    isLiked:false
                })
                setPostDisLiked(false);    
            }

        }else{
            db.collection("questions").doc(questionId).update({
                likes:firebase.firestore.FieldValue.increment(-1)
            })
            db.collection("user").doc(currentuser.uid).collection("liked_post").doc(questionId).update({
                isLiked:false
            })
            setPostLiked(false);
        }
        }
    }

    const unlikePost=async(e)=>{
        if(questionId!==""){
        var isLike=true;
        
        var likestatus=await db.collection('user').doc(currentuser.uid).collection('unliked_post').doc(questionId).get();
        if(likestatus.data()===undefined ||  likestatus.data().isLiked===false){
            isLike=false;
            if(likestatus.data()===undefined){
                db.collection("user").doc(currentuser.uid).collection("unliked_post").doc(questionId).set({
                    isLiked:false
                })
            }
        }
        if(isLike===false){
            await db.collection("questions").doc(questionId).update({
                dislikes:firebase.firestore.FieldValue.increment(1)
            })
            db.collection("user").doc(currentuser.uid).collection("unliked_post").doc(questionId).update({
                isLiked:true
            })   
            setPostDisLiked(true);
            if(isPostLiked){
                db.collection("questions").doc(questionId).update({
                    likes:firebase.firestore.FieldValue.increment(-1)
                })
                db.collection("user").doc(currentuser.uid).collection("liked_post").doc(questionId).update({
                    isLiked:false
                })
                setPostLiked(false);
            }
        }else{
            db.collection("questions").doc(questionId).update({
                dislikes:firebase.firestore.FieldValue.increment(-1)
            })
            db.collection("user").doc(currentuser.uid).collection("unliked_post").doc(questionId).update({
                isLiked:false
            })
            setPostDisLiked(false);
        }
        }   
    }


    if(postUser===null) return <div/>
    return (
        <div className="post" onClick={()=>setIsGetAnswer(Id)}>
            
            <div className="post__info">
                <Avatar src={postUser.photo}/>
                <h5 onClick={function(event){ showUserProfile(event.currentTarget);}}>{postUser.displayName?postUser.displayName:postUser.email}</h5>
                <small>{new Date(timestamp?.toDate()).toLocaleString()}</small>
            </div>
            <div className="post__body">
                <div className="post__question">
                <p>{question}</p>
                    <button onClick={()=>setIsModalOpen(true)}className="post__btnAnswer">Answer</button>
                    <Modal
                        isOpen={IsmodalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        shouldCloseOnOverlayClick={false}
                        style={{
                        overlay: {
                            width: 680,
                            height: 550,
                            backgroundColor: "rgba(0,0,0,0.8)",
                            zIndex: "1000",
                            top: "50%",
                            left: "50%",
                            marginTop: "-250px",
                            marginLeft: "-350px",
                        },
                        }}
                    >
                        <div className="modal__question">
                        <h1>{question}</h1>
                        <p>
                            asked by  {postUser.displayName?postUser.displayName:postUser.email}
                            <span className="name"></span>
                            {" "}
                            {""}
                            on{" "}
                            <span className="name">
                            {new Date(timestamp?.toDate()).toLocaleString()}
                            </span>
                        </p>    
                        </div>
                        <div className="modal__answer">
                        <textarea
                            required
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Enter Your Answer"
                            type="text"
                        />
                        </div>
                        <div className="modal__button">
                        <button  onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="sumbit" onClick={handleAnswer} className="add">
                            Add Answer
                        </button>
                        </div>
                    </Modal>
                </div>
                <div className="post__answer">
                {getAnswers.map(({ id, answers }) => (
                        <p key={id} style={{ position: "relative", paddingBottom: "5px" }}>
                        {Id === isgetAnswer ? (
                            <span>
                            {answers.answer}
                            <br />
                            <span
                                style={{
                                position: "absolute",
                                color: "gray",
                                fontSize: "small",
                                display: "flex",
                                right: "0px",
                                }}
                            >
                                <span style={{ color: "#b92b27" }}>
                                <GetUserName id={answers.user.uid}/>   
                                  on {" "}
                                {new Date(answers.timestamp?.toDate()).toLocaleString()}
                                </span>
                            </span>
                            </span>
                        ) : (
                            ""
                        )}
                        </p>
                    ))}
                </div>
                <img src={imageUrl} alt=""/>
            </div>

            <div className="post__footer">
                 {likes===0?"":"+"+likes}<ThumbUpAltIcon className={isPostLiked?'like':null} onClick={likePost}/>
                
                 {dislikes===0?"":"-"+dislikes}<ThumbDownIcon className={isPostDisLiked?'like':null} onClick={unlikePost}/>
                
                
                <ChatBubbleOutlineIcon onClick={()=>setIsModalOpen(true)}/>
                {navBarState!=='saved_post' && <PlaylistAddIcon onClick={()=>IsSavePost(true)}/>}
                {/* {navBarState==='saved_post' && <EjectIcon onClick={()=>IsRemoveSavedPost(true)}/>} */}
                
                <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={savePost}
                autoHideDuration={4000}
                onClose={()=>{IsSavePost(false)}}
                >
                   <Alert  severity="info">
                        <Button variant="outlined" onClick={handleSavePost}color="primary">
                            Click Here to save Post! 
                       </Button>
                   </Alert>
                </Snackbar>
                <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={removeSavedPost}
                autoHideDuration={4000}
                onClose={()=>{IsRemoveSavedPost(false)}}
                >
                   <Alert  severity="error">
                        <Button variant="outlined" onClick={handleRemoveSavedPost} color="primary">
                            REMOVE 
                       </Button>
                   </Alert>
                </Snackbar>
                {navBarState!=='saved_post' && postUser.uid===user.uid && 
                    <DeleteIcon onClick={()=>IsDeletePost(true)}/>
                }
                <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={deletePost}
                autoHideDuration={4000}
                onClose={()=>{IsDeletePost(false)}}
                >
                   <Alert  severity="error">
                        <Button variant="outlined" onClick={handleDeletePost} color="primary">
                            Are Your Sure?{"  "}<DeleteIcon/>
                       </Button>
                   </Alert>
                </Snackbar>
            </div>

                {/* To Show  User Profile*/}

                <Popover
                anchorEl={userProfile}
                open={Boolean(userProfile)}
                // eslint-disable-next-line no-restricted-globals   
                id={open ? "simple-popover" :""}
                onClose={() => {
                showUserProfile(null);
                }}
                transformOrigin={{
                horizontal: "center",
                vertical: "bottom",
                }}
                anchorOrigin={{
                horizontal: "center",
                vertical: "bottom",
                }}
            >
                <Card>
                    <CardContent>
                        <Avatar src={postUser.photo}/>
                        <p>{postUser.displayName}</p>
                        <br/>
                        <a href={"mailto:"+postUser.email} >{postUser.email}</a>
                    </CardContent>
                </Card>
            </Popover>
 



        </div>

    )
}

export default Post