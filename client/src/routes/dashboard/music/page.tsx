import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";

const Music = () => {
  return (
    <div>This is main Music page</div>
  )
  
}

export default Music;