import Home from "./pages/home/Home.tsx";
import Navbar from "./components/Home/Navbar.tsx";
import "./App.css"
function App() {
  return (
    <div className="App">
        <Navbar/>
        <Home/>
    </div>
  )
}

export default App
