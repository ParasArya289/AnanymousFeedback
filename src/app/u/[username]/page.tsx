"use client";
import { messageSchema } from "@/Schemas/messageSchema.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const page = () => {
  const { username } = useParams<{ username: string }>();
  const [messages, setMessages] = useState<Array<string>>();
  const [isLoading, setIsLoading] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    console.log(data);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
      toast("Message Sent", { description: response.data.message });
    } catch (error) {
      console.error("Error sending message");
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "Error sending message";
      toast("Error", {
        description: errorMessage,
      });
    }
  };
  const suggestMessageHandler = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/suggest-message");
      setMessages(response.data.message.split(" | | "));
      toast("Message Suggested");
    } catch (error) {
      console.error("Error suggesting message");
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "Error suggesting message";
      toast("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const setMessageRefHandler = (message: string) => {
    if (messageRef.current) {
      messageRef.current.value = message;
      messageRef.current.focus();
      form.setValue("content", message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[800px] space-y-8">
        <h1 className="text-2xl font-bold text-center">Public Profile Link</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send anonymous message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Message"
                      {...field}
                      ref={messageRef}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={false} className="w-full">
              Send
            </Button>
          </form>
        </Form>
        <div className="space-y-4">
          <Button
            onClick={suggestMessageHandler}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Suggesting <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Suggest Message"
            )}
          </Button>
          <div className="space-y-2">
            {messages?.map((message, i) => (
              <div
                onClick={() => setMessageRefHandler(message)}
                key={i}
                className="cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-center"
              >
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
