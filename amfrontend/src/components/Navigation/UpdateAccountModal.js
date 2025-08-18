import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const UpdateAccountModal = ({ show, onClose, onSubmit, username, email, apartmentCode }) => {
    const role = useSelector(state => state.auth.role);
    const [step, setStep] = useState(1); 

    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });

    useEffect(() => {
        if(show){
            setFormData({
                username: username || '',
                email: email || '',
            });
            setStep(1);
            }
        }, [show, username, email, apartmentCode]);

    const handleNextStep = () => {
        setStep(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    

    const defaultValidInput = {
        isValidUsername: true,
        isValidEmail: true
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    
    const isValidInputs = async () => {
        setObjCheckInput(defaultValidInput);
        if(role === 'admin'){
            if(!formData.username){
                toast.error("Tên tài khoản không được để trống!");
                setObjCheckInput({ ...defaultValidInput, isValidUsername: false });
                return false;
            }
            if(!formData.email){
                toast.error("Email không được để trống!");
                setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
                return false;
            }
        }
        return true;
    }


    const handleSubmit = async() => {
        let check = await isValidInputs();
        if(check === true){
            onSubmit(formData);
        }
    };

    const handleClose = () => {
        setStep(1);
        setFormData({ username: username || '', email: email || '', });
        onClose();
    };

    return (
        <>
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin tài khoản</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && (
                    <>
                    <div>Mã căn hộ: {apartmentCode}</div>
                    <div className='form-group mb-3'>
                        {role === 'admin' && (<label>Tên tài khoản:</label>)}
                        {role === 'resident' && (<label>Chủ hộ:</label>)}
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                        />
                    </div>
                    <div className='form-group mb-3'>
                        <label>Email:</label>
                        <input
                            type='text'
                            name='email'
                            className='form-control'
                            value={formData.email}
                        />
                    </div>
                    </>
                )}
                {step === 2 && (
                    <>
                        {role === 'admin' && (
                        <div className='form-group mb-3'>
                            <label>Tên tài khoản(<span className='redC'>*</span>):</label>
                            <input
                                type="text"
                                name="username"
                                className={objCheckInput.isValidUsername ? 'form-control' : 'form-control is-invalid'}
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>)}
                        {role === 'admin' &&(
                        <div className='form-group mb-3'>
                            <label>Email(<span className='redC'>*</span>):</label>
                            <input
                                type="text"
                                name="email"
                                className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>)}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn'  variant="secondary" onClick={handleClose}>Đóng</Button>
                {step === 1 && role === 'admin' && (
                    <Button className='savebtn' variant="primary" onClick={handleNextStep}>Chỉnh sửa</Button>
                )}
                {step === 2 && (
                    <Button className='savebtn' variant="success" onClick={handleSubmit}>Lưu</Button>
                )}
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default UpdateAccountModal ;
