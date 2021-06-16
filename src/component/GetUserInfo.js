import React,{useState,useEffect} from 'react'
import db from './firebase'

export default function GetUserInfo(props) {
    const [name,userName]=useState('');
    useEffect(()=>{
        if(props.id){
            db.collection('user').doc(props.id).onSnapshot((snapshot)=>{
                userName(snapshot.data().name)
            })
        }
    },[])
    return (
        <span >
            {name}{" "}
        </span>
    )
}
