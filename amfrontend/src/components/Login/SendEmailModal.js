import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SendEmailModal = ({ show, onClose, onSubmit }) => {
    
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (show) {
            setEmail('');
        }
    }, [show, apartmentCode]);

    const defaultValidInput = {
        isValidEmail: true,
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    
    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput);
        if(!email){
            toast.error("Email không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidEmail: false });
            return false;
        }
        let regx = /\S+@\S+\.\S+/;
        if(!regx.test(email)){
            setObjCheckInput({...defaultValidInput, isValidEmail: false });
            toast.error("Email không đúng định dạng!");
            return false;
        }
        return true;
    }

    const handleSubmit = () => {
        let check = isValidInputs();
        if(check === true){
            onSubmit(email);
        }
    };


    return (
      <>
        <Modal show={show} onHide={onClose} className='modal-user' centered>
            <Modal.Header closeButton>
                <Modal.Title>Nhập email để lấy lại mật khẩu:</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                    <div className='col-12 form-group pt-3 pb-3'>
                        <input type="text" className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'} 
                            name="email" value={email} placeholder="Email" onChange={(event)=> setEmail(event.target.value)}
                        />
                    </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
                <Button variant="primary" onClick={handleSubmit}>Gửi</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default SendEmailModal;
