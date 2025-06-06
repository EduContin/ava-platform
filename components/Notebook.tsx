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
}