"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Megaphone, Clock, User, ExternalLink } from "lucide-react";
import { slugify } from "@/models/slugify";

interface Thread {
  id: number;
  title: string;
  username: string;
  category_name?: string;
  post_count: number;
  last_post_at: string;
  anounts: boolean;
}

async function getAnnouncements() {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL;
  const response = await fetch(
    `${apiUrl}/api/v1/threads?announcements=true&page=1&pageSize=10`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch announcements");
  }
  return response.json();
}

const limitTitle = (title: string, maxLength: number = 70): string => {
  if (title.length > maxLength) {
    return title.slice(0, maxLength - 3) + "...";
  }
  return title;
};

const timeSinceLastActivity = (lastActivity: string): string => {
  const now = new Date();
  const lastActivityTime = new Date(lastActivity);
  const delta = now.getTime() - lastActivityTime.getTime();

  const minutes = Math.floor(delta / 60000);
  const hours = Math.floor(delta / 3600000);
  const days = Math.floor(delta / 86400000);
  const months = Math.floor(days / 30);

  if (months >= 1) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days >= 1) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes >= 1) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "just now";
  }
};

const AnnouncementsTopics: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch announcements");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  if (isLoading) {
    return <div>Loading announcements...</div>;
  } 

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card className="mb-8 border-0 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
              <Megaphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Announcements</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Important updates
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="font-mono whitespace-nowrap bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-600 border-orange-200/20 hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-300 shadow-sm"
            >
              <Megaphone className="h-3 w-3 mr-1.5" />
              {announcements.length}{" "}
              {announcements.length === 1 ? "topic" : "topics"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-1">
          <AnimatePresence>
            {announcements.length > 0 ? (
              announcements.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="group"
                >
                  <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-all duration-200 border-b border-border/30 last:border-b-0">
                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                      <AvatarImage src={`/api/avatar/${topic.username}`} alt={topic.username} />
                      <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary/20 to-secondary/20">
                        {topic.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link
                        href={`/thread/${slugify(topic.title)}-${topic.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors duration-200 line-clamp-2 group-hover:underline"
                        title={topic.title}
                      >
                        {limitTitle(topic.title)}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <Link
                          href={`/users/${topic.username}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {topic.username}
                        </Link>
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeSinceLastActivity(topic.last_post_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Badge variant="secondary" className="font-mono">
                        <Megaphone className="h-3 w-3 mr-1" />
                        {topic.post_count}
                      </Badge>
                      <Link
                        href={`/thread/${slugify(topic.title)}-${topic.id}`}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-primary hover:scale-110"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Megaphone className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                </div>
                <p className="text-muted-foreground text-lg">
                  No announcements at this time
                </p>
                <p className="text-muted-foreground/70 text-sm mt-2">
                  Important updates will appear here when available
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementsTopics;
