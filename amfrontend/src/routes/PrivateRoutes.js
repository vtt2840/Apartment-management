import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
};
// const PrivateRoute = ({ children, allowedRoles }) => {
//     const { isAuthenticated, role } = useSelector(state => state.auth);

//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }

//     if (allowedRoles && !allowedRoles.includes(role)) {
//         return <Navigate to="/" replace />; // hoặc redirect về trang riêng
//     }

//     return children;
// };
export default PrivateRoute;
