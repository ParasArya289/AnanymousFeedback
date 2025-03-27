"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Delete, DeleteIcon, X } from "lucide-react";
import { Message } from "@/model/User.model";
import axios from "axios";
import { toast } from "sonner";

type MessageCardProp = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProp) => {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete(`/api/delete-message/${message._id}`);
    toast("Success", {
      description: response.data.message,
    });
    onMessageDelete(message._id);
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(newDate);
  };

  return (
    <Card className="flex items-start justify-between py-4 relative">
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <CardDescription>
          {formatDate(message.createdAt.toString())}
        </CardDescription>
      </CardHeader>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="mr-6 mt-6 absolute top-0 right-0 translate-x-5 -translate-y-5"
          >
            <X className="w-5 h-5 text-red-600" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MessageCard;
