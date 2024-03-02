import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";

const Video = () => {
  return (
    <div>This is main Video page</div>
  )
  
}

export default Video;