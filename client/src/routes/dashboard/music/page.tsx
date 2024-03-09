/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Music } from "lucide-react";
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

const MusicPage = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const [music, setMusic] = useState<string>();

  const formSchema = z.object({
    prompt: z.string().min(1, {
      message: "Music prompt is required"
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
      setMusic(undefined);

      const response = await axios.post('http://localhost:8000/api/music', values, {
        headers: {
          'x-user-id': user?.id,
          'x-user-email': user?.emailAddresses[0]?.emailAddress,
        }
      });
      console.log(response);
      setMusic(response.data);
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
        title="Music Generation"
        description="Turn your prompt into music."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                      placeholder="Piano solo"
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
        {!music && !isLoading && (
          <Empty label="No music generated." />
        )}
        {music && (
          <audio controls className="w-full mt-8">
            <source src={music} />
          </audio>
        )}
      </div>
    </div>
  );
}

export default MusicPage;