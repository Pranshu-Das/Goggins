import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-brand">⚔️ Discipline Quest</div>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/habits">Habits</Link>
      </div>
      <div className="navbar-user">
        <span>
          {user?.username} · Lv.{user?.level}
        </span>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
