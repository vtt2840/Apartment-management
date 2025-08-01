import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CreateNewAccountModal = ({ show, onClose, onSubmit, apartmentCode }) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    
    useEffect(() => {
        if (show) {
            setFormData({
                email: '',
                username: '',
                password: '',
            });
            setConfirmPassword('');
        }
    }, [show, apartmentCode]);

    const defaultValidInput = {
        isValidEmail: true,
        isValidUsername: true,
        isValidPassword: true,
        isValidConfirmPassword: true
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);
    
    const isValidInputs = async () => {
        setObjCheckInput(defaultValidInput);
        if(!formData.email){
            toast.error("Email không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidEmail: false });
            return false;
        }
        let regx = /\S+@\S+\.\S+/;
        if(!regx.test(formData.email)){
            setObjCheckInput({...defaultValidInput, isValidEmail: false });
            toast.error("Email không đúng định dạng!");
            return false;
        }
        if(!formData.username){
            toast.error("Chủ hộ không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidUsername: false });
            return false;
        }
        if(!formData.password){
            toast.error("Mật khẩu không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidPassword: false });
            return false;
        }
        if (!(formData.password.length >= 8)) {
            toast.error("Mật khẩu phải chứa ít nhất 8 ký tự!");
            setObjCheckInput({...defaultValidInput, isValidPassword: false });
            return false;
        }

        if(formData.password !== confirmPassword){
            toast.error("Mật khẩu không trùng khớp!");
            setObjCheckInput({...defaultValidInput, isValidConfirmPassword: false });
            return false;
        }        
        return true;
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async () => {
        let check = await isValidInputs();
        if(check === true){
            onSubmit(formData);
        }
    };

    return (
      <>
        <Modal size="lg" show={show} onHide={onClose} className='modal-user' centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm tài khoản mới cho căn hộ {apartmentCode} </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Email(<span className='redC'>*</span>):</label>
                        <input type="text" className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'} 
                            name="email" value={formData.email} placeholder='Email' onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Chủ hộ(<span className='redC'>*</span>):</label>
                        <input type="text" className={objCheckInput.isValidUsername ? 'form-control' : 'form-control is-invalid'} 
                            name="username" value={formData.username} placeholder="Chủ hộ" onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Mật khẩu(<span className='redC'>*</span>):</label>
                        <input type="password" className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                            name="password" value={formData.password} placeholder="Mật khẩu" onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Nhập lại mật khẩu(<span className='redC'>*</span>):</label>
                        <input type="password" className={objCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'} 
                            name="confirmpassword" value={confirmPassword} placeholder="Nhập lại mật khẩu" onChange={(event)=> setConfirmPassword(event.target.value)}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
                <Button variant="primary" onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default CreateNewAccountModal;
