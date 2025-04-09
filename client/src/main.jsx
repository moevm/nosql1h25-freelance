import {createContext, StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import UserStore from "./store/UserStore.jsx";
import ContestStore from "./store/ContestStore.jsx";

export const Context = createContext(null);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Context.Provider value={{
          user: new UserStore(),
          project: new ContestStore(),
      }}>
    <App />
      </Context.Provider>
  </StrictMode>,
)
