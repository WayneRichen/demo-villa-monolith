import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'

import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
