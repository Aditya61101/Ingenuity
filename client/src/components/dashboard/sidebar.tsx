import { Link, useLocation } from "react-router-dom";
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
import { FreeCounter } from "./freeCounter";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: "text-sky-500"
    },
    {
        label: 'Code Generation',
        icon: Code,
        color: "text-green-700",
        href: '/dashboard/code',
    },
    {
        label: 'Conversation',
        icon: MessageSquare,
        href: '/dashboard/conversation',
        color: "text-violet-500",
    },
    {
        label: 'Image Generation',
        icon: ImageIcon,
        color: "text-pink-700",
        href: '/dashboard/image',
    },
    {
        label: 'Music Generation',
        icon: Music,
        color: "text-emerald-500",
        href: '/dashboard/music',
    },
    {
        label: 'Video Generation',
        icon: VideoIcon,
        color: "text-orange-700",
        href: '/dashboard/video',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
    },
];

export const Sidebar = () => {
    const location = useLocation();
    const { user } = useUser();
    const pathname = location.pathname;
    const getUserStatus = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/user-status", {
                headers: {
                    'x-user-id': user?.id,
                    'x-user-email': user?.emailAddresses[0].emailAddress
                }
            })
            return data;
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    const response = useQuery({ queryKey: ['user-status'], queryFn: getUserStatus });
    console.log(response.data);
    // if(response.isLoading) return <Loader/>;
    const apiLimitCount = response?.data?.apiLimitCount;
    const isPro = response?.data?.isPro;

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#0e131f] text-white">
            <div className="px-3 py-2 flex-1">
                <Link to="/" className="flex items-center pl-3 mb-14">
                    <div className="relative h-8 w-8 mr-4">
                        <img alt="Logo" src="/logo.png" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Ingenuity
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            to={route.href}
                            className={
                                `text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition
                                ${pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"}`
                            }
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={`h-5 w-5 mr-3 ${route.color}`} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <FreeCounter
                apiLimitCount={apiLimitCount}
                isPro={isPro}
            />
        </div>
    );
};