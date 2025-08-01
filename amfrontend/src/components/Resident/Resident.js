import './Resident.scss';
import React , {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllResidents, addNewResident, deleteOneResident, registerTemporaryResidence, registerTemporaryAbsence, cancelTempStatus, editResident } from '../../store/slices/residentSlice';
import addicon from '../../static/addicon.png';
import CreateNewResidentModal from './CreateNewResidentModal';
import DeleteResidentModal from './DeleteResidentModal';
import RegisterTempModal from './RegisterTempModal';
import CancelRegisterTempModal from './CancelRegisterTempModal';
import EditResidentModal from './EditResidentModal';
import SearchResidentModal from './SearchResidentModal';
import ReactPaginate from 'react-paginate';
import TemporaryAbsenceDetailModal from './TemporaryAbsenceDetailModal';
import TemporaryResidenceDetailModal from './TemporaryResidenceDetailModal';
import { getTemporaryAbsenceDetail, getTemporaryResidenceDetail } from '../../services/userService';


const Resident = (props) => {
    const dispatch = useDispatch();
    const {residentList, loading, error} = useSelector((state) => state.resident);
    const role = useSelector(state => state.auth.role);
    const selectedApartmentCode = useSelector(state => state.auth.selectedApartment);

    const [selectedResident, setSelectedResident] = useState(null);
    const [showLeftResidents, setShowLeftResidents] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRegisterTempModal, setShowRegisterTempModal] = useState(false);
    const [showCancelRegisterTempModal, setShowCancelRegisterTempModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [rawResidents, setRawResidents] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
        
    const [absenceDetail, setAbsenceDetail] = useState(null);
    const [showAbsenceModal, setShowAbsenceModal] = useState(false);
    const [residenceDetail, setResidenceDetail] = useState(null);
    const [showResidenceModal, setShowResidenceModal] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await dispatch(getAllResidents(currentPage));
                setRawResidents(res.payload.results);
            } catch (err) {
                toast.error("Có lỗi xảy ra, vui lòng thử lại!");
            }
        };
        fetchData();
    }, [dispatch, reloadTrigger]);

    useEffect(() => {
        const expandedResidents = rawResidents.flatMap((item) =>
            item.apartment
                .filter((apt) => showLeftResidents || apt.isMember === true)
                .map((apt) => ({
                    ...item,
                    apartmentCode: apt.apartmentCode,
                    isOwner: apt.isOwner,
                    isMember: apt.isMember
                }))
        );

        const sortedResidents = [...expandedResidents].sort((a, b) =>
            a.apartmentCode.localeCompare(b.apartmentCode) || a.residentId - b.residentId
        );

        const pageSize = 10;
        const start = (currentPage - 1) * pageSize;
        const paginated = sortedResidents.slice(start, start + pageSize);

        setPaginatedData(paginated);
        setTotalPages(Math.ceil(sortedResidents.length / pageSize));
    }, [rawResidents, currentPage, showLeftResidents]);

    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1); 
    };    

    const filteredLeftResidents = Array.isArray(residentList) ? residentList.filter(resident => resident.apartment?.some(item => item.isMember !== false && item.apartmentCode === selectedApartmentCode)): [];

    //add new resident
    const handleAddResident = () => {
        setShowAddModal(true);
    }
    const handleSubmitAddResident = async(formData)=> {
        const data = {
            ...formData,
            apartment_code: selectedApartmentCode,
            gender: formData.gender === 'Nam' ? 'male' : formData.gender === 'Nữ' ? 'female' : formData.gender
        };
        try{
            await dispatch(addNewResident(data));
            setReloadTrigger(prev => !prev);
            toast.success("Thêm cư dân thành công!");
            setShowAddModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    //edit resident
    const hanldeEditResident = (resident) => {
        setSelectedResident(resident);
        setShowEditModal(true);
    }

    const handleSubmitEditResident = async (formData) => {
        try{
            const data = {
                ...formData,
                residentId: selectedResident.residentId,
                gender: formData.gender === 'Nam' ? 'male' : formData.gender === 'Nữ' ? 'female' : formData.gender
            }
            await dispatch(editResident(data));
            setReloadTrigger(prev => !prev);
            toast.success("Chỉnh sửa thông tin cư dân thành công!");
            setShowEditModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    //delete resident
    const handleDeleteResident = (resident) => {
        const isOwner = resident.apartment?.some(
            (item) => item.isOwner === true && item.apartmentCode === selectedApartmentCode
        );
        if (isOwner) {
            toast.error("Chủ hộ chỉ được xóa khi khóa tài khoản căn hộ!");
            return;
        }
        setSelectedResident(resident);
        setShowDeleteModal(true);
    }

    const handleSubmitDeleteResident = async(data)=>{
        try{
            await dispatch(deleteOneResident(data));
            setReloadTrigger(prev => !prev);
            toast.success("Xóa cư dân thành công!");
            setShowDeleteModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    //register temporary status
    const handleRegisterTemp = (resident) => {
        setSelectedResident(resident);
        setShowRegisterTempModal(true);
    }
    const handleSubmitRegisterTemp = async(formData) => {
        try{
            if(formData.typeRegister === 'temporaryabsence'){
                const data = {
                    resident_id: formData.resident_id,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    reason: formData.reason,
                    destination: formData.destination
                }
                await dispatch(registerTemporaryAbsence(data));
                setReloadTrigger(prev => !prev);
                toast.success("Đăng ký tạm vắng thành công!");
            }else{
                const data = {
                    resident_id: formData.resident_id,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    reason: formData.reason
                }
                await dispatch(registerTemporaryResidence(data));
                setReloadTrigger(prev => !prev);
                toast.success("Đăng ký tạm trú thành công!");
            }
            setShowRegisterTempModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    //cancel temporary status
    const handleCancelRegisterTemp = (resident) => {
        setSelectedResident(resident);
        setShowCancelRegisterTempModal(true)

    }
    const handleSubmitCancelRegisterTemp = async(data) => {
        try{
            await dispatch(cancelTempStatus(data));
            setReloadTrigger(prev => !prev);
            toast.success("Hủy đăng ký thành công!");
            setShowCancelRegisterTempModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    const handleViewAbsenceDetail = async (absenceId) => {
        try {
            console.log(absenceId); 
            const res = await getTemporaryAbsenceDetail(absenceId);
            console.log(res.data);
            setAbsenceDetail(res.data); 
            setShowAbsenceModal(true);
        } catch (err) {
            toast.error("Không tìm thấy thông tin tạm vắng!");
        }
    };
    const handleViewResidenceDetail = async (absenceId) => {
        try {
            console.log(absenceId); 
            const res = await getTemporaryResidenceDetail(absenceId);
            console.log(res.data);
            setResidenceDetail(res.data); 
            setShowResidenceModal(true);
        } catch (err) {
            toast.error("Không tìm thấy thông tin tạm trú!");
        }
    };


    return (
        <>
        <div className='container mt-4'>
        <div className='content-top row mx-auto my-3'>
            {role === 'admin' && (<div className='col-10 mx-auto text-center'><SearchResidentModal/></div>)}
            {role === 'resident' && (<div className='col-12 mx-auto text-end'>
                <button className='btn' onClick={()=> handleAddResident()}>
                    <img
                    src={addicon}
                    width="30"
                    height="30"
                    alt="Thêm cư dân mới"
                    />Thêm cư dân mới 
                </button>
                
            </div>)}
        </div>
        <table className="table table-bordered table-striped table-hover">
            <thead>
                <tr>
                    <th className='text-center' scope="col">STT</th>
                    {role === 'admin' && (<th className='text-center' scope="col">Mã căn hộ</th>)}
                    <th className='text-center' scope="col">Họ tên</th>
                    <th className='text-center' scope="col">Email</th>
                    <th className='text-center' scope="col">Ngày sinh</th>
                    <th className='text-center' scope="col">Giới tính</th>
                    <th className='text-center' scope="col">Quê quán</th>
                    <th className='text-center' scope="col">Số điện thoại</th>
                    <th className='text-center' scope="col">CCCD</th>
                    <th className='text-center' scope="col">
                        Trạng thái
                        {role === 'admin' && (
                            <button
                                onClick={() => setShowLeftResidents(prev => !prev)}
                                className="btn btn-sm btn-light ms-2"
                                title={showLeftResidents ? 'Ẩn cư dân đã rời đi' : 'Hiện cư dân đã rời đi'}
                            >
                                <i className={`fa ${showLeftResidents ? 'fa fa-sign-in' : 'fa fa-sign-out'}`}></i>
                            </button>
                        )}
                    </th>
                    {role === 'resident' && (<th className='text-center' scope="col">Tạm trú / Tạm vắng</th>)}
                    {role === 'resident' && (<th className='text-center'>Hành động</th>)}
                </tr>
            </thead>
            <tbody>
                <>
                    {role === 'admin' && paginatedData && paginatedData.length > 0 &&(
                    paginatedData.map((item, index) => (
                        <tr key={`row-${index}`}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td className='text-center'>{item.apartmentCode}</td>
                        <td>{item.fullName}</td>
                        <td>{item.email}</td>
                        <td>{item.dateOfBirth || ''}</td>
                        <td className='text-center'>{item.gender ? (item.gender === 'male' ? 'Nam' : 'Nữ') : '---'}</td>
                        <td>{item.hometown || ''}</td>
                        <td>{item.phoneNumber || ''}</td>
                        <td>{item.idNumber || ''}</td>
                        <td className='text-center'>{
                            item.isMember === false ? 'Rời đi' : 
                                item.status === 'living' ? 'Thường trú' : 
                                    item.status === 'temporaryabsence' ? (
                                        <span
                                            className='text-temp'
                                            title='Xem thông tin'
                                            onClick={() => handleViewAbsenceDetail(item.absence_id)}
                                        >
                                            Tạm vắng
                                        </span>
                                    ) : 
                                    (
                                        <span
                                            className='text-temp'
                                            title='Xem thông tin'
                                            onClick={() => handleViewResidenceDetail(item.residence_id)}
                                        >
                                            Tạm trú
                                        </span>
                                    )
                        }</td>
                        </tr>
                        
                    )))}

                    {role === 'resident' && filteredLeftResidents && filteredLeftResidents.length > 0 &&(
                    filteredLeftResidents.map((item, index) => (
                        <tr key={`row-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.fullName}</td>
                        <td>{item.email}</td>
                        <td>{item.dateOfBirth || ''}</td>
                        <td className='text-center'>{item.gender ? (item.gender === 'male' ? 'Nam' : 'Nữ') : '---'}</td>
                        <td>{item.hometown || ''}</td>
                        <td>{item.phoneNumber || ''}</td>
                        <td>{item.idNumber || ''}</td>
                        <td className='text-center'>{item.status === 'living' ? 'Thường trú' : (item.status === 'temporaryabsence' ? 'Tạm vắng' : 'Tạm trú')}</td>
                        <td className='text-center'>
                            <span
                                title={item.status === 'living' ? 'Đăng ký tạm trú/tạm vắng' : 'Hủy tạm trú/tạm vắng'}
                                className='registertemp'
                                onClick={()=>{item.status === 'living' ?  handleRegisterTemp(item) : handleCancelRegisterTemp(item)}}
                            >{item.status === 'left' ? '' : (item.status === 'living' ? <i className='fa fa-plus'></i> : <i className='fa fa-ban'></i>)}
                            </span>
                        </td>
                        <td className='text-center'>
                            <>
                            <span
                                title='Chỉnh sửa cư dân'
                                className='editresident'
                                onClick={()=> hanldeEditResident(item)}
                            >{item.status === 'left' ? '' : <i className='fa fa-edit'></i>}</span>
                            <span
                                title='Xóa cư dân'
                                className='deleteresident'
                                onClick={()=> handleDeleteResident(item)}
                            >{item.status === 'left' ? '' : <i className='fa fa-trash'></i>}</span>
                            </>                            
                        </td>
                        </tr>
                    )))}
                </>
            </tbody>
        </table>
        </div>
        <CreateNewResidentModal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleSubmitAddResident}
            apartmentCode={selectedApartmentCode}
        />
        <DeleteResidentModal
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onSubmit={handleSubmitDeleteResident}
            resident={selectedResident?.residentId}  
            name={selectedResident?.fullName}          
        />
        <RegisterTempModal
            show={showRegisterTempModal}
            onClose={() => setShowRegisterTempModal(false)}
            onSubmit={handleSubmitRegisterTemp}
            resident={selectedResident?.residentId}
            name={selectedResident?.fullName}
        />
        <CancelRegisterTempModal
            show={showCancelRegisterTempModal}
            onClose={() => setShowCancelRegisterTempModal(false)}
            onSubmit={handleSubmitCancelRegisterTemp}
            resident={selectedResident?.residentId}
            name={selectedResident?.fullName}
        />
        <EditResidentModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleSubmitEditResident}
            resident={selectedResident}
        />
        <TemporaryAbsenceDetailModal
            show={showAbsenceModal}
            onClose={() => setShowAbsenceModal(false)}
            data={absenceDetail}
        />
        <TemporaryResidenceDetailModal
            show={showResidenceModal}
            onClose={() => setShowResidenceModal(false)}
            data={residenceDetail}
        />

        {role === 'admin' && (<ReactPaginate
            nextLabel="Sau >"
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
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
        />)}
        </>
    )
}

export default Resident;