import { Routes, Route } from 'react-router-dom';
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import AdminRoute from './AdminRoutes';
import PrivateRoute from './PrivateRoutes';
import Apartment from '../components/Apartment/Apartment';
import ResetPasswordPage from '../components/Login/ResetPasswordPage';
import Resident from '../components/Resident/Resident';
import Vehicle from '../components/Vehicle/Vehicle';
import Fee from '../components/Fee/Fee';
import Payment from '../components/Fee/Payment';
import FeeType from '../components/Fee/FeeType';
import Statistics from '../components/Fee/Statistics';

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
            <Route path="/payment" element={<PrivateRoute><Payment/></PrivateRoute>}/>
            <Route path="/feetype" element={<PrivateRoute><FeeType/></PrivateRoute>}/>
            <Route path="/statistics" element={<PrivateRoute><AdminRoute><Statistics/></AdminRoute></PrivateRoute>}/>
        </Routes>
        </>
    )
}

export default AppRoutes;