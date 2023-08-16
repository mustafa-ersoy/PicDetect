import { Link } from "react-router-dom"

export default function Navbar(){
  return (
    <nav className="nav">
      <Link to="/dashboard" className="logo">
        <img className="nav-logo" src={process.env.PUBLIC_URL+'/logo2.png'} alt="logo" />
      </Link>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/upload">Upload</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  )
}