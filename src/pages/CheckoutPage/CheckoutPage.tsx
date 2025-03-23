import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
    const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
    });
    const navigate = useNavigate();

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 2;
    const total = subtotal + deliveryFee;

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProceedToPayment = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.phone) {
            alert('Please fill in all delivery information fields.');
            return;
        }

        const order = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            items: cart,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            total: total,
            status: 'Đang xử lý',
            deliveryInfo: formData,
        };

        // Lấy lịch sử đặt hàng từ localStorage
        const orderHistory = localStorage.getItem('orderHistory');
        const orders = orderHistory ? JSON.parse(orderHistory) : [];

        // Thêm đơn hàng mới vào lịch sử
        orders.push(order);
        localStorage.setItem('orderHistory', JSON.stringify(orders));

        // Xóa giỏ hàng sau khi thanh toán
        localStorage.removeItem('cart');
        setCart([]);

        alert('Đặt hàng thành công! Bạn có thể xem lịch sử đặt hàng trong trang "Lịch sử đặt hàng".');
        navigate('/');
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="delivery-info">
                    <h3 className="section-title">Delivery Information</h3>
                    <div className="form-row">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>

                <div className="cart-total">
                    <h3 className="section-title">Cart Total</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery fee</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button onClick={handleProceedToPayment} className="payment-button">
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;