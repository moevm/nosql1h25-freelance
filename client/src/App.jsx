import {useState} from 'react'
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter.jsx";
import NavBar from "./components/NavBar.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
        </BrowserRouter>
    )
}

export default App
