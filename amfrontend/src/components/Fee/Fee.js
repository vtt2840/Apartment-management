import './Fee.scss';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../../setup/axios';
import { checkFeeNameExists } from '../../services/userService';
import { getNewFeeCollection, editApartmentFee, addNewFeeType, getAllFeeTypes, editFeeType, deleteOneFeeType, addNewFeeCollection } from '../../store/slices/feeSlice';
import SearchFeeModal from './SearchFeeModal';
import UpdateApartmentFeeModal from './UpdateApartmentFeeModal';
import CreateNewFeeTypeModal from './CreateNewFeeTypeModal';
import UpdateFeeTypeModal from './UpdateFeeTypeModal';
import DeleteFeeTypeModal from './DeleteFeeTypeModal';
import CreateNewFeeCollectionModal from './CreateNewFeeCollectionModal';
import StatisticModal from './StatisticModal';
import PaymentTransactionModal from './PaymentTransactionModal';
import { useNavigate} from 'react-router-dom';
import { useClickAway } from '@uidotdev/usehooks';

const Fee = (props) => {
    const dispatch = useDispatch();
    const feeList = useSelector((state) => state.fee.feeList);
    const role = useSelector(state => state.auth.role);
    const selectedApartmentCode = useSelector(state => state.auth.selectedApartment);
    const totalCount = useSelector(state => state.fee.totalCount);
    const feeTypeList = useSelector(state => state.fee.feeTypeList);

    const [apartmentList, setApartmentList] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFee, setSelectedFee] = useState(null);
    const [apartmentFee, setApartmentFee] = useState(null);

    const [showFilterDateMenu, setShowFilterDateMenu] = useState(false);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [filterIsRequired, setFilterIsRequired] = useState('all');
    const [showFilterIsRequiredMenu, setShowFilterIsRequiredMenu] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilterStatusMenu, setShowFilterStatusMenu] = useState(false);
    const [filterDueDate, setFilterDueDate] = useState('all');
    const [showFilterDueDateMenu, setShowFilterDueDateMenu] = useState(false);
    const [filterFeeName, setFilterFeeName] = useState(null);
    const [showFilterFeeName, setShowFilterFeeName] = useState(false);

    const [showUpdateApartmentFeeModal, setShowUpdateApartmentFeeModal] = useState(false);
    const [showUpdateFeeTypeModal, setShowUpdateFeeTypeModal] = useState(false);
    const [showStatisticModal, setShowStatisticModal] = useState(false);
    const [showDeleteFeeTypeModal, setShowDeleteFeeTypeModal] = useState(false);
    const [showCreateNewFeeTypeModal, setShowCreateNewFeeTypeModal] = useState(false);
    const [showCreateNewFeeCollectionModal, setShowCreateNewFeeCollectionModal] = useState(false);
    const [showPaymentTransactionModal, setShowPaymentTransactionModal] = useState(false);

    useEffect(() => {
            if(totalCount){
                setTotalPages(Math.ceil(totalCount/10)); //totalpages
            }
        }, [totalCount]);
    
    //get fee list
    useEffect(() => {
        dispatch(getNewFeeCollection({
            page: currentPage,
            apartment_code: selectedApartmentCode,
            month: month ? month : 'latest',
            year: year ? year : 'latest',
            isRequired: filterIsRequired !== 'all' ? filterIsRequired : null,
            status: filterStatus !== 'all' ? filterStatus : null,
            dueDate: filterDueDate !== 'all' ? filterDueDate : null,
            feeName: filterFeeName ? filterFeeName : null,
        }));
    }, [dispatch, reloadTrigger, currentPage, month, year, selectedApartmentCode, filterIsRequired, filterStatus, filterDueDate, filterFeeName]);
    
    //get feetype list
    useEffect(() => {
        dispatch(getAllFeeTypes({
            page_size: 1000,
        }));
    }, [showUpdateFeeTypeModal, showDeleteFeeTypeModal]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, filterFeeName])

    //get apartment active
    useEffect(() => {
        const fetchApartments = async () => {
            try{
                const res = await axios.get('/apartments/', {
                    params:{
                        apartmentCode: null,
                        showLeftResidents: false,
                        status: 'sold',
                        page_size: 1000,
                    }
                });
                const data = res.data;
                const apartments = Array.isArray(data.results) ? data.results : data;
                setApartmentList(apartments);
            }catch(error){
                toast.error("Không thể tải danh sách căn hộ");
            }
        };
        fetchApartments();
    }, [showCreateNewFeeTypeModal]);
    
    //handle page change
    const handlePageChange= (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    }
    
    //filter feename
    const handleFeeNameFilter = () => {
        setFilterFeeName(null);
        setShowFilterFeeName(false);
    }
    const feeNameRef = useClickAway(() => {
        if(!filterFeeName){
            setShowFilterFeeName(false);
        }
    });

    //filter date
    const handleDateFilter = () => {
        setMonth(null); 
        setYear(null);
        setShowFilterDateMenu(false);
    };
    const dateRef = useClickAway(() => {
        if(!month && !year){
            setShowFilterDateMenu(false);
        }
    });

    //filter isRequired
    const handleIsRequiredFilter = (isRequired) => {
        setFilterIsRequired(isRequired);
        setShowFilterIsRequiredMenu(false); 
    };
     const isRequiredRef = useClickAway(() => {
        setShowFilterIsRequiredMenu(false);
    });

    //filter status
    const handleStatusFilter = (status) => {
        setFilterStatus(status);
        setShowFilterStatusMenu(false); 
    };
    const statusRef = useClickAway(() => {
        setShowFilterStatusMenu(false); 
    });

    //filter duedate
    const handleDueDateFilter = (duedate) => {
        setFilterDueDate(duedate);
        setShowFilterDueDateMenu(false);
    }
    const dueDateRef = useClickAway(() => {
        setShowFilterDueDateMenu(false);
    });

    //edit apartmentfee
    const hanldeEditApartmentFee = (item) => {
        setSelectedFee(item);
        setShowUpdateApartmentFeeModal(true);
    };

    const handleSubmitUpdateApartmentFee = async(formData) => {
        try{
            await dispatch(editApartmentFee({apartmentFeeId: selectedFee.apartmentFeeId, data: formData}));
            setReloadTrigger(prev => !prev);
            toast.success("Chỉnh sửa thành công!");
            setShowUpdateApartmentFeeModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    //add new fee collection
    const handleAddNewFeeCollection = () => {
        setShowCreateNewFeeCollectionModal(true);
    };

    const handleSubmitAddNewFeeCollection = async(formData) => {
        try{
            console.log(formData);
            await dispatch(addNewFeeCollection(formData));
            setReloadTrigger(prev => !prev);
            toast.success("Tạo bảng thu phí thành công!");
            setShowCreateNewFeeCollectionModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    //add new feetype
    const handleAddNewFeeType = () => {
        setShowCreateNewFeeTypeModal(true);
    };

    const checkFeeName = async (feeName) => {
        try{
            const res = await checkFeeNameExists(feeName);
            if(res.status === 200){
                return res.status;
            }
        }catch (err) {
            let temp = 'not found'; //new account
            if(err.response?.status === 400){
                return temp; 
            }
            toast.error("Lỗi hệ thống, vui lòng thử lại sau!");
            return false;
        }
    }

    const handleSubmitCreateNewFeeType = async(formData) => {
        try{
            const res = await checkFeeName(formData.feeName); 
            if(res === 200){
                toast.error("Khoản phí đã tồn tại")
                return;
            }
            if(res === 'not found'){
                await dispatch(addNewFeeType({
                    ...formData,
                    amountDefault: formData.amountDefault === '' ? '0' : formData.amountDefault,
                }));
                setReloadTrigger(prev => !prev);
                toast.success("Thêm khoản phí mới thành công!");
                setShowCreateNewFeeTypeModal(false);
            }
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    //delete feetype
    const handleDeleteFeeType = () => {
        setShowDeleteFeeTypeModal(true);
    };

    const handleSubmitDeleteFeeType = async(typeId) => {
        try{
            await dispatch(deleteOneFeeType(typeId));
            setReloadTrigger(prev => !prev);
            toast.success("Xóa khoản phí thành công!");
            setShowDeleteFeeTypeModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    //update feetype
    const handleUpdateFeeType = () => {
        setShowUpdateFeeTypeModal(true);
    };

    const handleSubmitUpdateFeeType = async(formData) => {
        try{
            const data = {
                feeName: formData?.feeName,
                typeDescription: formData?.typeDescription || '',
                isRequired: formData.isRequired,
                appliedScope: formData?.appliedScope,
                amountDefault: formData?.amountDefault === '' ? '0' : formData?.amountDefault,
                applicableApartments: formData?.applicableApartments || [],
            }
            await dispatch(editFeeType({ typeId: formData.typeId, data: data }));
            setReloadTrigger(prev => !prev);
            toast.success("Chỉnh sửa khoản phí thành công!");
            setShowUpdateFeeTypeModal(false)
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    //statistics
    const handleStatistics = () => {
        setShowStatisticModal(true);
    };

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

    const navigate = useNavigate();
    //payment
    const handlePayment = (item) => {
        let paymentApartmentFee = item.apartmentFeeId;
        navigate(`/payment/?apartmentFee=${paymentApartmentFee}`);
    };

    const handleShowPaymentTransaction = (item) => {
        setApartmentFee(item);
        setShowPaymentTransactionModal(true);
    }

    return (
        <>
        <div className='container'>
            <div className='row mx-auto mt-0'>
                <div className={`content-left mx-auto ${role === 'admin' ? 'col-12 col-md-10' : 'col-12'}`}>
                <div className='mx-auto'>
                    {role === 'admin' && (<div className='col-10 mx-auto text-center'><SearchFeeModal/></div>)}
                </div>
                <table className='table table-bordered table-striped table-hover'>
                    <thead>
                        <tr>
                            <th className='text-center align-middle' scope='col'>STT</th>
                            {role === 'admin' && (<th className='text-center align-middle' scope='col'>Mã căn hộ</th>)}
                            <th className='text-center align-middle' scope='col'>Tên khoản phí
                                {role === 'admin' && (
                                <div className="d-inline-block position-relative" ref={feeNameRef}>
                                <button
                                    onClick={() => setShowFilterFeeName(!showFilterFeeName)}
                                    className="btn"
                                    title="Lọc khoản phí"
                                ><i className='fa fa-filter'></i>
                                </button>
                                {showFilterFeeName && (
                                    <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
                                        <input 
                                            type="text" 
                                            name="filterFeeName" 
                                            value={filterFeeName} 
                                            placeholder="Khoản phí" 
                                            style={{ maxWidth: '150px', marginLeft: '10px', marginRight: '10px', marginTop: '10px' }}
                                            onChange={(e) => setFilterFeeName(e.target.value)}
                                        />
                                        <button className="dropdown-item" onClick={() => handleFeeNameFilter()}>Bỏ lọc</button>
                                    </div>
                                )}
                                </div>)}
                            </th>
                            <th className='text-center align-middle' scope='col'>Tháng/Năm
                                <div className="d-inline-block position-relative" ref={dateRef}>
                                <button
                                    onClick={() => setShowFilterDateMenu(!showFilterDateMenu)}
                                    className="btn"
                                    title="Lọc tháng năm"
                                ><i className='fa fa-filter'></i>
                                </button>
                                {showFilterDateMenu && (
                                    <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
                                        <input 
                                            type="number" 
                                            name="month" 
                                            value={month} 
                                            placeholder="Tháng" 
                                            style={{ maxWidth: '70px', marginLeft: '10px', marginRight: '10px', marginTop: '10px' }}
                                            onChange={(e) => setMonth(e.target.value)}
                                        />
                                        <input 
                                            type="number" 
                                            name="year" 
                                            value={year} 
                                            placeholder="Năm" 
                                            style={{ maxWidth: '70px', marginLeft: '10px', marginRight: '10px', marginTop: '10px' }}
                                            onChange={(e) => setYear(e.target.value)}
                                        />
                                        <button className="dropdown-item" onClick={() => handleDateFilter()}>Bỏ lọc</button>
                                    </div>
                                )}
                            </div>
                            </th>
                            <th className='text-center align-middle' scope='col'>Số tiền (VNĐ)</th>
                            <th className='text-center align-middle' scope='col'>Bắt buộc
                                {role === 'admin' && (
                                    <div className="d-inline-block position-relative" ref={isRequiredRef}>
                                        <button
                                            onClick={() => setShowFilterIsRequiredMenu(!showFilterIsRequiredMenu)}
                                            className="btn"
                                            title="Lọc bắt buộc hoặc không"
                                        ><i className='fa fa-filter'></i>
                                        </button>
                                        {showFilterIsRequiredMenu && (
                                            <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
                                                <button className="dropdown-item" onClick={() => handleIsRequiredFilter('all')}>Tất cả</button>
                                                <button className="dropdown-item" onClick={() => handleIsRequiredFilter('True')}>Có</button>
                                                <button className="dropdown-item" onClick={() => handleIsRequiredFilter('False')}>Không</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </th>
                            <th className='text-center align-middle' scope='col'>Hạn nộp
                                {role === 'admin' && (
                                    <div className="d-inline-block position-relative" ref={dueDateRef}>
                                        <button
                                            onClick={() => setShowFilterDueDateMenu(!showFilterDueDateMenu)}
                                            className="btn"
                                            title="Lọc hạn nộp"
                                        ><i className='fa fa-filter'></i>
                                        </button>
                                        {showFilterDueDateMenu && (
                                            <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
                                                <button className="dropdown-item" onClick={() => handleDueDateFilter('increase')}>Tăng dần</button>
                                                <button className="dropdown-item" onClick={() => handleDueDateFilter('decrease')}>Giảm dần</button>
                                                <button className="dropdown-item" onClick={() => handleDueDateFilter('all')}>Bỏ lọc</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </th>
                            <th className='text-center align-middle' scope='col'>Trạng thái
                                {role === 'admin' && (
                                    <div className="d-inline-block position-relative" ref={statusRef}>
                                        <button
                                            onClick={() => setShowFilterStatusMenu(!showFilterStatusMenu)}
                                            className="btn"
                                            title="Lọc trạng thái thanh toán"
                                        >
                                            <i className='fa fa-filter'></i>
                                        </button>
                                        {showFilterStatusMenu && (
                                            <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
                                                <button className="dropdown-item" onClick={() => handleStatusFilter('all')}>Tất cả</button>
                                                <button className="dropdown-item" onClick={() => handleStatusFilter('paid')}>Đã thanh toán</button>
                                                <button className="dropdown-item" onClick={() => handleStatusFilter('unpaid')}>Chưa thanh toán</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </th>
                            <th className='text-center align-middle' scope='col'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <>
                        {feeList && feeList.length > 0 ? (
                        feeList.map((item, index) => (
                            <tr key={`row-${index}`}>
                            <td className='text-center'>{(currentPage - 1)*10 + index + 1}</td>
                            {role === 'admin' && (<td className='text-center'>{item.apartmentCode}</td>)}
                            <td>{item.feeName}</td>
                            <td className='text-center'>{item.month || ''}</td>
                            <td className='text-center'>{item.amount || ''}</td>
                            <td className='text-center'>{item.isRequired ? 'Có' : 'Không'}</td>
                            <td className='text-center'>{item.dueDate}</td>
                            <td className='text-center'>{item.status === 'paid' ? 'Đã thanh toán' : item.status === 'unpaid' ? 'Chưa thanh toán' : 'Đã xóa'}</td>
                            <td className='text-center'>
                                <>
                                {role === 'admin' && item.status !== 'deleted' && (<span
                                    title='Chỉnh sửa'
                                    className='edit'
                                    onClick={()=> {item.status === 'unpaid' && hanldeEditApartmentFee(item) }}
                                ><i className='fa fa-edit'></i></span>)}
                                <span
                                    title={item.status === 'unpaid' ? 'Thanh toán' : 'Xem thông tin thanh toán'}
                                    className='payment'
                                    onClick={()=> {item.status === 'unpaid' ? handlePayment(item) : handleShowPaymentTransaction(item)}}
                                ><i className={item.status === 'unpaid' ? 'fa fa-usd' : 'fa fa-check'}></i></span>
                                </>    
                            </td>
                        </tr>)))
                        :
                        (
                            <tr><td colSpan={10} className="text-center">Không có dữ liệu</td></tr>
                        )}
                        </>
                    </tbody>
                </table>
                </div>
            {role === 'admin' &&(<div className='content-right mx-auto col-12 col-md-2'>
                <div className='custombtn'>
                    <button
                        onClick={() => handleAddNewFeeCollection()}
                        className="btn"
                    >Tạo bảng thu phí mới
                    </button>
                </div>
                <div className='custombtn'>
                    <button
                        onClick={() => handleAddNewFeeType()}
                        className="btn"
                    >Thêm khoản phí mới
                    </button>
                </div>
                <div className='custombtn'>
                    <button
                        onClick={() => handleUpdateFeeType()}
                        className="btn"
                    >Chỉnh sửa khoản phí
                    </button>
                </div>
                <div className='custombtn'>
                    <button
                        onClick={() => handleDeleteFeeType()}
                        className="btn"
                    >Xóa khoản phí
                    </button>
                </div>
                <div className='custombtn'>
                    <button
                        onClick={() => handleStatistics()}
                        className="btn"
                    >Thống kê
                    </button>
                </div>
            </div>)}
            </div>
        </div>
        <UpdateApartmentFeeModal
            show={showUpdateApartmentFeeModal}
            onClose={() => setShowUpdateApartmentFeeModal(false)}
            onSubmit={handleSubmitUpdateApartmentFee}
            feeName={selectedFee?.feeName}
            month={selectedFee?.month}
            apartmentCode={selectedFee?.apartmentCode}
            amount={selectedFee?.amount}
            dueDate={selectedFee?.dueDate}
        />
        <CreateNewFeeTypeModal
            show={showCreateNewFeeTypeModal}
            onClose={() => setShowCreateNewFeeTypeModal(false)}
            onSubmit={handleSubmitCreateNewFeeType}
            apartmentList={apartmentList}
        />
        <UpdateFeeTypeModal
            show={showUpdateFeeTypeModal}
            onClose={() => setShowUpdateFeeTypeModal(false)}
            onSubmit={handleSubmitUpdateFeeType}
            feeTypeList={feeTypeList}
            apartmentList={apartmentList}
        />
        <DeleteFeeTypeModal
            show={showDeleteFeeTypeModal}
            onClose={() => setShowDeleteFeeTypeModal(false)}
            onSubmit={handleSubmitDeleteFeeType}
            feeTypeList={feeTypeList}
        />
        <CreateNewFeeCollectionModal
            show={showCreateNewFeeCollectionModal}
            onClose={() => setShowCreateNewFeeCollectionModal(false)}
            onSubmit={handleSubmitAddNewFeeCollection}
        />
        <StatisticModal
            show={showStatisticModal}
            onClose={() => setShowStatisticModal(false)}
            onSubmit={handleSubmitStatisticModal}
        />
        <PaymentTransactionModal
            show={showPaymentTransactionModal}
            onClose={() => setShowPaymentTransactionModal(false)}
            apartmentFee={apartmentFee}
        />
        {totalPages > 1 && <ReactPaginate
            nextLabel="Sau >"
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            previousLabel="< Trước"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
            forcePage={currentPage - 1}
            className={'pagination justify-content-center'}
        />}
        </>
    )
}
export default Fee;