import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { fetchPaymentTransaction } from '../../services/userService';

const PaymentTransactionModal = ({show, onClose, apartmentFee}) => {
    const [formData, setFormData] = useState({
        feeName: '',
        amount: '',
        transactionId: '',
        paymentDate: '',
    });

    useEffect(()=> {
        if(show && apartmentFee){
            const id = apartmentFee.apartmentFeeId;
            const fetchFee = async() => {
                const res = await fetchPaymentTransaction(id);
                const fee = res.data.results[0];
                setFormData({
                    feeName: fee?.feeName,
                    amount: fee?.amount,
                    transactionId: fee?.transactionId,
                    paymentDate: fee?.paymentDate,
                })
            }
            fetchFee();
        }
        
    }, [show, apartmentFee]);

    return(
        <>
        <Modal show={show} onHide={onClose} className='modal-vehicle' centered>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Tên khoản phí:</label>
                        <input type='text' className='form-control'
                            name='feeName' value={formData.feeName} 
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Số tiền:</label>
                        <input type='text' className='form-control'
                            name='amount' value={formData.amount} 
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Mã giao dịch:</label>
                        <input type='text' className='form-control'
                            name='transactionId' value={formData.transactionId} 
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Ngày thanh toán:</label>
                        <input type='text' className='form-control'
                            name='dueDate' value={formData.paymentDate} placeholder='Ngày thanh toán'
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn' variant='secondary' onClick={onClose}>Đóng</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default PaymentTransactionModal;