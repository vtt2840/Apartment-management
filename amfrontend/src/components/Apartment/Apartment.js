import './Apartment.scss';
import React , {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllApartments, addNewAccount, deactiveAccount, assignAccount, editApartment } from '../../store/slices/apartmentSlice';
import CreateNewAccountModal from './CreateNewAccountModal';
import LockAccountModal from './LockAccountModal';
import EditApartmentModal from './EditApartmentModal';
import SearchApartmentModal from './SearchApartmentModal';
import { checkAccountExists } from '../../services/userService';
import ReactPaginate from "react-paginate";

const Apartment = (props) => {
    const dispatch = useDispatch();
    const role = useSelector(state => state.auth.role);
    const selectedApartmentCode = useSelector(state => state.auth.selectedApartment);

    const [selectedApartment, setSelectedApartment] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [reloadTrigger, setReloadTrigger] = useState(false);

    const fetchAllApartments = async () => {
        try {
            let allResults = [];
            let page = 1;
            let hasNext = true;

            while (hasNext) {
                const res = await dispatch(getAllApartments(page));
                const { results, next } = res.payload;

                if (Array.isArray(results)) {
                    allResults = [...allResults, ...results];
                }
                if (next) {
                    page += 1;
                } else {
                    hasNext = false;
                }
            }
            const filtered = role === 'resident'
                ? allResults.filter(item => item.apartmentCode === selectedApartmentCode)
                : allResults;

            setPaginatedData(filtered.slice((currentPage - 1) * 10, currentPage * 10));
            setTotalPages(Math.ceil(filtered.length / 10));
        } catch (err) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };
    
    useEffect(() => {
        fetchAllApartments();
    }, [currentPage, dispatch, role, selectedApartmentCode, reloadTrigger]);


    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1); 
    };
    
    //add new account if apartment.status == inactive
    const hanldeAddNewAccount = (apartment)=> {
        if(apartment.status === 'active'){
            toast.error("Căn hộ đã có tài khoản!");
            return;
        }
        setSelectedApartment(apartment);
        setShowAddModal(true);
    }

    const checkAccount = async (formData) => {
        try {
            const res = await checkAccountExists(formData);
            if (res.status === 200) {
                return res.data.pkid;
            }
        } catch (err) {
            let temp = 'not found'; //new account
            if (err.response?.status === 400) {
                const detail = err.response?.data?.detail;
                if (detail === "Wrong password") {
                    toast.error("Vui lòng kiểm tra lại mật khẩu!");
                    return false;
                }
                if (detail === "Email taken") {
                    toast.error("Kiểm tra lại chủ hộ nếu muốn đăng ký tài khoản đã tồn tại cho căn hộ mới!");
                    return false;
                }
            }
            if (err.response?.status === 404) {
                return temp; 
            }
            toast.error("Lỗi hệ thống, vui lòng thử lại sau!");
            return false;
        }
    };

    const handleSubmitNewAccount = async(formData) => {
        const data = {
            ...formData,
            apartment_code: selectedApartment.apartmentCode,
        };
        try{
            const accountId = await checkAccount(formData); 
            const olddata = {
                email: formData.email,
                apartmentCode: selectedApartment.apartmentCode,
                account_id: accountId,
            };
            if(accountId && accountId !== 'not found'){
                await dispatch(assignAccount(olddata));
                setReloadTrigger(prev => !prev);
                //await dispatch(getAllApartments());
                toast.success("Thêm tài khoản vào căn hộ thành công!");
                setShowAddModal(false);
            } 
            if(accountId === 'not found'){
                await dispatch(addNewAccount(data));
                setReloadTrigger(prev => !prev);
                //await dispatch(getAllApartments());
                toast.success("Tạo tài khoản mới thành công!");
                setShowAddModal(false);
            }
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
            console.log(err);
        }        
    };

    //lock account to turn apartment.status to inactive, so that admin can add new account and the old account cant be used to login
    const handleLockAccount = (apartment)=> {
        if(apartment.status === 'inactive'){
            toast.error("Căn hộ chưa có tài khoản!");
            return;
        }
        setSelectedApartment(apartment);
        setShowLockModal(true);
    }
    const handleSubmitLockAccount = async (data) => {
        try{
            await dispatch(deactiveAccount(data));
            setReloadTrigger(prev => !prev);
            //await dispatch(getAllApartments());
            toast.success("Khóa tài khoản thành công!");
            setShowLockModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    const handleEditApartment = (apartment) => {
        setSelectedApartment(apartment);
        setShowEditModal(true);
    }

    const handleSubmitEditApartment = async(formData) => {
         try{
            await dispatch(editApartment(formData));
            setReloadTrigger(prev => !prev);
            await dispatch(getAllApartments());
            toast.success("Chỉnh sửa thông tin căn hộ thành công!");
            setShowEditModal(false);
        }catch(err){
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    return (
        <>
        <div className='container mt-4'>
        {role === 'admin' && (<div className='col-10 mx-auto text-center'><SearchApartmentModal/></div>)}
        <table className="table table-bordered table-striped table-hover">
            <thead>
                <tr>
                    <th className='text-center' scope="col">STT</th>
                    <th className='text-center' scope="col">Mã căn hộ</th>
                    <th className='text-center' scope="col">Chủ hộ</th>
                    <th className='text-center' scope="col">Email</th>
                    <th className='text-center' scope="col">Tầng</th>
                    <th className='text-center' scope="col">Diện tích (m2)</th>
                    <th className='text-center' scope="col">Trạng thái</th>
                    {role === 'admin' && (<th className='text-center'>Hành động</th>)}
                </tr>
            </thead>
            <tbody>
                <>
                    {paginatedData.map((item, index) => (
                        <tr key={`row-${index}`}>
                            <td className='text-center'>{(currentPage - 1) * 10 + index + 1}</td>
                            <td className='text-center'>{item.apartmentCode}</td>
                            <td>{item.owner ? item.owner.fullName : ''}</td>
                            <td>{item.owner ? item.owner.email : ''}</td>
                            <td className='text-center'>{item.floor}</td>
                            <td className='text-center'>{item.area}</td>
                            <td>{item.status === 'active' ? 'Đã bán' : 'Chưa bán'}</td>
                            {role === 'admin' && (<td className='text-center'>
                                <>
                                    <span
                                        title='Thêm tài khoản mới cho căn hộ'
                                        className='addnewaccount'
                                        onClick={()=> hanldeAddNewAccount(item)}
                                    ><i className='fa fa-plus'></i></span>
                                    <span
                                        title='Khóa tài khoản căn hộ'
                                        className='lockaccount'
                                        onClick={()=> handleLockAccount(item)}
                                    ><i className='fa fa-lock'></i></span>
                                    <span
                                        title='Chỉnh sửa thông tin căn hộ'
                                        className='editapartment'
                                        onClick={()=> handleEditApartment(item)}
                                    ><i className='fa fa-edit'></i></span>
                                    </>
                            </td>)}
                        </tr>
                    ))}
                </>
            </tbody>
        </table>
        <CreateNewAccountModal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleSubmitNewAccount}
            apartmentCode={selectedApartment?.apartmentCode}
        />
        <LockAccountModal
            show={showLockModal}
            onClose={() => setShowLockModal(false)}
            onSubmit={handleSubmitLockAccount}
            apartmentCode={selectedApartment?.apartmentCode}
        />
        <EditApartmentModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleSubmitEditApartment}
            apartment={selectedApartment}
        />
        </div>
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

export default Apartment;