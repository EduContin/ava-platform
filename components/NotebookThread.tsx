import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import customEmojis from "@/models/custom-emojis";
import SessionProviderClient from "./SessionProviderClient";
import { FaTrashAlt } from "react-icons/fa";
import { ThreadProps, Post} from "app/interfaces/interfaces";
import { slugify } from "@/models/slugify";

interface NotebookThread{
    removePinned : (threadId : number)=> void;
    threadProp : ThreadProps; 
}

const NotebookThread: React.FC<NotebookThread> = ({removePinned, threadProp}) => {


    const { data: session } = useSession();
    const [thread, setThread] = useState(threadProp.threadProp);
    const [user, setUser] = useState(threadProp.user_id);
    const [posts, setPosts] = useState(thread.posts);

    useEffect(()=>{
        setThread(threadProp.threadProp);
        setUser(threadProp.user_id);
    },[threadProp]);

    useEffect(()=> {
        setPosts(thread.posts);
    }, [thread]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    //Render the user profile from the user of a post
    const renderUserProfile = (user : any) => {
        if (!user.username) return null;

        return (
            <div className="bg-gray-800 rounded-lg overflow-hidden max-w-xs mx-auto w-full">
                <div className="relative">
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-700 flex items-end justify-center pb-2">
                        <h3 className="text-xl font-bold text-white mb-12">
                            <a
                            href={`/users/${user.username}`}
                            className={`font-semibold ${user.banned ? "line-through text-gray-400" : ""}`}
                            >
                            {user.username}
                            </a>
                        </h3>
                    </div>
                    <Image
                    src={user.avatar_url || `/winter_soldier.gif`}
                    alt="Profile Picture"
                    width={10}
                    height={10}
                    className="absolute left-1/2 transform
                    -translate-x-1/2 -bottom-12 w-24 h-24
                    rounded-full border-4 border-gray-800 object-cover"
                    />
                </div>
                <div className="pt-16 px-4 pb-6">
                    {/* Reputation and Likes */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <p
                            className={`text-2xl font-bold ${
                                user.reputation >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                            >
                            {user.reputation}
                            </p>
                            <p className="text-xs text-gray-400">Reputation</p>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <p className="text-2xl font-bold text-green-500">
                            {user.likes_received}
                            </p>
                            <p className="text-xs text-gray-400">Likes</p>
                        </div>
                    </div>

                    {/* User group */}
                    <p className={`text-gray-300 font-bold
                    text-sm mb-4 text-center ${user.banned ? "text-red-500" : ""}`}>
                        {user.banned ? "Banned" : user.user_group}
                    </p>

                    {/* User details */}
                    <div className="text-xs text-gray-300 space-y-2">
                        <p>
                            <span className="font-semibold">POSTS:</span> {user.posts_count}
                        </p>
                        <p>
                            <span className="font-semibold">THREADS:</span>{" "}
                            {user.threads_count}
                        </p>
                        <p>
                            <span className="font-semibold">JOINED:</span>{" "}
                            {new Date(user.user_created_at).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-semibold">VOUCHES:</span> {user.vouches}
                        </p>
                        <p>
                            <span className="font-semibold">CREDITS:</span>{" "}
                            {user.credits || 0}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderContentWithEmojisAndBBCode = (content: string) => {
        const parsedContent = content
            .replace(/\[b\](.*?)\[\/b\]/g, "<b>$1</b>")
            .replace(/\[i\](.*?)\[\/i\]/g, "<i>$1</i>")
            .replace(/\[u\](.*?)\[\/u\]/g, "<u>$1</u>")
            .replace(/\[s\](.*?)\[\/s\]/g, "<s>$1</s>")
            .replace(
            /\[color=(\w+|#[0-9a-fA-F]{6})\](.*?)\[\/color\]/g,
            "<span style='color:$1'>$2</span>",
            )
            .replace(
            /\[size=(\w+)\](.*?)\[\/size\]/g,
            "<span style='font-size:$1'>$2</span>",
            )
            .replace(
            /\[align=(\w+)\](.*?)\[\/align\]/g,
            "<div style='text-align:$1'>$2</div>",
            )
            .replace(
            /\[quote\](.*?)\[\/quote\]/g,
            "<blockquote class='border-l-4 border-gray-500 pl-4 my-2 italic'>$1</blockquote>",
            )
            .replace(/\[code\](.*?)\[\/code\]/g, "<pre><code>$1</code></pre>")
            .replace(
            /\[img\](.*?)\[\/img\]/g,
            "<img src='$1' alt='User uploaded image' />",
            )
            .replace(
            /\[url=([^\]]+)\](.*?)\[\/url\]/g,
            "<a href='$1' target='_blank' rel='noopener noreferrer'>$2</a>",
            )
            .replace(
            /\[spoiler\](.*?)\[\/spoiler\]/g,
            "<span class='spoiler-content'>$1</span>",
            )
            .replace(/\[hidden\](.*?)\[\/hidden\]/g, (match, content) => {
            const firstPost = posts[0];
            return firstPost.is_liked_by_user
                ? "<span style='color:#ff0000'>" + content + "</span>"
                : "<span class='hidden-content'>Like this post to see the content</span>";
            })
            .replace(/\n/g, "<br>");

        const parts = parsedContent.split(/(:[a-zA-Z0-9_+-]+:)/g);

        return parts.map((part, index) => {
            const emojiUrl = customEmojis[part as keyof typeof customEmojis];
            if (emojiUrl) {
                return (
                    <Image key={index} src={emojiUrl}
                    alt={part} width={20}
                    height={20} className="inline-block h-7 w-7"/>
                );
            }
            return (
                <span key={index} dangerouslySetInnerHTML={{ __html: part }}></span>
            );
        });
    };

    
    return (
        <SessionProviderClient session={session}>
            {thread && (
                <div className="bg-gray-800/90 backdrop-blur-sm w-full rounded-lg p-6 mb-2">
                    <div className="flex items-center w-full justify-between">
                        <h2 className="text-2xl font-bold">
                            <a href={`/thread/${slugify(thread.title)}-${thread.id}`}>{thread.title}</a>
                        </h2>
                        <div className="flex flex-row align-right space-x-10">
                            <button onClick={() => removePinned(thread.id)}
                            className="px-4 py-2 p-2 bg-blue-600 border-none
                            rounded-md cursor-pointer flex items-center space-x-3
                            hover:bg-blue-800
                            transition-all duration-800 ease-in-out
                            active:scale-105 transform"
                            >
                                <img src="/push-pin.png" alt="Button Pin" className={`w-6 h-6 transition-transform
                                duration-300 ease-in-out rotate-180`}/>
                                <span>Unpin from Favorites</span>
                                
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                        Posted by
                        <a href={`/users/${thread.username}`}> {thread.username} </a>
                        in {thread.category_name} on{" "}
                        {new Date(thread.created_at).toLocaleString()}
                    </p>
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post.id} className="flex">
                                <div className=" pr-4">{renderUserProfile(post)}</div>

                                <div className="w-5/6">
                                    <div className="rounded-lg p-4 bg-gray-700/50 overflow-hidden">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-400">
                                                {new Date(post.created_at).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="whitespace-pre-wrap overflow-wrap-break-word word-break-break-word max-w-full">
                                            {post.is_deleted ? (
                                            <div className="flex items-center space-x-2 text-gray-500 italic">
                                                <FaTrashAlt className="text-red-500" />
                                                <span>This content was deleted by a moderator</span>
                                            </div>
                                            ) : (renderContentWithEmojisAndBBCode(post.content))}
                                        </div>
                                        {!post.is_deleted && (
                                            <div className="mt-2 flex items-center">
                                                <svg
                                                    className={`w-5 h-5 ${post.is_liked_by_user ? 'text-blue-500': 'text-gray-400'}`}
                                                    fill="currentColor"
                                                    
                                                    viewBox="0 0 20 20">
                                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                </svg>

                                                <span>{post.likes_count}</span>
                                            </div>
                                        )}
                                    </div>
                                    {!post.is_deleted && post?.signature && (
                                        <div className="mt-4 bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
                                            <h3 className="text-lg font-semibold">User Signature:</h3>
                                            <div className="overflow-wrap-break-word word-break-break-word max-w-full">
                                            {renderContentWithEmojisAndBBCode(
                                                post.signature,
                                            )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        
                        ))}
                    </div>
                </div>
            )}
        </SessionProviderClient>
    );
};
export default NotebookThread;