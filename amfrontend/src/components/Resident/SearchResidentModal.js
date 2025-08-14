import { useState, useEffect } from 'react';
import { Modal, Button} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { searchResidents } from '../../services/userService';
import ReactPaginate from "react-paginate";

const SearchResidentModal = () => {
    const [query, setQuery] = useState('');
    const [residents, setResidents] = useState([]);
    const [show, setShow] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const handleSearch = async (page) => {
        if (!query.trim()) return;
        try{
            const response = await searchResidents({keyword: query, page});
            const pages = Math.ceil(response.data.count / 10);
            setTotalPages(pages);
            if(!response.data.results || response.data.results.length === 0){
                toast.info("Không tìm thấy cư dân phù hợp!");
            }else{
                setResidents(response.data.results);
                setShow(true);
            }
        }catch(error){
            toast.error("Lỗi khi tìm kiếm cư dân!");
        }
    };

    useEffect(() => {
        handleSearch(currentPage);
    }, [currentPage]);
    
    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1); 
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
            placeholder="Nhập từ khóa (Họ tên, email, quê quán, SĐT, CCCD)"
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
                        <td className='text-center'>{(currentPage - 1)*10 + index + 1}</td>
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
};


export default SearchResidentModal;
