import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Government from './component/government.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Government />
    {/*<App />*/}
  </StrictMode>,
)
