import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";
import { ProModal } from "@/components/dashboard/proModal";
import { Loader } from "@/components/loader";

const DashboardLayout = () => {
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        console.log({ isLoaded, userId });
        if (isLoaded && !userId) {
            navigate("/sign-in");
        }
    }, [userId, navigate, isLoaded])
    if (!isLoaded) return <Loader/>
    return (
        <div className="h-full relative">
            <ProModal />
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-10">
                <Navbar />
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout;