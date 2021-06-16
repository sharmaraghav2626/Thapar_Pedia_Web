import React,{useState,useEffect} from 'react';
import '../css/sidebaroptions.css';
import {Avatar,Card,CardContent} from '@material-ui/core';
import { Popover } from '@material-ui/core';
import db from './firebase';
function SidebarOptions() {
    const [showfaculty,IsShowFaculty]=useState(null);
    const [faculty,setFaculty]=useState([]);
    const [facultyid,setFacultyId]=useState(1);
    useEffect(() => {
        db.collection('faculty').orderBy('rank','asc').onSnapshot((snapshot)=>{
            setFaculty(
                snapshot.docs.map((doc,index) => ({
                    id:index,
                    faculty:doc.data()    
                })))
        })
      },[]);    
    return (
        <div className="sidebarOptions">
            {
            faculty.map((f)=>(
                <div className="sidebar_option" onClick={function(event){ setFacultyId(f.id); IsShowFaculty(event.currentTarget);}}>
                    <Avatar src={f.faculty.photo}/>
                    <p>{f.faculty.designation}</p>            
                </div>
            ))}
            <Popover
                anchorEl={showfaculty}
                open={Boolean(showfaculty)}
                // eslint-disable-next-line no-restricted-globals   
                id={open ? "simple-popover" :""}
                onClose={() => {
                IsShowFaculty(null);
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
                {faculty.length>0 && <Card>
                    <CardContent>
                        <Avatar src={faculty[facultyid]['faculty']['photo']}/>
                        <p>{faculty[facultyid]['faculty']['designation']}</p>
                        <small><b>{faculty[facultyid]['faculty']['name']}</b></small>
                        <br/>
                        <a href={"mailto:"+faculty[facultyid]['faculty']['email']} >{faculty[facultyid]['faculty']['email']}</a>
                    </CardContent>
                </Card>}
            </Popover>
            
        </div>
        
    )
}

export default SidebarOptions
 