import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import burger from '../../assets/burger1.png';
import {actions, useAppContext} from "../../components/AppContext/AppContext.tsx";

const CartPage: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [promoCode, setPromoCode] = useState('');
    const navigate = useNavigate();

    // Update quantity of an item in cart
    const updateQuantity = (id: number, newQuantity: number) => {
        if (isNaN(newQuantity) || newQuantity < 1) return;
        dispatch({ type: actions.UPDATE_QUANTITY, payload: { id, quantity: newQuantity } });
    };

    // Remove item from cart
    const removeFromCart = (id: number) => {
        dispatch({ type: actions.REMOVE_FROM_CART, payload: { id } });
    };

    // Calculate totals
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 2;
    const total = subtotal + deliveryFee;

    // Handle promo code (placeholder functionality)
    const handlePromoSubmit = () => {
        alert(`Promo code "${promoCode}" applied (placeholder)`);
        setPromoCode('');
    };

    // Handle checkout
    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="cart-page">
            <h2 className="cart-title">Giỏ hàng</h2>

            {state.cart.length === 0 ? (
                <p>Giỏ hàng của bạn đang trống.</p>
            ) : (
                <>
                    <table className="cart-table">
                        <thead>
                        <tr>
                            <th>Items</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {state.cart.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <img
                                        src={burger}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                        min="1"
                                        className="quantity-input"
                                    />
                                </td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="remove-button"
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="cart-summary">
                        <div className="summary-left">
                            <h3 className="summary-title">Cart Total</h3>
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
                            <button onClick={handleCheckout} className="checkout-button">
                                Proceed to Checkout
                            </button>
                        </div>

                        <div className="summary-right">
                            <div className="promo-section">
                                <p>IF YOU HAVE A PROMO CODE, ENTER IT HERE</p>
                                <div className="promo-input">
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <button onClick={handlePromoSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;