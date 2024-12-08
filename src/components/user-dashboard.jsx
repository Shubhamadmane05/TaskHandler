import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

export function UserDashboard() {
    const [cookies, setCookie, removeCookie] = useCookies(['userid']);
    let navigate = useNavigate();
    const [tasks, setTasks] = useState([{ TaskId: 0, TaskTitle: '', Description: '', Date: Date(), TaskStatus: '', UserId: '' }]);
    const [editTask, setEditTask] = useState([{ TaskId: 0, TaskTitle: '', Description: '', Date: Date(), TaskStatus: '', UserId: '' }]);

    const formik = useFormik({
        initialValues: {
            TaskId: 0,
            TaskTitle: '',
            Description: '',
            Date: '',
            TaskStatus: '',
            UserId: cookies['userid']
        },
        onSubmit: (task) => {
            axios.post('http://127.0.0.1:3300/add-task', task)
                .then(() => {
                    alert('Task Added Successfully');
                    window.location.reload();
                });
        }
    });

    const editFormik = useFormik({
        initialValues: {
            TaskId: editTask?.[0]?.TaskId || 0,
            TaskTitle: editTask?.[0]?.TaskTitle || '',
            Description: editTask?.[0]?.Description || '',
            Date: editTask?.[0]?.Date ? new Date(editTask[0].Date).toISOString().substr(0, 10) : '',
            TaskStatus: editTask?.[0]?.TaskStatus || '',
            UserId: cookies['userid']
        },
        onSubmit: (tasks) => {
            axios.put(`http://127.0.0.1:3300/edit-task/${tasks.TaskId}`, tasks)
                .then(() => {
                    alert('Updated Successfully');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Update failed', error);
                    alert('Update failed, please try again.');
                });
        },
        enableReinitialize: true
    });

    function LoadTasks() {
        axios.get(`http://127.0.0.1:3300/get-task/${cookies['userid']}`)
            .then(response => {
                setTasks(response.data);
            });
    }

    useEffect(() => {
        LoadTasks();
    }, []);

    function handleSignout() {
        removeCookie('userid');
        navigate('/');
    }

    function handleRemoveClick(id) {
        axios.delete(`http://127.0.0.1:3300/remove-task/${id}`)
            .then(() => {
                alert('Task Removed');
                window.location.reload();
            });
    }

    function handleEditClick(id) {
        axios.get(`http://127.0.0.1:3300/tasks/${id}`)
            .then(response => {
                setEditTask(response.data);
            });
    }

    return (
        <div className="row pt-4">
            <div className="col-7">
                <button data-bs-target="#AddTask" data-bs-toggle="modal" style={{ marginLeft: '650px', marginTop: '50px' }} className="bi bi-calendar btn btn-warning">
                    Add Task
                </button>
                <div className="modal fade" id="AddTask">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={formik.handleSubmit}>
                                <div className="modal-header">
                                    <h2>Add New Task</h2>
                                    <button type="button" className="btn btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body">
                                    <dl>
                                        <dt>Task Id</dt>
                                        <dd><input type="number" name="TaskId" className="form-control" onChange={formik.handleChange} /></dd>
                                        <dt>Task Title</dt>
                                        <dd><input type="text" name="TaskTitle" onChange={formik.handleChange} className="form-control" /></dd>
                                        <dt>Description</dt>
                                        <dd><textarea className="form-control" name="Description" onChange={formik.handleChange} rows="4" cols="40"></textarea></dd>
                                        <dt>Date</dt>
                                        <dd><input type="date" className="form-control" name="Date" onChange={formik.handleChange} /></dd>
                                        <dt>Task Status</dt>
                                        <dd>
                                            <select name="TaskStatus" onChange={formik.handleChange} className="form-control" value={formik.values.TaskStatus}>
                                                <option value="">Select Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </dd>
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
            <div className="col-5">
                <h3>{cookies['userid']} - Dashboard <button onClick={handleSignout} className="btn btn-danger">Signout</button></h3>
                <div className="mt-4">
                    {tasks.map(task =>
                        <div key={task.TaskId} className="alert alert-success alert-dismissible">
                            <button onClick={() => { handleRemoveClick(task.TaskId) }} data-bs-dismiss="alert" className="btn btn-close"></button>
                            <h2 className="alert-title">{task.TaskTitle}</h2>
                            <p className="alert-text">{task.Description}</p>
                            <p>{task.Date}</p>
                            <p className="alert-text font-color">{task.TaskStatus}</p>
                            <button onClick={() => { handleEditClick(task.TaskId) }} data-bs-target="#EditTask" data-bs-toggle="modal" className="btn btn-warning bi bi-pen-fill">Edit Task</button>
                            <button onClick={() => { handleRemoveClick(task.TaskId) }} className="btn btn-danger">Delete task</button>
                            <div className="modal fade" id="EditTask">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <form onSubmit={editFormik.handleSubmit}>
                                            <div className="modal-header">
                                                <h2>Edit Task</h2>
                                                <button type="button" className="btn btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <div className="modal-body">
                                                <dl className="row">
                                                    <dt>Task Id</dt>
                                                    <dd>
                                                        <input type="number" onChange={editFormik.handleChange} name="TaskId" value={editFormik.values.TaskId || ''} />
                                                    </dd>
                                                    <dt>Title</dt>
                                                    <dd>
                                                        <input type="text" onChange={editFormik.handleChange} name="TaskTitle" value={editFormik.values.TaskTitle || ''} />
                                                    </dd>
                                                    <dt>Description</dt>
                                                    <dd><textarea onChange={editFormik.handleChange} name="Description" value={editFormik.values.Description || ''} /></dd>
                                                    <dt>Date</dt>
                                                    <dd><input type="date" onChange={editFormik.handleChange} name="Date" value={editFormik.values.Date ? new Date(editFormik.values.Date).toISOString().substr(0, 10) : ''} /></dd>
                                                    <dt>Task Status</dt>
                                                    <dd>
                                                        <select name="TaskStatus" onChange={editFormik.handleChange} className="form-control" value={editFormik.values.TaskStatus || ''}>
                                                            <option value="">Select Status</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="completed">Completed</option>
                                                        </select>
                                                    </dd>
                                                </dl>
                                                <button to='/dashboard' type="submit" className="bi bi-floppy-fill btn btn-success">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
