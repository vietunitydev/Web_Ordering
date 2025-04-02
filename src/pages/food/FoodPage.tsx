import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext, actions } from '../../components/AppContext/AppContext.tsx';
import axios from 'axios';
import './FoodPage.css';

interface Item {
    _id: string;
    title: string;
    price: number;
    type: string;
    imageURL: string;
}

const ITEMS_PER_PAGE = 20;

const FoodPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState<Item[]>([]);
    const [searchParams] = useSearchParams();
    const { dispatch } = useAppContext();

    const category = searchParams.get('category') || 'main';

    const categoryTitleMap: { [key: string]: string } = {
        main: 'Món chính',
        dessert: 'Tráng miệng',
        fast_food: 'Đồ ăn nhanh',
        drinks: 'Đồ uống',
        other: 'Khác',
    };

    const title = categoryTitleMap[category] || 'Món chính';

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:4999/api/foodItems');
                setItems(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };
        fetchItems();
    }, []);

    const addToCart = async (item: { _id: string; title: string; price: number }) => {
        try {
            // nếu lưu token ở cookie thì sẽ có thể tự động gửi tới server trong mỗi request, còn
            // nếu lưu trong local Storage thì phải thêm header vào trong mỗi request
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:4999/api/carts/add',
                { foodItemId: item._id, quantity: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );
            // Cập nhật AppContext để đồng bộ giao diện
            dispatch({
                type: actions.ADD_TO_CART,
                payload: { id: item._id, name: item.title, price: item.price }
            });
            console.log('Thêm vào giỏ hàng thành công:', response.data);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
        }
    };

    const filteredItems = items.filter((item) => item.type === category);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [category]);

    return (
        <div className="food-page">
            <div className="food-header">
                <h2 className="food-title">{title}</h2>
                <p className="result-count">{filteredItems.length} kết quả</p>
            </div>

            <div className="pizza-grid">
                {currentItems.map((item) => (
                    <div key={item._id} className="pizza-card">
                        <img src={`http://localhost:4999${item.imageURL}`} alt={item.title} className="pizza-image" />
                        <h3 className="pizza-name">{item.title}</h3>
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