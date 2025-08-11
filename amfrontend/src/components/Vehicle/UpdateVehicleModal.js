import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';

const UpdateVehicleModal = ({ show, onClose, onSubmit, vehicle, residentList }) => {
    const [formData, setFormData] = useState({
        resident: '',
        licensePlate: '',
        vehicleType: '',
        brand: '',
        color: '',
    });

    useEffect(() => {
        if(show && vehicle){
            setFormData({
                resident: vehicle.resident,
                licensePlate: vehicle.licensePlate || '',
                vehicleType: vehicle.vehicleType,
                brand: vehicle.brand,
                color: vehicle.color,                
            });
        }
    }, [show, vehicle]);

    const defaultValidInput = {
        isValidResident: true,
        isValidLicensePlate: true,
        isValidVehicleType: true,
        isValidBrand: true,
        isValidColor: true,
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    //check input valid
    const isValidInputs = async () => {
        setObjCheckInput(defaultValidInput);
        if(!formData.resident){
            toast.error("Chủ xe không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidResident: false});
            return false;
        }
        if(!formData.vehicleType){
            toast.error("Loại xe không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidVehicleType: false});
            return false;
        }
        if(!formData.brand){
            toast.error(" Hãng xe không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidBrand: false});
            return false;
        }
        if(!formData.color){
            toast.error("Màu sắc xe không được để trống!");
            setObjCheckInput({...defaultValidInput, isValidColor: false});
            return false;
        }
        return true;
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async() => {
        let check = await isValidInputs();
        if(check === true){
            onSubmit(formData);
        }
    };

    const vehicleTypeOption = [
        { value: 'car', label: 'Ô tô' },
        { value: 'bike', label: 'Xe đạp' },
        { value: 'motorbike', label: 'Mô tô' },
        { value: 'other', label: 'Khác' },
    ]
    return(
        <>
        <Modal size='lg' show={show} onHide={onClose} className='modal-vehicle' centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa phương tiện</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Chủ xe(<span className='redC'>*</span>):</label>
                        <select 
                            className='form-select'
                            name='resident'
                            value={formData.resident} 
                            onChange={handleChange}
                        >
                            <option>Tùy chọn</option>
                            {residentList.map((resident) => (
                                <option key={resident.residentId} value={resident.residentId}>
                                {resident.fullName} ({resident.phoneNumber})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Biển số xe:</label>
                        <input type='text' className='form-control'
                            name='licensePlate' value={formData.licensePlate} placeholder='Biển số xe' onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Loại xe(<span className='redC'>*</span>):</label>
                        <Select
                            name="vehicleType"
                            options={vehicleTypeOption}
                            placeholder='Tùy chọn'
                            value={vehicleTypeOption.find(opt => opt.value === formData.vehicleType) || null}
                            onChange={(selectedOption) => {
                                setFormData({
                                    ...formData,
                                    vehicleType: selectedOption ? selectedOption.value : ''
                                });
                            }}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Hãng(<span className='redC'>*</span>):</label>
                        <input type='text' className={objCheckInput.isValidBrand ? 'form-control' : 'form-control is-invalid'}
                            name='brand' value={formData.brand} placeholder='Hãng xe' onChange={handleChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                        <label>Màu sắc(<span className='redC'>*</span>):</label>
                        <input type='text' className={objCheckInput.isValidColor ? 'form-control' : 'form-control is-invalid'}
                            name='color' value={formData.color} placeholder='Màu sắc' onChange={handleChange}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='cancelbtn' variant='secondary' onClick={onClose}>Hủy</Button>
                <Button className='savebtn' variant='primary' onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
};

export default UpdateVehicleModal;
