import { useState } from 'react';
import { Modal, Button} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { searchResidents } from '../../services/userService';

const SearchResidentModal = () => {
    const [query, setQuery] = useState('');
    const [residents, setResidents] = useState([]);
    const [show, setShow] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        try{
            const response = await searchResidents(query);
            if(response.data.length === 0){
                toast.info("Không tìm thấy cư dân phù hợp!");
            }else{
                setResidents(response.data);
                setShow(true);
            }
        }catch(error){
            toast.error("Lỗi khi tìm kiếm cư dân!");
        }
    };
    
    const expandedResidents = residents.flatMap((item) =>
        item.apartment
        .map((apt) => ({
            ...item,
            apartmentCode: apt.apartmentCode,
            isOwner: apt.isOwner,
            isMember: apt.isMember
        }))
    );

    const sortedResidents = [...expandedResidents].sort((a, b) =>
        a.apartmentCode.localeCompare(b.apartmentCode)
    );

    const handleClose = () => setShow(false);

    return(
        <>
        <div className="input-group">
            <input
            type="text"
            className="form-control"
            placeholder="Nhập từ khóa (Họ tên, email, quê quán, SĐT, CCCD)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleSearch}>
            <i className='fa fa-search'></i>
            </button>
        </div>

        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
            <Modal.Title>Kết quả tìm kiếm cư dân</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {sortedResidents.length === 0 ? (
                <p>Không tìm thấy cư dân nào.</p>
            ) : (
                <div className="container">
                <table className="table table-bordered table-striped table-hover">
                <thead>
                    <tr>
                    <th className='text-center' scope="col">STT</th>
                    <th className='text-center' scope="col">Mã căn hộ</th>
                    <th className='text-center' scope="col">Họ tên</th>
                    <th className='text-center' scope="col">Email</th>
                    <th className='text-center' scope="col">Ngày sinh</th>
                    <th className='text-center' scope="col">Giới tính</th>
                    <th className='text-center' scope="col">Quê quán</th>
                    <th className='text-center' scope="col">Số điện thoại</th>
                    <th className='text-center' scope="col">CCCD</th>
                    <th className='text-center' scope="col">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedResidents.map((item, index) => (
                    <tr key={`row-${index}`}>
                        <td className='text-center'>{index + 1}</td>
                        <td className='text-center'>{item.apartmentCode}</td>
                        <td>{item.fullName}</td>
                        <td>{item.email}</td>
                        <td className='text-center'>{item.dateOfBirth || ''}</td>
                        <td className='text-center'>{item.gender === 'male' ? 'Nam' : 'Nữ'}</td>
                        <td className='text-center'>{item.hometown || ''}</td>
                        <td className='text-center'>{item.phoneNumber || ''}</td>
                        <td className='text-center'>{item.idNumber || ''}</td>
                        <td className='text-center'>{item.isMember === false ? 'Rời đi' : item.status === 'living' ? 'Thường trú' : item.isMember === true ? 'Thường trú' : (item.status === 'temporaryabsence' ? 'Tạm vắng' : 'Tạm trú')}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
                </div>
            )}
            </Modal.Body>
            <Modal.Footer>
            <Button className='cancelbtn' variant="secondary" onClick={handleClose}>
                Đóng
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
};


export default SearchResidentModal;
