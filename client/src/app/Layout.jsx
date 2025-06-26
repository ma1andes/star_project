import {Link, Outlet, useNavigate} from 'react-router-dom'
import '../css/Layout.css'

function Layout() {
    const role = localStorage.getItem('role')
    const navigate = useNavigate()
    const logout = async(e) =>{
        e.preventDefault()
        localStorage.removeItem('auth_token')
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('role')
        navigate('/login')
    }
  return (
    <div>
        <nav className='header'>
            <Link to={'/register'}>register</Link>
            <Link to={'/login'}>login</Link>
            <Link to={'/product'}>product</Link>
            <Link to={'/concert'}>concert</Link>
            <Link to={'/cart'}>cart</Link>
            {
                    (role === 'qa' || role === 'admin') && ( 
                        <Link to={'/QA'}>QA</Link>
                    )
                }

                <button><a onClick={logout}>logout</a></button>
        </nav>
        <main>
            <Outlet/>
        </main>
    </div>
  )
}

export default Layout


