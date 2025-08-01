import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TemporaryAbsenceDetailModal = ({ show, onClose, data }) => {
  return (
    <Modal show={show} onHide={onClose} className='modal-user' centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết tạm vắng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data ? (
          <>
            <p><strong>Từ ngày:</strong> {data.startDate}</p>
            <p><strong>Đến ngày:</strong> {data.endDate}</p>
            <p><strong>Lý do:</strong> {data.reason}</p>
            <p><strong>Nơi đến:</strong> {data.destination}</p>
          </>
        ) : <p>Không có dữ liệu.</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TemporaryAbsenceDetailModal;
