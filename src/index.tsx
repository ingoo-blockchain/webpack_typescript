import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'

import '@css/index.css'

const container = document.querySelector('#root') as Element
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
