import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserContext";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();
  const { user, fetchUser } = useUser();
  const logout = async (e) => {
    e?.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (res.ok) {
        localStorage.removeItem("auth_token");
        await fetchUser();
        setTimeout(() => {
          navigate("/login");
        }, 350);
      } else if (res.status === 401) {
        localStorage.removeItem("auth_token");
        await fetchUser();
        setTimeout(() => {
          navigate("/login");
        }, 350);
      }
    } catch (err) {
      console.error("failed to connect to server: ", err);
      localStorage.removeItem("auth_token");
      await fetchUser();
      setTimeout(() => {
        navigate("/login");
      }, 350);
    }
  };
  return (
    <div>
      <nav className="header">
        {!user && <Link to={"/register"}>register</Link>}
        {!user && <Link to={"/login"}>login</Link>}
        <Link to={"/product"}>product</Link>
        <Link to={"/concert"}>concert</Link>
        {user && <Link to={"/cart"}>cart</Link>}
        {user && (user?.role === "qa" || user?.role === "admin") && (
          <Link to={"/QA"}>QA</Link>
        )}

        {user && <button onClick={(e) => logout(e)}>Logout</button>}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
