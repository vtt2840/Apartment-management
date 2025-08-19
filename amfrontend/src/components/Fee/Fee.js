import './Fee.scss';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { useSelector, useDispatch } from 'react-redux';
import { getNewFeeCollection, editApartmentFee, addNewFeeCollection } from '../../store/slices/feeSlice';
import UpdateApartmentFeeModal from './UpdateApartmentFeeModal';
import CreateNewFeeCollectionModal from './CreateNewFeeCollectionModal';
import PaymentTransactionModal from './PaymentTransactionModal';
import { useNavigate} from 'react-router-dom';
import { useClickAway } from '@uidotdev/usehooks';

const Fee = (props) => {
    const dispatch = useDispatch();
    const feeList = useSelector((state) => state.fee.feeList);
    const role = useSelector(state => state.auth.role);
    const selectedApartmentCode = useSelector(state => state.auth.selectedApartment);
    const totalCount = useSelector(state => state.fee.totalCount);

    const [query, setQuery] = useState(null);
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
    const [showCreateNewFeeCollectionModal, setShowCreateNewFeeCollectionModal] = useState(false);
    const [showPaymentTransactionModal, setShowPaymentTransactionModal] = useState(false);

    useEffect(() => {
        if(totalCount){
            setTotalPages(Math.ceil(totalCount/10)); //totalpages
        }
    }, [totalCount]);
    
    //get fee list
    useEffect(() => {
        if(query === null || query === ''){
            dispatch(getNewFeeCollection({
                page: currentPage,
                apartment_code: selectedApartmentCode,
                month: month ? month : 'latest',
                year: year ? year : 'latest',
                isRequired: filterIsRequired !== 'all' ? filterIsRequired : null,
                status: filterStatus !== 'all' ? filterStatus : null,
                dueDate: filterDueDate !== 'all' ? filterDueDate : null,
                feeName: filterFeeName ? filterFeeName : null,
                query: null,
            }));
        }
    }, [dispatch, reloadTrigger, currentPage, month, year, selectedApartmentCode, filterIsRequired, filterStatus, filterDueDate, filterFeeName, query==='']);
    
    const handleSearch = async () => {
        if(!query.trim()) return;
        try{
            dispatch(getNewFeeCollection({
                page: currentPage,
                apartment_code: null,
                month: 'latest',
                year: 'latest',
                isRequired: null,
                status: null,
                dueDate: null,
                feeName: null,
                query: query,
            }));
        }catch(error){
            toast.error("Lỗi khi tìm kiếm khoản phí.");
        }
    };

    useEffect(() => {
        if(query !== null && query !== ''){
            handleSearch();
        }
    }, [currentPage, reloadTrigger])
    
    const handlePressEnter = (event)=> {
        if(event.code === "Enter"){
            setCurrentPage(1);
            handleSearch(1);
        }
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, filterFeeName])

    
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

    const navigate = useNavigate();
    const handleManageFeeType = () => {
        navigate('/feetype');
    }

    const handleStatistics = () => {
        navigate('/statistics');
    }

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
                    {role === 'admin' && (<div className='col-10 mx-auto text-center'>
                        <div className="input-group mb-3">
                            <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập từ khóa (Mã căn hộ, tên khoản phí)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(event) => handlePressEnter(event)}
                            style={{borderColor: 'white'}}
                            />
                            <button type="button"onClick={() => {setQuery('');  setReloadTrigger(prev => !prev);}} className="btn"><i className='fa fa-times'></i></button>
                            <button className="btn btn-success" onClick={() => { setCurrentPage(1); handleSearch();}}>
                            <i className='fa fa-search'></i>
                            </button>
                        </div>
                    </div>)}
                    {role === 'resident' && (
                        <div className='custombtn'>
                            <button
                                onClick={() => handleManageFeeType()}
                                className="btn"
                            >Thông tin các khoản phí
                            </button>
                        </div>
                    )}
                </div>
                <table className='table table-bordered table-striped table-hover'>
                    <thead>
                        <tr>
                            <th className='text-center align-middle' scope='col'>STT</th>
                            {role === 'admin' && (<th className='text-center align-middle' scope='col'>Mã căn hộ</th>)}
                            <th className='text-center align-middle' scope='col'>Tên khoản phí
                                {role === 'admin' && (query === null || query === '') && (
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
                                {(query === null || query === '') &&(
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
                            </div>)}
                            </th>
                            <th className='text-center align-middle' scope='col'>Số tiền (VNĐ)</th>
                            <th className='text-center align-middle' scope='col'>Bắt buộc
                                {role === 'admin' && (query === null || query === '') && (
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
                                {role === 'admin' && (query === null || query === '') && (
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
                                {role === 'admin' && (query === null || query === '') && (
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
                        onClick={() => handleManageFeeType()}
                        className="btn"
                    >Quản lý các khoản phí
                    </button>
                </div>
                <div className='custombtn'>
                    <button
                        onClick={() => handleStatistics()}
                        className="btn"
                    >Thống kê khoản phí
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
        <CreateNewFeeCollectionModal
            show={showCreateNewFeeCollectionModal}
            onClose={() => setShowCreateNewFeeCollectionModal(false)}
            onSubmit={handleSubmitAddNewFeeCollection}
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