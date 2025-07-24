import { Routes, Route } from 'react-router-dom';
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import PrivateRoute from './PrivateRoutes';
import Apartment from '../components/Apartment/Apartment';

const AppRoutes = (props) => {
    return(
        <>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
            <Route path="/apartments" element={<PrivateRoute><Apartment/></PrivateRoute>}/>
        </Routes>
        </>
    )
}

export default AppRoutes;