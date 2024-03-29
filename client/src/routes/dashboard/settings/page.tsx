import { Settings } from "lucide-react";
import { Heading } from "@/components/dashboard/heading";
import { SubscriptionButton } from "@/components/dashboard/subscribeButton";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/axios";

const SettingsPage = () => {
  const { user } = useUser();
  const getUserStatus = async () => {
    try {
      const api = apiCall(user);
      const { data } = await api.get("user-status");
      return data;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  const response = useQuery({ queryKey: ['user-status'], queryFn: getUserStatus });
  console.log(response.data);
  const isPro = response?.data?.isPro;
  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <hr className="mt-[-15px]"/>
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm mt-4">
          {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
}

export default SettingsPage;
