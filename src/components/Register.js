import React from 'react'
import css from './css/Register.module.css';
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/user/create'
})

export default function Register(){
    //initialize state default values
    const [formData, setFormData] = React.useState({
        email: "",
        username: "",
        pass: "",
        cpass: "",
        userType: "none",
        checked: false,
    })

    // React.useEffect(() => {
    //     console.log(formData)
    // }, [formData])

    function submitForm(event){
        event.preventDefault()
        //SEND REQUEST TO API, THEN WRITE TO DB
        
        //1. validate inputs

        var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var email = formData.email.trim()

        if(email.match(emailRegex)){
            console.log("email true")
        }else{
            console.log("email false")
        }


        var usernameRegex = /^[a-zA-Z0-9]+\w{3,20}$/;
        var username = formData.username.trim()

        if(username.match(usernameRegex)){
            console.log("true")
        }else{
            console.log("false")
        }


        var passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        var password = formData.pass.trim()
        var cpassword = formData.cpass.trim()

        if(password.match(passRegex)){
            console.log("pass true")
        }else{
            console.log("pass false")
        }


        if(password === cpassword){
            console.log("passwords match")
        }


        if(formData.userType === "none"){
            console.log("no option selected")
        }else{
            console.log("option selected")
        }

        if(formData.checked){
            console.log("checked")
        }

    }

    function handleChange(event){
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    return (
        <div>
            <div className={`${css.register_root} d-flex`}>
                {/* left section */}
                <div className={`${css.left} d-none d-md-block`}>
                </div>

                {/* right section */}
                <div className={`${css.form_container} ${css.right} container p-0 m-0 w-100-md d-md-flex align-items-center`}>  
                    {/* top divider (SHOWN ONLY ON MEDIUM SCREENS) */}
                    <div className={`${css.divider} d-block d-md-none`}>
                    </div>
                    {/* ACTUAL FORM */}
                    <div className={`${css.form} m-5`}>
                        <h1 className="mb-5">OnlineExam</h1>
                        <h2 className="mb-4">Create an Account</h2>
                        <form onSubmit={submitForm}>
                            {/* email field */}
                            <div className="mb-4 form-floating">
                                <input 
                                    id="InputEmail" 
                                    type="email" 
                                    className='form-control'
                                    name='email' 
                                    onChange={handleChange} 
                                    value={formData.email}/>
                                <label htmlFor="InputEmail" >Email address</label>
                            </div>

                            {/* username field */}
                            <div className="mb-4 form-floating">
                                <input 
                                    id="InputUsername" 
                                    type="text" 
                                    className="form-control" 
                                    name='username' 
                                    onChange={handleChange} 
                                    value={formData.username}/>
                                <label htmlFor="InputUsername">Username</label>
                            </div>

                            {/* password field */}
                            <div className="mb-4 form-floating">
                                <input 
                                    id="InputPassword" 
                                    type="password" 
                                    className="form-control" 
                                    name='pass' 
                                    onChange={handleChange} 
                                    value={formData.pass}/>
                                <label htmlFor="InputPassword">Password</label>
                            </div>

                            {/* confirm pass field */}
                            <div className="mb-4 form-floating">
                                <input 
                                    id="InputCPassword" 
                                    type="password" 
                                    className="form-control" 
                                    name='cpass' 
                                    onChange={handleChange} 
                                    value={formData.cpass}/>
                                <label htmlFor="InputCPassword">Confirm Password</label>
                            </div>

                            {/* select option field */}
                            <div className="mb-4 form-floating">
                                <select 
                                    id="floatingSelect" 
                                    className="form-select" 
                                    name='userType' 
                                    defaultValue={formData.userType} 
                                    onChange={handleChange}>

                                    <option disabled value="none">----</option>
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                                <label htmlFor="floatingSelect">Select User Type</label>
                            </div>

                            {/* terms and conds checkbox */}
                            <div className="mb-5 form-check">
                                <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    id="tacCheckBox" 
                                    name='checked' 
                                    onChange={handleChange} 
                                    checked={formData.checked}/>
                                <p className='form-check-label text-muted'  htmlFor="tacCheckBox">
                                    By creating an account you agree to the&#160;
                                    <span className={`text-primary ${css.tac}`}  data-bs-toggle="modal" data-bs-target="#exampleModal">terms of use</span> and our 
                                    <span className={`text-primary ${css.tac}`}> privacy policy</span>
                                </p>
                            </div>
                            {/* submit button */}
                            <button type="submit" className={`${css.reg_btn} btn btn-primary`}>Register</button>

                            <p className='text-center mt-4 text-muted'>Already have an account? 
                                <span className='text-primary'>
                                    <a href='/login' className='text-decoration-none'> Sign In</a>
                                </span>
                            </p>
                        </form>
                    </div>

                    {/* bottom divider (SHOWN ONLY ON MEDIUM SCREENS) */}
                    <div className={`${css.divider} d-block d-md-none`}>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <h1>Hello world</h1>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}