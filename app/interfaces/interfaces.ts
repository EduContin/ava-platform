
//Thread.tsx
export interface PostThread {
  id: number;
  content: string;
  username: string;
  created_at: string;
  user_id: number;
  avatar_url: string;
  likes_count: number;
  is_liked_by_user: boolean;
  signature: string;
  is_deleted: boolean;
}

export interface UserThread {
  credits: number;
  banned: any;
  id: number;
  username: string;
  email: string;
  created_at: string;
  avatar_url: string;
  bio: string | null;
  user_group: string;
  threads_count: number;
  posts_count: number;
  likes_received: number;
  reputation: number;
  vouches: number;
  last_seen: string | null;
  signature: string;
}

export interface ThreadPropThread {
    thread: {
        id: number;
        title: string;
        username: string;
        category_name: string;
        created_at: string;
    };
    posts: PostThread[];
}

export interface User{
  username : string;
  created_at : string;
  avatar_url : string;
  user_group : string;
  threads_count : number;
  posts_count : number;
  likes_received: number;
  reputation : number;
  vouches: number;
  signature : string;
  banned : boolean;
  credits : number;
}


//NotebookThread, Notebook
export interface Post{
    id : number;
    content : string;
    created_at : string;
    likes_count : number;
    is_deleted : boolean;
    is_liked_by_user : boolean;

    //user fields
    username : string;
    user_created_at : string;
    avatar_url : string;
    user_group : string;
    threads_count : number;
    posts_count : number;
    likes_received: number;
    reputation : number;
    vouches: number;
    signature : string;
    banned : boolean;
    credits : number;
}


export interface ThreadProp {
    id: number;
    title: string;
    username: string;
    category_name: string;
    created_at: string;
    posts: Post[];
}

export interface ThreadProps {
    user_id: number;
    threadProp : ThreadProp;
}



//components/Notebook.tsx
export interface Threads{
    id: number;
    title : string;
}

export interface Section {
    id: number;
    name: string;
    threads: Threads[];
}

//app/category/[slug]
export interface Subcategory {
  id: number;
  name: string;
  description: string;
  thread_count: number;
  post_count: number;
}