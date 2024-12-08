import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TaskHome } from './components/task-home';
import { UserLogin } from './components/user-login';
import { UserRegister } from './components/user-register';
import { UserDashboard } from './components/user-dashboard';
import { AddTask } from './components/add-task';
import { EditTask } from './components/edit-task';
import { UserError } from './components/user-error';

function App() {
  return (
    <div className="container-fluid task-background">
      
      
      <BrowserRouter>
      <section className='mt-0'>
      <Routes>
        <Route path='/' element={<TaskHome></TaskHome>}></Route>
        <Route path='/register' element={<UserRegister></UserRegister>}></Route>
        <Route path='/login' element={<UserLogin></UserLogin>}></Route>
        <Route path='/dashboard' element={<UserDashboard></UserDashboard>}></Route>
        <Route path="/addtask" element={<AddTask></AddTask>}></Route>
        <Route path="/edit-task/:id" element={<EditTask/>}></Route>
        
        <Route path="/error/user" element={<UserError></UserError>}></Route>
      </Routes>
      </section>
      </BrowserRouter>
    </div>
  );
}

export default App;
