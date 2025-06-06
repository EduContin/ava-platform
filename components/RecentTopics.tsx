"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { slugify } from "@/models/slugify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  User,
  ExternalLink,
  RefreshCw
} from "lucide-react";

interface Thread {
  id: number;
  title: string;
  username: string;
  category_name: string;
  post_count: number;
  last_post_at: string;
  announcements: boolean;
}

async function getLatestThreads() {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL;
  const response = await fetch(`${apiUrl}/api/v1/threads?page=1&pageSize=10`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch threads");
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

const LoadingSkeleton = () => (
  <Card className="mb-8 border-0 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl">
    <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 p-4 border rounded-xl bg-gradient-to-r from-background to-muted/20"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </motion.div>
      ))}
    </CardContent>
  </Card>
);

function RecentTopics() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchThreads = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      else setIsLoading(true);

      const latestThreads = await getLatestThreads();
      const commonThreads = latestThreads.filter((thread: Thread) => !thread.announcements);
      setThreads(commonThreads);
      setError(null);
    } catch (err) {
      setError("Failed to fetch threads");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchThreads();
    const intervalId = setInterval(() => fetchThreads(true), 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className="mb-8 border-0 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-destructive/5 via-transparent to-destructive/5">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10">
              <MessageSquare className="h-5 w-5 text-destructive" />
            </div>
            Recent Topics
          </CardTitle>
          <CardDescription>Latest discussions from the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mb-4">
              <RefreshCw className="h-16 w-16 text-muted-foreground/50 mx-auto" />
            </div>
            <p className="text-destructive text-lg">Failed to load recent topics</p>
            <p className="text-muted-foreground/70 text-sm mt-2">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-0 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Recent Topics</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Latest discussions
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="font-mono whitespace-nowrap bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 border-blue-200/20 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300 shadow-sm"
            >
              <MessageSquare className="h-3 w-3 mr-1.5" />
              {threads.length} {threads.length === 1 ? 'topic' : 'topics'}
            </Badge>
            {isRefreshing && (
              <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-1">
          <AnimatePresence>
            {threads.length > 0 ? (
              threads.map((thread, index) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="group"
                >
                  <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-all duration-200 border-b border-border/30 last:border-b-0">
                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                      <AvatarImage src={`/api/avatar/${thread.username}`} alt={thread.username} />
                      <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary/20 to-secondary/20">
                        {thread.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link
                        href={`/thread/${slugify(thread.title)}-${thread.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors duration-200 line-clamp-2 group-hover:underline"
                        title={thread.title}
                      >
                        {limitTitle(thread.title)}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <Link
                          href={`/users/${thread.username}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {thread.username}
                        </Link>
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeSinceLastActivity(thread.last_post_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Badge variant="secondary" className="font-mono">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {thread.post_count}
                      </Badge>
                      <Link
                        href={`/thread/${slugify(thread.title)}-${thread.id}`}
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
                  <MessageSquare className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                </div>
                <p className="text-muted-foreground text-lg">No recent topics found</p>
                <p className="text-muted-foreground/70 text-sm mt-2">Start a new discussion to get the conversation going!</p>
            </div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentTopics;
