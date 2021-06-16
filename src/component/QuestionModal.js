import React,{useState} from 'react'
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import { ExpandMore, Link } from "@material-ui/icons";
import firebase from "firebase";
import {Avatar,Input} from '@material-ui/core';
import {useSelector,useDispatch} from 'react-redux';
import { selectUser } from '../features/userSlice';
import db,{auth} from './firebase';
import '../css/navbar.css';
import '../css/questionModal.css';
import { selectQuestionModal,setQuestionModalFalse} from '../features/questionModalSlice';


  function QuestionModal() {
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const [inputUrl, setInputUrl] = useState("");
    const user=useSelector(selectUser);
    
    const handleQuestion=(e)=>{
            e.preventDefault();
            db.collection("questions").add({
              user:user,
              question: input,
              imageUrl: inputUrl,
              likes:+0,
              dislikes:+0,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(()=>dispatch(setQuestionModalFalse())).catch((e)=>console.log("Error ",e.message));
            setInput("");
            setInputUrl("");
    }

    return (
          <div className="container">
          <div className="modal__title">
            <h5>Add Question</h5>
          </div>
          <div className="modal__info">
            <Avatar
              className="avatar"
              src={user.photo}
            />
            <p>{user.displayName ? user.displayName : user.email} asked</p>
          </div>
          <div className="modal__Field">
            <Input
              required
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Start your question with 'What', 'How', 'Why', etc. "
            />
            <div className="modal__fieldLink">
              <Link /> 
              <input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                type="text"
                placeholder="Optional: inclue a link that gives context"
              ></input>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" onClick={() => dispatch(setQuestionModalFalse())}>
              Cancel
            </button>
            <button type="sumbit"  onClick={handleQuestion}className="add">
              Add Question
            </button>
          </div>
        </div>
    )
}

export default QuestionModal
