import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../../setup/axios';
import StatisticModal from './StatisticModal';
import Select from 'react-select';
import { getLatestDate, getChart, getBarFee } from '../../services/userService';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

const Statistics = () => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
    const navigate = useNavigate();
    
    const [feeTypeList, setFeeTypeList] = useState([]);
    const [apartmentFeeData, setApartmentFeeData] = useState([])
    const [showStatisticModal, setShowStatisticModal] = useState(false);
    
    const [date, setDate] = useState({
        month: '',
        year: '',
        selectedFeeType: '',
    })

    const [dataChart, setDataChart] = useState({
        totalUnpaidAmount: '',
        totalPaidAmount: '',
        percent: '',
    })

    const centerTextPlugin = {
        id: "centerText",
        beforeDraw: (chart) => {
            const { ctx, chartArea } = chart;
            const { top, bottom, left, right } = chartArea;

            ctx.save();
            const xCenter = (left + right) / 2;
            const yCenter = (top + bottom) / 2;

            ctx.font = "bold 30px sans-serif"; 
            ctx.fillStyle = "#6D7278";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const text = chart.config.options.centerText;
            ctx.fillText(text, xCenter, yCenter);
            ctx.restore();
        },
    };

    const dataChartFeeCollection = {
        labels: ['Chưa thanh toán', 'Đã thanh toán'],
        datasets: [
            {
            label: 'Số tiền',
            data: [dataChart.totalUnpaidAmount, dataChart.totalPaidAmount],
            backgroundColor: [
                '#7097ebff',
                '#a4c9fdff',
            ],
            borderColor: [
                '#7097ebff',
                '#a4c9fdff',
            ],
            borderWidth: 0.5,
            },
        ],
    };
    
    const optionsDoughnut = {
        cutout: '75%', 
        plugins: {
            legend: { position: "top" },
            fontSize: '14px',
        },
        centerText: `${Math.floor(dataChart.percent)}%`,
    };

    const optionsBar = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Năm ${date.year}`,
            },
        },
    };
    const [totalCount, setTotalCount] = useState({
        totalReceived: [],
        totalAmount: [],
    })

    const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

    const dataBar = {
        labels,
        datasets: [
            {
            label: 'Thực nhận',
            data: totalCount.totalReceived,
            backgroundColor: 'rgba(54, 246, 230, 0.5)',
            },
            {
            label: 'Thực thu',
            data: totalCount.totalAmount,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    //get default date
    useEffect(() => {
        const getLatestDateFeeCollection = async () => {
            try{
                const res = await getLatestDate();
                setDate({
                    month: res.data.latest_date[0],
                    year: res.data.latest_date[1],
                    selectedFeeType: {
                        value: res.data.latest_date[2],   
                        label: res.data.latest_date[3],  
                    }
                })
            }catch(err){
                console.log(err);
            }
        }
        getLatestDateFeeCollection();
    }, []);

    //get feetypelist
    useEffect(() => {
        if (!date.month || !date.year) return; 

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
                                
                if (!date.selectedFeeType && feetypes.length > 0) {
                    setDate(prev => ({
                        ...prev,
                        selectedFeeType: { value: feetypes[0].typeId, label: feetypes[0].feeName }
                    }));
                }

            }catch(error){
                toast.error("Không thể tải danh sách khoản phí!");
            }
        }
        fetchAllFeeTypes();
    }, [date.month, date.year]);

    //get table info
    useEffect(() => {
        if (!date.month || !date.year || !date.selectedFeeType) return;

        const fetchApartmentFee = async () => {
            try{
                const feeType = feeTypeList.find(f => f.typeId === date.selectedFeeType.value);
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
                console.log(error);
            }
        }
        fetchApartmentFee();
    }, [date.selectedFeeType, feeTypeList, date.month, date.year]);

    //get chart
    useEffect(() => {
        if (!date.month || !date.year || !date.selectedFeeType) return; 
        const fetchChart = async () => {
            try{
                const feeType = feeTypeList.find(f => f.typeId === date.selectedFeeType.value);
                const data = {
                    month: date.month,
                    year: date.year,
                    feeName: feeType?.feeName
                }
                const res = await getChart(data);
                setDataChart({
                    totalUnpaidAmount: res.data.data[0],
                    totalPaidAmount: res.data.data[1],
                    percent: res.data.data[2],
                })
            }catch(err){
                console.log(err);
            }
        }
        fetchChart();
    }, [date.month, date.year, date.selectedFeeType]);

    //get bar
    useEffect(() => {
        if (!date.year) return; 
        const getBarFeePerYear = async () => {
            try{
                const res = await getBarFee(date.year);
                console.log(res.data);
                setTotalCount({
                    totalReceived: res.data.data[0],
                    totalAmount: res.data.data[1],
                })
            }catch(err){
                console.log(err);
            }
        }
        getBarFeePerYear();
    }, [date.year]);
    

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
        <div className="container mt-2">
            <div className='col-12 mx-auto text-start'>
                <button className='btn' onClick={() => handleBack()}>
                    <i class="fa fa-angle-left" style={{color: 'green'}}> Quay lại</i>
                </button>
            </div>
            <div className="content-top row mx-auto my-2 ">
                <div className="content-top-left col-12 col-md-8 py-3">
                    <Bar data={dataBar} options={optionsBar}/>
                </div>
                <div className="content-top-right col-12 col-md-4">
                    <div className="content-middle row mx-auto my-2 align-items-center py-3 px-5">
                        <div className="d-flex align-items-center">
                            <label className="me-2">Tháng:</label>
                            <input
                                type="number"
                                className="form-control me-2"
                                value={date.month}
                                onChange={(e) => setDate({ ...date, month: e.target.value, selectedFeeType: '' })}
                            />                
                            <label className="me-2">Năm:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={date.year}
                                onChange={(e) => setDate({ ...date, year: e.target.value, selectedFeeType: '' })}
                            />
                        </div>
                    </div>
                    <div className="col-12 d-flex align-items-center py-3 px-5">
                        <div className="col-10">
                            <Select
                            name="feeType"
                            options={feeTypeList.map(a => ({
                                value: a.typeId,
                                label: a.feeName
                            }))}
                            value={date.selectedFeeType}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(item) => setDate({...date, selectedFeeType: item})}
                            />
                        </div>
                        <div className="col-2">
                            <button onClick={() => handleStatistics()} className="btn" title="Xuất file"><i className="fa fa-print"></i></button>
                        </div>
                    </div>
                    <div style={{width: '75%'}}>
                        <Doughnut data={dataChartFeeCollection} options={optionsDoughnut} plugins={[centerTextPlugin]} style={{padding: '40px'}}/>
                    </div>
                </div>
            </div>
            <div className="content-bottom row mx-auto my-2">
                <div className="content-bottom-right py-3">
                    <table className='table table-hover table-striped'>
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
                                            <td className="text-center">{Number(item.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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