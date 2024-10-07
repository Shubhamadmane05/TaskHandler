       
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
export function TaskHome(){

    const [cookies, setCookie, removeCookie] = useCookies('user-id');

    useEffect(()=>{
  
    },[]);
    return(
        <div >
            <header className="d-flex align-items-relative  background justify-content-between " style={{ height: '90px',width: '100%'}} >
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center">
                        
                    <div className="col-xs-3">
                <Link to={'/login'} class="d-flex align-items-center ">
                    <img className="logo" src="/logo22.jpg" width={60} />
                    <span className="mt-4 h2 bi-file-font header-text" style={{ color: 'red' }}>taskHandler</span> 
                    </Link>
                    </div>
                    </div>
                </div>
                <div className='p-3 d-flex justify-content-between'>    
            <Link to="/login" className='btn btn-danger bi bi-person p-2 mx-4'> Login</Link>
          </div>      
            </header>
            
            <main style={{height:'400px'}} className="me-4 pe-4 d-flex justify-content-end align-items-center">
                <Link to='/register'className="btn btn-light me-2">New user Register</Link>
                <Link to='/login' className="btn btn-warning ">User Login</Link>
            </main>
        </div>
    )
}