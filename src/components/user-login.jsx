import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { useCookies } from "react-cookie";

export function UserLogin() {
    const [cookies, setCookie, removeCookie] = useCookies(['userid']);
    let navigate = useNavigate();
    
    const formik = useFormik({
        initialValues: {
            UserId: '',
            Password: ''
        },
        onSubmit: (formdata) => {
            axios.get('http://127.0.0.1:3300/get-users')
                .then((response) => {
                    var user = response.data.find(user => user.UserId === formdata.UserId);
                    if (user && user.Password === formdata.Password) {
                        setCookie('userid', formdata.UserId);
                        navigate('/dashboard');
                    } else {
                        navigate('/user-error');
                    }
                })
                .catch((error) => {
                    navigate('/user-error');
                });
        }
    });
    
    return (
        <div style={{ height: '400px' }} className="me-4 pe-4 d-flex justify-content-end align-items-center">
            <div>
                <h1 className="text-danger bi bi-person-fill">User Login</h1>
                <form onSubmit={formik.handleSubmit} className="bg-white text-dark p-4">
                    <dl>
                        <dt>User Id</dt>
                        <dd><input type="text" name="UserId" onChange={formik.handleChange} className="form-control" /></dd>
                        <dt>Password</dt>
                        <dd><input type="password" name="Password" onChange={formik.handleChange} className="form-control" /></dd>
                    </dl>
                    <Button type="submit" variant="contained" color="info" className="w-100">Login</Button>
                    <Link to='/register' className="btn btn-link w-100 mt-2">New User? Register</Link>
                </form>
            </div>
        </div>
    );
}
