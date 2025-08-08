import './Fee.scss';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { useSelector, useDispatch } from 'react-redux';
import { getNewFeeCollection } from '../../store/slices/feeSlice';
import SearchFeeModal from './SearchFeeModal';

const Fee = (props) => {
    const dispatch = useDispatch();
    const feeList = useSelector((state) => state.fee.feeList);
    const role = useSelector(state => state.auth.role);
    const selectedApartmentCode = useSelector(state => state.auth.selectedApartment);
    const totalCount = useSelector(state => state.fee.totalCount);
    
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFee, setSelectedFee] = useState(null);

    const [showFilterDateMenu, setShowFilterDateMenu] = useState(false);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [filterIsRequired, setFilterIsRequired] = useState('all');
    const [showFilterIsRequiredMenu, setShowFilterIsRequiredMenu] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilterStatusMenu, setShowFilterStatusMenu] = useState(false);
    const [filterDueDate, setFilterDueDate] = useState('all');
    const [showFilterDueDateMenu, setShowFilterDueDateMenu] = useState(false);

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
        }));
        console.log(feeList);
    }, [dispatch, reloadTrigger, , currentPage, month, year, currentPage, selectedApartmentCode, filterIsRequired, filterStatus, filterDueDate]);
    
    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [showStatus])
    
        //handle page change
    const handlePageChange= (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    }
    
    //filter date
    const handleDateFilter = (sortOrder) => {
        setMonth(null); 
        setYear(null);
        setShowFilterDateMenu(false);
    };

    //filter isRequired?

    const handleIsRequiredFilter = (isRequired) => {
        setFilterIsRequired(isRequired);
        setShowFilterIsRequiredMenu(false); 
    };

    //filter status
    const handleStatusFilter = (status) => {
        setFilterStatus(status);
        setShowFilterStatusMenu(false); 
    };

    //filter duedate
    const handleDueDateFilter = (duedate) => {
        setFilterDueDate(duedate);
        setShowFilterDueDateMenu(false);
    }

    const hanldeEdit = () => {};
    const handlePayment = () => {};
    const handleAddNewFeeCollection = () => {};

    const handleAddNewFeeType = () => {};

    const handleDeleteFeeType = () => {};

    const handleUpdateFeeType = () => {};

    const handleStatistics = () => {};
    
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
                            <th className='text-center align-middle' scope='col'>Tên khoản phí</th>
                            <th className='text-center align-middle' scope='col'>Tháng/Năm
                                <div className="d-inline-block position-relative">
                                <button
                                    onClick={() => setShowFilterDateMenu(!showFilterDateMenu)}
                                    className="btn"
                                    title="Lọc tháng năm"
                                >
                                    <i className='fa fa-filter'></i>
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
                                        <button className="dropdown-item" onClick={() => handleDateFilter('all')}>Bỏ lọc</button>
                                    </div>
                                )}
                            </div>
                            </th>
                            <th className='text-center align-middle' scope='col'>Số tiền (VNĐ)</th>
                            <th className='text-center align-middle' scope='col'>Bắt buộc
                                {role === 'admin' && (
                                    <div className="d-inline-block position-relative">
                                        <button
                                            onClick={() => setShowFilterIsRequiredMenu(!showFilterIsRequiredMenu)}
                                            className="btn"
                                            title="Lọc bắt buộc hoặc không"
                                        >
                                            <i className='fa fa-filter'></i>
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
                                    <div className="d-inline-block position-relative">
                                        <button
                                            onClick={() => setShowFilterDueDateMenu(!showFilterDueDateMenu)}
                                            className="btn"
                                            title="Lọc hạn nộp"
                                        >
                                            <i className='fa fa-filter'></i>
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
                                    <div className="d-inline-block position-relative">
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
                            <td className='text-center'>{item.status == 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                            <td className='text-center'>
                                <>
                                {role === 'admin' && (<span
                                    title='Chỉnh sửa'
                                    className='edit'
                                    onClick={()=> hanldeEdit(item)}
                                ><i className='fa fa-edit'></i></span>)}
                                <span
                                    title='Thanh toán'
                                    className='payment'
                                    onClick={()=> handlePayment(item)}
                                ><i className={item.status == 'unpaid' ? 'fa fa-usd' : 'fa fa-check'}></i></span>
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