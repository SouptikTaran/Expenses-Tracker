import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GridBackground from './Components/GridBackground.jsx'
import {BrowserRouter} from "react-router-dom"
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<GridBackground>
				<App />
			</GridBackground>
		</BrowserRouter>
	</StrictMode>
);