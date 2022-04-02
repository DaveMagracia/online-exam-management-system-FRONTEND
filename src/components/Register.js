import React, { useEffect } from 'react'
import css from './css/Register.module.css';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
//THIS IS A REACT SPINNER 
//source: https://www.npmjs.com/package/react-spinners (see demo)
import PuffLoader from "react-spinners/PuffLoader"; 


export default function Register(){

    let navigate = useNavigate();

    const [loading, setLoading] = React.useState(false)

    //initialize state default values (for FORM FIELDS)
    const [formData, setFormData] = React.useState({
        email: "",
        username: "",
        pass: "",
        cpass: "",
        userType: "none",
        checked: false,
    })

    //general error; shown on top of the form
    const [generalError, setGenError] = React.useState({
        hasGenError: false,
        msg: ""
    })

    //errors for validation; false value means no error
    const [errors, setErrors] = React.useState({
        email:      {hasError: false, msg: "Invalid Email"},
        username:   {hasError: false, msg: "Invalid Username"},
        pass:       {hasError: false, msg: "Invalid Password"},
        cpass:      {hasError: false, msg: "Passwords do not match"},
        userType:   {hasError: false, msg: "Please select an option"},
        checked:    {hasError: false, msg: "You must agree to our Terms and Conditions"},
    })

    //errors for empty fields; false value means field is not empty
    const [emptyErrors, setEmptyErrors] = React.useState({
        email: false,
        username: false,
        pass: false,
        cpass: false,
        userType: false,
    })
    
    //handles onchange on form fields
    function handleOnChange(event){
        const {name, value, type, checked} = event.target
        //removes error to TAC checkbox if the checkbox is clicked
        if(name === "checked"){
            setErrors(prevValue => ({
                ...prevValue,
                checked: {hasError: false, msg: "You must agree to our Terms and Conditions"}
            }))
        }

        //remove error to the field that was changed
        setEmptyErrors(prevValue => ({
            ...prevValue,
            [name]: false
        }))

        //set the new value to the formData
        setFormData(prevFormData => {
            return ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        })})

    }

    // validates fields; returns true if form is valid, else returns false
    function validateForm(){
        // before validation, check if fields are filled up
        let tempEmptyErrors = {...emptyErrors}

        //NOTE: in JS, if formData.email has a value, it is considered true
        tempEmptyErrors.email = formData.email ? false : true
        tempEmptyErrors.username = formData.username ? false : true
        tempEmptyErrors.pass = formData.pass ? false : true
        tempEmptyErrors.cpass = formData.cpass ? false : true
        tempEmptyErrors.userType = formData.userType !== "none" ? false : true
        setEmptyErrors(tempEmptyErrors)

        // "hasEmptyField" will be true if one of the key in the emptyErrors obj has a value of true
        var hasEmptyFields = Object.keys(tempEmptyErrors).some(k => tempEmptyErrors[k] === true);

        //if there are no empty fields, proceed to validation
        if(!hasEmptyFields){
            //temp errors 
            //Use spread operator. Simply assigning the errors to tempError without spread doesn't assign the object as a value
            let tempErrors = {...errors}

            //validate inputs
            let emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            let email = formData.email.trim()
            tempErrors.email.hasError = !email.match(emailRegex)

            let usernameRegex = /^[a-zA-Z0-9]+\w{3,20}$/;
            let username = formData.username.trim()
            tempErrors.username.hasError = !username.match(usernameRegex)

            let passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            let password = formData.pass.trim()
            let cpassword = formData.cpass.trim()

            tempErrors.pass.hasError =      !password.match(passRegex)
            tempErrors.cpass.hasError =     password !== cpassword
            tempErrors.userType.hasError =  formData.userType === "none"
            tempErrors.checked.hasError =   !formData.checked
            
            // set the tempErrors to the "errors" state
            setErrors(tempErrors)

            //the return statements will return a boolean. If true, it means the form inputs are valid, invalid otherwise
            //if there are no errors in the tempErrors, return true
            return !Object.keys(tempErrors).some(k => tempErrors[k].hasError === true);
        }
        return false;
    }

    //makes the call to the api, and send a post request for the server to process and write to DB
    async function registerUser(event){
        event.preventDefault()
        if(validateForm()){
            //SEND POST REQUEST TO API, THEN WRITE TO DB
            setLoading(true)
            await axios({
                method: 'POST',
                url: 'http://localhost:5000/user/register',
                data: formData
            })
            //in this then, redirect user to login page
            .then(data => {
                setTimeout(() => {
                    setLoading(false)
                    navigate("/login");
                }, 5000)
            })
            .catch(err => {
                setTimeout(() => {
                    setLoading(false)
                    setGenError({
                        hasGenError: true,
                        msg: err.response.data.msg
                    })
                }, 2000)
            })
        }
    }

    return (
        <div>
            {
                loading ?
                <div className={`${css.register_root} d-flex flex-column align-items-center justify-content-center`}>
                    <PuffLoader  
                        loading={loading} 
                        color="#9c2a22"
                        size={80} />
                    <p className='lead mt-4'>&nbsp;&nbsp;Creating your account...</p>
                </div>
                :
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
                                {   
                                    generalError.hasGenError &&
                                    <div className="alert alert-danger" role="alert">
                                        { generalError.msg }
                                    </div>
                                }
                                <form onSubmit={registerUser}>
                                    {/* email field */}
                                    <div className="form-floating">
                                        <input 
                                            id="InputEmail" 
                                            type="email" 
                                            className={`form-control ${errors.email.hasError || emptyErrors.email ? 'border border-danger' : 'mb-4'}`}
                                            name='email' 
                                            onChange={handleOnChange}  
                                            value={formData.email}/>
                                        <label htmlFor="InputEmail">Email address *</label>
                                    </div>
                                    {errors.email.hasError  && <p className='text-danger mb-4 small'>{ errors.email.msg }</p>}
                                    {emptyErrors.email && <p className='text-danger mb-4 small'>This field is required</p>}
                                    
        
                                    {/* username field */}
                                    <div className="form-floating">
                                        <input 
                                            id="InputUsername" 
                                            type="text" 
                                            className={`form-control ${errors.username.hasError || emptyErrors.username ? 'border border-danger' : 'mb-4'}`}
                                            name='username' 
                                            onChange={handleOnChange} 
                                            value={formData.username}/>
                                        <label htmlFor="InputUsername">Username *</label>
                                    </div>
                                    {errors.username.hasError && <p className='text-danger mb-4 small'>{ errors.username.msg }</p>}
                                    {emptyErrors.username && <p className='text-danger mb-4 small'>This field is required</p>}
        
                                    {/* password field */}
                                    <div className="form-floating">
                                        <input 
                                            id="InputPassword" 
                                            type="password" 
                                            className={`form-control ${errors.pass.hasError || emptyErrors.pass ? 'border border-danger' : 'mb-4'}`}
                                            name='pass' 
                                            onChange={handleOnChange} 
                                            value={formData.pass}/>
                                        <label htmlFor="InputPassword">Password *</label>
                                    </div>
                                    {errors.pass.hasError && <p className='text-danger mb-4 small'>{ errors.pass.msg }</p>}
                                    {emptyErrors.pass && <p className='text-danger mb-4 small'>This field is required</p>}
        
                                    {/* confirm pass field */}
                                    <div className="form-floating">
                                        <input 
                                            id="InputCPassword" 
                                            type="password" 
                                            className={`form-control ${errors.cpass.hasError || emptyErrors.cpass ? 'border border-danger' : 'mb-4'}`}
                                            name='cpass' 
                                            onChange={handleOnChange} 
                                            value={formData.cpass}/>
                                        <label htmlFor="InputCPassword">Confirm Password *</label>
                                    </div>
                                    {errors.cpass.hasError && <p className='text-danger mb-4 small'>{ errors.cpass.msg }</p>}
                                    {emptyErrors.cpass && <p className='text-danger mb-4 small'>This field is required</p>}
        
                                    {/* select option field */}
                                    <div className="form-floating">
                                        <select 
                                            id="floatingSelect" 
                                            className={`form-control ${errors.userType.hasError || emptyErrors.userType ? 'border border-danger' : 'mb-4'}`}
                                            name='userType' 
                                            defaultValue={formData.userType} 
                                            onChange={handleOnChange}>
        
                                            <option disabled value="none">----</option>
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                        </select>
                                        <label htmlFor="floatingSelect">Select User Type *</label>
                                    </div>
                                    {errors.userType.hasError && <p className='text-danger mb-4 small'>{ errors.userType.msg }</p>}
                                    {emptyErrors.userType && <p className='text-danger mb-4 small'>This field is required</p>}
                                    
        
                                    {/* terms and conds checkbox */}
                                    <div className="mb-5 form-check">
                                        <input 
                                            type="checkbox" 
                                            className="form-check-input" 
                                            id="tacCheckBox" 
                                            name='checked' 
                                            onChange={handleOnChange} 
                                            checked={formData.checked}/>
                                        <p className='form-check-label text-muted'  htmlFor="tacCheckBox">
                                            By creating an account you agree to the&#160;
                                            <span className={`text-primary ${css.tac}`} data-bs-toggle="modal" data-bs-target="#tacModal">terms of use</span> and our 
                                            <span className={`text-primary ${css.tac}`} data-bs-toggle="modal" data-bs-target="#ppModal"> privacy policy</span>
                                            {errors.checked.hasError && <><br/><span className='text-danger mb-4 small'>{ errors.checked.msg }</span></>}
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
        
        
                    <div className="modal fade" id="tacModal" tabIndex="-1" aria-labelledby="tacModal" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="tacModal">Terms and Conditions</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Content goes here...</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">I Understand</button>
                            </div>
                            </div>
                        </div>
                    </div>
        
                    <div className="modal fade" id="ppModal" tabIndex="-1" aria-labelledby="ppModal" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="ppModal">Privacy Policy</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Content goes here...</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">I Understand</button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}