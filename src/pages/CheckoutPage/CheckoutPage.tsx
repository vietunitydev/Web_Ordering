import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';
import { useAppContext, actions } from '../../components/AppContext/AppContext.tsx';

const CheckoutPage: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        address: '',
        phone: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            if (state.role !== 'user') return;
            try {
                const response = await axios.get('http://localhost:4999/api/carts/my-cart', {
                    headers: { Authorization: `Bearer ${state.token}` },
                });

                const cartItems = response.data.list.map((item: any) => ({
                    id: item.foodItemId._id,
                    name: item.foodItemId.title,
                    price: item.foodItemId.price,
                    quantity: item.quantity,
                }));

                setCart(cartItems);

                const userResponse = await axios.get('http://localhost:4999/api/auth/me', {
                    headers: { Authorization: `Bearer ${state.token}` },
                });
                const user = userResponse.data.data;
                setFormData({
                    firstName: user.name || '',
                    email: user.email || '',
                    address: user.address || '',
                    phone: user.phone || '',
                });
            } catch (error) {
                console.error('Error fetching cart or user data:', error);
                alert('Không thể tải giỏ hàng hoặc thông tin người dùng.');
            }
        };

        if (state.token && state.role === 'user') fetchCart();
    }, [navigate, state.token, state.role]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProceedToPayment = async () => {
        if (!formData.firstName || !formData.email || !formData.address || !formData.phone) {
            alert('Please fill in all delivery information fields.');
            return;
        }

        try {
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const deliveryFee = 2;
            const total = subtotal + deliveryFee - state.discount;

            const orderData = {
                name: formData.firstName,
                address: formData.address,
                email: formData.email,
                phone: formData.phone,
                shippingFee: deliveryFee,
                totalAmount: total,
                payment: total,
                paymentMethod: 'cash',
                discount: state.discount,
                items: cart.map((item) => ({
                    foodItemId: item.id,
                    quantity: item.quantity,
                })),
                // promoCode: state.appliedPromoCode,
            };

            console.log(orderData);

            const response = await axios.post('http://localhost:4999/api/orders/create', orderData, {
                headers: { Authorization: `Bearer ${state.token}` },
            });

            if (response) {
                console.log("success");

                await axios.delete('http://localhost:4999/api/carts/clear', {
                    headers: { Authorization: `Bearer ${state.token}` },
                });
                dispatch({ type: actions.CLEAR_CART });
                dispatch({ type: actions.CLEAR_DISCOUNT });
                alert('Đặt hàng thành công! Bạn có thể xem lịch sử đơn hàng ở trang "Order History".');
                navigate('/order-history');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    if (state.role !== 'user') {
        return <div>Bạn không có quyền truy cập trang này.</div>;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 2;
    const total = subtotal + deliveryFee - state.discount;

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
                            required
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        required
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
                    {state.discount > 0 && (
                        <div className="summary-row">
                            <span>Discount ({state.appliedPromoCode})</span>
                            <span>-${state.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleProceedToPayment}
                        className="payment-button"
                        disabled={cart.length === 0}
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;