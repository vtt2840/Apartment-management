import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../../setup/axios';

const StatisticModal = ({ show, onClose, onSubmit, month, year }) => {
    const dispatch = useDispatch();
    //const feeTypeList = useSelector(state => state.fee.feeTypeList);
    const [selectedFees, setSelectedFees] = useState([]);
    const [feeTypeList, setFeeTypeList] = useState([]);

    const [feeData, setFeeData] = useState([])
    const [tempFeeData, setTempFeeData] = useState([])

    useEffect(() => {
        if (show) {
            setTempFeeData([])
            setSelectedFees([]);
        }
    }, [show]);

    //get feetypelist 
    useEffect(() => {
        const fetchAllFeeTypes = async () => {
            try{
                const res = await axios.get('/feetype/', {
                    params: {
                        page_size: 1000,
                        month: month,
                        year: year,
                        statistic: true,
                    }
                })
                const data = res.data;
                const feetypes = Array.isArray(data.results) ? data.results : data;
                setFeeTypeList(feetypes);
            }catch(error){
                toast.error("Không thể tải danh sách khoản phí!");
            }
        }
        fetchAllFeeTypes();
    }, [month, year]);

    //handle selectedFees change
    useEffect(() => {
        if (!selectedFees || selectedFees.length === 0) {
            setFeeData([]);
            return;
        }
        const fetchData = async () => {
            let updatedFeeData = [];
            updatedFeeData = feeData.filter(item => selectedFees.includes(item.typeId));

            for(const selectedFee of selectedFees){
                const exists = updatedFeeData.some(f => f.typeId === selectedFee);
                if(!exists){
                    try {
                        const feeType = feeTypeList.find(f => f.typeId === selectedFee);
                        const res = await axios.get('/apartmentfee/', {
                            params: {
                                page_size: 1000,
                                month: month,
                                year: year,
                                feeName: feeType?.feeName
                            }
                        });
                        const data = res.data;
                        const apartmentFees = Array.isArray(data.results) ? data.results : data;

                        updatedFeeData = [...updatedFeeData, ...apartmentFees.map(f => ({
                            ...f,
                            typeId: selectedFee
                        }))];
                    }catch(error){
                        toast.error("Không thể tải danh sách");
                    }
                }
            }
            setFeeData(updatedFeeData);
        };
        fetchData();
    }, [selectedFees, feeTypeList, month, year]);

    //change when selectedFee onclick change
    useEffect(() => {
        setTempFeeData(prev => (prev.filter(f =>
                selectedFees.some(s => s.typeId === f.typeId)
            )
        ));
    }, [selectedFees]);

    
    const handleShowFee = (feeId) => {
        const feeName = feeTypeList.find(ft => ft.typeId === feeId)?.feeName;
        const showFeeList = feeData.filter(f => f.feeName === feeName);
        console.log(showFeeList);

        if(showFeeList.length > 0){
            setTempFeeData(showFeeList);
            console.log(tempFeeData);
        }else{
            setTempFeeData([]);
        }
    };

    const handleClose = () => {
        setFeeData([])
        onClose();
    };

    const handleSubmit = () => {
        onSubmit(feeData); 
    };

    return (
        <Modal size='xl' className='modal-create' show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thống kê khoản phí tháng {month}/{year}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                                    <th className='text-center align-middle' scope='col'>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tempFeeData && tempFeeData.length > 0 ? (
                                    tempFeeData?.map((item, index) =>(
                                        <tr key={`row-${index}`}>
                                            <td className='text-center'>{index + 1}</td>
                                            <td className='text-center'>{item.apartmentCode}</td>
                                            <td>{item.feeName}</td>
                                            <td className='text-center'>{item.month || ''}</td>
                                            <td className='text-center'>{Number(item.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className='text-center'>{item.isRequired ? 'Có' : 'Không'}</td>
                                            <td className='text-center'>{item.dueDate}</td>
                                            <td className='text-center'>{item.status == 'paid' ? 'Đã thanh toán' : item.status == 'unpaid' ? 'Chưa thanh toán' : 'Đã xóa'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="text-center">Chưa chọn khoản phí</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='content-right col-3 pt-3 pb-3'>
                        <div>
                        <label>Thêm khoản phí:</label>
                        <Select
                            isMulti
                            name="feeType"
                            options={feeTypeList?.map(a => ({
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
                                    onClick={() => handleShowFee(feeId) }
                                    className="btn"
                                >{feeTypeList.find(f => f.typeId === feeId)?.feeName}
                                </button>
                            </div>
                        )))}
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button className='savebtn' variant="success" onClick={handleSubmit}>Xuất file</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StatisticModal;
