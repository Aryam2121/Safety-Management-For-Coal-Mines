import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SafetyIcon from '@mui/icons-material/Shield';
import UserIcon from '@mui/icons-material/People';
import ResourceIcon from '@mui/icons-material/Storage';
import InventoryIcon from '@mui/icons-material/Inventory';
import WeatherIcon from '@mui/icons-material/WbSunny';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import ReportIcon from '@mui/icons-material/Description';
import AuditIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Updated Icon Import
import LoginIcon from '@mui/icons-material/Login';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsMenuOpen(false); // Close menu when a link is clicked
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-white text-2xl font-bold">
          <Link to="/" onClick={() => handleLinkClick("/")}>Mine Manager</Link>
        </div>
        
        {/* Desktop Navbar Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/"
            onClick={() => handleLinkClick("/")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/" ? "text-yellow-400" : ""}`}
          >
            <DashboardIcon className="mr-2" /> Dashboard
          </Link>
          <Link
            to="/shift-logs"
            onClick={() => handleLinkClick("/shift-logs")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/shift-logs" ? "text-yellow-400" : ""}`}
          >
            <InventoryIcon className="mr-2" /> Shift Logs
          </Link>
          <Link
            to="/safety-plan"
            onClick={() => handleLinkClick("/safety-plan")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/safety-plan" ? "text-yellow-400" : ""}`}
          >
            <SafetyIcon className="mr-2" /> Safety Plan
          </Link>
          <Link
            to="/User-Management"
            onClick={() => handleLinkClick("/User-Management")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/User-Management" ? "text-yellow-400" : ""}`}
          >
            <UserIcon className="mr-2" /> User Management
          </Link>
          <Link
            to="/Resources"
            onClick={() => handleLinkClick("/Resources")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/Resources" ? "text-yellow-400" : ""}`}
          >
            <ResourceIcon className="mr-2" /> Resources
          </Link>
          <Link
            to="/Inventory"
            onClick={() => handleLinkClick("/Inventory")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/Inventory" ? "text-yellow-400" : ""}`}
          >
            <InventoryIcon className="mr-2" /> Inventory
          </Link>
          <Link
            to="/Weather"
            onClick={() => handleLinkClick("/Weather")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/Weather" ? "text-yellow-400" : ""}`}
          >
            <WeatherIcon className="mr-2" /> Weather
          </Link>
          <Link
            to="/Data-Visualization"
            onClick={() => handleLinkClick("/Data-Visualization")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/Data-Visualization" ? "text-yellow-400" : ""}`}
          >
            <DataUsageIcon className="mr-2" /> Data Visualization
          </Link>
          <Link
            to="/Report-Generation"
            onClick={() => handleLinkClick("/Report-Generation")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/Report-Generation" ? "text-yellow-400" : ""}`}
          >
            <ReportIcon className="mr-2" /> Report Generation
          </Link>
          <Link
            to="/Audit-Logs"
            onClick={() => handleLinkClick("/Audit-Logs")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/Audit-Logs" ? "text-yellow-400" : ""}`}
          >
            <AuditIcon className="mr-2" /> Audit Logs
          </Link>
          <Link
            to="/notifications"
            onClick={() => handleLinkClick("/notifications")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/notifications" ? "text-yellow-400" : ""}`}
          >
            <NotificationsIcon className="mr-2" /> Notifications
          </Link>
          <Link
            to="/Alerts"
            onClick={() => handleLinkClick("/Alerts")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/Alerts" ? "text-yellow-400" : ""}`}
          >
            <WarningAmberIcon className="mr-2" /> Alerts
          </Link>
          <Link
            to="/login"
            onClick={() => handleLinkClick("/login")}
            className={`flex items-center text-white hover:text-yellow-400 transition-all duration-300 ${activeLink === "/login" ? "text-yellow-400" : ""}`}
          >
            <LoginIcon className="mr-2" /> Login
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Slide-in Animation */}
      <div
        className={`md:hidden ${isMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"} transition-transform duration-500 ease-in-out bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 space-y-4`}
      >
        <Link to="/" onClick={() => handleLinkClick("/")} className="block hover:text-yellow-400 transition-all duration-300">Dashboard</Link>
        <Link to="/shift-logs" onClick={() => handleLinkClick("/shift-logs")} className="block hover:text-yellow-400 transition-all duration-300">Shift Logs</Link>
        <Link to="/safety-plan" onClick={() => handleLinkClick("/safety-plan")} className="block hover:text-yellow-400 transition-all duration-300">Safety Plan</Link>
        <Link to="/User-Management" onClick={() => handleLinkClick("/User-Management")} className="block hover:text-yellow-400 transition-all duration-300">User Management</Link>
        <Link to="/Resources" onClick={() => handleLinkClick("/Resources")} className="block hover:text-yellow-400 transition-all duration-300">Resources</Link>
        <Link to="/Inventory" onClick={() => handleLinkClick("/Inventory")} className="block hover:text-yellow-400 transition-all duration-300">Inventory</Link>
        <Link to="/Weather" onClick={() => handleLinkClick("/Weather")} className="block hover:text-yellow-400 transition-all duration-300">Weather</Link>
        <Link to="/Data-Visualization" onClick={() => handleLinkClick("/Data-Visualization")} className="block hover:text-yellow-400 transition-all duration-300">Data Visualization</Link>
        <Link to="/Report-Generation" onClick={() => handleLinkClick("/Report-Generation")} className="block hover:text-yellow-400 transition-all duration-300">Report Generation</Link>
        <Link to="/Audit-Logs" onClick={() => handleLinkClick("/Audit-Logs")} className="block hover:text-yellow-400 transition-all duration-300">Audit Logs</Link>
        <Link to="/notifications" onClick={() => handleLinkClick("/notifications")} className="block hover:text-yellow-400 transition-all duration-300">Notifications</Link>
        <Link to="/Alerts" onClick={() => handleLinkClick("/Alerts")} className="block hover:text-yellow-400 transition-all duration-300">Alerts</Link>
        <Link to="/login" onClick={() => handleLinkClick("/login")} className="block hover:text-yellow-400 transition-all duration-300">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
