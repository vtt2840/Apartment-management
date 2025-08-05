import './Home.scss';
import skylake_img from '../../static/skylake-img.jpg';

const Home = (props) => {
    
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
                    <div className='content-right-bottom'></div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home;
