"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NotebookThread from "@/components/NotebookThread";
import { Section, Threads, ThreadProps, ThreadProp } from "app/interfaces/interfaces";



export default function Notebook() {

    const { data: session } = useSession();
    const [curr_user_id, setCurrUserId] = useState<number>();
    const [sections, setSections] = useState<Section[]>([]);
    const [activeSection, setActiveSection] = useState<string>("");

    const [pinnedThreads, setPinnedThreads] = useState<Threads[]>([]);

    const [currThreadId, setCurrThreadId] = useState<number>();
    const [currThread, setCurrThread] = useState<ThreadProps>();
    const [displayThread, setDisplayThread] = useState(false);

    useEffect(() => {
        if (session?.user?.name) {
            fetch(`/api/v1/users/${session.user.name}`)
                .then((response) => response.json())
                .then((user) => {
                    setCurrUserId(user.id);
                })
                .catch((error) => console.error("Error fetching user data:", error));
        }
    }, [session]);

    useEffect(() => {
        const fetchSectionsAndThreads = async () => {
            try {
                const response = await fetch(`/api/v1/notebook?userId=${curr_user_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSections(data);
                    if (data.length > 0) {
                        setActiveSection(data[0].name);
                    }
                } else {
                    console.error("Failed to fetch sections and threads");
                }
            } catch (error) {
                console.error("Error fetching sections and threads:", error);
            }
        };
        fetchSectionsAndThreads();
    }, [curr_user_id]);

    useEffect(() => {
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].name === activeSection) {
                const temp = sections[i].threads;
                setPinnedThreads(sections[i].threads);
                setCurrThreadId(undefined);
                setCurrThread(undefined);
            }
        }
        /*const index = sections.findIndex(item => item.name === activeSection);
        setPinnedThreads(sections[index].threads);
        setCurrThreadId(undefined);
        setCurrThread(undefined);*/

    }, [activeSection]);

    const removePinned = async (threadId: number) => {
        //Remove from sections and from pinnedThreads
        if (curr_user_id && currThread) {
            const remove_thread = window.confirm(`
                Unpin Thread ${currThread.threadProp.title} from Favorites?`);

            if (!remove_thread) return;

            const thread_id = currThread.threadProp.id;
            try {
                const response = await fetch(`/api/v1/pinned`, {
                    method: "DELETE",
                    body: JSON.stringify({
                        user_id: curr_user_id,
                        thread_id: thread_id
                    })
                });
                if (response.ok) {
                    const index = sections.findIndex(item => item.id == threadId);
                    const new_threads = sections[index].threads.filter(item => item.id != threadId);
                    //Substitute the pinnedThreads from a sections to another one
                    sections[index].threads = new_threads;
                    setPinnedThreads(sections[index].threads);
                    setCurrThread(undefined);
                    setCurrThreadId(undefined);
                    setDisplayThread(false);
                }
                else {

                }
            }
            catch (error) {
                console.error("Failed to Unpin Thread");
            }
        }
    }

    useEffect(() => {
        const fetchCurrThread = async () => {
            try {
                const response = await fetch("/api/v1/notebook", {
                    method: "POST",
                    body: JSON.stringify({
                        thread_id: currThreadId,
                        user_id: curr_user_id
                    })
                });
                if (response.ok) {
                    const result = await response.json();
                    const threadprop: ThreadProp = result;
                    if (curr_user_id) {
                        const temp: ThreadProps = ({
                            user_id: curr_user_id,
                            threadProp: threadprop
                        });
                        setCurrThread(temp);
                        setDisplayThread(true);
                    }
                }

            }
            catch (error) {
                console.error("Failed to fetch the Current thread");
            }
        };
        fetchCurrThread();
    }, [currThreadId]);

    /*useEffect(()=> {
        setDisplayThread(true);   
        console.log("Current Thread: ", currThread); 
    }, [currThread]);*/


    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-[#111827] via-[#181f2e] to-[#232946]">
            {/* Sections */}
            <div className="w-[95%] h-[15%] flex items-center justify-center bg-gradient-to-r from-[#1f2737] to-[#232946] mt-8 mb-4 rounded-2xl shadow-lg border border-[#232946]/40">
                <ul className="w-full flex flex-row items-center justify-evenly gap-2">
                    {sections.map((section) => (
                        <li key={section.id} className="flex-1">
                            <button
                                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                ${activeSection === section.name
                                        ? "bg-blue-600 text-white shadow-lg scale-105"
                                        : "text-slate-300 hover:bg-gray-700/70 hover:text-white"
                                    }`}
                                onClick={() => setActiveSection(section.name)}
                                aria-pressed={activeSection === section.name}
                            >
                                {section.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Container */}
            <div className="w-full flex-1 flex flex-row mt-2 mb-4">
                {/* Pinned Threads */}
                <div className="w-[20%] h-full flex flex-col items-center justify-start ml-[5%] mr-6 bg-gradient-to-br from-[#212732] to-[#232946] rounded-3xl border-4 border-[#2b354b] shadow-lg">
                    <div className="w-full h-[20%] flex justify-center items-center text-2xl border-b-4 border-[#2b354b] font-semibold tracking-wide text-slate-200">
                        <h1>PINNED THREADS</h1>
                    </div>
                    <div className="w-full flex-1 overflow-y-auto">
                        <ul className="flex flex-col items-start justify-start w-full pt-4 gap-2">
                            {pinnedThreads.map((thread) => (
                                <li key={thread.id} className="w-full">
                                    <div
                                        className={`w-full flex justify-between items-center px-4 py-2 rounded-lg transition-all duration-200
                    ${currThreadId === thread.id
                                                ? "bg-blue-600 text-white shadow-lg scale-105"
                                                : "text-slate-300 hover:bg-gray-700/70 hover:text-white"
                                            }`}
                                    >
                                        <button
                                            className="w-full flex flex-row items-center gap-2 rounded-md text-sm font-medium transition-all duration-200"
                                            onClick={() => setCurrThreadId(thread.id)}
                                            aria-pressed={currThreadId === thread.id}
                                        >
                                            {thread.title}
                                            <img
                                                src="/push-pin.png"
                                                alt="Button Pin"
                                                className="w-6 h-6 ml-2 transition-transform duration-300"
                                            />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Thread Display */}
                <div className="flex-1 container mx-auto px-4 py-8 mr-10">
                    {displayThread && currThread && (
                        <NotebookThread threadProp={currThread} removePinned={removePinned} />
                    )}
                </div>
            </div>
        </div>
    );
}