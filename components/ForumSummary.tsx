// components/ForumSummary.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { slugify } from "@/models/slugify";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Folder,
  ExternalLink,
  BarChart3,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  thread_count: number;
  post_count: number;
}

interface Section {
  id: number;
  name: string;
  categories: Category[];
}

const ForumSummary: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("/api/v1/forum-structure");
        if (response.ok) {
          const data = await response.json();
          setSections(data);
        } else {
          console.error("Failed to fetch forum structure");
        }
      } catch (error) {
        console.error("Error fetching forum structure:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sections]);

  const LoadingSkeleton = () => (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-6 border rounded-xl bg-gradient-to-r from-background to-muted/20"
            >
              <div className="space-y-3 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="mb-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <Card className="mb-8 border-0 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
              <Folder className="h-8 w-8 text-primary" />
            </div>
            Forum Categories
          </CardTitle>
          <CardDescription className="text-base">
            Explore different topics and discussions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mb-4">
              <BarChart3 className="h-16 w-16 text-muted-foreground/50 mx-auto" />
            </div>
            <p className="text-muted-foreground text-lg">No forum sections available yet.</p>
            <p className="text-muted-foreground/70 text-sm mt-2">Check back later for new discussions!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalThreads = sections.reduce((acc, section) => 
    acc + section.categories.reduce((catAcc, cat) => catAcc + cat.thread_count, 0), 0
  );
  
  const totalPosts = sections.reduce((acc, section) => 
    acc + section.categories.reduce((catAcc, cat) => catAcc + cat.post_count, 0), 0
  );

  return (
    <Card className="mb-8 border-0 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                <Folder className="h-6 w-6 text-primary" />
              </div>
              Forum Categories
              <Badge variant="outline" className="ml-2 font-mono text-xs">
                {sections.length} sections
              </Badge>
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Explore different topics and discussions across various sections
            </CardDescription>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg text-primary">{totalThreads.toLocaleString()}</div>
              <div className="text-muted-foreground">Total Threads</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-secondary">{totalPosts.toLocaleString()}</div>
              <div className="text-muted-foreground">Total Posts</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue={sections[0]?.name} className="w-full">
          <div className="relative mb-8">
            {/* Left scroll button */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 border border-border shadow-lg flex items-center justify-center hover:bg-background transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            
            {/* Right scroll button */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 border border-border shadow-lg flex items-center justify-center hover:bg-background transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
              className="overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <TabsList className="flex h-12 w-max items-center gap-2 p-2 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl min-w-full">
                {sections.map((section, index) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.name}
                    className="flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex-shrink-0"
                  >
                    <TrendingUp className="h-4 w-4" />
                    {section.name}
                    <Badge variant="secondary" className="ml-1 h-5 text-xs font-mono">
                      {section.categories.length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Fade indicators */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background/90 to-transparent pointer-events-none rounded-l-xl" />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background/90 to-transparent pointer-events-none rounded-r-xl" />
            )}
          </div>
          
          {sections.map((section) => (
            <TabsContent key={section.id} value={section.name} className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {section.categories.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mb-4">
                        <Clock className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                      </div>
                      <p className="text-muted-foreground text-lg">No categories in this section yet.</p>
                      <p className="text-muted-foreground/70 text-sm mt-2">New categories will appear here soon!</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/10 overflow-hidden shadow-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-muted/30 to-muted/10 hover:bg-muted/40">
                            <TableHead className="py-4 text-base font-semibold">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-primary" />
                                Category
                              </div>
                            </TableHead>
                            <TableHead className="text-center py-4">
                              <div className="flex items-center justify-center gap-2 text-base font-semibold">
                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                Threads
                              </div>
                            </TableHead>
                            <TableHead className="text-center py-4">
                              <div className="flex items-center justify-center gap-2 text-base font-semibold">
                                <Users className="h-4 w-4 text-green-500" />
                                Posts
                              </div>
                            </TableHead>
                            <TableHead className="w-[60px] text-center py-4">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {section.categories.map((category, index) => (
                            <motion.tr
                              key={category.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group border-b border-border/30 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-300"
                            >
                              <TableCell className="py-6">
                                <div className="space-y-2">
                                  <Link
                                    href={`/category/${slugify(category.name)}`}
                                    className="font-semibold text-lg text-foreground hover:text-primary transition-all duration-300 inline-flex items-center gap-2 group-hover:gap-3 group"
                                  >
                                    <span className="bg-gradient-to-r from-primary/10 to-secondary/10 p-2 rounded-lg group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                                      <Folder className="h-4 w-4 text-primary" />
                                    </span>
                                    {category.name}
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary" />
                                  </Link>
                                  <p className="text-sm text-muted-foreground leading-relaxed pl-10">
                                    {category.description}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="text-center py-6">
                                <Badge 
                                  variant="secondary" 
                                  className="font-mono text-sm px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 border-blue-200/20 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300"
                                >
                                  {category.thread_count.toLocaleString()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center py-6">
                                <Badge 
                                  variant="outline" 
                                  className="font-mono text-sm px-3 py-1 bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-600 border-green-200/20 hover:from-green-500/20 hover:to-green-600/20 transition-all duration-300"
                                >
                                  {category.post_count.toLocaleString()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center py-6">
                                <Link
                                  href={`/category/${slugify(category.name)}`}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 text-primary hover:from-primary/20 hover:to-primary/30 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ForumSummary;
