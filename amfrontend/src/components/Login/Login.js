import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, resetpassword } from '../../services/userService'
import { useState } from 'react';
import logo from '../../static/logo.jpeg';
import { loginSuccess } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import SendEmailModal from './SendEmailModal';

const Login = (props) => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        email:"",
        password:""
    })

    const handleLogin = async () => {
        try {
            const response = await loginUser(formData);

            console.log(response.data);

            const email = response.data.user.email;
            const role = response.data.user.role;
            const apartment = response.data.user.apartment;

            const userData = {
                email,
                role,
                apartment
            };

            dispatch(loginSuccess(userData));
            localStorage.setItem('auth', JSON.stringify(userData));

            console.log("Login success:", response.data.message);
            toast.success("Đăng nhập thành công!");
            navigate('/');
        } catch (err) {
            toast.error("Email hoặc mật khẩu không hợp lệ!");
            if (err.response && err.response.status === 400) {
                console.log("Login error:", err.response.data);
            } else {
                console.log("Server connection error");
            }
        }
    };

    const handlePressEnter = (event)=> {
        if(event.code === "Enter"){
            handleLogin();
        }
    }

    const handleSendEmail = () => {
        setShowModal(true);
    }
    const handleSubmitEmail = async(email) =>{
        //proceed send email to reset pasword
        
        //if not found email show toast "email không tồn tại
        try {
            await resetpassword(email);
            setShowModal(false);
            toast.success('Vui lòng kiểm tra email để đặt lại mật khẩu.');
        } catch (error) {
            if (error.response?.data?.email) {
                toast.error(`Lỗi: ${error.response.data.email}`);
            } else {
                toast.error('Có lỗi xảy ra. Hãy thử lại.');
            }
        }
    }


    return (
            <div className='container mt-5'>
                <div className='row mx-auto'>
                    <div className='col-12 col-md-4 mx-auto text-center d-flex flex-column gap-4'>
                            <img 
                                src={logo}
                                width="140"
                                height="140"
                                className="mx-auto"
                                alt="Skylake logo"
                            />
                            <h4>Đăng nhập vào hệ thống Skylake</h4>
                            <input
                                type='email'
                                style={{ borderWidth: '1.3px' }}
                                className='form-control'
                                placeholder='Email'
                                value={formData.email}
                                onChange={(event) => {setFormData({ ...formData, email: event.target.value })}}
                            />
                            <input
                                type='password'
                                style={{ borderWidth: '1.3px' }}
                                className='form-control'
                                placeholder='Mật khẩu'
                                value={formData.password}
                                onChange={(event) => {setFormData({ ...formData, password: event.target.value })}}
                                onKeyDown={(event) => handlePressEnter(event)}
                            />
                            <button className='btn btn-primary' onClick={handleLogin}>Đăng nhập</button>  
                            <span className='text-center'>
                                <a className='forgot-password' onClick={handleSendEmail}>Quên mật khẩu?</a>
                            </span>               
                    </div>
                </div>
                <SendEmailModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmitEmail}
                />
            </div>

    )
}

export default Login;