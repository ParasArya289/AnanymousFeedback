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
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const page = () => {
  const { username } = useParams<{ username: string }>();
  const [messages, setMessages] = useState<Array<string>>();
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
    }
  };
  const setMessageRefHandler = (message: string) => {
    if (messageRef.current) {
      messageRef.current.value = message;
      messageRef.current.focus();
    }
  };
  return (
    <div>
      <h1>Public Profile Link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send anonymous message to @{username}</FormLabel>
                <FormControl>
                  {/* <Input
                    placeholder="Message"
                    type="text"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  /> */}
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

          <Button type="submit" disabled={false}>
            Send
          </Button>
        </form>
      </Form>
      <Button onClick={suggestMessageHandler}>Suggest Message</Button>
      {messages?.map((message, i) => (
        <div
          onClick={() => setMessageRefHandler(message)}
          key={i}
          className="cursor-pointer"
        >
          {message}
        </div>
      ))}
    </div>
  );
};

export default page;
