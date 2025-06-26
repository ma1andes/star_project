import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../css/Layout.css';

function Layout() {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div>
            <nav className='header'>
                {!user && (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
                <Link to="/product">Products</Link>
                <Link to="/concert">Concerts</Link>
                {user && (
                    <>
                        <Link to="/cart">Cart</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                )}
                {(role === 'qa' || role === 'admin') && <Link to="/QA">QA</Link>}
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;