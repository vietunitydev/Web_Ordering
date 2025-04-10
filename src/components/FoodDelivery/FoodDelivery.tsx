import './FoodDelivery.css';
import package1 from '../../assets/package.png';
import fired_chicken from '../../assets/fired-chicken.png';
import computer from '../../assets/computer.png';

const FoodDelivery = () => {
    return (
        <div className="food-delivery-container">
            <h2>Hoạt động thế nào</h2>
            <h1 className="main-title">Thực phẩm là một phần quan trọng của chế độ ăn cân bằng.</h1>

            <div className="steps-container">
                <div className="step">
                    <img
                        src={computer}
                        alt="Laptop"
                        className="step-image"
                    />
                    <h2 className="step-title">CHỌN</h2>
                    <p className="step-description">
                        Bạn muốn giảm cân, tập thể dục <br />
                        hoặc tuân theo một chế độ ăn trị liệu? <br />
                        Chuyên gia dinh dưỡng của chúng tôi sẽ <br />
                        giúp bạn chọn chương trình phù hợp! <br />
                    </p>
                </div>

                <div className="step">

                    <h2 className="step-title">CHUẨN BỊ</h2>
                    <p className="step-description">
                        Bạn muốn giảm cân, tập thể dục <br />
                        hoặc tuân theo một chế độ ăn trị liệu? <br />
                        Chuyên gia dinh dưỡng của chúng tôi sẽ <br />
                        giúp bạn chọn chương trình phù hợp! <br />
                    </p>

                    <img
                        src={fired_chicken}
                        alt="Food"
                        className="step-image"
                    />

                </div>

                <div className="step">
                    <img
                        src={package1}
                        alt="Delivery"
                        className="step-image"
                    />
                    <h2 className="step-title">GIAO HÀNG</h2>
                    <p className="step-description">
                        Bạn muốn giảm cân, tập thể dục <br />
                        hoặc tuân theo một chế độ ăn trị liệu? <br />
                        Chuyên gia dinh dưỡng của chúng tôi sẽ <br />
                        giúp bạn chọn chương trình phù hợp! <br />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FoodDelivery;