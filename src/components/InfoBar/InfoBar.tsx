import './InfoBar.css';

import clock from '../../assets/clock.png';
import location from '../../assets/location.png';
import phone from '../../assets/phone.png';

const InfoBar = () => {
    return (
        <div className="info-bar-container">
            <div className="info-bar">
                <div className="info-item">
                    <img src={clock} alt="item"/>
                    <span>24/7</span>
                    <span>Giờ hoạt động</span>
                </div>
                <div className="info-item">
                    <img src={location} alt="item"/>
                    <span>Thanh Xuân, Hà Nội</span>
                    <span>Our Location</span>
                </div>
                <div className="info-item">
                    <img src={phone} alt="item"/>
                    <span>+84 973 870 244</span>
                    <span>Phone Number</span>
                </div>
            </div>
        </div>
    );
};

export default InfoBar;