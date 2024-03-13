/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Heading } from "@/components/dashboard/heading";
import { Loader } from "@/components/dashboard/loader";
import { UserAvatar } from "@/components/dashboard/userAvatar";
import { BotAvatar } from "@/components/dashboard/botAvatar";
import Empty from "@/components/dashboard/empty";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Code } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { ChatCompletionUserMessageParam } from 'openai/resources/chat/index.mjs';
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/reducers/modalReducer";
import { useQueryClient } from "@tanstack/react-query";
import { apiCall } from "@/lib/axios";

const CodePage = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user } = useUser();
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
      const response = await api.post("code", { messages: newMessages });
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
        title="Code Generation"
        description="Generate code using descriptive text!"
        icon={Code}
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
                        placeholder="Simple toggle button using react hooks.."
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
            <Empty label="Generate your first code." />
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
                <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <div className="overflow-auto w-full mt-2 bg-black/10 p-2 m-5 rounded-lg">
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                  )
                }}
                className='text-sm overflow-hidden leading-7'
              >
                {Array.isArray(message.content)
                  ? message.content
                      .map((part, partIndex) => {
                        if ("text" in part) {
                          return <span key={partIndex}>{part.text}</span>;
                        } else {
                          // Handle 'ChatCompletionContentPartImage' case here
                          return null;
                        }
                      })
                      .join("")
                  : message.content || ""}
              </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

}
export default CodePage;