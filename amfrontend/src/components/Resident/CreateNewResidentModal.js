import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CreateNewResidentModal = ({ show, onClose, onSubmit, apartmentCode }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        hometown: '',
        phoneNumber: '',
        idNumber: '',
    });

    useEffect(() => {
        if (show) {
            setFormData({
                fullName: '',
                email: '',
                dateOfBirth: '',
                gender: '',
                hometown: '',
                phoneNumber: '',
                idNumber: '',
            });
        }
    }, [show, apartmentCode]);

    const defaultValidInput = {
        isValidFullname: true,
        isValidEmail: true,
        isValidDateOfBirth: true,
        isValidGender: true,
        isValidHometown: true,
        isValidPhoneNumber: true,
        isValidIdNumber: true,
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    //check input valid
    const isValidInputs = async () => {
        setObjCheckInput(defaultValidInput);
        if(!formData.fullName){
            toast.error("Họ tên không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidFullname: false });
            return false;
        }
        let regx = /\S+@\S+\.\S+/;
        if(formData.email){
            if(!regx.test(formData.email)){
                setObjCheckInput({...defaultValidInput, isValidEmail: false });
                toast.error("Email không đúng định dạng!");
                return false;
            }    
        }
        if(!formData.dateOfBirth){
            toast.error("Ngày sinh không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidDateOfBirth: false });
            return false;
        }
        if(!formData.gender){
            toast.error("Giới tính không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidGender: false });
            return false;
        }
        if(!formData.hometown){
            toast.error("Quê quán không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidHometown: false });
            return false;
        }
        if(formData.phoneNumber){
            if (!/^\d{10}$/.test(formData.phoneNumber)) {
                toast.error("Số điện thoại phải có 10 chữ số!");
                setObjCheckInput({ ...defaultValidInput, isValidPhoneNumber: false });
                return false;
            }
        }
        if(formData.idNumber){
            if (!/^\d{12}$/.test(formData.idNumber)) {
                toast.error("Số căn cước công dân phải có 12 chữ số!");
                setObjCheckInput({ ...defaultValidInput, isValidIdNumber: false });
                return false;
            }
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
                <Modal.Title>Thêm cư dân mới cho căn hộ {apartmentCode} </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Họ tên(<span className='redC'>*</span>):</label>
                        <input type="text" className={objCheckInput.isValidFullname ? 'form-control' : 'form-control is-invalid'} 
                            name="fullName" value={formData.fullName} placeholder="Họ tên" onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Email:</label>
                        <input type="text" className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'} 
                            name="email" value={formData.email} placeholder='Email' onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Ngày sinh(<span className='redC'>*</span>):</label>
                        <input type="date" className={objCheckInput.isValidDateOfBirth ? 'form-control' : 'form-control is-invalid'} 
                            name="dateOfBirth" value={formData.dateOfBirth} placeholder="Ngày sinh" onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Giới tính(<span className='redC'>*</span>):</label>
                        <select
                            className='form-select'
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option>Tùy chọn</option>
                            <option defaultValue="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Quê quán(<span className='redC'>*</span>):</label>
                        <input type="text" className={objCheckInput.isValidHometown ? 'form-control' : 'form-control is-invalid'} 
                            name="hometown" value={formData.hometown} placeholder="Quê quán" onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Số điện thoại:</label>
                        <input type="text" className={objCheckInput.isValidPhoneNumber ? 'form-control' : 'form-control is-invalid'} 
                            name="phoneNumber" value={formData.phoneNumber} placeholder="Số điện thoại" onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Căn cước công dân:</label>
                        <input type="text" className={objCheckInput.isValidIdNumber ? 'form-control' : 'form-control is-invalid'} 
                            name="idNumber" value={formData.idNumber} placeholder="Số căn cước công dân" onChange={handleChange}
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

export default CreateNewResidentModal;
