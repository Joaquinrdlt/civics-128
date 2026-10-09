import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@aws-amplify/ui-react/styles.css'
import './index.css'
import AppBootstrap from './AppBootstrap.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>,
)
