import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserContext";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();
  const { user, fetchUser } = useUser();
  const logout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("auth_token");
    await fetchUser();
    navigate("/login");
  };
  return (
    <div>
      <nav className="header">
        {!user && <Link to={"/register"}>register</Link>}
        {!user && <Link to={"/login"}>login</Link>}
        <Link to={"/product"}>product</Link>
        <Link to={"/concert"}>concert</Link>
        <Link to={"/cart"}>cart</Link>
        {(user && (user?.role === "qa" || user?.role === "admin")) && <Link to={"/QA"}>QA</Link>}

        <button>
          <a onClick={logout}>logout</a>
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
