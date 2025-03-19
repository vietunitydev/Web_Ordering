import './HeroSection.css';
import cake1 from '../../assets/cake1.png';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
}

const menuItems: MenuItem[] = [
    { id: 1, name: 'Pizza', description: 'Mushroom Sauce', price: '$6.15', image: cake1 },
    { id: 2, name: 'Cake', description: 'Mushroom Sauce', price: '$5.15', image: cake1 },
    { id: 3, name: 'Burger', description: 'Mushroom Sauce', price: '$5.15', image: cake1 },
    { id: 4, name: 'Cake', description: 'Mushroom Sauce', price: '$5.15', image: cake1 },
];

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="title">
                        <span className="black">Giao Nhanh</span>
                        <br />
                        <span className="black">Hơn</span>
                        <br />
                        <span className="orange">The Flash</span>
                    </h1>
                    <p>
                        Ứng dụng mang đến trải nghiệm tiện lợi, giúp bạn dễ dàng đặt món ăn yêu thích.
                        Giao diện trực quan, tối ưu hóa cho người dùng, đảm bảo quá trình đặt hàng nhanh chóng và thuận tiện.
                        Thiết kế hiện đại, phù hợp với mọi nhu cầu, từ các món ăn phổ biến đến những lựa chọn cao cấp.
                    </p>
                    <button className="hero-button">Đặt ngay</button>
                </div>
                <div className="hero-menu">
                    <div className="menu-grid">
                        {menuItems.map((item) => (
                            <div key={item.id} className="menu-item">
                                <img src={item.image} alt={item.name} className="menu-item-image" />
                                <div className="menu-item-content">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <p className="price">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;