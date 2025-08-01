import { Modal, Button } from 'react-bootstrap';
import dangericon from '../../static/danger-icon.png';

const DeleteResidentModal = ({ show, onClose, onSubmit, resident, name }) => {
    
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
                    <img 
                    src={dangericon}
                    width="40"
                    height="40"
                    className="mx-3"
                    alt="Alert"
                    />
                    Xóa cư dân {name} 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>Bạn có chắc chắn muốn xóa cư dân này?</h6>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
                <Button variant="primary" onClick={handleSubmit}>Xóa</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default DeleteResidentModal;
