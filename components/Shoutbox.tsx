"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import customEmojis from "@/models/custom-emojis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  MessageCircle, 
  Send, 
  Smile, 
  Edit, 
  X, 
  Check,
  Users,
  Clock,
  Maximize2,
  Minimize2
} from "lucide-react";

const MAX_MESSAGE_LENGTH = 300;

interface Message {
  id: number;
  username: string;
  message: string;
  avatar_url?: string;
}

interface User {
  avatar_url: string;
}

const Shoutbox = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const shoutboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newSocket = io(
      process.env.NEXT_PUBLIC_SHOUTBOX_SOCKET || "http://localhost:4000",
      { withCredentials: true },
    );
    setSocket(newSocket);

    newSocket.on("message", (message: Message) => {
      fetchUserAvatar(message.username).then((avatarUrl) => {
        setMessages((prevMessages) => [
          { ...message, avatar_url: avatarUrl },
          ...prevMessages,
        ]);
      });
    });

    newSocket.on("messageUpdated", (updatedMessage: Message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updatedMessage.id
            ? { ...updatedMessage, avatar_url: msg.avatar_url }
            : msg,
        ),
      );
    });

    newSocket.on("recentMessages", (recentMessages: Message[]) => {
      Promise.all(
        recentMessages.map(async (message) => {
          const avatarUrl = await fetchUserAvatar(message.username);
          return { ...message, avatar_url: avatarUrl };
        }),
      ).then(setMessages);
    });

    newSocket.on("message_error", (error: string) => {
      setErrorMessage(error);
      setTimeout(() => setErrorMessage(""), 5000);
    });

    fetch("/api/v1/shoutbox/history")
      .then((response) => response.json())
      .then((data) => {
        Promise.all(
          data.rows.map(async (message: Message) => {
            const avatarUrl = await fetchUserAvatar(message.username);
            return { ...message, avatar_url: avatarUrl };
          }),
        ).then(setMessages);
      })
      .catch((error) =>
        console.error("Error fetching shoutbox history:", error),
      );

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchUserAvatar = async (username: string): Promise<string> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/users/${username}`,
      );
      const userData: User = await response.json();
      return userData.avatar_url;
    } catch (error) {
      console.error("Error fetching user avatar:", error);
      return "/default-avatar.png";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const renderMessageWithEmojis = (message: string) => {
    const parts = message.split(/(:[a-zA-Z0-9_+-]+:)/g);
    return parts.map((part, index) => {
      const emojiUrl = customEmojis[part as keyof typeof customEmojis];
      if (emojiUrl) {
        return (
          <Image
            key={index}
            src={emojiUrl}
            alt={part}
            className="inline-block h-5 w-5 mx-0.5"
            width={20}
            height={20}
          />
        );
      }
      return part;
    });
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "" && session) {
      if (inputMessage.length <= MAX_MESSAGE_LENGTH) {
        const newMessage = {
          id: Date.now(),
          username: session.user.name,
          message: inputMessage,
        };
        if (socket) {
          socket.emit("message", newMessage);
        }
        setInputMessage("");

        try {
          await fetch("/api/v1/shoutbox/history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: session.user.name,
              message: inputMessage,
            }),
          });
        } catch (error) {
          console.error("Error sending message:", error);
          setErrorMessage("Failed to send message. Please try again.");
        }
      } else {
        setErrorMessage("Message exceeds the maximum length");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingMessageId) {
        handleUpdateMessage();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleEditMessage = (messageId: number) => {
    const messageToEdit = messages.find((msg) => msg.id === messageId);
    if (messageToEdit) {
      setEditingMessageId(messageId);
      setInputMessage(messageToEdit.message);
      inputRef.current?.focus();
    }
  };

  const handleUpdateMessage = () => {
    if (inputMessage.trim() !== "" && session && editingMessageId) {
      if (inputMessage.length <= MAX_MESSAGE_LENGTH) {
        const updatedMessage = {
          id: editingMessageId,
          username: session.user.name,
          message: inputMessage,
        };
        if (socket) {
          socket.emit("updateMessage", updatedMessage);
        }
        setInputMessage("");
        setEditingMessageId(null);
      } else {
        setErrorMessage("Message exceeds the maximum length");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setInputMessage("");
  };

  const handleEmojiClick = (emoji: string) => {
    setInputMessage((prevMessage) => prevMessage + emoji);
    setIsEmojiPickerOpen(false);
  };

  const onlineUsers = Array.from(new Set(messages.slice(0, 10).map(msg => msg.username)));

  return (
    <Card className="mb-8 border-0 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Live Shoutbox</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Real-time conversations
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="font-mono">
                {onlineUsers.length} active
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-200"
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Messages Area */}
        <ScrollArea 
          className={`px-4 transition-all duration-300 ease-in-out ${
            isExpanded ? 'h-96' : 'h-48'
          }`}
        >
          <div className="space-y-3 py-4">
            <AnimatePresence>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="group relative"
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/30">
                      <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
                        <AvatarImage 
                          src={msg.avatar_url || "/prof-pic.png"} 
                          alt={msg.username}
                        />
                        <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-secondary/20">
                          {msg.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
                            {msg.username}
                          </span>
                          <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                          <span className="text-xs text-muted-foreground">
                            now
                          </span>
                        </div>
                        <div className="text-sm text-foreground/90 leading-relaxed break-words">
                          {renderMessageWithEmojis(msg.message)}
                        </div>
                      </div>
                      
                      {session && session.user.name === msg.username && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-7 w-7 p-0 hover:bg-primary/10"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                  </div>
                  <p className="text-muted-foreground">No messages yet.</p>
                  <p className="text-muted-foreground/70 text-sm mt-1">Be the first to start a conversation!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-gradient-to-r from-muted/20 to-muted/10 p-4">
          {editingMessageId && (
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Edit className="h-3 w-3" />
              <span>Editing message</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="ml-auto h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="pr-12 bg-background/50 border-border/50 focus:bg-background transition-all duration-200"
                placeholder={
                  editingMessageId ? "Edit your message..." : "Type your message..."
                }
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {inputMessage.length}/{MAX_MESSAGE_LENGTH}
              </div>
            </div>
            
            <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="end">
                <div className="grid grid-cols-8 gap-2">
                  {Object.entries(customEmojis).map(([emoji, url]) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEmojiClick(emoji)}
                      className="h-8 w-8 p-0 hover:bg-muted rounded-lg"
                    >
                      <Image
                        src={url}
                        alt={emoji}
                        className="w-5 h-5"
                        width={20}
                        height={20}
                        unoptimized
                      />
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              onClick={editingMessageId ? handleUpdateMessage : handleSendMessage}
              disabled={!inputMessage.trim() || inputMessage.length > MAX_MESSAGE_LENGTH}
              className="h-10 px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            >
              {editingMessageId ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {editingMessageId ? "Update" : "Send"}
            </Button>
          </div>
          
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 p-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
            >
              {errorMessage}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Shoutbox;
