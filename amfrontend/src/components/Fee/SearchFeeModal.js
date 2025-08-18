import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ReactPaginate from "react-paginate";
import { searchFee } from '../../services/userService';

const SearchFeeModal = () => {
    const [query, setQuery] = useState('');
    const [fee, setFee] = useState([]);
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const handleSearch = async (page) => {
        if(!query.trim()) return;
        try{
            const response = await searchFee({keyword: query, page});
            const pages = Math.ceil(response.data.count / 10);
            setTotalPages(pages);
            if(!response.data.results || response.data.results.length === 0){
                toast.info("Không tìm thấy khoản phí phù hợp.");
            }else{
                setFee(response.data.results);
                setShow(true);
            }
        }catch(error){
            toast.error("Lỗi khi tìm kiếm khoản phí!");
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

    return (
        <>
        <div className="input-group mb-3">
            <input
            type="text"
            className="form-control"
            placeholder="Nhập từ khóa (Mã căn hộ, tên khoản phí)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(event) => handlePressEnter(event)}
            style={{borderColor: 'white'}}
            />
            <button type="button"onClick={() => setQuery("")} className="btn"><i className='fa fa-times'></i></button>
            <button className="btn btn-success" onClick={() => {setCurrentPage(1); handleSearch(1);}}>
            <i className='fa fa-search'></i>
            </button>
        </div>

        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
            <Modal.Title>Kết quả tìm kiếm khoản phí</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                <table className="table table-bordered table-striped table-hover">
                <thead>
                    <tr>
                    <th className='text-center' scope="col">STT</th>
                    <th className='text-center' scope="col">Mã căn hộ</th>
                    <th className='text-center' scope="col">Tên khoản phí</th>
                    <th className='text-center' scope="col">Tháng/Năm</th>
                    <th className='text-center' scope="col">Số tiền (VNĐ)</th>
                    <th className='text-center' scope="col">Bắt buộc</th>
                    <th className='text-center' scope="col">Hạn nộp</th>
                    <th className='text-center' scope="col">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {fee.map((item, index) => (
                    <tr key={`row-${index}`}>
                        <td className='text-center'>{(currentPage - 1)*10 + index+1}</td>
                        <td className='text-center'>{item.apartmentCode}</td>
                        <td>{item.feeName}</td>
                        <td className='text-center'>{item.month}</td>
                        <td className='text-center'>{item.amount}</td>
                        <td className='text-center'>{item.isRequired ? 'Có' : 'Không'}</td>
                        <td>{item.dueDate}</td>
                        <td className='text-center'>{item.status == 'paid' ? 'Đã thanh toán' : item.status == 'unpaid' ? 'Chưa thanh toán' : 'Đã xóa'}</td>
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

export default SearchFeeModal;