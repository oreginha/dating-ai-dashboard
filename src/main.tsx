import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useAppStore } from './store'
import { populateStoreWithMockData } from './data/mockData'

// Populate store with mock data for development
if (import.meta.env.DEV) {
  populateStoreWithMockData(useAppStore);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
