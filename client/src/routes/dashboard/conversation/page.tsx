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



    const response = await fetch("/conversation", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${user.token}`,

      },

      body: JSON.stringify({ messages: newMessages }),

    });



    const reader = response.body?.getReader();

    const decoder = new TextDecoder("utf-8");



    let botMessage = { role: "bot", content: "" };

    setMessages((current) => [...current, userMessage, botMessage]);



    const processStream = async () => {

      while (true) {

        const { done, value } = await reader?.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        botMessage.content += chunk;

        setMessages((current) => {

          const updatedMessages = [...current];

          updatedMessages[updatedMessages.length - 1] = botMessage;

          return updatedMessages;

        });

      }

    };



    await processStream();



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

};
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