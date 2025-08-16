import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const UpdateApartmentModal = ({ show, onClose, onSubmit, apartment }) => {
    const [formData, setFormData] = useState({
        apartmentCode: '',
        floor: '',
        area: '',
    });

    useEffect(() => {
        if (show && apartment) {
            setFormData({
                apartmentCode: apartment.apartmentCode || '',
                floor: apartment.floor || '',
                area: apartment.area || '',
            });
        }
    }, [show, apartment]);

    const defaultValidInput = {
        isValidApartmentCode: true,
        isValidFloor: true,
        isValidArea: true,
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    //check input valid
    const isValidInputs = async () => {
        setObjCheckInput(defaultValidInput);
        if(!formData.floor){
            toast.error("Số tầng không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidDateOfBirth: false });
            return false;
        }
        if(!formData.area){
            toast.error("Diện tích không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidGender: false });
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
        <Modal show={show} onHide={onClose} className='modal-user' centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa thông tin căn hộ {apartment?.apartmentCode} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Tầng(<span className='redC'>*</span>):</label>
                        <input type="number" className={objCheckInput.isValidFloor ? 'form-control' : 'form-control is-invalid'} 
                            name="floor" value={formData.floor} placeholder="Số tầng" onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Diện tích(<span className='redC'>*</span>):</label>
                        <input type="text" className={objCheckInput.isValidArea ? 'form-control' : 'form-control is-invalid'} 
                            name="area" value={formData.area} placeholder="Diện tích" onChange={handleChange}
                        />
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

export default UpdateApartmentModal;
