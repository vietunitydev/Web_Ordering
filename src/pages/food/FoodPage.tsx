// FoodPage.tsx
import React, { useState, useEffect } from 'react';
import './FoodPage.css';
import {useNavigate} from "react-router-dom";

// Sample data for pizzas
const pizzaData = Array.from({ length: 124 }, (_, index) => ({
    id: index + 1,
    name: 'Pizza Mushroom Sauce',
    price: 6.15,
    image: 'https://via.placeholder.com/150', // Placeholder image
}));

const ITEMS_PER_PAGE = 15;

const FoodPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
    const navigate = useNavigate();

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Add item to cart
    const addToCart = (pizza: { id: number; name: string; price: number }) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === pizza.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...pizza, quantity: 1 }];
        });
    };

    // Filter pizzas based on search term
    const filteredPizzas = pizzaData.filter((pizza) =>
        pizza.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredPizzas.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentPizzas = filteredPizzas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="food-page">
            <div className="food-header">
                <h2 className="food-title">Đồ ăn</h2>
                <button onClick={() => navigate('/cart')} className="view-cart-button">
                    Xem giỏ hàng ({cart.length})
                </button>
                <input
                    type="text"
                    placeholder="Tìm kiếm pizza..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <p className="result-count">{filteredPizzas.length} kết quả</p>
            </div>

            <div className="pizza-grid">
                {currentPizzas.map((pizza) => (
                    <div key={pizza.id} className="pizza-card">
                        <img src={pizza.image} alt={pizza.name} className="pizza-image" />
                        <h3 className="pizza-name">{pizza.name}</h3>
                        <p className="pizza-price">${pizza.price.toFixed(2)}</p>
                        <button onClick={() => addToCart(pizza)} className="add-to-cart-button">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default FoodPage;