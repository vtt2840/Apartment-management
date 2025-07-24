import './Apartment.scss';
import React , {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllApartments, addNewAccount } from '../../store/slices/apartmentSlice';
import CreateNewAccountModal from './CreateNewAccountModal';
import LockAccountModal from './LockAccountModal';

const Apartment = (props) => {
    const dispatch = useDispatch();
    const {apartmentList, loading, error} = useSelector((state) => state.apartment);

    const [selectedApartment, setSelectedApartment] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);

    const role = useSelector(state => state.auth.role);
    const apartmentCode = useSelector(state => state.auth.apartment);
    
    const filteredApartments = role === 'resident' ? apartmentList.filter(item => item.apartmentCode === apartmentCode) : apartmentList;

    useEffect(()=>{
        dispatch(getAllApartments())   ;   
    }, [dispatch]);

    useEffect(()=>{
        if(error) {
            toast.error(error.message)
        }
    }, [error]);

    
    //add new account if apartment.status == inactive
    const hanldeAddNewAccount = (apartment)=> {
        if(apartment.status === 'active'){
            toast.error("Căn hộ đã có tài khoản!");
            return;
        }
        setSelectedApartment(apartment);
        setShowAddModal(true);
    }

    const handleSubmitNewAccount = (formData) => {
        const data = {
            ...formData,
            apartment: selectedApartment.apartmentCode,
        };

        dispatch(addNewAccount(data));
        dispatch(getAllApartments());
        setShowAddModal(false);
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
    const handleSubmitLockAccount = (formData) => {
        const data = { ...formData, apartment: selectedApartment.apartmentCode,};
        dispatch(getAllApartments);
        setShowLockModal(false);
    }

    return (
        <>
        <div className='container mt-3'>
        <h4>Search</h4>
        <table className="table table-bordered table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Mã căn hộ</th>
                    <th scope="col">Chủ hộ</th>
                    <th scope="col">Email</th>
                    <th scope="col">Tầng</th>
                    <th scope="col">Diện tích(m2)</th>
                    <th scope="col">Trạng thái</th>
                    {role === 'admin' && (<th>Hành động</th>)}
                </tr>
            </thead>
            <tbody>
                <>
                    {filteredApartments.map((item, index) => {
                        return (
                            <tr key={`row-${index}`}>
                                <td>{index+1}</td>
                                <td>{item.apartmentCode}</td>
                                <td>{item.owner ? item.owner.fullName : '---'}</td>
                                <td>{item.owner ? item.owner.email : '---'}</td>
                                <td>{item.floor}</td>
                                <td>{item.area}</td>
                                <td>{item.status === 'active' ? 'Đã bán' : 'Chưa bán'}</td>
                                <td>
                                    {role === 'admin' && (
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
                                        </>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
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
        </div>
        </>
    )
}

export default Apartment;