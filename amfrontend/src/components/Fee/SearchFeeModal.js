import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const SearchFeeModal = () => {
    const [query, setQuery] = useState('');
    const [fee, setFee] = useState([]);
    const [show, setShow] = useState(false);

    const handleSearch = async () => {
        if(!query.trim()) return;
        try{
            // const response = await searchApartments(query);
            // if(response.data.length === 0){
            //     toast.info("Không tìm thấy căn hộ phù hợp.");
            // }else{
            //     setApartments(response.data);
            //     setShow(true);
            // }
        }catch(error){
            toast.error("Lỗi khi tìm kiếm khoản phí!");
        }
    };

    
    const handleClose = () => setShow(false);

    return (
        <>
        <div className="input-group mb-3">
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
            <Modal.Title>Kết quả tìm kiếm khoản phí</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {fee.length === 0 ? (
                <p>Không tìm thấy khoản phí nào.</p>
            ) : (
                <div className="container">
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
                    </tr>
                </thead>
                <tbody>
                    {fee.map((item, index) => (
                    <tr key={`row-${index}`}>
                        <td className='text-center'>{index+1}</td>
                        <td className='text-center'>{item.apartmentCode}</td>
                        <td>{item.owner ? item.owner.fullName : ''}</td>
                        <td>{item.owner ? item.owner.email : ''}</td>
                        <td className='text-center'>{item.floor}</td>
                        <td className='text-center'>{item.area}</td>
                        <td>{item.status === 'active' ? 'Đã bán' : 'Chưa bán'}</td>
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
    );
};

export default SearchFeeModal;
