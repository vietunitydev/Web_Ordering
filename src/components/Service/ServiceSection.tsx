import './ServiceSection.css';
import delivery from '../../assets/delivery-2.png';
import fork from '../../assets/fork-2.png';
import fork2 from '../../assets/fork2-2.png';


interface ServiceSection {
    id: number;
    title: string;
    description: string;
    icon: string;
}

const services: ServiceSection[] = [
    { id: 1, title: 'Thực phẩm chất lượng', description: 'Chúng tôi cam kết cung cấp thực phẩm ngon, an toàn và đa dạng để bạn chọn lựa.', icon: fork },
    { id: 2, title: 'Tốt cho sức khỏe', description: 'Món ăn chất lượng tốt, bổ dưỡng, phù hợp với chế độ ăn lành mạnh.', icon: fork2 },
    { id: 3, title: 'Giao hàng nhanh', description: 'Dịch vụ giao hàng nhanh chóng, đảm bảo món ăn nóng hổi, giúp bạn nhận ngay tại nhà.', icon: delivery },
];

const ServiceSection = () => {
    return (
        <section className="services-section">
            <h2>Services</h2>
            <h1>Vì Sao Nên Chọn Món Ăn Yêu Thích Của Chúng Tôi?</h1>
            <div className="services-grid">
                {services.map((service) => (
                    <div key={service.id} className="service-item">
                        <div className={`service-icon ${service.icon}`}><img src={service.icon} alt="icon"/></div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ServiceSection;