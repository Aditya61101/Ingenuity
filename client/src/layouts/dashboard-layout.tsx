import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";

const DashboardLayout = () => {
    const { userId, isLoaded } = useAuth()
    const navigate = useNavigate()
    console.log('for testing', userId)
    useEffect(() => {
        if (!userId) {
            navigate("/sign-in")
        }
    }, [])

    if (!isLoaded) return "Loading..."
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
                {/* <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} /> */}
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