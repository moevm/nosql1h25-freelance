import {useState} from 'react'
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    )
}

export default App
