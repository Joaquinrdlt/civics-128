import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Load Amplify's component styles before the app's own overrides.
import '@aws-amplify/ui-react/styles.css'
import './index.css'
import AppBootstrap from './AppBootstrap.jsx'

// Mount the React app into the root element declared in index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>,
)
