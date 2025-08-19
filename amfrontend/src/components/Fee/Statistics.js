import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../../setup/axios';
import StatisticModal from './StatisticModal';
import { useSelector, useDispatch } from "react-redux";
import Select from 'react-select';
import { fetchPaymentTransaction } from '../../services/userService';
import checkicon from '../../static/check.png';

const Statistics = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [date, setDate] = useState({
        month: '',
        year: '',
    })

    const [latestTransaction, setLatestTransaction] = useState([]);

    const [selectedFeeType, setSelectedFeeType] = useState(null)
    const [feeTypeList, setFeeTypeList] = useState([]);
    const [apartmentFeeData, setApartmentFeeData] = useState([])
    
    const [showStatisticModal, setShowStatisticModal] = useState(false);

    //get feetypelist
    useEffect(() => {
        const fetchAllFeeTypes = async () => {
            try{
                const res = await axios.get('/feetype/', {
                    params: {
                        page_size: 1000,
                        month: date.month,
                        year: date.year,
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
    }, [date.month, date.year]);

    useEffect(() => {
        const fetchApartmentFee = async () => {
            try{
                const feeType = feeTypeList.find(f => f.typeId === selectedFeeType.value);
                const res = await axios.get('/apartmentfee/', {
                    params: {
                        page_size: 1000,
                        month: date.month,
                        year: date.year,
                        feeName: feeType?.feeName
                    }
                });
                const data = res.data;
                const apartmentFees = Array.isArray(data.results) ? data.results : data;
                setApartmentFeeData(apartmentFees);
            }catch(error){
                toast.error("Không thể tải danh sách khoản phí căn hộ!");
            }
        }
        fetchApartmentFee();
    }, [selectedFeeType, feeTypeList, date.month, date.year]);
    
    useEffect(()=> {
        const fetchFee = async() => {
            const res = await axios.get('/payment/');
            console.log(res.data.results);
            setLatestTransaction(res.data.results);
        }
        fetchFee();
    }, []);

    // useEffect(() => {
    //     const interval = setInterval(checkPaymentStatus, 1000);
    //     return () => clearInterval(interval);
    // }, [status]);

    //statistics
    const handleStatistics = () => {
        setShowStatisticModal(true);
    }
    
    const handleSubmitStatisticModal = async (data) => {
        try {
            const res = await axios.post(
                "http://localhost:8000/export/",
                data,
                { responseType: "blob" }
            );
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Thongke.xlsx");
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            setShowStatisticModal(false);
        } catch (err) {
            console.error("Export Excel failed:", err);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    const handleBack = () => {
        navigate('/fee');
    }

    return(
        <>
        <div className="container mt-4">
            <div className='col-12 mx-auto text-start'>
                <button className='btn' onClick={() => handleBack()}>
                    <i class="fa fa-angle-left" style={{color: 'green'}}> Quay lại</i>
                </button>
            </div>
            <div className="content-top row mx-auto my-3">
                <div className="content-top-left col-8">bang thong ke doanh thu ca nam</div>
                <div className="content-top-right col-4">
                    <div className="fw-bold mb-2">Thanh toán gần đây</div>
                    {latestTransaction?.map((item, index) => {
                        // Tách feeName: ["A104", "Tiền", "Internet", "8/2025"]
                        const parts = item.feeName.split(" ");
                        const apartmentCode = parts[0];               // A104
                        const monthYear = parts[parts.length - 1];    // 8/2025
                        const feeName = parts.slice(1, parts.length - 1).join(" "); // Tiền Internet

                        return (
                        <div key={index} className="d-flex align-items-center mb-1">
                            <img
                            src={checkicon}
                            width="15"
                            height="15"
                            className="me-2"
                            alt="check"
                            />
                            Căn hộ {apartmentCode} vừa thanh toán {parseFloat(item.amount).toLocaleString()} {feeName.toLowerCase()} tháng {monthYear}
                        </div>
                        );
                    })}
                </div>
            </div>
            <div className="content-middle row mx-auto my-3 align-items-center">
                <div className="col-3 d-flex align-items-center">
                    <label className="me-2">Tháng:</label>
                    <input
                        type="number"
                        className="form-control me-2"
                        value={date.month}
                        onChange={(e) => setDate({ ...date, month: e.target.value })}
                    />                
                    <label className="me-2">Năm:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={date.year}
                        onChange={(e) => setDate({ ...date, year: e.target.value })}
                    />
                </div>
                <div className="col-2">
                    <button onClick={() => handleStatistics()} className="btn btn-success">Xuất file</button>
                </div>
                </div>

            <div className="content-bottom row mx-auto my-3">
                <div className="content-bottom-left col-3">
                    chart doanh thu cua tung loai phi
                    <Select
                        name="feeType"
                        options={feeTypeList.map(a => ({
                            value: a.typeId,
                            label: a.feeName
                        }))}
                        placeholder='Tùy chọn'
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(item) => setSelectedFeeType(item)}
                        />
                    </div>
                <div className="content-bottom-right col-9">
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
                                {apartmentFeeData && apartmentFeeData.length > 0 ? (
                                    apartmentFeeData?.map((item, index) =>(
                                        <tr key={`row-${index}`}>
                                            <td className='text-center'>{index + 1}</td>
                                            <td className='text-center'>{item.apartmentCode}</td>
                                            <td>{item.feeName}</td>
                                            <td className='text-center'>{item.month || ''}</td>
                                            <td className='text-center'>{item.amount || ''}</td>
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
            </div>
        </div>
        <StatisticModal
            show={showStatisticModal}
            onClose={() => setShowStatisticModal(false)}
            onSubmit={handleSubmitStatisticModal}
            month={date?.month}
            year={date?.year}
        />
        </>
    )
}
export default Statistics;