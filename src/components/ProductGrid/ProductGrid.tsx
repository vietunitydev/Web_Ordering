import './ProductGrid.css';

import sandwich1 from '../../assets/sandwich1.png';

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
            <p>Product</p>
            <h2>Những món đặc ưa thích</h2>
            <div className="products-container">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <img src={product.image} alt={product.name} />
                        <div className="product-content">
                            <h3>{product.name}</h3>
                            <div className="rating">★ {product.rating}</div>
                            <p className="price">{product.price}</p>
                            <button className="add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="see-more">See More Product</button>
        </section>
    );
};

export default ProductGrid;