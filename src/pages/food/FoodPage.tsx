import React, { useState, useEffect } from 'react';
import './FoodPage.css';
import { useSearchParams } from "react-router-dom";
import burger from '../../assets/burger1.png';

// Sample data for items with categories
const itemData = Array.from({ length: 124 }, (_, index) => {
    const categories = ['food', 'alcohol', 'flowers', 'medicine'];
    const category = categories[index % categories.length]; // Phân bổ category cho từng sản phẩm
    return {
        id: index + 1,
        name: `${category === 'food' ? 'Pizza' : category === 'alcohol' ? 'Beer' : category === 'flowers' ? 'Rose' : 'Pill'} Mushroom Sauce`,
        price: 6.15,
        category: category, // Thêm thuộc tính category
        image: burger, // Placeholder image
    };
});

const ITEMS_PER_PAGE = 20;

const FoodPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
    // const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // Lấy query params từ URL

    // Lấy category từ URL
    const category = searchParams.get('category') || 'food'; // Mặc định là 'food' nếu không có category
    // const search = searchParams.get('search') || 'food'; // Mặc định là 'food' nếu không có category

    // Xác định tiêu đề và placeholder dựa trên category
    const categoryTitleMap: { [key: string]: string } = {
        food: 'Thực phẩm',
        alcohol: 'Rượu Bia',
        flowers: 'Hoa',
        medicine: 'Thuốc',
    };

    const categoryPlaceholderMap: { [key: string]: string } = {
        food: 'Tìm kiếm thực phẩm...',
        alcohol: 'Tìm kiếm rượu bia...',
        flowers: 'Tìm kiếm hoa...',
        medicine: 'Tìm kiếm thuốc...',
    };

    const title = categoryTitleMap[category] || 'Thực phẩm';
    const placeholder = categoryPlaceholderMap[category] || 'Tìm kiếm thực phẩm...';

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
    const addToCart = (item: { id: number; name: string; price: number }) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    // Filter items based on category and search term
    const filteredItems = itemData
        .filter((item) => item.category === category) // Lọc theo category
        .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset current page when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [category, searchTerm]);

    return (
        <div className="food-page">
            <div className="food-header">
                <h2 className="food-title">{title}</h2>
                {/*<button onClick={() => navigate('/cart')} className="view-cart-button">*/}
                {/*    Xem giỏ hàng ({cart.length})*/}
                {/*</button>*/}
                <input
                    type="text"
                    placeholder={placeholder}
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <p className="result-count">{filteredItems.length} kết quả</p>
            </div>

            <div className="pizza-grid">
                {currentItems.map((item) => (
                    <div key={item.id} className="pizza-card">
                        <img src={item.image} alt={item.name} className="pizza-image" />
                        <h3 className="pizza-name">{item.name}</h3>
                        <p className="pizza-price">${item.price.toFixed(2)}</p>
                        <button onClick={() => addToCart(item)} className="add-to-cart-button">
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