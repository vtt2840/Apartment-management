import { Modal, Button } from 'react-bootstrap';
import dangericon from '../../static/danger-icon.png';

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
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
                <Button variant="primary" onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default CancelRegisterTempModal;
