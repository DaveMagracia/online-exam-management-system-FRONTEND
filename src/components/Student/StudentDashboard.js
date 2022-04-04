import React from 'react'
import css from './css/StudentDashboard.module.css'

export default function StudentDashboard(props){
    return (
        <>  
            <div className={`${css.stud_dashboard_root} d-flex flex-column align-items-center justify-content-center`}>
                <div>
                    <h1 className='display-1 m-0'>Student Dashboard</h1>
                    <p className='lead text-center'>{ props.username }</p>
                </div>
            </div>
        </>
    )
}