import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const SearchVehicleModal = () => {
    const [query, setQuery] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [show, setShow] = useState(false);

    const handleSearch = async () => {
        if(!query.trim()) return;
        try{
            const response = null;
            if(response.data.length === 0){
                toast.info("Không tìm thấy phương tiện phù hợp!");
            }else{
                setVehicles(response.data);
                setShow(true);
            }
        }catch(error){
            toast.error("Lỗi khi tìm kiếm phương tiện!");
        }
    };
    const handleClose = () => setShow(false);

    return(
        <>
        <div className="input-group">
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập từ khóa"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={handleSearch}>
                    <i className='fa fa-search'></i>
                    </button>
                </div>
        
                <Modal show={show} onHide={handleClose} size="xl" centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Kết quả tìm kiếm phương tiện</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {vehicles.length === 0 ? (
                        <p>Không tìm thấy phương tiện nào.</p>
                    ) : (
                        <div className="container">
                        <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th className='text-center' scope="col">STT</th>
                                <th className='text-center' scope="col">Mã căn hộ</th>
                                <th className='text-center' scope="col">Chủ xe</th>
                                <th className='text-center' scope="col">Số điện thoại</th>
                                <th className='text-center' scope="col">Biển số</th>
                                <th className='text-center' scope="col">Loại xe</th>
                                <th className='text-center' scope="col">Hãng</th>
                                <th className='text-center' scope="col">Màu sắc</th>
                                <th className='text-center' scope="col">Ngày đăng ký</th>
                                <th className='text-center' scope="col">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((item, index) => (
                            <tr key={`row-${index}`}>
                                <td className='text-center'>{index + 1}</td>
                                <td className='text-center'>{item.apartmentCode}</td>
                                <td>{item.fullName}</td>
                                <td className='text-center'>{item.phoneNumber || ''}</td>
                                <td className='text-center'>{item.licensePlate || ''}</td>
                                <td className='text-center'>{item.vehicleType === 'car' ? 'Ô tô' : item.vehicleType === 'bike' ? 'Xe đạp' : item.vehicleType === 'motorbike' ? 'Mô tô' : 'Khác'}</td>
                                <td className='text-center'>{item.brand}</td>
                                <td className='text-center'>{item.color}</td>
                                <td className='text-center'>{item.timeregister || ''}</td>
                                <td className='text-center'>{item.status === 'inuse' ? 'Đang sử dụng' : 'Đã xóa'}</td>
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
}

export default SearchVehicleModal;