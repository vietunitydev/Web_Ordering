import "./Home.css"
import HeroSection from "../../components/Hero/HeroSection.tsx";
import InfoBar from "../../components/InfoBar/InfoBar.tsx";
import ProductGrid from "../../components/ProductGrid/ProductGrid.tsx";
import ServiceSection from "../../components/Service/ServiceSection.tsx";

const Home = () => {
    return (
       <div className="home">
           <HeroSection/>
           <InfoBar/>
           <ProductGrid/>
           <ServiceSection/>
       </div>
    )
}

export default Home;