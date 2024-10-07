import axios from "axios";  // Importing axios for HTTP requests
import { useFormik } from "formik";  // Importing Formik for form handling
import { useState } from "react";  // Importing useState for managing local state
import { Link, useNavigate } from "react-router-dom";  // Importing React Router DOM for navigation and linking

export function UserRegister(){

    const [error, setError] = useState('');  // State to handle error messages for user ID validation
    const [errorClass, setErrorClass] = useState('');  // State to dynamically assign CSS class based on error status

    let navigate = useNavigate();  // Hook to navigate to different routes programmatically

    // Formik setup for handling form state and submission
    const formik = useFormik({
        initialValues: {  // Initial form field values
            UserId: '',  
            UserName: '',
            Password: '',
            Email: '',
            Mobile: ''
        },
        onSubmit : (user => {  // Function to handle form submission
            axios.post('http://127.0.0.1:3300/register-user', user)  // Axios POST request to register a new user
                .then(() => {
                    alert('Registered Successfully..');  // Alert on successful registration
                    navigate('/login');  // Redirect to login page after successful registration
                });
        })
    });

    // Function to verify if the entered UserId is already taken
    function VerifyUserId(e) {
        axios.get('http://127.0.0.1:3300/get-users')  // Axios GET request to fetch all registered users
            .then(response => {
                for (var user of response.data) {  // Loop through all users to check for matching UserId
                    if (user.UserId === e.target.value) {  // If UserId matches, set error message and class
                        setError('User Id Taken - Try Another');
                        setErrorClass('text-danger');
                        break;  // Exit loop if UserId is found
                    } else {  // If UserId is available, set success message and class
                        setError('User Id Available');
                        setErrorClass('text-success');
                    }
                }
            });
    }

    // Render the registration form
    return (
        <div className="d-flex justify-content-end">  {/* Container for form alignment */}
            <form onSubmit={formik.handleSubmit} className="mt-4 pe-4 bg-light border border-2 p-4">  {/* Formik form handler */}
                <h3>Register User</h3>
                <dl>
                    <dt>UserId</dt>  {/* Input for UserId */}
                    <dd><input type="text" className="form-control" onKeyUp={VerifyUserId} name="UserId" onChange={formik.handleChange} /></dd>
                    <dd className={errorClass}> {error} </dd>  {/* Display error or success message for UserId */}
                    
                    <dt>User Name</dt>  {/* Input for UserName */}
                    <dd><input type="text" className="form-control" name="UserName" onChange={formik.handleChange} /></dd>
                    
                    <dt>Password</dt>  {/* Input for Password */}
                    <dd><input type="password" className="form-control" name="Password" onChange={formik.handleChange} /></dd>
                    
                    <dt>Email</dt>  {/* Input for Email */}
                    <dd><input type="email" className="form-control" name="Email" onChange={formik.handleChange} /></dd>
                    
                    <dt>Mobile</dt>  {/* Input for Mobile number */}
                    <dd><input type="text" className="form-control" name="Mobile" onChange={formik.handleChange} /></dd>
                </dl>
                
                <button className="btn btn-dark w-100">Register</button>  {/* Submit button */}
                
                <Link className="mt-2 btn btn-link" to="/login"> Have Account? Login </Link>  {/* Link to navigate to the login page */}
            </form>
        </div>
    );
}
