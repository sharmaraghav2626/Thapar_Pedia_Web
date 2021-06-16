import React from 'react';
import '../css/feedbox.css';
import {Avatar} from '@material-ui/core';
import { selectUser } from '../features/userSlice';
import { selectQuestionModal,setQuestionModalTrue} from '../features/questionModalSlice';
import {useSelector,useDispatch} from 'react-redux';

function FeedBox() {
    const user=useSelector(selectUser);
    const isQuestionModal=useSelector(selectQuestionModal);
    const dispatch=useDispatch();
    return (
        <div className="feedbox" onClick={() => dispatch(setQuestionModalTrue())}>
            <div className="feedbox_info">
                <Avatar src={user.photo}/>
                <h5>{user.displayName}</h5>
            </div>
            <div className="feedbox_ques">
                <p>What is Your Question?</p>
            </div>
        </div>
    )
}

export default FeedBox
