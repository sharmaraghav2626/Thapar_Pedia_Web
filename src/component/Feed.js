import React,{useState,useEffect} from 'react';
import '../css/feed.css';
import FeedBox from './FeedBox';
import Post from './Post';
import db from './firebase';
import {selectNavbarState,setNavBarState} from '../features/navBarSlice';
import {selectUser} from '../features/userSlice';
import {useSelector} from 'react-redux';
import {search} from '../features/searchTerm';
import { selectQuestionModal,setQuestionModalTrue} from '../features/questionModalSlice';
import QuestionModal from './QuestionModal';


function Feed() {
    const [posts,setPosts]=useState([]);
    const [profilePost,setProfilePost]=useState([]);
    const [savedPost,setSavedPost]=useState([]);
    const [savedPostId,setSavedPostId]=useState([]);
    const navBarState=useSelector(selectNavbarState);
    const user=useSelector(selectUser);
    const searchTerm=useSelector(search);
    const [searchedPost,setSearchedPost]=useState([]);
    const isQuestionModal=useSelector(selectQuestionModal);
        

    useEffect(() => {
        db.collection("questions")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot)=>{
            var post=[];
            var mypost=[];
            snapshot.docs.map((doc)=>{
                post.push({
                  id:doc.id,
                  questions:doc.data()
                })
                if(doc.data().user.uid==user.uid ){ mypost.push({
                  id:doc.id,
                  questions:doc.data()
                })}
              })
              setPosts(post);
              setProfilePost(mypost);    
            });    
      }, []);
        useEffect(()=>{
          db.collection("user").doc(user.uid).collection('saved_post').orderBy("timestamp","desc")
          .onSnapshot((snapshot)=>{
              setSavedPostId(snapshot.docs.map((doc)=>doc.id))
          }) 
        },[]);
        useEffect(()=>{
          var myPost=[]
          savedPostId.map((doc)=>{
            db.collection("questions").doc(doc).get().then((doc)=>{
              myPost.push({
                id:doc.id,
                questions:doc.data()
              })
            })
          })
          setSavedPost(myPost);
        },[savedPostId])

         // USE EFFECT FOR SEARCHING PROCESS
         useEffect(()=>{
              var post=[];
              db.collection("questions").orderBy("timestamp","desc").onSnapshot((snapshot)=>{
                snapshot.docs.map((doc)=>{
                  var question=doc.data().question+" "+doc.data().user.email+" "+doc.data().user.displayName;
                  if(question.toLowerCase().includes(searchTerm.toLowerCase())){
                     post.push({
                       id:doc.id,
                       questions:doc.data()
                     }) 
                  }
                })
                setSearchedPost(post);
              });
             
         },[searchTerm]) ;

    return (
        <div className="feed">
            
            <FeedBox/>
            {isQuestionModal?<QuestionModal/>:""}


            {/* HOME */}
            {navBarState==='home' && posts.length===0 && <h1 class="no_post">NO POST YET</h1>}
            {navBarState==='home' && posts.length>0 && posts.map(({ id, questions }) => (
              <Post
              key={id}
              Id={id}
              question={questions.question}
              imageUrl={questions.imageUrl}
              timestamp={questions.timestamp}
              users={questions.user}
              likes={questions.likes}
              dislikes={questions.dislikes}
              />
            ))}

            {/* MY Profle  */}
            {navBarState==='profile' && profilePost.length===0 && <h1 class="no_post">NO POST YET</h1>}
            {navBarState==='profile' && profilePost.length>0 &&
            profilePost.map(({ id, questions }) => (
              <Post
              key={id}
              Id={id}
              question={questions.question}
              imageUrl={questions.imageUrl}
              timestamp={questions.timestamp}
              users={questions.user}
              likes={questions.likes}
              dislikes={questions.dislikes}
              />
            ))}

            {/* SAVED POST */}
            {navBarState==='saved_post' && savedPost.length===0 && <h1 class="no_post">NO POST YET</h1>}
            {
              navBarState==='saved_post' && savedPost.length>0 &&
              savedPost.map(({ id, questions }) => (
                <Post
                key={id}
                Id={id}
                question={questions.question}
                imageUrl={questions.imageUrl}
                timestamp={questions.timestamp}
                users={questions.user}
                likes={questions.likes}
                dislikes={questions.dislikes}
                />
              ))
                
            }

             {/* Search Post  */}
             {navBarState==='search' && searchedPost.length===0 && <h1 class="no_post">NO MATCH FOUND TO YOUR SEARCH</h1>}
            {
              navBarState==='search' && searchedPost.length>0 && searchTerm!=="" &&
              searchedPost.map(({ id, questions }) => (
                <Post
                key={id}
                Id={id}
                question={questions.question}
                imageUrl={questions.imageUrl}
                timestamp={questions.timestamp}
                users={questions.user}
                likes={questions.likes}
                dislikes={questions.dislikes}
                />
              ))
                
            }
        </div>
    )
}
export default Feed
