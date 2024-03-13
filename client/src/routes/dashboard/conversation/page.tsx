/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Heading } from "@/components/dashboard/heading";
import { Loader } from "@/components/dashboard/loader";
import { UserAvatar } from "@/components/dashboard/userAvatar";
import { BotAvatar } from "@/components/dashboard/botAvatar";
import Empty from "@/components/dashboard/empty";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ChatCompletionUserMessageParam } from 'openai/resources/chat/index.mjs';
import { openModal } from "@/store/reducers/modalReducer";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { apiCall } from "@/lib/axios";

const Conversation = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<ChatCompletionUserMessageParam[]>([]);

  const formSchema = z.object({
    prompt: z.string().min(1, {
      message: "Prompt is required."
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionUserMessageParam = { role: "user", content: values.prompt };
      const newMessages = [...messages, userMessage];

      const api = apiCall(user);
      const response = await api.post("conversation", { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);

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
        title="Conversation"
        description="Our most advanced conversation model!"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                border 
                rounded-lg
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
                        placeholder="How do I calculate the radius of a circle?"
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
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "border" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                {Array.isArray(message.content)
                  ? message.content.map((part, idx) => {
                    if ("text" in part) {
                      return <span key={idx}>{part.text}</span>
                    } else {
                      return null;
                    }
                  })
                  : <p className="text-sm">{message.content}</p>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

}

export default Conversation;