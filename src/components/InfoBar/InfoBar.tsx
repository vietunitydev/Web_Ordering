import './InfoBar.css';

const InfoBar = () => {
    return (
        <div className="info-bar">
            <div className="info-item">
                <span className="icon">⏰</span>
                <span>24/7</span>
                <span>Giờ hoạt động</span>
            </div>
            <div className="info-item">
                <span className="icon">📍</span>
                <span>Thanh Xuân, Hà Nội</span>
                <span>Our Location</span>
            </div>
            <div className="info-item">
                <span className="icon">📞</span>
                <span>+84 973 870 244</span>
                <span>Phone Number</span>
            </div>
        </div>
    );
};

export default InfoBar;