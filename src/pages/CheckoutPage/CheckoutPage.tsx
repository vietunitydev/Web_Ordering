import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Đảm bảo đã cài đặt axios
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
    const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        address: '',
        phone: '',
    });
    const navigate = useNavigate();

    // Lấy thông tin giỏ hàng và người dùng từ server hoặc localStorage khi component mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Please log in to proceed.');
                    navigate('/login');
                    return;
                }

                // Lấy giỏ hàng từ server (giả sử bạn có endpoint /api/carts/my-cart)
                const cartResponse = await axios.get('http://localhost:4999/api/carts/my-cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const cartItems = cartResponse.data.list.map((item: any) => ({
                    id: item.foodItemId._id,
                    name: item.foodItemId.title,
                    price: item.foodItemId.price,
                    quantity: item.quantity,
                }));

                setCart(cartItems);

                // Lấy thông tin người dùng từ localStorage hoặc server
                const userInfo = localStorage.getItem('user');
                if (userInfo) {
                    const user = JSON.parse(userInfo);
                    setFormData({
                        firstName: user.name || '',
                        email: user.email || '',
                        address: user.address || '',
                        phone: user.phone || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching cart or user data:', error);
                alert('Failed to load cart or user data. Please try again.');
            }
        };

        fetchCart();
    }, [navigate]);

    // Tính toán tổng giá trị
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 2;
    const total = subtotal + deliveryFee;

    // Xử lý thay đổi input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Xử lý khi nhấn nút "Proceed to Payment"
    const handleProceedToPayment = async () => {
        if (!formData.firstName || !formData.email || !formData.address || !formData.phone) {
            alert('Please fill in all delivery information fields.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to proceed.');
                navigate('/login');
                return;
            }

            console.log("start oder");

            const orderData = {
                userId: JSON.parse(localStorage.getItem('user') || '{}').id, // Lấy userId từ localStorage
                name: formData.firstName,
                address: formData.address,
                email : formData.email,
                phone: formData.phone,
                shippingFee: deliveryFee,
                totalAmount: subtotal + deliveryFee, // Tổng trước khi discount
                payment: subtotal, // Giả sử không có discount, bạn có thể thêm logic discount sau
                paymentMethod: 'cash', // Mặc định là cash, có thể thay đổi
                discount: 0.0, // Mặc định không có discount, bạn có thể mở rộng
                items: cart.map(item => ({
                    foodItemId: item.id,
                    quantity: item.quantity
                }))
            };

            console.log(orderData);

            // Gửi order lên server
            const response = await axios.post('http://localhost:4999/api/orders/create', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if(!response){
                alert('Order placed successfully! You can view order history in the "Order History" page.');

                // Xóa giỏ hàng trên server (nếu cần)
                await axios.delete('http://localhost:4999/api/carts/clear', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setCart([]); // Xóa giỏ hàng locally
                navigate('/order-history'); // Chuyển đến trang lịch sử order
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
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