import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './Router/Router'
import { UserProvider } from '../utils/UserContext'

function App() {

  return (
    <>
      <UserProvider>
        <RouterProvider router={router}/>
      </UserProvider>
    </>
  )
}

export default App
