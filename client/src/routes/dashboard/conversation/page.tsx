import { useState } from "react";
import { Heading } from "@/components/dashboard/heading";
import { Loader } from "@/components/dashboard/loader";
import { UserAvatar } from "@/components/dashboard/userAvatar";
import { BotAvatar } from "@/components/dashboard/botAvatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

const Conversation = () => {

  const navigate = useNavigate();
  // const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [messages, setMessages] = useState([]);

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
    console.log('values', values);
    // try {
    //   const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
    //   const newMessages = [...messages, userMessage];
      
    //   const response = await axios.post('/api/conversation', { messages: newMessages });
    //   setMessages((current) => [...current, userMessage, response.data]);
      
    //   form.reset();
    // } catch (error: any) {
    //   if (error?.response?.status === 403) {
    //     proModal.onOpen();
    //   } else {
    //     toast.error("Something went wrong.");
    //   }
    // } finally {
    //   navigate(0);
    // }
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
          {/* {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )} */}
          {/* <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">
                  {message.content}
                </p>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );

}

export default Conversation;