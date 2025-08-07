import './Home.scss';
import skylake_img from '../../static/skylake-img.jpg';
import car from '../../static/car-icon.png';
import home from '../../static/house-icon.png';
import resident from '../../static/resident-icon.png';
import { useState, useEffect } from 'react';
import axios from '../../setup/axios';

const Home = (props) => {
    const [countHome, setCountHome] = useState("");
    const [countResident, setCountResident] = useState("");
    const [countVehicle, setCountVehicle] = useState("");

    //count apartments
    useEffect(() => {
        const fetchApartments = async () => {
            try{
                const res = await axios.get('/apartments', {
                    params:{
                        apartmentCode: null,
                        page_size: 1000,
                    }
                })
                const data = res.data;
                setCountHome(data.count);
            }catch(err){
                console.log(err);
            }
        }
        fetchApartments();
    });
    
    //count vehicles
    useEffect(() => {
        const fetchVehicles = async () => {
            try{
                const res = await axios.get('/vehicles/', {
                    params:{
                        apartmentCode: null,
                        showDeletedVehicles: false,
                        page_size: 1000,
                    }
                })
                const data = res.data;
                setCountVehicle(data.count);
            }catch(err){
                console.log(err);
            }
        }
        fetchVehicles();
    });

    //count residents
    useEffect(() => {
        const fetchResidents = async () => {
            try{
                const res = await axios.get('residents/count/', {
                    params:{
                        page_size: 100,
                    }
                });
                const data = res.data;
                setCountResident(data.count);
            }catch(err){
                console.log(err);
            }
        };
        fetchResidents();
    });
    
    return(
        <>
        <div className='container py-4'>
            <div className="row align-items-center">
                <div className='content-left col-lg-6 col-12 mb-3 mb-md-0 text-center'>
                    <img 
                        src={skylake_img}
                        className="img-fluid rounded shadow"
                        alt="Skylake"
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                    />
                </div>
                <div className='content-right col-lg-6 col-12'>
                    <h3 className='fw-bold mb-3'>Tổng quan về căn hộ Skylake</h3>
                    <p className='content-right-top'>
                        Dự án Skylake tọa lạc tại khu vực giao cắt giữa hai trục đường trung tâm là Phạm Hùng 
                        và Dương Đình Nghệ, thuộc khu vực lõi trung tâm hành chính, kinh tế mới Mỹ Đình. Cơ sở 
                        hạ tầng giao thông được quy hoạch đồng bộ cùng sự xuất hiện của những tòa nhà hành chính
                        cấp cao, các địa điểm thương mại, vui chơi giải trí, trung tâm hội nghị lớn,… tại khu vực 
                        khiến Skylake trở thành địa chỉ đầu tư không thể bỏ qua với nhiều tiềm năng hấp dẫn.
                    </p>
                    <div className='content-right-bottom row px-3'>
                        <div className='count-home'>
                            <img
                                src={home}
                                alt="home"
                                style={{ maxHeight: '27px', objectFit: 'cover', marginRight:'10px' }}
                            />
                            Căn hộ
                            <div>{countHome}</div>
                        </div>
                        <div className='count-resident'>
                            <img
                                src={resident}
                                alt="resident"
                                style={{ maxHeight: '27px', objectFit: 'cover', marginRight:'10px' }}
                            />
                            Cư dân
                            <div>{countResident}</div>
                        </div>
                        <div className='count-vehicle'>
                            <img
                                src={car}
                                alt="vehicle"
                                style={{ maxHeight: '30px', objectFit: 'cover', marginRight:'10px' }}
                            />
                            Phương tiện
                            <div>{countVehicle}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home;
