import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ResidentTempModal = ({ show, onClose, onSubmit, resident, name }) => {
    const [typeRegister, setTypeRegister] = useState(null);
    
    const [step, setStep] = useState(1); 
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        destination: '',
    });
    useEffect(() => {
            if (show) {
                setFormData({
                    startDate: '',
                    endDate: '',
                    reason: '',
                    destination: '',
                });
                setStep(1);
            }
        }, [show, resident, name]);

    const handleNextStep = () => {
        if(!typeRegister || typeRegister === "Tùy chọn"){
            toast.error("Vui lòng chọn loại đăng ký.");
            return;
        }
        setStep(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const defaultValidInput = {
        isValidStartDate: true,
        isValidEndDate: true,
        isValidReason: true,
        isValidDestination: true
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    
    const isValidInputs = async () => {
        setObjCheckInput(defaultValidInput);
        if(!formData.startDate){
            toast.error("Ngày bắt đầu không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidStartDate: false });
            return false;
        }
        if(!formData.endDate){
            toast.error("Ngày kết thúc không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidEndDate: false });
            return false;
        }

        if(new Date(formData.endDate) < new Date(formData.startDate)){
            toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!");
            setObjCheckInput({...defaultValidInput, isValidStartDate: false, isValidEndDate: false });
            return false;
        }
        if(!formData.reason){
            toast.error("Lý do không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidReason: false });
            return false;
        }
        if(typeRegister === 'temporaryabsence'){
            if(!formData.destination){
                toast.error("Địa điểm di chuyển không được để trống!");
                setObjCheckInput({...defaultValidInput, isValidDestination: false });
                return false;
            }
        }
        return true;
    }

    const handleSubmit = async() => {
        let check = await isValidInputs();
        if(check === true){
            onSubmit({ typeRegister, resident_id: resident, ...formData });
        }
        
    };

    const handleClose = () => {
        setStep(1);
        setTypeRegister('');
        setFormData({ startDate: '', endDate: '', reason: '',  destination: '' });
        onClose();
    };

    return (
        <>
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Đăng ký tạm trú/tạm vắng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && (
                    <>
                    <div>Cư dân: {name}</div>
                    <div className='col-12 form-group pt-3 pb-3'>
                        <label>Loại đăng ký(<span className='redC'>*</span>):</label>
                        <select
                            className='form-select'
                            name="gender"
                            value={typeRegister}
                            onChange={(event)=> setTypeRegister(event.target.value)}
                        >
                            <option>Tùy chọn</option>
                            <option value="temporaryresidence">Tạm trú</option>
                            <option value="temporaryabsence">Tạm vắng</option>
                        </select>
                    </div>
                    </>
                )}
                {step === 2 && (
                    <>
                        <div className='form-group mb-3'>
                            <label>Ngày bắt đầu(<span className='redC'>*</span>):</label>
                            <input
                                type="date"
                                name="startDate"
                                className="form-control"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Ngày kết thúc(<span className='redC'>*</span>):</label>
                            <input
                                type="date"
                                name="endDate"
                                className="form-control"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Lý do(<span className='redC'>*</span>):</label>
                            <textarea
                                name="reason"
                                className="form-control"
                                value={formData.reason}
                                onChange={handleChange}
                            />
                        </div>
                        {typeRegister === "temporaryabsence" && (
                            <div className='form-group mb-3'>
                                <label>Địa điểm di chuyển(<span className='redC'>*</span>):</label>
                                <input
                                    type="text"
                                    name="destination"
                                    className="form-control"
                                    value={formData.destination || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn'  variant="secondary" onClick={handleClose}>Hủy</Button>
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
};

export default ResidentTempModal ;
