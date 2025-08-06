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
import UpdateResidentModal from './UpdateResidentModal';
import SearchResidentModal from './SearchResidentModal';
import ReactPaginate from 'react-paginate';
import TemporaryAbsenceDetailModal from './TemporaryAbsenceDetailModal';
import TemporaryResidenceDetailModal from './TemporaryResidenceDetailModal';
import { getTemporaryAbsenceDetail, getTemporaryResidenceDetail } from '../../services/userService';

const Resident = (props) => {
    const dispatch = useDispatch();
    const residentList = useSelector((state) => state.resident.residentList);
    const role = useSelector(state => state.auth.role);
    const selectedApartmentCode = useSelector(state => state.auth.selectedApartment);
    const totalCount = useSelector(state => state.resident.totalCount);

    const [selectedResident, setSelectedResident] = useState(null);
    const [showLeftResidents, setShowLeftResidents] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRegisterTempModal, setShowRegisterTempModal] = useState(false);
    const [showCancelRegisterTempModal, setShowCancelRegisterTempModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(false);
        
    const [absenceDetail, setAbsenceDetail] = useState(null);
    const [showAbsenceModal, setShowAbsenceModal] = useState(false);
    const [residenceDetail, setResidenceDetail] = useState(null);
    const [showResidenceModal, setShowResidenceModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
  
    useEffect(() => {
        if(totalCount){
            setTotalPages(Math.ceil(totalCount/10)); //total pages
        }
    }, [totalCount]);

    //get resident list
    useEffect(() => {
        dispatch(getAllResidents({
            apartmentCode: selectedApartmentCode, 
            showLeftResidents: showLeftResidents, 
            page: currentPage}));
    }, [dispatch, reloadTrigger, selectedApartmentCode, showLeftResidents, currentPage]);

    //if showleftresident render to page 1
    useEffect(() => {
        setCurrentPage(1); 
    }, [showLeftResidents]);


    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1); 
    };

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
                gender: formData.gender === 'Nam' ? 'male' : formData.gender === 'Nữ' ? 'female' : formData.gender
            }
            await dispatch(editResident({ residentId: selectedResident.residentId, data }));
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
        try{ 
            const res = await getTemporaryAbsenceDetail(absenceId);
            setAbsenceDetail(res.data); 
            setShowAbsenceModal(true);
        }catch(err){
            toast.error("Không tìm thấy thông tin tạm vắng!");
        }
    }
    const handleViewResidenceDetail = async (residenceId) => {
        try{
            const res = await getTemporaryResidenceDetail(residenceId);
            setResidenceDetail(res.data); 
            setShowResidenceModal(true);
        }catch(err){
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
                    alt="Thêm cư dân mới"/>Thêm cư dân mới 
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
                    <th className='text-center' scope="col">Trạng thái
                        {role === 'admin' && (
                            <button
                                onClick={() => setShowLeftResidents(prev => !prev)}
                                className="btn btn-sm btn-light ms-2"
                                title={showLeftResidents ? 'Ẩn cư dân đã rời đi' : 'Hiện cư dân đã rời đi'}
                            ><i className={`fa ${showLeftResidents ? 'fa fa-sign-in' : 'fa fa-sign-out'}`}></i>
                            </button>)}
                    </th>
                    {role === 'resident' && (<th className='text-center' scope="col">Tạm trú / Tạm vắng</th>)}
                    {role === 'resident' && (<th className='text-center'>Hành động</th>)}
                </tr>
            </thead>
            <tbody>
                <>
                {residentList && residentList.length > 0 ? (
                residentList.map((item, index) => (
                    <tr key={`row-${index}`}>
                    <td className='text-center'>{(currentPage - 1)*10 + index + 1}</td>
                    {role === 'admin' && (<td className='text-center'>{item.apartmentCode}</td>)}
                    <td>{item.fullName}</td>
                    <td>{item.email}</td>
                    <td>{item.dateOfBirth || ''}</td>
                    <td className='text-center'>{item.gender ? (item.gender === 'male' ? 'Nam' : 'Nữ') : '---'}</td>
                    <td>{item.hometown || ''}</td>
                    <td>{item.phoneNumber || ''}</td>
                    <td>{item.idNumber || ''}</td>
                    {role === 'admin' && (<td className='text-center'>{
                        item.isMember === false ? 'Rời đi' : 
                            item.status === 'living' ? 'Thường trú' : 
                                item.status === 'temporaryabsence' ? (
                                    <span
                                        className='text-temp'
                                        title='Xem thông tin'
                                        onClick={() => handleViewAbsenceDetail(item.absence_id)}
                                    >Tạm vắng
                                    </span>) 
                                : (
                                    <span
                                        className='text-temp'
                                        title='Xem thông tin'
                                        onClick={() => handleViewResidenceDetail(item.residence_id)}
                                    >Tạm trú
                                    </span>)
                    }</td>)}
                    {role === 'resident' && 
                    <>
                    <td className='text-center'>{
                        item.status === 'living' ? 'Thường trú' : 
                        item.status === 'temporaryabsence' ? (
                            <span
                                className='text-temp'
                                title='Xem thông tin'
                                onClick={() => handleViewAbsenceDetail(item.absence_id)}
                            > Tạm vắng
                            </span>)  
                        : (
                            <span
                                className='text-temp'
                                title='Xem thông tin'
                                onClick={() => handleViewResidenceDetail(item.residence_id)}
                            >Tạm trú
                            </span>)
                    }</td>
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
        <UpdateResidentModal
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

export default Resident;
