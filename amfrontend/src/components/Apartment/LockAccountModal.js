import { Modal, Button } from 'react-bootstrap';
import dangericon from '../../static/danger-icon.png';
import { accountByApartment } from '../../services/userService';

const LockAccountModal = ({ show, onClose, onSubmit, apartmentCode }) => {
    
    const handleSubmit = async() => {
        const res = await accountByApartment(apartmentCode);
        const data = {
            apartment_code: apartmentCode,
            account_id: res.data.pkid
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
                    Khóa tài khoản căn hộ {apartmentCode} 
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h6>Tài khoản sau khi khóa sẽ không thể truy cập vào hệ thống.</h6>
                <h6>Bạn có chắc chắn muốn khóa tài khoản căn hộ này?</h6>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
                <Button variant="primary" onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default LockAccountModal;
