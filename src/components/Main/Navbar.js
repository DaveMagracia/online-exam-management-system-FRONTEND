import React from 'react'
import css from './css/Navbar.module.css'

export default function Navbar(){
    return (
        <>  
            <nav className={`${css.navbar_root} navbar navbar-expand-lg navbar-light`}>
                <div className="container">
                    <a className="navbar-brand" href="/">Online Exam</a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item me-2">
                                <a className="nav-link active" aria-current="page" href="/">Home</a>
                            </li>
                            <li className="nav-item me-2">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                            <li className="nav-item me-2">
                                <a className="nav-link" href="/register">Register</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}