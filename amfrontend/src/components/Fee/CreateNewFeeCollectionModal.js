import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { getAllFeeTypes } from '../../store/slices/feeSlice';


const CreateNewFeeCollectionModal = ({show, onClose, onSubmit}) => {
    const dispatch = useDispatch();
    const feeTypeList = useSelector(state => state.fee.feeTypeList);
    const [step, setStep] = useState(1);
    const [selectedFees, setSelectedFees] = useState([]);

    const [formData, setFormData] = useState({
        month: '',
        year: '',
        feeCollection: [{
            typeId: '',
            dueDate: '',
            apartments: [{
                apartmentCode: '',
                amount: '',
            }]
        }]
    })

    const [tempFormData, setTempFormData] = useState({
        month: '',
        year: '',
        feeCollection: [],
    });

    useEffect(() => {
        if(show){
            setFormData({
                month: '',
                year: '',
                feeCollection: []
            });
            setSelectedFees([]);
            setTempFormData({
                month: '',
                year: '',
                feeCollection: [],
            })
        }
        setStep(1);
    }, [show]);

    //change when selectedFees change
    useEffect(() => {
        setTempFormData(prev => ({
            ...prev,
            feeCollection: prev.feeCollection.filter(f =>
                selectedFees.some(s => s.typeId === f.typeId)
            )
        }));
    }, [selectedFees]);


    //get feetype list to create feecollection
    useEffect(() => {
        dispatch(getAllFeeTypes({
            page_size: 1000,
            month: formData.month,
            year: formData.year,
        }));
    }, [formData.month, formData.year]);

    //handle selectedfees change
    useEffect(() => {
        if (!selectedFees || selectedFees.length === 0) {
            setFormData(prev => ({ ...prev, feeCollection: [] }));
            return;
        }
        setFormData(prev => {
            let existingCollection = [...prev.feeCollection];
            let newItems = [];

            //add new feecollection
            selectedFees.forEach(selectedFee => {
                const feeType = feeTypeList.find(f => f.typeId === selectedFee);
                const exists = existingCollection.some(f => f.typeId === selectedFee);
                //add if feeName not exists
                if(!exists){
                    newItems.push({
                        typeId: selectedFee,
                        dueDate: '',
                        apartments: feeType.applicableApartments.map(apartment => ({
                            apartmentCode: apartment,
                            amount: feeType.amountDefault > 0 ? feeType.amountDefault : ''
                        }))
                    });
                }
            });
            //feename exists previously
            let keptItems = existingCollection.filter(item =>
                selectedFees.includes(item.typeId)
            );
            //push newitems to front
            return { ...prev, feeCollection: [...newItems, ...keptItems] };
        });
    }, [selectedFees, feeTypeList]);

    const defaultValidInput = {
        isValidAmount: true,
        isValidDueDate: true,
    }

    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput);

        for(let feeItem of formData.feeCollection){
            if(!feeItem.dueDate){
                setObjCheckInput({ ...defaultValidInput, isValidDueDate: false });
                return false;
            }

            for(let apt of feeItem.apartments){
                if(!apt.amount || Number(apt.amount) <= 0){
                    setObjCheckInput({ ...defaultValidInput, isValidAmount: false });
                    return false;
                }
            }
        }
        return true;
    };

    const handleShowFee = (feeId) => {
        const feeData = formData.feeCollection.find(f => f.typeId === feeId);
        if (feeData) {
            setTempFormData({
                ...formData,
                feeCollection: [ { ...feeData } ] 
            });
        }
    };

    const handleChangeDueDate = (value) => {
        const typeId = tempFormData.feeCollection[0]?.typeId;
        if(!typeId) return;
        //update to show
        setTempFormData(prev => ({
            ...prev,
            feeCollection: prev.feeCollection.map((fee, i) =>
                i === 0 ? { ...fee, dueDate: value } : fee
            )
        }));
        //save data in formdata
        setFormData(prev => ({
            ...prev,
            feeCollection: prev.feeCollection.map(f =>
                f.typeId === typeId ? { ...f, dueDate: value } : f
            )
        }));
    };

    const handleChangeAmount = (typeId, apartmentCode, value) => {
        //update to show
        setTempFormData(prev => {
            const updated = prev.feeCollection.map(fee => {
                if (fee.typeId === typeId) {
                    return {
                        ...fee,
                        apartments: fee.apartments.map(apartment =>
                            apartment.apartmentCode === apartmentCode
                                ? { ...apartment, amount: value }
                                : apartment
                        )
                    };
                }
                return fee;
            });
            return { ...prev, feeCollection: updated };
        });

        // save data in formData
        setFormData(prev => {
            const updated = prev.feeCollection.map(fee => {
                if (fee.typeId === typeId) {
                    return {
                        ...fee,
                        apartments: fee.apartments.map(apartment =>
                            apartment.apartmentCode === apartmentCode
                                ? { ...apartment, amount: value }
                                : apartment
                        )
                    };
                }
                return fee;
            });
            return { ...prev, feeCollection: updated };
        });
    };

    const handleNextStep = () => {
        if(!formData.month || !formData.year){
            toast.error("Vui lòng chọn tháng, năm để tạo bảng thu phí mới!");
            return;
        }
        if(!/^\d{4}$/.test(formData.year)){
            toast.error("Số năm không hợp lệ!");
            return;
        }
        if(!/^\d{1,2}$/.test(formData.month)){
            toast.error("Số tháng không hợp lệ!");
            return;
        }
        setStep(2);
    }
    const handleClose = () => {
        setStep(1);
        setFormData({
            month: '',
            year: '',
            feeCollection: [{
                typeId: '',
                dueDate: '',
                apartments: [{
                    apartmentCode: '',
                    amount: '',
                }]
            }]
        });
        onClose();
    }

    const handleSubmit = async() => {
        let check = await isValidInputs();
        if(check === true){
            onSubmit(formData);
        }
        else{
            toast.error("Vui lòng kiểm tra lại số tiền và hạn nộp cho các khoản phí!");
        }
    }

    return(
        <>
        <Modal size={`${step === 2 ? 'xl' : 'md'}`} className='modal-create' show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tạo bảng thu phí mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 &&(
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                            <label>Tháng(<span className='redC'>*</span>):</label>
                            <input type='number' className='form-control' name='month' value={formData.month}
                                placeholder='Tháng' onChange={(e) => {setFormData({...formData, month: e.target.value})}} />
                        </div>
                        <div className='col-12 col-sm-6 form-group pt-3 pb-3'>
                            <label>Năm(<span className='redC'>*</span>):</label>
                            <input type='number' className='form-control' name='year' value={formData.year}
                                placeholder='Năm' onChange={(e) => {setFormData({...formData, year: e.target.value})}} />
                        </div>
                    </div>
                )}
                {step === 2 &&(
                <div className='content-body row'>
                    <div className='content-left col-9 pt-3 pb-3'>
                        <table className='table table-bordered table-striped table-hover'>
                            <thead>
                                <tr>
                                    <th className='text-center align-middle' scope='col'>STT</th>
                                    <th className='text-center align-middle' scope='col'>Mã căn hộ</th>
                                    <th className='text-center align-middle' scope='col'>Tên khoản phí</th>
                                    <th className='text-center align-middle' scope='col'>Tháng/Năm</th>
                                    <th className='text-center align-middle' scope='col'>Số tiền (VNĐ)</th>
                                    <th className='text-center align-middle' scope='col'>Bắt buộc</th>
                                    <th className='text-center align-middle' scope='col'>Hạn nộp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <>
                                {tempFormData.feeCollection && tempFormData.feeCollection.length > 0 ? (
                                tempFormData.feeCollection.map((feeItem, feeIndex) => (
                                    feeItem.apartments.map((item, aptIndex) => (
                                    <tr key={`row-${feeIndex}-${aptIndex}`}>
                                    <td className='text-center'>{feeIndex + aptIndex + 1}</td>
                                    <td className='text-center'>{item.apartmentCode}</td>
                                    <td>{feeTypeList.find(f => f.typeId === feeItem.typeId)?.feeName}</td>
                                    <td className='text-center'>{formData.month}/{formData.year}</td>
                                    <td className='text-center'>
                                        <input
                                            type="number"
                                            className='form-control'
                                            style={{width: "130px", paddingRight: "0"}}
                                            value={item.amount}
                                            onChange={(e) => handleChangeAmount(feeItem.typeId, item.apartmentCode, e.target.value)}
                                        />
                                    </td>
                                    <td className='text-center'>{feeTypeList.find(f => f.typeId === feeItem.typeId).isRequired === true ? 'Có' : 'Không'}</td>
                                    <td className='text-center'>
                                        <input 
                                            type="date"
                                            className='form-control'
                                            style={{width: "150px"}}
                                            value={feeItem.dueDate}
                                            onChange={(e) => handleChangeDueDate(e.target.value)}
                                        />
                                    </td>
                                </tr>)))))
                                :
                                (
                                    <tr><td colSpan={10} className="text-center">Chưa chọn khoản phí</td></tr>
                                )}
                                </>
                            </tbody>
                        </table>
                    </div>
                    <div className='content-right col-3 pt-3 pb-3'>
                        <div>
                        <label>Thêm khoản phí:</label>
                        <Select
                            isMulti
                            name="feeType"
                            options={feeTypeList.map(a => ({
                                value: a.typeId,
                                label: a.feeName
                            }))}
                            placeholder='Tùy chọn'
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => {
                                const selectedIds = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                                setSelectedFees(selectedIds);
                            }}
                        />
                        </div>
                        <div>
                        {selectedFees && selectedFees.length > 0 && (selectedFees.map((feeId, index) => (
                            <div className='feebtn'>
                                <button
                                    onClick={() => handleShowFee(feeId)}
                                    className="btn"
                                >{feeTypeList.find(f => f.typeId === feeId)?.feeName}
                                </button>
                            </div>
                        )))}
                        </div>
                    </div>
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
    );
};

export default CreateNewFeeCollectionModal;