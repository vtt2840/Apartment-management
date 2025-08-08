import { Modal, Button } from 'react-bootstrap';

const CancelRegisterTempModal = ({ show, onClose, onSubmit, resident, name }) => {
    
    const handleSubmit = async() => {
        const data = {
            resident_id: resident
        }
        onSubmit(data);
    };

    return (
        <>
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Hủy đăng ký tạm trú/tạm vắng 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>Bạn có chắc chắn muốn hủy đăng ký cho cư dân {name} ?</h6>
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn' variant="secondary" onClick={onClose}>Hủy</Button>
                <Button className='savebtn' variant="primary" onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default CancelRegisterTempModal;
