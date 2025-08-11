import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const UpdateApartmentFeeModal = ({show, onClose, onSubmit, feeName, month, apartmentCode, amount, dueDate}) => {
    const [formData, setFormData] = useState({
        amount: '',
        dueDate: '',
    });

    useEffect(()=> {
        if(show && apartmentCode && feeName && month){
            setFormData({
                amount: amount,
                dueDate: dueDate,
            });
        }
    }, [show, apartmentCode, feeName, month]);

    const defaultValidInput = {
        isValidAmount: true,
        isValidDueDate: true,
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    const isValidInputs = async() => {
        setObjCheckInput(defaultValidInput);
        if(!formData.amount){
            toast.error("Số tiền không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidAmount: false});
            return false;
        }
        if(formData.amount <= 0){
            toast.error("Số tiền phải là số dương!");
            setObjCheckInput({...defaultValidInput, isValidAmount: false});
            return false;
        }
        if(!formData.dueDate){
            toast.error("Hạn nộp không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidDueDate: false});
            return false;
        }
        return true;
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async() => {
        let check = await isValidInputs();
        if(check === true){
            onSubmit(formData);
        }
    }

    return(
        <>
        <Modal show={show} onHide={onClose} className='modal-vehicle' centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa khoản phí: {feeName} {month} căn hộ {apartmentCode}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Số tiền(<span className='redC'>*</span>):</label>
                        <input type='number' className={objCheckInput.isValidAmount ? 'form-control' : 'form-control is-invalid'}
                            name='amount' value={formData.amount} placeholder='Số tiền' onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Hạn nộp(<span className='redC'>*</span>):</label>
                        <input type='date' className={objCheckInput.isValidDueDate ? 'form-control' : 'form-control is-invalid'}
                            name='dueDate' value={formData.dueDate} placeholder='Hạn nộp' onChange={handleChange}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn' variant='secondary' onClick={onClose}>Hủy</Button>
                <Button className='savebtn' variant='primary' onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default UpdateApartmentFeeModal;