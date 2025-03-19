import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo libero viverra dapibus odio sit malesuada in quis. Arcu tristique elementum viverra integer id.
                    </p>
                    <div className= "social-icons">
                        <a href="#" aria-label="Facebook"><span className="icon facebook" /></a>
                        <a href="" aria-label="Twitter"><span className="icon twitter" /></a>
                        <a href="" aria-label="Instagram"><span className="icon instagram" /></a>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Opening</h3>
                    <p>Mon-Fri: 09:00am-10:00pm</p>
                    <p>Sat-Sun: 09:00am-11:00pm</p>
                </div>
                <div className="footer-section">
                    <h3>User Link</h3>
                    <p>About Us</p>
                    <p>Contact Us</p>
                    <p>Oder Delivery</p>
                    <p>Payment & Tex</p>
                    <p>Terms of Services</p>
                </div>
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>100 Nguyen Xien</p>
                    <p>Thanh Xuan, Ha Noi</p>
                    <p>+0123 456 7891</p>
                    <div className="email-input">
                        <input type="email" placeholder="Enter your email..." />
                        <button type="submit">→</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;