import React from 'react';
import '../css/thapar.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Feed from './Feed';
function Thapar() {
    return (
        <div className="thapar">
             <Navbar/>
             <div className="tcontents">
                <Sidebar/>
                <Feed/>
             </div>
        </div>
    )
}

export default Thapar
