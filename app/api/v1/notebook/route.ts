import database from "@/infra/database";
import { NextRequest, NextResponse } from "next/server";
import { ThreadProp, Post, User, Threads, Section } from "@/app/interfaces/interfaces";

export async function GET(req : NextRequest){
    const {searchParams} = new URL(req.url);
    const user_id = searchParams.get("userId");
    

    if (!user_id) {
        return NextResponse.json( { error: "User not authenticated" } , { status: 401 } );
    }

    try{
        
        const result = await database.query({
            text: `SELECT id, name FROM sections`
        });

        let sections : Section[] = result.rows;
        for(let i = 0; i < sections.length; i++){
            const result = await database.query({
                text: `
                SELECT t.id, t.title, t.user_id, t.category_id,
                t.created_at from threads AS t
                JOIN pinned as p ON t.id = p.thread_id
                WHERE p.user_id=$1
                AND t.category_id IN
                (SELECT id FROM categories WHERE section_id=$2)`,
                values : [user_id, sections[i].id]
            });
            sections[i].threads = result.rows;
        }
        return NextResponse.json(sections);
    }
    catch(error){
        console.error("Error fetching pinned:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export async function POST(req : Request){
    try{
        const { thread_id , user_id } = await req.json();
        const response = await database.query({
            //Fetch the thread info
            text: `SELECT t.id, t.title, t.created_at,
            c.name AS category_name, u.username AS username
            FROM threads AS t
            JOIN categories AS c ON c.id=t.category_id
            JOIN users AS u ON u.id=t.user_id
            WHERE t.id=$1`,
            values : [thread_id]
        });

        if (response.rows.length > 0){
            const posts_response = await database.query({
                //Get all the posts from a thread and the respective user info
                text: 
                `SELECT p.id, p.content, p.created_at, p.likes_count, p.is_deleted,
                (SELECT true AS is_liked_by_user FROM likes WHERE user_id=$1 AND post_id=p.id),
                u.username, u.created_at AS user_created_at, u.avatar_url, u.user_group,
                u.threads_count, u.posts_count, u.likes_received,
                u.reputation, u.vouches, u.signature, u.banned
                FROM posts AS p
                JOIN users as u ON u.id=p.user_id
                WHERE p.thread_id=$2 ORDER BY p.created_at ASC`,
                values : [user_id, thread_id]
            });
            if(response.rows.length > 0){
                const thread : ThreadProp = response.rows[0];
                thread.posts = posts_response.rows;
                return NextResponse.json(thread);
            }
            }
            else{
                return NextResponse.json(
                    {message: "Failed to get posts"},
                    {status : 401}
                );
            }
        }
    catch (error){
        return NextResponse.json(
            { message: "Internal Server Error" } ,
            { status : 500 }
        );
    }
}