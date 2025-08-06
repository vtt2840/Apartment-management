import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { resetconfirm } from '../../services/userService';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage = () => {
    const query = useQuery();
    const uid = query.get('uid');
    const token = query.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const showPasswordVisiblity = () => {
        setShowPassword(showPassword ? false : true);
    }
    const showConfirmPasswordVisiblity = () => {
        setConfirmPassword(showConfirmPassword ? false : true);
    }

    const navigate = useNavigate();

    const defaultValidInput = {
        isValidPassword: true,
        isValidConfirmPassword: true
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);
    
    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput);
        if(!password){
            toast.error("Mật khẩu không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidPassword: false });
            return false;
        }
        
        if(password !== confirmPassword){
            toast.error("Mật khẩu không trùng khớp!");
            setObjCheckInput({...defaultValidInput, isValidConfirmPassword: false });
            return false;
        }
        return true;
    }
    
    const handleReset = async () => {
        let check = isValidInputs();
        if(check === true){
            try {
                await resetconfirm(uid, token, password);
                toast.success("Đặt lại mật khẩu thành công!");
                navigate('/login');
            } catch (err) {
                toast.error("Có lỗi xảy ra, vui lòng thử lại!");
            }
        }
    };

    const handlePressEnter = (event)=> {
        if(event.code === "Enter"){
            handleReset();
        }
    }

    return (
        <div className='container-reset'>
            <div className='row mx-auto'>
                <div className='col-12 col-md-4 mx-auto text-center d-flex flex-column gap-4'>
                    <h4>Nhập mật khẩu mới</h4>
                    <div className='position-relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            style={{ borderWidth: '1.3px' }}
                            className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                            placeholder='Mật khẩu mới'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i className={`fa ${showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}`} 
                            onClick={showPasswordVisiblity}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                right: '20px',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#5a5555'
                            }}
                        />
                    </div>
                    <div className='position-relative'>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            style={{ borderWidth: '1.3px' }}
                            className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                            placeholder='Nhập lại mật khẩu'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyDown={(event) => handlePressEnter(event)}
                        />
                        <i className={`fa ${showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}`} 
                            onClick={showConfirmPasswordVisiblity}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                right: '20px',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#5a5555'
                            }}
                        />
                    </div>
                    <button className='btn btn-primary' onClick={handleReset}>Lưu</button>              
                </div>
            </div>
        </div>    
    );
}

export default ResetPasswordPage;
