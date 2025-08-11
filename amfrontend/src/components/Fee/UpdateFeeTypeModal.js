import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';

const UpdateFeeTypeModal = ({show, onClose, onSubmit, feeTypeList, apartmentList}) => {
    const [step, setStep] = useState(1);
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [selectedFeeName, setSelectedFeeName] = useState(null);

    const [formData, setFormData] = useState({
        feeName: '',
        typeDescription: '',
        isRequired: '',
        appliedScope: '',
        amountDefault: '',
        applicableApartments: [],
    });
    useEffect(() => {
        if(show && selectedFeeType){
            setFormData({
                feeName: selectedFeeType?.feeName,
                typeDescription: selectedFeeType?.typeDescription || '',
                isRequired: selectedFeeType?.isRequired,
                appliedScope: selectedFeeType?.appliedScope,
                amountDefault: selectedFeeType?.amountDefault || '',
                applicableApartments: selectedFeeType?.applicableApartments,
            })
            setSelectedFeeName(null);
        }
        setStep(1);
    }, [show, selectedFeeType, selectedFeeName]);

    const handleNextStep = () => {
        if(!selectedFeeType){
            toast.error("Vui lòng chọn khoản phí để chỉnh sửa!");
            return;
        }
        setStep(2);
    }

    const defaultValidInput = {
        isValidFeeName: true,
        isValidIsRequired: true,
        isValidAppliedScope: true,
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    const isValidInputs = async() => {
        setObjCheckInput(defaultValidInput);
        if(!formData.feeName){
            toast.error("Tên khoản phí không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidFeeName: false});
            return false;
        }
        if(!formData.isRequired){
            toast.error("Bắt buộc không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidIsRequired: false});
            return false;
        }
        if(!formData.appliedScope){
            toast.error("Phạm vi áp dụng không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidAppliedScope: false});
            return false;
        }
        return true;
    }
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async() => {
        let check = await isValidInputs();
        if(check === true){
            const data = {
                ...formData,
                typeId: selectedFeeType.typeId,
            }
            onSubmit(data);
        }
    }
    const handleClose = () => {
        setStep(1);
        setSelectedFeeType(null);
        onClose();
    }

    const isRequiredOption = [
        { value: true, label: 'Có' },
        { value: false, label: 'Không' },
    ];
    const appliedScopeOption = [
        { value: 'all', label: 'Tất cả căn hộ'},
        { value: 'some', label: 'Một số căn hộ'},
    ]

    return(
        <>
        <Modal size={`${step === 2 ? 'lg' : 'md'}`} show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa khoản phí </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 &&(
                    <div className='col-12 form-group pt-3 pb-3'>
                        <label>Chọn khoản phí(<span className='redC'>*</span>):</label>
                        <select
                            className='form-select'
                            name='selectedFeeName'
                            value={selectedFeeName} 
                            onChange={(event) => {
                                setSelectedFeeName(event.target.value);
                                const selected = event.target.value;
                                const typeObj = feeTypeList.find(t => t.feeName === selected);
                                setSelectedFeeType(typeObj);
                            }}
                        >
                            <option>Tùy chọn</option>
                            {feeTypeList?.map((type) => (
                                <option key={type.typeId} value={type.feeName}>
                                {type.feeName}
                                </option>
                            ))}
                        </select>

                    </div>)}
                {step === 2 && (
                <div className='content-body row'>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Tên khoản phí(<span className='redC'>*</span>):</label>
                        <input type='text' className={objCheckInput.isValidFeeName ? 'form-control' : 'form-control is-invalid'}
                            name='feeName' value={formData.feeName} placeholder='Tên khoản phí' onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Mô tả:</label>
                        <input type='text' className='form-control'
                            name='typeDescription' value={formData.typeDescription} placeholder='Mô tả nội dung khoản phí' onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Bắt buộc(<span className='redC'>*</span>):</label>
                        <Select
                            name="isRequired"
                            options={isRequiredOption}
                            placeholder='Tùy chọn'
                            value={isRequiredOption.find(opt => opt.value === formData.isRequired)} 
                            onChange={(selectedOption) => {
                                setFormData({
                                    ...formData,
                                    isRequired: selectedOption ? selectedOption.value : null
                                });
                            }}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Phạm vi áp dụng(<span className='redC'>*</span>):</label>
                        <Select
                            name="appliedScope"
                            options={appliedScopeOption}
                            placeholder='Tùy chọn'
                            value={appliedScopeOption.find(opt => opt.value === formData.appliedScope)} 
                            onChange={(selectedOption) => {
                                setFormData({
                                    ...formData,
                                    appliedScope: selectedOption ? selectedOption.value : null
                                });
                            }}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Số tiền mặc định:</label>
                        <input type='number' className='form-control'
                            name='amountDefault' value={formData.amountDefault} placeholder='Số tiền mặc định' onChange={handleChange}
                        />
                    </div>
                    {formData.appliedScope == 'some' && <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Căn hộ áp dụng:</label>
                        <Select
                            isMulti
                            name="applicableApartments"
                            options={apartmentList.map(a => ({
                                value: a.apartmentCode,
                                label: a.apartmentCode
                            }))}
                            defaultValue={formData.applicableApartments.map(code => ({
                                value: code,
                                label: code
                            }))} 
                            onChange={(selectedOptions) => {
                                const selected = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                setFormData({
                                    ...formData,
                                    applicableApartments: selected
                                });
                            }}
                        />
                    </div>}
                </div>
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
    )
}

export default UpdateFeeTypeModal;