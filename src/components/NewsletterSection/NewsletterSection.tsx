import './NewsletterSection.css'; // Import file CSS
import burgere from '../../assets/burger1.png';

const NewsletterSection = () => {
    return (
        <div className="newsletter-container">
            <img
                src={burgere}
                alt="Burger"
                className="burger-image"
            />

            <div className="text-form-container">
                <h2>Đăng ký nhận bản tin của chúng tôi</h2>
                <form className="email-form">
                    <input type="email" placeholder="Type your email..." />
                    <button type="submit">SUBSCRIBE</button>
                </form>
            </div>
        </div>
    );
};

export default NewsletterSection;