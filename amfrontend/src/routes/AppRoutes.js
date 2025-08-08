import { Routes, Route } from 'react-router-dom';
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import PrivateRoute from './PrivateRoutes';
import Apartment from '../components/Apartment/Apartment';
import ResetPasswordPage from '../components/Login/ResetPasswordPage';
import Resident from '../components/Resident/Resident';
import Vehicle from '../components/Vehicle/Vehicle';
import Fee from '../components/Fee/Fee';

const AppRoutes = (props) => {
    return(
        <>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/reset-password" element={<ResetPasswordPage/>} />
            <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
            <Route path="/apartments" element={<PrivateRoute><Apartment/></PrivateRoute>}/>
            <Route path="/residents" element={<PrivateRoute><Resident/></PrivateRoute>}/>
            <Route path="/vehicles" element={<PrivateRoute><Vehicle/></PrivateRoute>}/>
            <Route path="/fee" element={<PrivateRoute><Fee/></PrivateRoute>}/>
        </Routes>
        </>
    )
}

export default AppRoutes;