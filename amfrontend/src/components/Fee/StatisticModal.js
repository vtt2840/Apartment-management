import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { getAllFeeTypes, getNewFeeCollection } from '../../store/slices/feeSlice';

const StatisticModal = ({ show, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const feeTypeList = useSelector(state => state.fee.feeTypeList);
    const feeList = useSelector(state => state.fee.feeList); // lấy từ store khi gọi API
    const [step, setStep] = useState(1);
    const [selectedFees, setSelectedFees] = useState([]);
    const [showFee, setShowFee] = useState(null);

    const [formData, setFormData] = useState({
        month: '',
        year: '',
        feeCollection: [] // chứa toàn bộ feeList của tất cả selectedFees
    });

    const [tempFormData, setTempFormData] = useState({
        feeCollection: [] // chỉ chứa feeList của 1 feeType đang xem
    });

    // Reset khi mở modal
    useEffect(() => {
        if (show) {
            setFormData({ month: '', year: '', feeCollection: [] });
            setSelectedFees([]);
            setShowFee(null);
            setStep(1);
        }
    }, [show]);

    // Lấy danh sách feeType sau khi chọn tháng/năm
    useEffect(() => {
        if (formData.month && formData.year) {
            dispatch(getAllFeeTypes({
                page_size: 1000,
                month: formData.month,
                year: formData.year,
                statistic: true,
            }));
        }
    }, [formData.month, formData.year]);

    // Khi click button khoản phí → gọi API lấy chi tiết ApartmentFee
    const handleShowFee = async (feeId) => {
        setShowFee(feeId);
        const res = await dispatch(getNewFeeCollection({
            page_size: 1000,
            apartment_code: null,
            isRequired: null,
            status: null,
            dueDate:null,
            month: formData.month,
            year: formData.year,
            feeName: feeTypeList.find(f => f.typeId === feeId.typeId)?.feeName
        }));

        console.log(feeList);
        // feeList lấy từ Redux sau dispatch
        const feeType = feeTypeList.find(f => f.typeId === feeId);
        const newFeeData = {
            typeId: feeId,
            dueDate: '',
            apartments: feeList.map(fee => ({
                apartmentCode: fee.apartmentCode,
                amount: fee.amount
            }))
        };

        // Lưu bảng tạm (chỉ khoản phí đang xem)
        setTempFormData({ feeCollection: [newFeeData] });

        // Lưu vào bảng chung (formData)
        setFormData(prev => {
            const exists = prev.feeCollection.some(f => f.typeId === feeId);
            return exists
                ? prev // nếu đã có thì không thêm
                : { ...prev, feeCollection: [...prev.feeCollection, newFeeData] };
        });
    };

    const handleNextStep = () => {
        if (!formData.month || !formData.year) {
            toast.error("Vui lòng chọn tháng, năm để thống kê!");
            return;
        }
        if (!/^\d{4}$/.test(formData.year)) {
            toast.error("Số năm không hợp lệ!");
            return;
        }
        if (!/^\d{1,2}$/.test(formData.month)) {
            toast.error("Số tháng không hợp lệ!");
            return;
        }
        setStep(2);
    };

    const handleClose = () => {
        setStep(1);
        setFormData({
            month: '',
            year: '',
            feeCollection: []
        });
        onClose();
    };

    const handleSubmit = () => {
        onSubmit(formData); // gửi toàn bộ feeCollection để xuất file
    };

    return (
        <Modal size={step === 2 ? 'xl' : 'md'} className='modal-create' show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thống kê khoản phí</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && (
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                            <label>Tháng(<span className='redC'>*</span>):</label>
                            <input type='number' className='form-control'
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                            <label>Năm(<span className='redC'>*</span>):</label>
                            <input type='number' className='form-control'
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className='content-body row'>
                        <div className='content-left col-9 pt-3 pb-3'>
                            <table className='table table-bordered table-striped table-hover'>
                                <thead>
                                    <tr>
                                        <th className='text-center'>STT</th>
                                        <th className='text-center'>Mã căn hộ</th>
                                        <th className='text-center'>Tên khoản phí</th>
                                        <th className='text-center'>Tháng/Năm</th>
                                        <th className='text-center'>Số tiền (VNĐ)</th>
                                        <th className='text-center'>Bắt buộc</th>
                                        <th className='text-center'>Hạn nộp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tempFormData.feeCollection?.length > 0 ? (
                                        tempFormData.feeCollection.map((feeItem, feeIndex) =>
                                            feeItem.apartments.map((item, aptIndex) => (
                                                <tr key={`${feeIndex}-${aptIndex}`}>
                                                    <td className='text-center'>{feeIndex + aptIndex + 1}</td>
                                                    <td className='text-center'>{item.apartmentCode}</td>
                                                    <td>{feeTypeList.find(f => f.typeId === feeItem.typeId)?.feeName}</td>
                                                    <td className='text-center'>{formData.month}/{formData.year}</td>
                                                    <td className='text-center'>{item.amount}</td>
                                                    <td className='text-center'>
                                                        {feeTypeList.find(f => f.typeId === feeItem.typeId)?.isRequired ? 'Có' : 'Không'}
                                                    </td>
                                                    <td className='text-center'>{feeItem.dueDate}</td>
                                                </tr>
                                            ))
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={10} className="text-center">Chưa chọn khoản phí</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className='content-right col-3 pt-3 pb-3'>
                            <label>Thêm khoản phí:</label>
                            <Select
                                isMulti
                                options={feeTypeList.map(a => ({ value: a.typeId, label: a.feeName }))}
                                onChange={(selectedOptions) => {
                                    const selectedIds = selectedOptions.map(opt => opt.value);
                                    setSelectedFees(selectedIds);
                                }}
                            />
                            <div>
                                {selectedFees.map(feeId => (
                                    <div className='feebtn' key={feeId}>
                                        <button
                                            onClick={() => handleShowFee(feeId)}
                                            className="btn"
                                        >
                                            {feeTypeList.find(f => f.typeId === feeId)?.feeName}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                {step === 1 && <Button variant="primary" onClick={handleNextStep}>Tiếp tục</Button>}
                {step === 2 && <Button variant="success" onClick={handleSubmit}>Xuất file</Button>}
            </Modal.Footer>
        </Modal>
    );
};

export default StatisticModal;
