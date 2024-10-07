import { Link, useNavigate } from "react-router-dom";  // Importing necessary hooks and components from react-router-dom
import { Button } from "@mui/material";  // Importing Button component from Material UI
import { useFormik } from "formik";  // Importing Formik for form handling
//import { useState } from "react";  // Importing useState hook for managing state
import axios from "axios";  // Importing axios for HTTP requests
import { useCookies } from "react-cookie";  // Importing useCookies hook for managing cookies

export function UserLogin() {
    const [cookies, setCookie, removeCookie] = useCookies(['userid']);  // useCookies hook to manage 'userid' cookie
    let navigate = useNavigate();  // Hook to navigate between routes programmatically
    
    // Formik setup for managing form state and submission
    const formik = useFormik({
        initialValues: {  // Initial values for form fields
            UserId: '',
            Password: ''
        },
        onSubmit: (formdata) => {  // Function to handle form submission
            axios.get('http://127.0.0.1:3300/get-users')  // Axios GET request to fetch all users
                .then((response) => {
                    var user = response.data.find(user => user.UserId === formdata.UserId);  // Check if UserId exists in the response
                    if (user && user.Password === formdata.Password) {  // Validate if password matches the UserId
                        setCookie('userid', formdata.UserId);  // Set 'userid' cookie if login is successful
                        navigate('/dashboard');  // Navigate to dashboard upon successful login
                    } else {
                        navigate('/user-error');  // Redirect to error page if login fails
                    }
                })
                .catch((error) => {
                    navigate('/user-error');  // Handle any errors during the HTTP request and navigate to error page
                });
        }
    });
    
    // Rendering the login form
    return (
        <div style={{ height: '400px' }} className="me-4 pe-4 d-flex justify-content-end align-items-center">
            <div>
                <h1 className="text-danger bi bi-person-fill">User Login</h1>  {/* Title for the login form */}
                <form onSubmit={formik.handleSubmit} className="bg-white text-dark p-4">  {/* Formik form handler */}
                    <dl>
                        <dt>User Id</dt>  {/* Input for UserId */}
                        <dd><input type="text" name="UserId" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Password</dt>  {/* Input for Password */}
                        <dd><input type="password" name="Password" onChange={formik.handleChange} className="form-control" /></dd>
                    </dl>
                    <Button type="submit" variant="contained" color="info" className="w-100">Login</Button>  {/* Login button */}
                    <Link to='/register' className="btn btn-link w-100 mt-2">New User? Register</Link>  {/* Link to the registration page */}
                </form>
            </div>
        </div>
    );
}
