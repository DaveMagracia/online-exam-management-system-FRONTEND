import React from 'react'
import css from './css/FacultyNavbar.module.css'
import { useNavigate } from 'react-router-dom'

export default function FacultyNavbar(props){
    const navigate = useNavigate()

    async function logout(){
        await localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <>  
            <nav className={`${css.fact_navbar_root} navbar navbar-expand-lg navbar-light`}>
                <div className="container">
                    <a className="navbar-brand" href="/">Online Exam</a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item me-2">
                                <a className="nav-link active" aria-current="page" href="/dashboard">Dashboard</a>
                            </li>
                            <li className="nav-item me-2">
                                <a className="nav-link" href="/">History</a>
                            </li>
                            {/* my profile dropdown */}
                            <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="/" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {props.username}&nbsp;
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDarkDropdownMenuLink">
                                <li><a className="dropdown-item" href="/">My Profile</a></li>
                                <li onClick={logout}><p className="dropdown-item">Logout</p></li>
                            </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}