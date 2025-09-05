import { useState } from "react";
import { FaHamburger } from "react-icons/fa";
import { Button } from "./ui/button";
import { Sidebar } from "./Sidebar";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <nav className="shadow-md flex items-center justify-baseline">
        <Button
          variant="ghost"
          className="m-4 p-2"
          onClick={() => setSidebarOpen(true)}
        >
          <FaHamburger size={20} />
        </Button>
        <a className="btn btn-ghost normal-case text-xl">Rovia</a>
      </nav>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
