import React from 'react'
import Navbar from './Navbar'
import css from './css/Landing.module.css'

export default function Landing(){

    React.useEffect(()  => {
        //if user accesses this page while logged in, log the user out
        const token = localStorage.getItem('token')
        if(token) localStorage.removeItem('token')
    })

    return (
        <>
            <Navbar />
            <div className={`${css.landing_root} d-flex flex-column align-items-center justify-content-center`}>
                <div>
                    <h1 className='display-1'>Hello, World!</h1>
                    <h1 className='lead text-center'>Kung nakikita nyo to sa browser, goods na :></h1>
                </div>
            </div>
        </>
    )
}