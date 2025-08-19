import './Fee.scss';
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../setup/axios';
import { checkFeeNameExists } from '../../services/userService';
import { addNewFeeType, getAllFeeTypes, editFeeType, deleteOneFeeType } from '../../store/slices/feeSlice';
import CreateNewFeeTypeModal from './CreateNewFeeTypeModal';
import UpdateFeeTypeModal from './UpdateFeeTypeModal';
import DeleteFeeTypeModal from './DeleteFeeTypeModal';
import addicon from '../../static/addicon.png';

const FeeType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const feeTypeList = useSelector(state => state.fee.feeTypeList);
    const totalTypes = useSelector(state => state.fee.totalTypes);
    const role = useSelector(state => state.auth.role);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [apartmentList, setApartmentList] = useState([]);

    const [showUpdateFeeTypeModal, setShowUpdateFeeTypeModal] = useState(false);
    const [showDeleteFeeTypeModal, setShowDeleteFeeTypeModal] = useState(false);
    const [showCreateNewFeeTypeModal, setShowCreateNewFeeTypeModal] = useState(false);

    useEffect(() => {
        if(totalTypes){
            setTotalPages(Math.ceil(totalTypes/10));
        }
    }, [totalTypes]);

    useEffect(() => {
        dispatch(getAllFeeTypes({
            page: currentPage,
        }));
    }, [dispatch, reloadTrigger, currentPage]);

    useEffect(() => {
        const fetchApartments = async () => {
            try{
                const res = await axios.get('/apartments/', {
                    params:{
                        apartmentCode: null,
                        status: 'sold',
                        page_size: 1000,
                        query: null,
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
    }, [showCreateNewFeeTypeModal, showUpdateFeeTypeModal]);

    //handle page change
    const handlePageChange= (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    }

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
    const handleDeleteFeeType = (item) => {
        setSelectedFeeType(item);
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
    const handleUpdateFeeType = (item) => {
        setSelectedFeeType(item);
        setShowUpdateFeeTypeModal(true);
    };

    const handleSubmitUpdateFeeType = async(formData) => {
        try{
            const data = {
                feeName: formData?.feeName,
                typeDescription: formData?.typeDescription || '',
                isRequired: formData?.isRequired,
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

    const handleBack = () => {
        navigate('/fee');
    }

    return(
        <>
        <div className='container mt-4'>
            <div className='content-top row mx-auto my-3'>
                <div className='col-2 mx-auto text-start'>
                    <button className='btn' onClick={() => handleBack()}>
                        <i class="fa fa-angle-left" style={{color: 'green'}}> Quay lại</i>
                        
                    </button>
                </div>
                <div className='col-10 mx-auto text-end'>
                    {role === 'admin' &&(<button className='btn' onClick={()=> handleAddNewFeeType()}>
                        <img
                        src={addicon}
                        width="30"
                        height="30"
                        alt="Thêm khoản phí mới"/>Thêm khoản phí mới 
                    </button>)}
                </div>
            </div>
            <table className='table table-bordered table-striped table-hover '>
                <thead>
                    <tr>
                        <th className='text-center align-middle' scope='col'>STT</th>
                        <th className='text-center align-middle' scope='col'>Tên khoản phí</th>
                        <th className='text-center align-middle' scope='col'>Bắt buộc</th>
                        <th className='text-center align-middle' scope='col'>Số tiền mặc định</th>
                        <th className='text-center align-middle' scope='col'>Căn hộ áp dụng</th>
                        <th className='text-center align-middle' scope='col' style={{width: '300px'}}>Mô tả</th>
                        {role === 'admin' && (<th className='text-center align-middle' scope='col'>Hành động</th>)}
                    </tr>
                </thead>
                <tbody>
                    <>
                    {feeTypeList && feeTypeList.length > 0 ? (
                        feeTypeList.map((item, index) => (
                            <tr key={`row-${index}`}>
                                <td className='text-center'>{(currentPage - 1)*10 + index + 1}</td>
                                <td>{item.feeName}</td>
                                <td className='text-center'>{item.isRequired ? 'Có' : 'Không'}</td>
                                <td className='text-center'>{item.amountDefault > 0 ? item.amountDefault : 'Không có'}</td>
                                <td>{item.appliedScope === 'all' ? 'Tất cả' 
                                : role === 'resident' ? 'Một số căn hộ' 
                                : Array.isArray(item.applicableApartments) ? item.applicableApartments.join(', ') 
                                : item.applicableApartments}</td>
                                <td>{item.typeDescription}</td>
                                {role === 'admin' && (<td className='text-center'>
                                    <>
                                    <span
                                        title='Chỉnh sửa khoản phí'
                                        className='editfeetype'
                                        onClick={()=> handleUpdateFeeType(item)}
                                    ><i className='fa fa-edit'></i></span>
                                    <span
                                        title='Xóa khoản phí'
                                        className='deletefeetype'
                                        onClick={()=> handleDeleteFeeType(item)}
                                    ><i className='fa fa-trash'></i></span>
                                    </>                            
                                </td>)}
                            </tr>
                        ))
                    )
                    :
                    (
                        <tr><td colSpan={10} className="text-center">Không có dữ liệu</td></tr>
                    )}
                    </>
                </tbody>
            </table>
        </div>
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
            selectedFeeType={selectedFeeType}
            apartmentList={apartmentList}
        />
        <DeleteFeeTypeModal
            show={showDeleteFeeTypeModal}
            onClose={() => setShowDeleteFeeTypeModal(false)}
            onSubmit={handleSubmitDeleteFeeType}
            selectedFeeType={selectedFeeType}
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

export default FeeType;