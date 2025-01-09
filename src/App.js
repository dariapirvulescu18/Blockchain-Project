import { createBrowserRouter, RouterProvider} from "react-router-dom"
import { Web3Provider } from './utils/Context';
import { useMemo } from 'react';
import routes from "./routes/router"
import './styles/global.css';


const router = createBrowserRouter(routes)

function App() {
    
    return (
        <Web3Provider>
            
            {useMemo(() => (
            
            <RouterProvider router={router} />)
            , [])}
        </Web3Provider>
    )
}

export default App;