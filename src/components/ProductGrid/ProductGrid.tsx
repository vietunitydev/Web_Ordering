import './ProductGrid.css';

import sandwich1 from '../../assets/sandwich1.png';
import star from '../../assets/star.png';

interface Product {
    id: number;
    name: string;
    rating: number;
    price: string;
    image: string;
}

const products: Product[] = [
    { id: 1, name: 'Gyro Sandwich', rating: 4.9, price: '$15.00', image: sandwich1 },
    { id: 2, name: 'Enchilade', rating: 5.0, price: '$25.50', image: sandwich1 },
    { id: 3, name: 'Green Beans', rating: 4.9, price: '$12.00', image: sandwich1 },
    { id: 4, name: 'Pizza', rating: 5.0, price: '$18.50', image: sandwich1 },
    { id: 5, name: 'Chicken Pot Pie', rating: 4.9, price: '$25.00', image: sandwich1 },
    { id: 6, name: 'Green Salad', rating: 4.9, price: '$15.00', image: sandwich1 },
];

const ProductGrid = () => {
    return (
        <section className="product-grid">
            <p>Sản phẩm</p>
            <h2>Những món đặc ưa thích</h2>
            <div className="products-container">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <img src={product.image} alt={product.name} />
                        <div className="product-content">
                            <div className="left-group">
                                <h3>{product.name}</h3>
                                <button className="add-to-cart">Add To Cart</button>
                            </div>
                            <div className="right-group">
                                <div className="rating">
                                    <img src={star} alt="star" />
                                    <p>{product.rating}</p>
                                </div>
                                <p className="price">{product.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="see-more">
                    <p>Xem nhiều sản phẩm hơn</p>
                    <div className="o"></div>
            </button>
        </section>
    );
};

export default ProductGrid;