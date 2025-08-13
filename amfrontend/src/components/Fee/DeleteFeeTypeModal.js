import { Modal, Button } from 'react-bootstrap';
import dangericon from '../../static/danger-icon.png';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DeleteFeeTypeModal = ({ show, onClose, onSubmit, feeTypeList}) => {
    const [step, setStep] = useState(1);
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [selectedFeeName, setSelectedFeeName] = useState(null);

    useEffect(() => {
        if(show){
            setStep(1);
            setSelectedFeeName(null);
        }
    }, [show, selectedFeeName]);

    const handleNextStep = () => {
        if(!selectedFeeType){
            toast.error("Vui lòng chọn khoản phí để xóa!");
            return;
        }
        setStep(2);
    }

    const handleClose = () => {
        setStep(1);
        setSelectedFeeType(null);
        onClose();
    }
    const handleSubmit = () => {
        onSubmit(selectedFeeType.typeId);
    }
    return (
        <>
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <img 
                    src={dangericon}
                    width="40"
                    height="40"
                    className="mx-3"
                    alt="Alert"
                    />
                    Xóa khoản phí
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 &&(
                    <div className='form-group pt-3 pb-3'>
                        <label>Chọn khoản phí(<span className='redC'>*</span>):</label>
                        <select
                            className='form-select'
                            name='selectedFeeName'
                            value={selectedFeeName}
                            onChange={(e) => {
                                setSelectedFeeName(e.target.value);
                                const selected = e.target.value;
                                const typeObj = feeTypeList.find(t => t.feeName === selected);
                                setSelectedFeeType(typeObj);
                            }}
                        >
                            <option>Tùy chọn</option>
                            {feeTypeList?.map((type) => (
                                <option key={type.typeId} value={type.feeName}>{type.feeName}</option>
                            ))}
                        </select>
                    </div>
                )}
                {step === 2 && (
                    <h6>Bạn có chắc chắn muốn xóa khoản phí "{selectedFeeType.feeName}"?</h6>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn' variant="secondary" onClick={handleClose}>Hủy</Button>
                {step === 1 && (
                    <Button className='savebtn' variant="primary" onClick={handleNextStep}>Tiếp tục</Button>
                )}
                {step === 2 && (
                    <Button className='savebtn' variant="success" onClick={handleSubmit}>Xác nhận</Button>
                )}
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default DeleteFeeTypeModal;