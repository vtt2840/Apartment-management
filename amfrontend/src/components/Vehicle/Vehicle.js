import './Vehicle.scss';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllVehicles, addNewVehicle, editVehicle, deleteOneVehicle } from '../../store/slices/vehicleSlice';
import addicon from '../../static/addicon.png';
import ReactPaginate from 'react-paginate';
import CreateNewVehicleModal from './CreateNewVehicleModal';
import UpdateVehicleModal from './UpdateVehicleModal';
import DeleteVehicleModal from './DeleteVehicleModal';
import axios from '../../setup/axios';
import { useClickAway } from '@uidotdev/usehooks';

const Vehicle = (props) => {
    const dispatch = useDispatch();
    const vehicleList = useSelector((state) => state.vehicle.vehicleList);
    const role = useSelector(state => state.auth.role);
    const selectedApartmentCode = useSelector(state => state.auth.selectedApartment);
    const totalCount = useSelector(state => state.vehicle.totalCount);

    const [query, setQuery] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [residentList, setResidentList] = useState([]);

    const [showDecreaseApartmentCode, setShowDecreaseApartmentCode] = useState(false);
    const [showType, setShowType] = useState('all');
    const [showFilterTypeMenu, setShowFilterTypeMenu] = useState(false);
    const [dateRegister, setDateRegister] = useState('all');
    const [showFilterDateRegisterMenu, setShowFilterDateRegisterMenu] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
 

    useEffect(() => {
        if(totalCount){
            setTotalPages(Math.ceil(totalCount/10)); //totalpages
        }
    }, [totalCount]);

    //get vehicle list
    useEffect(() => {
        if(query === null || query === ''){
            dispatch(getAllVehicles({
                apartmentCode: selectedApartmentCode,
                status: showStatus,
                page: currentPage,
                showDecreaseApartmentCode: showDecreaseApartmentCode,
                showType: showType !== 'all' ? showType : null,
                dateRegister: dateRegister !== 'all' ? dateRegister : null,
                query: null,
            }))
        }
    }, [dispatch, reloadTrigger, selectedApartmentCode, showStatus, currentPage, showDecreaseApartmentCode, showType, dateRegister, query==='']);

    const handleSearch = async () => {
        if(!query.trim()) return;
        try{
            dispatch(getAllVehicles({
                apartmentCode: null,
                status: false,
                page: currentPage,
                showDecreaseApartmentCode: false,
                showType: null,
                dateRegister: null,
                query: query,
            }));
        }catch(error){
            toast.error("Lỗi khi tìm kiếm phương tiện.");
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
    }, [showStatus, selectedApartmentCode])

    //handle page change
    const handlePageChange= (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    }

    //filter vehicle type
    const handleTypeFilter = (type) => {
        setShowType(type);
        setShowFilterTypeMenu(false); 
    };

    const typeRef = useClickAway(() => {
        setShowFilterTypeMenu(false);
    });

    //filter date register
    const handleDateRegisterFilter = (date) => {
        setDateRegister(date);
        setShowFilterDateRegisterMenu(false);
    }
      
    const dateRef = useClickAway(() => {
        setShowFilterDateRegisterMenu(false);
    });


    //get resident list to create/update vehicle
    useEffect(() => {
        const fetchResidents = async () => {
            try{
                const res = await axios.get('/residents/', {
                    params:{
                        apartmentCode: selectedApartmentCode,
                        showLeftResidents: false,
                        page_size: 100,
                    }
                });
                const data = res.data;
                const residents = Array.isArray(data.results) ? data.results : data;
                setResidentList(residents);
            }catch(error){
                toast.error("Không thể tải danh sách cư dân");
            }
        };
        if(selectedApartmentCode){
            fetchResidents();
        }
    }, [selectedApartmentCode]);

    //add new vehicle
    const handleAddVehicle = () => {
        setShowAddModal(true);
    }

    const handleSubmitAddVehicle = async(formData) => {
        try{
            await dispatch(addNewVehicle(formData));
            setReloadTrigger(prev => !prev);
            toast.success("Thêm phương tiện thành công!");
            setShowAddModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    //edit vehicle
    const hanldeEditVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowEditModal(true);
    }

    const handleSubmitEditVehicle = async(formData) => {
        try{
            await dispatch(editVehicle({vehicleId: selectedVehicle.vehicleId, data: formData}));
            setReloadTrigger(prev => !prev);
            toast.success("Chỉnh sửa phương tiện thành công!");
            setShowEditModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    //delete vehicle
    const handleDeleteVehicle = (vehicle) => {
        setSelectedVehicle(vehicle)
        setShowDeleteModal(true);
    }

    const handleSubmitDeleteVehicle = async(data) => {
        try{
            await dispatch(deleteOneVehicle(data));
            setReloadTrigger(prev => !prev);
            toast.success("Xóa phương tiện thành công!");
            setShowDeleteModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    return (
    <>
    <div className='container mt-4'>
        <div className='content-top row mx-auto my-3'>
            {role === 'admin' && (<div className='col-10 mx-auto text-center'>
                <div className="input-group mb-3">
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập từ khóa (Biển số, hãng xe, màu sắc)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(event) => handlePressEnter(event)}
                    style={{borderColor: 'white'}}
                    />
                    <button type="button"onClick={() => {setQuery('');  setReloadTrigger(prev => !prev);}} className="btn"><i className='fa fa-times'></i></button>
                    <button className="btn btn-success" onClick={() => { setCurrentPage(1); handleSearch(1);}}>
                    <i className='fa fa-search'></i>
                    </button>
                </div>
            </div>)}
            {role === 'resident' && (<div className='col-12 mx-auto text-end'>
                <button className='btn' onClick={()=> handleAddVehicle()}>
                    <img
                    src={addicon}
                    width="30"
                    height="30"
                    alt="Thêm phương tiện mới"/>Thêm phương tiện mới 
                </button>
            </div>)}
        </div>
        <table className="table table-bordered table-striped table-hover">
            <thead>
                <tr>
                    <th className='text-center align-middle' scope="col">STT</th>
                    {role === 'admin' && (<th className='text-center' scope="col">Mã căn hộ
                        {(query === null || query === '') && (
                        <button
                            onClick={() => setShowDecreaseApartmentCode(prev => !prev)}
                            className="btn"
                            title={showDecreaseApartmentCode ? 'Giảm dần' : 'Tăng dần'}
                        ><i className={`fa ${showDecreaseApartmentCode ? 'fa fa-caret-down' : 'fa fa-caret-up'}`}></i>
                        </button>)}
                    </th>)}
                    <th className='text-center align-middle' scope="col">Chủ xe</th>
                    <th className='text-center align-middle' scope="col">Số điện thoại</th>
                    <th className='text-center align-middle' scope="col">Biển số</th>
                    <th className='text-center' scope="col">Loại xe
                        {role === 'admin' && (query === null || query === '') && (
                            <div className="d-inline-block position-relative" ref={typeRef}>
                                <button
                                    onClick={() => setShowFilterTypeMenu(!showFilterTypeMenu)}
                                    className="btn"
                                    title="Lọc loại xe"
                                >
                                    <i className='fa fa-filter'></i>
                                </button>
                                {showFilterTypeMenu && (
                                    <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
                                        <button className="dropdown-item" onClick={() => handleTypeFilter('all')}>Tất cả</button>
                                        <button className="dropdown-item" onClick={() => handleTypeFilter('bike')}>Xe đạp</button>
                                        <button className="dropdown-item" onClick={() => handleTypeFilter('motorbike')}>Mô tô</button>
                                        <button className="dropdown-item" onClick={() => handleTypeFilter('car')}>Ô tô</button>
                                        <button className="dropdown-item" onClick={() => handleTypeFilter('other')}>Khác</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </th>
                    <th className='text-center align-middle' scope="col">Hãng</th>
                    <th className='text-center align-middle' scope="col">Màu sắc</th>
                    <th className='text-center' scope="col">Ngày đăng ký
                        {role === 'admin' && (query === null || query === '') && (
                            <div className="d-inline-block position-relative" ref={dateRef}>
                                <button
                                    onClick={() => setShowFilterDateRegisterMenu(!showFilterDateRegisterMenu)}
                                    className="btn"
                                    title="Lọc ngày đăng ký"
                                >
                                    <i className='fa fa-filter'></i>
                                </button>
                                {showFilterDateRegisterMenu && (
                                    <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
                                        <button className="dropdown-item" onClick={() => handleDateRegisterFilter('increase')}>Tăng dần</button>
                                        <button className="dropdown-item" onClick={() => handleDateRegisterFilter('decrease')}>Giảm dần</button>
                                        <button className="dropdown-item" onClick={() => handleDateRegisterFilter('all')}>Bỏ lọc</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </th>
                    {role === 'admin' && (<th className='text-center' scope="col">Trạng thái
                        {(query === null || query === '') && (
                            <button
                                onClick={() => setShowStatus(prev => !prev)}
                                className="btn"
                                title={showStatus ? 'Phương tiện đang sử dụng' : 'Phương tiện đã xóa'}
                            ><i className='fa fa-filter'></i>
                            </button>)}
                    </th>)}
                    {role === 'resident' && (<th className='text-center'>Hành động</th>)}
                </tr>
            </thead>
            <tbody>
                <>
                {vehicleList && vehicleList.length > 0 ? (
                vehicleList.map((item, index) => (
                    <tr key={`row-${index}`}>
                    <td className='text-center'>{(currentPage - 1)*10 + index + 1}</td>
                    {role === 'admin' && (<td className='text-center'>{item.apartmentCode}</td>)}
                    <td>{item.fullName}</td>
                    <td className='text-center'>{item.phoneNumber || ''}</td>
                    <td className='text-center'>{item.licensePlate || ''}</td>
                    <td className='text-center'>{item.vehicleType === 'car' ? 'Ô tô' : item.vehicleType === 'bike' ? 'Xe đạp' : item.vehicleType === 'motorbike' ? 'Mô tô' : 'Khác'}</td>
                    <td className='text-center'>{item.brand}</td>
                    <td className='text-center'>{item.color}</td>
                    <td className='text-center'>{item.timeregister || ''}</td>
                    {role === 'admin' && (<td className='text-center'>{item.status === 'inuse' ? 'Đang sử dụng' : 'Đã xóa'}</td>)}
                    {role === 'resident' && 
                    <>
                    <td className='text-center'>
                        <>
                        <span
                            title='Chỉnh sửa phương tiện'
                            className='editvehicle'
                            onClick={()=> hanldeEditVehicle(item)}
                        >{item.status === 'deleted' ? '' : <i className='fa fa-edit'></i>}</span>
                        <span
                            title='Xóa phương tiện'
                            className='deletevehicle'
                            onClick={()=> handleDeleteVehicle(item)}
                        >{item.status === 'deleted' ? '' : <i className='fa fa-trash'></i>}</span>
                        </>                            
                    </td>
                    </>}
                    </tr>)))
                    :
                    (
                        <tr><td colSpan={10} className="text-center">Không có dữ liệu</td></tr>
                    )}
                </>
            </tbody>
        </table>
        </div>
        <CreateNewVehicleModal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleSubmitAddVehicle}
            apartmentCode={selectedApartmentCode}
            residentList={residentList}
        />
        <UpdateVehicleModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleSubmitEditVehicle}
            vehicle={selectedVehicle}
            residentList={residentList}
        />
        <DeleteVehicleModal
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onSubmit={handleSubmitDeleteVehicle}
            vehicle={selectedVehicle?.vehicleId}
            licensePlate={selectedVehicle?.licensePlate}
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

export default Vehicle;