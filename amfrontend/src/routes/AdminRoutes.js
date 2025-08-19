import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const role = useSelector(state => state.auth.role);
    return role === 'admin' ? children : <Navigate to="/fee" />;
};
export default AdminRoute;
