import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-subcontainer">
        <img
          className="logo-img"
          src="/public/avianca-icon.png"
          alt="logo avianca"
        />
      </div>
    </nav>
  );
};

export default Navbar;
