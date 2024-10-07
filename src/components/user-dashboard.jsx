import axios from "axios";  // Axios for HTTP requests
import { useFormik } from "formik";  // Formik for handling form state and validation
import { useEffect, useState } from "react";  // React hooks for state and lifecycle methods
import { useCookies } from "react-cookie";  // React-cookie for handling cookies
import { Link, useNavigate } from "react-router-dom";  // React Router for navigation

export function UserDashboard() {
    const [cookies, setCookie, removeCookie] = useCookies(['userid']);  // Retrieve and manage user ID cookie
    let navigate = useNavigate();  // For navigating between routes

    // State for storing tasks and the task being edited
    const [tasks, setTasks] = useState([{TaskId:0, TaskTitle:'', Description:'', Date:Date(),TaskStatus:'', UserId:''}]);
    const [editTask, setEditTask] = useState([{ TaskId:0, TaskTitle:'', Description:'', Date:Date(),TaskStatus:'', UserId:'' }]);

    // Formik for adding a new task
    const formik = useFormik({
        initialValues: {
            TaskId: 0,
            TaskTitle: '',
            Description: '',
            Date: '',
            TaskStatus:'',
            UserId: cookies['userid']  // Assign user ID from cookie
        },
        onSubmit: (task) => {  // Submit handler for adding a new task
            axios.post('http://127.0.0.1:3300/add-task',task)  // Send POST request to add task
                .then(() => {
                    alert('Task Added Successfully');  // Alert on success
                    window.location.reload();  // Reload the page to show updated tasks
                });
        }
    });

    // Formik for editing an existing task
    const editFormik = useFormik({
        initialValues: {
            TaskId: editTask?.[0]?.TaskId || 0,  // Use editTask state to pre-fill form
            TaskTitle: editTask?.[0]?.TaskTitle || '',
            Description: editTask?.[0]?.Description || '',
            Date: editTask?.[0]?.Date ? new Date(editTask[0].Date).toISOString().substr(0, 10) : '',  // Format date
            TaskStatus: editTask?.[0]?.TaskStatus || '',
            UserId: cookies['userid']  // Assign user ID from cookie
        },
        onSubmit: (tasks) => {  // Submit handler for editing a task
            axios.put(`http://127.0.0.1:3300/edit-task/${tasks.TaskId}`, tasks)  // Send PUT request to update task
                .then(() => {
                    alert('Updated Successfully');  // Alert on success
                    window.location.reload();  // Reload the page to show updated tasks
                })
                .catch(error => {
                    console.error('Update failed', error);  // Log error in console
                    alert('Update failed, please try again.');  // Alert on failure
                });
        },
        enableReinitialize: true  // Allow form to reset its values when editTask changes
    });

    // Function to load tasks for the current user
    function LoadTasks() {
        axios.get(`http://127.0.0.1:3300/get-task/${cookies['userid']}`)  // Fetch tasks based on user ID
            .then(response =>{
                setTasks(response.data);  // Set tasks state with fetched data
            });
    }

    useEffect(() => {
        LoadTasks();  // Load tasks when component mounts
    },[]);

    // Function to handle user signout
    function handleSignout() {
        removeCookie('userid');  // Remove the user ID cookie
        navigate('/');  // Redirect to the homepage
    }

    // Function to remove a task by its ID
    function handleRemoveClick(id) {
        axios.delete(`http://127.0.0.1:3300/remove-task/${id}`)  // Send DELETE request to remove task
            .then(() => {
                alert('Task Removed');  // Alert on success
            });
            window.location.reload();  // Reload the page to show updated tasks
    }

    // Function to load task data into the form for editing
    function handleEditClick(id) {
        axios.get(`http://127.0.0.1:3300/tasks/${id}`)  // Fetch the task by ID
            .then(response => {
                setEditTask(response.data);  // Set editTask state with fetched task data
            });
    }

    return (
        <div className="row pt-4">
            <div className="col-7">
                {/* Button to trigger Add Task modal */}
                <button data-bs-target="#AddTask" data-bs-toggle="modal" style={{ marginLeft: '650px', marginTop: '50px' }} className="bi bi-calendar btn btn-warning">
                    Add Task
                </button>
                
                {/* Add Task  */}
                <div className="modal fade" id="AddTask">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={formik.handleSubmit}>  {/* Formik for task submission */}
                                <div className="modal-header">
                                    <h2>Add New Task</h2>
                                    <button type="button" className="btn btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body">
                                    <dl>
                                        <dt>Task Id</dt>
                                        <dd><input type="number" name="TaskId" className="form-control"  onChange={formik.handleChange} /></dd>
                                        <dt>Task Title</dt>
                                        <dd><input type="text" name="TaskTitle" onChange={formik.handleChange} className="form-control" /></dd>
                                        <dt>Description</dt>
                                        <dd><textarea className="form-control" name="Description" onChange={formik.handleChange} rows="4" cols="40"></textarea></dd>
                                        <dt>Date</dt>
                                        <dd><input type="date" className="form-control" name="Date" onChange={formik.handleChange} /></dd>
                                        <dt>Task Status</dt>
                                        <d>
                                           <select name="TaskStatus" onChange={formik.handleChange} className="form-control" value={formik.values.TaskStatus}>
                                             <option value="">Select Status</option>
                                             <option value="pending">Pending</option>
                                             <option value="completed">Completed</option>
                                           </select>

                                        </d>
                                    </dl>
                                </div>
                                <div className="modal-footer">
                                    <button data-bs-dismiss="modal" className="bi bi-calendar-date btn btn-info">Add Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-5 ">
                <h3>{cookies['userid']} - Dashboard <button onClick={handleSignout} className="btn btn-danger">Signout</button></h3>  {/* Display user ID and signout button */}
                
                <div className="mt-4">
                    {
                        tasks.map(task =>  // Map over tasks to display each one
                            <div key={task.TaskId} className="alert alert-success alert-dismissible">
                                <button onClick={()=> {handleRemoveClick(task.TaskId)}} data-bs-dismiss="alert" className="btn btn-close"></button>  {/* Button to remove task */}
                                <h2 className="alert-title">{task.TaskTitle}</h2>
                                <p className="alert-text">{task.Description}</p>
                                <p>{task.Date}</p>
                                <p className="alert-text font-color">{task.TaskStatus}</p>
                                <button onClick={()=> {handleEditClick(task.TaskId)}} data-bs-target="#EditTask" data-bs-toggle="modal" className="btn btn-warning bi bi-pen-fill">Edit Task</button>  {/* Button to edit task */}
                               <button onClick={()=> {handleRemoveClick(task.TaskId)}} className="btn btn-danger">Delete task</button>
                               {/* Edit Task Modal */}
                               <div className="modal fade" id="EditTask">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <form onSubmit={editFormik.handleSubmit}>  {/* Formik for editing task */}
                                                <div className="modal-header">
                                                    <h2>Edit Task</h2>
                                                    <button type="button" className="btn btn-close" data-bs-dismiss="modal"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <dl className="row">
                                                        <dt>Task Id</dt>
                                                        <dd>
                                                            <input type="number" onChange={editFormik.handleChange} name="TaskId" value={editFormik.values.TaskId || ''}/>  {/* Controlled input for TaskId */}
                                                        </dd>
                                                        <dt>Title</dt>
                                                        <dd>
                                                            <input type="text" onChange={editFormik.handleChange} name="TaskTitle" value={editFormik.values.TaskTitle || ''} />  {/* Controlled input for TaskTitle */}
                                                        </dd>
                                                        <dt>Description</dt>
                                                        <dd><textarea onChange={editFormik.handleChange} name="Description" value={editFormik.values.Description || ''} />  {/* Controlled input for Description */}
                                                        </dd>
                                                        <dt>Date</dt>
                                                        <dd><input type="date" onChange={editFormik.handleChange} name="Date" value={editFormik.values.Date ? new Date(editFormik.values.Date).toISOString().substr(0, 10) : ''} />  {/* Controlled input for Date */}
                                                        </dd>
                                                        <dt>Task Status</dt>
                                                        <dd> 
                                                        <select name="TaskStatus" onChange={editFormik.handleChange} className="form-control" value={editFormik.values.TaskStatus || ''}>
                                                            <option value="">Select Status</option>
                                                            <option value="pending">Pending</option>
                                                            <option  value="completed">Completed</option>
                                                        </select>
                                                        </dd>
                                                    </dl>
                                                    
                                                    <button to='/dashboard' type="submit" className="bi bi-floppy-fill btn btn-success">Save</button> {/* Save button */}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
