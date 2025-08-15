import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ChangePasswordModal = ({ show, onClose, onSubmit }) => {
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const showOldPasswordVisiblity = () => {
        setShowOldPassword(showOldPassword ? false : true);
    }

    const showNewPasswordVisiblity = () => {
        setShowNewPassword(showNewPassword ? false : true);
    }
    const showConfirmPasswordVisiblity = () => {
        setShowConfirmPassword(showConfirmPassword ? false : true);
    }
    
    useEffect(() => {
        if (show) {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [show]);

    const defaultValidInput = {
        isValidOldPassword: true,
        isValidNewPassword: true,
        isValidConfirmPassword: true
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);
    
    const isValidInputs = async () => {
        setObjCheckInput(defaultValidInput);
        
        if(!oldPassword){
            toast.error("Mật khẩu cũ không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidOldPassword: false });
            return false;
        }
        if(!newPassword){
            toast.error("Mật khẩu mới không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidNewPassword: false });
            return false;
        }
        if(!(newPassword.length >= 8)){
            toast.error("Mật khẩu phải chứa ít nhất 8 ký tự!");
            setObjCheckInput({...defaultValidInput, isValidNewPassword: false });
            return false;
        }
        if(newPassword !== confirmPassword){
            toast.error("Mật khẩu không trùng khớp!");
            setObjCheckInput({...defaultValidInput, isValidConfirmPassword: false });
            return false;
        }        
        if(oldPassword === newPassword){
            toast.error("Mật khẩu mới trùng với mật khẩu cũ!");
            setObjCheckInput({...defaultValidInput, isValidNewPassword: false});
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        let check = await isValidInputs();
        if(check === true){
            const data = {
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmNewPassword: confirmPassword
            }
            onSubmit(data);
        }
    };
    const handlePressEnter = (event)=> {
        if(event.code === "Enter"){
            handleSubmit();
        }
    }

    return (
      <>
        <Modal show={show} onHide={onClose} className='modal-user' centered>
            <Modal.Header closeButton>
                <Modal.Title>Đổi mật khẩu</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className='content-body row'>
                    <div className='form-group pt-3 pb-3 px-4 position-relative'>
                        <label>Mật khẩu cũ(<span className='redC'>*</span>):</label>
                        <input type={showOldPassword ? "text" : "password"} className={objCheckInput.isValidOldPassword ? 'form-control' : 'form-control is-invalid'}
                            name="oldPassword" value={oldPassword} placeholder="Mật khẩu cũ" onChange={(event) => setOldPassword(event.target.value)}
                        />
                        <i className={`fa ${showOldPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}`} 
                            onClick={showOldPasswordVisiblity}
                            style={{
                                position: 'absolute',
                                top: '53%',
                                right: '40px',
                                cursor: 'pointer',
                                color: '#878585'
                        }}/>
                    </div>
                    <div className='form-group pt-3 pb-3 px-4 position-relative'>
                        <label>Mật khẩu mới(<span className='redC'>*</span>):</label>
                        <input type={showNewPassword ? "text" : "password"} className={objCheckInput.isValidNewPassword ? 'form-control' : 'form-control is-invalid'}
                            name="newPassword" value={newPassword} placeholder="Mật khẩu mới" onChange={(event) => setNewPassword(event.target.value)}
                        />
                        <i className={`fa ${showNewPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}`} 
                            onClick={showNewPasswordVisiblity}
                            style={{
                                position: 'absolute',
                                top: '53%',
                                right: '40px',
                                cursor: 'pointer',
                                color: '#878585'
                        }}/>
                    </div>
                    <div className='form-group pt-3 pb-3 px-4 position-relative'>
                        <label>Nhập lại mật khẩu mới(<span className='redC'>*</span>):</label>
                        <input type={showConfirmPassword ? "text" : "password"} className={objCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'} 
                            name="confirmpassword" value={confirmPassword} placeholder="Nhập lại mật khẩu" onChange={(event)=> setConfirmPassword(event.target.value)}
                            onKeyDown={(event) => handlePressEnter(event)}
                        />
                        <i className={`fa ${showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}`} 
                            onClick={showConfirmPasswordVisiblity}
                            style={{
                                position: 'absolute',
                                top: '53%',
                                right: '40px',
                                cursor: 'pointer',
                                color: '#878585'
                        }}/>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn' variant="secondary" onClick={onClose}>Hủy</Button>
                <Button className='savebtn' variant="primary" onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default ChangePasswordModal;
