
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import './styles/app.css'

createRoot(document.getElementById('root')).render(

  // Store is registered for this App
  <BrowserRouter >
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>

)
