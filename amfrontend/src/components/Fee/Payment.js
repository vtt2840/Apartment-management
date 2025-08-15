import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from '../../setup/axios';
import { toast } from 'react-toastify';

const Payment = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const apartmentFee = searchParams.get("apartmentFee");
    const [fee, setFee] = useState(null);
    const [status, setStatus] = useState("unpaid");

    useEffect(() => {
        const handleShowApartmentFee = async () => {
            try {
                const res = await axios.get('/apartmentfee/', {
                    params: {
                        page_size: 1000,
                        apartmentFeeId: apartmentFee,
                    }
                });
                setFee(res.data.results[0]);
            } catch (err) {
                console.log(err);
            }
        }
        handleShowApartmentFee();
    }, [apartmentFee]);


    const checkPaymentStatus = async () => {
        if (status === "unpaid") {
            try {
                const res = await axios.post("/check-payment-status/", {apartmentFee});
                if (res.data.payment_status === "paid") {
                    setStatus("paid");
                    toast.success("Thanh toán thành công!");
                    navigate("/fee");
                }
            } catch (err) {
                console.error("Lỗi khi kiểm tra thanh toán:", err);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(checkPaymentStatus, 1000);
        return () => clearInterval(interval);
    }, [status]);


    useEffect(() => {})
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                {/* QR + Thông tin ngân hàng */}
                <div className="col-12 col-md-5 px-5 py-4 bg-white shadow rounded">
                    <div className='text-center'>
                    <img
                        src={`https://qr.sepay.vn/img?acc=270427082004&bank=MBBank&amount=${fee?.amount}&des=KhoanPhi${apartmentFee}&template=compact`}
                        alt="QR Code"
                        className="mb-3"
                        style={{ height: '250px', width: '250px', objectFit: 'contain' }}
                    />
                    </div>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <td>Ngân hàng:</td>
                                <td><b>MBBank</b></td>
                            </tr>
                            <tr>
                                <td>Chủ tài khoản:</td>
                                <td><b>Nguyễn Mạnh Hải</b></td>
                            </tr>
                            <tr>
                                <td>Số TK:</td>
                                <td><b>270427082004</b></td>
                            </tr>
                            <tr>
                                <td>Số tiền:</td>
                                <td><b>{fee?.amount} VNĐ</b></td>
                            </tr>
                            <tr>
                                <td>Nội dung CK:</td>
                                <td><b>KhoanPhi{apartmentFee}</b></td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-danger">Lưu ý: Nhập đúng nội dung chuyển khoản để xác nhận giao dịch thành công.</p>
                </div>

                {/* Thông tin thanh toán */}
                <div className="col-12 col-md-3 px-5 py-4 bg-white shadow rounded ms-md-4 mt-4 mt-md-0">
                    <h4 className="mb-4 bold">Thông tin thanh toán</h4>
                    <p><strong>Căn hộ:</strong> {fee?.apartmentCode}</p>
                    <p><strong>Tên khoản phí:</strong> {fee?.feeName}</p>
                    <p><strong>Tháng/Năm:</strong> {fee?.month}</p>
                    <p><strong>Số tiền:</strong> {fee?.amount} VNĐ</p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
