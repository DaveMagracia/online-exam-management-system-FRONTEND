import React from 'react'
import css from './css/FacultyDashboard.module.css'

export default function FacultyDashboard(props){
    return (
        <>  
            <div className={`${css.fact_dashboard_root} d-flex flex-column align-items-center justify-content-center`}>
                <div>
                    <h1 className='display-1 m-0'>Faculty Dashboard</h1>
                    <p className='lead text-center'>{ props.username }</p>
                </div>
            </div>
        </>
    )
}