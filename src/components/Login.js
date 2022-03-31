import React from 'react'
import css from './css/Login.module.css';
import Navbar from './Navbar'

export default function Login(){
    return (
        <div>
            <Navbar/>
            <div className={`${css.login_root} d-flex align-items-center justify-content-center`}>
                <div className={`${css.form_container}`}>    
                    <form method="POST">
                        <h1 className='display-1'>Login Route</h1>
                    </form>
                </div>
            </div>
        </div>
    )
}