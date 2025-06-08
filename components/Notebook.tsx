<<<<<<< Updated upstream
"use client";

import "../assets/notebook.css";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";



export default function Notebook() {


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

    const {data : session} = useSession();
    const [sections, setSections] = useState<Section[]>([]);
    const [activeSection, setActiveSection] = useState<string>("");
    const [pinnedThreads, setPinnedThreads] = useState({});
    const [curr_user_id, setCurrUserId] = useState("");
    const [currThread, setCurrThread] = useState({});
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(()=> {

        const fetchPinnedThreads = async () =>{
            let section_id;
            for(let i = 0; i < sections.length; i++){
                if (sections[i].name == activeSection){
                    section_id = sections[i].name;
                    const data = sections[i].categories;
                    console.log("Data", data);
                    setCategories(data);
                }
            }
            const categories_ids = categories.map(item => item.id);
            console.log("Active session", activeSection);
            console.log("Categories", categories);
            console.log(categories_ids);

                try{
                    const response = await fetch("api/v1/notebook",{
                        method: "POST",
                        headers : { "Content-Type": "application/json"},
                        body : JSON.stringify({
                            section_id,
                            curr_user_id,
                            categories_ids

                        })
                    });
                    if(response.ok){
                        const data = await response.json();
                        
                    }
                    else{
                        console.error("Failed to fetch the Threads");
                    }
                }
                catch (error){
                    console.error("Error fetching the Threads: ", error);
                }
        };
    
    fetchPinnedThreads();
    }, [activeSection]);
    
    useEffect(() => {
        if (session?.user?.name) {
            fetch(`/api/v1/users/${session.user.name}`)
            .then((response) => response.json())
            .then((user) => {
                setCurrUserId(user.id);
                console.log(user.id);
            })
            .catch((error) => console.error("Error fetching user data:", error));
        }
    }, [session]);


    useEffect(() => {
    const fetchSections = async () => {
        try {
        const response = await fetch("/api/v1/forum-structure");
        if (response.ok) {
            const data = await response.json();
            setSections(data);
            if (data.length > 0) {
            setActiveSection(data[0].name);
            }
        } else {
            console.error("Failed to fetch forum structure");
        }
        } catch (error) {
        console.error("Error fetching forum structure:", error);
        }
    };


    fetchSections();
    }, []);

    return (
        
        <div className="root">
            {/* Still need to create the logic behind the categories
                and the decoration */}
            <div className="categories">
                <ul className="list-categories">
                    {sections.map((section) => (
                    <li key={section.id}>
                        <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                            activeSection === section.name
                            ? "bg-blue-600 text-white shadow-lg transform scale-105"
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
            
            {/*Main Container */}
            <div className="main-container">
                
                {/*Pinned Threads part */}
                <div className="pinned-threads">
                    <div className="title-pinned-threads">
                        <h1>PINNED THREADS</h1>
                    </div>
                    <hr></hr>
                    <div className="threads">
                        <ul className="list-threads">
                            <li className="item-threads">Thread1</li>
                            <li className="item-threads">Thread2</li>
                            <li className="item-threads">Thread3</li>
                        </ul>
                    </div>
                </div>

                <div className="threads-display">
                    <div className="opened-threads">

                    </div>
                    <div className="current-thread">

                    </div>
                </div>
            </div>
        </div>
    );
=======
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NotebookThread from "@/components/NotebookThread";
import {Section, Threads, ThreadProps, ThreadProp} from "app/interfaces/interfaces";



export default function Notebook() {

    const {data : session} = useSession();
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

    useEffect(()=> {
        for (let i = 0; i < sections.length; i++){
            if(sections[i].name === activeSection){
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

    const removePinned = async (threadId : number) => {
        //Remove from sections and from pinnedThreads
        if(curr_user_id && currThread){
            const remove_thread = window.confirm(`
                Unpin Thread ${currThread.threadProp.title} from Favorites?`);

            if(!remove_thread) return;

            const thread_id = currThread.threadProp.id;
            try{
                const response = await fetch(`/api/v1/pinned`, {
                    method : "DELETE",
                    body : JSON.stringify({
                        user_id : curr_user_id,
                        thread_id : thread_id
                    })
                });
                if(response.ok){
                    const index = sections.findIndex(item => item.id == threadId);
                    const new_threads = sections[index].threads.filter(item => item.id != threadId);
                    //Substitute the pinnedThreads from a sections to another one
                    sections[index].threads = new_threads;
                    setPinnedThreads(sections[index].threads);
                    setCurrThread(undefined);
                    setCurrThreadId(undefined);
                    setDisplayThread(false);
                }
                else{

                }
            }
            catch ( error ){
                console.error("Failed to Unpin Thread");
            }
        }
    }
    
    useEffect(() => {
        const fetchCurrThread = async () => {
            try{
                const response = await fetch("/api/v1/notebook", {
                    method : "POST",
                    body : JSON.stringify({
                        thread_id : currThreadId,
                        user_id : curr_user_id
                    })
                });
                if(response.ok){
                    const result = await response.json();
                    const threadprop : ThreadProp = result;
                    if(curr_user_id){
                        const temp : ThreadProps = ({
                            user_id : curr_user_id,
                            threadProp: threadprop
                        });
                        setCurrThread(temp);
                        setDisplayThread(true);
                    }
                }
                
            }
            catch ( error ){
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
        
        <div className="w-screen h-screen flex flex-col items-center bg-[#111827]">
            {/*Sections div */}
            <div className="w-[95%] h-[15%] flex items-center justify-center bg-[#1f2737] mt-[5%] mb-[2.5%]">
                <ul className="w-full flex flex-row items-center justify-evenly">
                    {sections.map((section) => (
                        <li key={section.id}>
                            <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                                activeSection === section.name
                                ? "bg-blue-600 text-white shadow-lg transform scale-105"
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
            
            {/*Main Container */}
            <div className="w-full h-[90%] flex flex-row mt-[2.5%] mb-[2.5%]">
                
                {/*Pinned Threads part */}
                <div className="w-[20%] h-full flex items-center
                justify-center flex-col ml-[5%] mr-[2.5%]
                bg-[#212732] rounded-3xl border-solid 
                border-[#2b354b] border-4">
                    <div className="w-full h-[20%] flex justify-center
                    items-center text-2xl border-b-4
                    border-solid border-[#2b354b]">
                        <h1>PINNED THREADS</h1>
                    </div>
                    <div className="w-full h-[90%]">
                        <ul className="flex flex-col items-start
                        justify-start w-full pt-4">
                            {pinnedThreads.map((thread)=>(
                            <li key={thread.id}> 
                                <div className={` w-full flex justify-between items-center px-4 py-2
                                    ${currThreadId === thread.id
                                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                                        : "text-slate-300 hover:bg-gray-700/70 hover:text-white"}`
                                    }>
                                    <button
                                        className={"w-full px-4 py-2 flex flex-row rounded-md text-sm font-medium transition-all duration-200 ease-in-out "}
                                        onClick={() => setCurrThreadId(thread.id)}
                                        aria-pressed={currThreadId === thread.id}
                                        >
                                        {thread.title}
                                        <img src="/push-pin.png" alt="Button Pin"
                                         className={`w-6 h-6 transition-transform duration-300 ease-in-out
                                         hover: transform`}/>
                                    </button>
                                </div>

                            </li>  
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8 mr-10">
                    {displayThread && currThread &&(
                    <NotebookThread threadProp={currThread} removePinned={removePinned}/>
                    )}
                </div>                 
            </div>
        </div>
    );
>>>>>>> Stashed changes
}