/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Video } from "lucide-react";
import { Heading } from "@/components/dashboard/heading";
import { Loader } from "@/components/dashboard/loader";
import Empty from "@/components/dashboard/empty";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { openModal } from "@/store/reducers/modalReducer";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { apiCall } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

const VideoPage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [video, setVideo] = useState<string>();

  const formSchema = z.object({
    prompt: z.string().min(1, {
      message: "Video prompt is required"
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);

      const api = apiCall(user);
      const response = await api.post("video", values);
      setVideo(response.data[0]);

      queryClient.invalidateQueries({ queryKey: ['user-status'] });
      form.reset();
    } catch (error: any) {
      console.error('error', error);
      if (error?.response?.status === 403) {
        dispatch(openModal());
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Turn your prompt into video!"
        icon={Video}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Clown fish swimming in a coral reef"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
              Generate
            </Button>
          </form>
        </Form>
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {!video && !isLoading && (
          <Empty label="No video files generated." />
        )}
        {video && (
          <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
            <source src={video} />
          </video>
        )}
      </div>
    </div>
  );
}

export default VideoPage;