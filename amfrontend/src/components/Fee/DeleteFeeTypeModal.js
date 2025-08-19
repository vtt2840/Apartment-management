import { Modal, Button } from 'react-bootstrap';
import dangericon from '../../static/danger-icon.png';
import { useState, useEffect } from 'react';

const DeleteFeeTypeModal = ({ show, onClose, onSubmit, selectedFeeType}) => {
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
                <h6>Bạn có chắc chắn muốn xóa khoản phí "{selectedFeeType?.feeName}"?</h6>
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn' variant="secondary" onClick={onClose}>Hủy</Button>
                <Button className='savebtn' variant="success" onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default DeleteFeeTypeModal;