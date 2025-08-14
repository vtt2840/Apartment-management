import { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { searchVehicles } from "../../services/userService";
import ReactPaginate from "react-paginate";

const SearchVehicleModal = () => {
    const [query, setQuery] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [show, setShow] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const handleSearch = async (page) => {
        if(!query.trim()) return;
        try{
            const response = await searchVehicles({keyword: query, page});
            const pages = Math.ceil(response.data.count / 10);
            setTotalPages(pages);
            if(!response.data.results || response.data.results.length === 0){
                toast.info("Không tìm thấy phương tiện phù hợp!");
            }else{
                setVehicles(response.data.results);
                setShow(true);
            }
        }catch(error){
            toast.error("Lỗi khi tìm kiếm phương tiện!");
        }
    };

    useEffect(() => {
        handleSearch(currentPage);
    }, [currentPage]);
    
    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1); 
    };

    const handleClose = () => setShow(false);

    const handlePressEnter = (event)=> {
        if(event.code === "Enter"){
            setCurrentPage(1);
            handleSearch(1);
        }
    }

    return(
        <>
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                placeholder="Nhập từ khóa (Biển số, hãng, màu sắc)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(event) => handlePressEnter(event)}
            />
            <button className="btn btn-success" onClick={() => {setCurrentPage(1); handleSearch(1);}}>
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
                                <td className='text-center'>{(currentPage - 1)*10 + index + 1}</td>
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
                {totalPages > 1 && <ReactPaginate
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
                />}
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