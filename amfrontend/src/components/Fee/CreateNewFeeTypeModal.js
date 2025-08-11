import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';

const CreateNewFeeTypeModal = ({show, onClose, onSubmit, apartmentList}) => {
    const [formData, setFormData] = useState({
        feeName: '',
        typeDescription: '',
        isRequired: '',
        appliedScope: '',
        amountDefault: '',
        applicableApartments: [],
    });
    useEffect(() => {
        if(show){
            setFormData({
                feeName: '',
                typeDescription: '',
                isRequired: '',
                appliedScope: '',
                amountDefault: '',
                applicableApartments: [],
            })
        }
    }, [show]);

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
            onSubmit(formData);
        }
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
        <Modal size='lg' show={show} onHide={onClose} className='modal-vehicle' centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm khoản phí mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                            className="basic-multi-select"
                            classNamePrefix="select"
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
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn' variant='secondary' onClick={onClose}>Hủy</Button>
                <Button className='savebtn' variant='primary' onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default CreateNewFeeTypeModal;