import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { searchApartments } from '../../services/userService';
import ReactPaginate from "react-paginate";

const SearchApartmentModal = () => {
    const [query, setQuery] = useState('');
    const [apartments, setApartments] = useState([]);
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const handleSearch = async (page) => {
        if(!query.trim()) return;
        try{
            const response = await searchApartments({keyword: query, page});
            const pages = Math.ceil(response.data.count / 10);
            setTotalPages(pages);
            if(!response.data.results || response.data.results.length === 0){
                toast.info("Không tìm thấy căn hộ phù hợp.");
            }else{
                setApartments(response.data.results);
                setShow(true);
            }
        }catch(error){
            toast.error("Lỗi khi tìm kiếm căn hộ.");
        }
    };

    useEffect(() => {
        handleSearch(currentPage);
    }, [currentPage]);
    
    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1); 
    };
    
    const handleClose = () => setShow(false);

    return (
        <>
        <div className="input-group mb-3">
            <input
            type="text"
            className="form-control"
            placeholder="Nhập từ khóa (Mã căn hộ, chủ hộ, email)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-success" onClick={() => { setCurrentPage(1); handleSearch(1);}}>
            <i className='fa fa-search'></i>
            </button>
        </div>

        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
            <Modal.Title>Kết quả tìm kiếm căn hộ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                    {apartments.map((item, index) => (
                    <tr key={`row-${index}`}>
                        <td className='text-center'>{(currentPage - 1)*10 + index+1}</td>
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
    );
};

export default SearchApartmentModal;
