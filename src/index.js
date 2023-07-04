import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import { StateContextProvider } from './context'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ThirdwebProvider desiredChainId={ChainId.Goerli}>
    {/* <React.StrictMode> */}
      <StateContextProvider>
        <App />
      </StateContextProvider>
    {/* </React.StrictMode> */}
  </ThirdwebProvider>
)
