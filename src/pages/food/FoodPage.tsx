import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './FoodPage.css';
import burger from '../../assets/burger1.png';
import {actions, useAppContext} from "../../components/AppContext/AppContext.tsx";

// Sample data for items with categories
const itemData = Array.from({ length: 124 }, (_, index) => {
    const categories = ['main', 'dessert', 'fast_food', 'drinks', 'other'];
    const category = categories[index % categories.length];
    return {
        id: index + 1,
        name: `${category === 'main' ? 'main' : category === 'dessert' ? 'dessert' : category === 'fast_food' ? 'fast_food' : category === 'drinks' ? 'drinks' : 'other'} Mushroom Sauce`,
        price: 6.15,
        category: category,
        image: burger,
    };
});

const ITEMS_PER_PAGE = 20;

const FoodPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const { dispatch } = useAppContext();

    const category = searchParams.get('category') || 'food';

    const categoryTitleMap: { [key: string]: string } = {
        main: 'Món chính',
        dessert: 'Tráng miệng',
        fast_food: 'Đồ ăn nhanh',
        drinks: 'Đồ uống',
        other: 'Khác',
    };

    const categoryPlaceholderMap: { [key: string]: string } = {
        main: 'Tìm kiếm món chính...',
        dessert: 'Tìm kiếm tráng miệng',
        fast_food: 'Tìm kiếm đồ ăn nhanh',
        drinks: 'Tìm kiếm đồ uống',
        other: 'Tìm kiếm khác',
    };

    const title = categoryTitleMap[category] || 'Món chính';
    const placeholder = categoryPlaceholderMap[category] || 'Tìm kiếm món chính...';

    // Add item to cart using dispatch
    const addToCart = (pizza: { id: number; name: string; price: number }) => {
        dispatch({ type: actions.ADD_TO_CART, payload: pizza });
    };

    // Filter items based on category and search term
    const filteredItems = itemData
        .filter((item) => item.category === category)
        .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

    // Reset current page when category or search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [category, searchTerm]);

    return (
        <div className="food-page">
            <div className="food-header">
                <h2 className="food-title">{title}</h2>
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
                    {'<'}
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
                    {'>'}
                </button>
            </div>
        </div>
    );
};

export default FoodPage;