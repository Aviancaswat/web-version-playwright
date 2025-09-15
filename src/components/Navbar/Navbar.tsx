import { Link } from "react-router-dom";

//Styles
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-subcontainer">
        <Link to="/">
          <img
            className="logo-img"
            src="/public/avianca-icon.png"
            alt="logo avianca"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
