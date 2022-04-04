import React from 'react'
import css from './css/StudentNavbar.module.css'
import { useNavigate } from 'react-router-dom'

export default function StudentNavbar(props){
    const navigate = useNavigate()

    async function logout(){
        await localStorage.removeItem('token')
        navigate('/')
    }

    
    return (
        <>  
            <nav className={`${css.stud_navbar_root} navbar navbar-expand-lg navbar-light`}>
                <div className="container">
                    <a className="navbar-brand" href="/">Online Exam</a>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item me-4">
                                <button className={`${css.code_btn} btn btn-outline-dark`} data-bs-toggle="modal" data-bs-target="#exampleModal">Enter Exam Code</button>
                            </li>
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
                                <li onClick={logout}><a className="dropdown-item">Logout</a></li>
                            </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Enter exam code</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input className="form-control" type="text" placeholder="Default input" aria-label="default input example"/>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary">Join</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}