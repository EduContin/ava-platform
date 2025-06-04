
import database from "@/infra/database";
import { NextRequest, NextResponse } from "next/server";



//GET Request using URL Parameters as THREAD_ID and USER_ID
//To find if a Thread was Pinned as Favorite by a User
export async function GET(req: NextRequest){
    const {searchParams} = new URL(req.url);
    const user_id = searchParams.get("userId");
    const thread_id = searchParams.get("threadId");
    
    if (!user_id) {
        return NextResponse.json( { error: "User not authenticated" } , { status: 401 } );
    }
    if (!thread_id){
        return NextResponse.json( { error : "No Thread ID provided"} , { status : 400} );
    }
    try{
        const result = await database.query({
            text: `SELECT thread_id, true AS is_pinned_by_user
            FROM pinned WHERE user_id=$1 AND thread_id=$2`,
            values: [user_id, thread_id]

        });

        return NextResponse.json(result);
    }
    catch(error){
        console.error("Error fetching pinned:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}

//POST used to add threads into the PINNED table
//and to the NOTEBOOK of a specific USER
export async function POST(req: Request){
    const {user_id, thread_id} = await req.json();

    try{
        const result = await database.query({
            text: `INSERT INTO pinned (user_id, thread_id)
            VALUES ($1, $2)`,
            values: [user_id, thread_id]
        });

        if (result.rows.length > 0){
            return NextResponse.json({
                message: "Thread Pinned Sucessfully!!!",

            });
        }
        else{
            return NextResponse.json({
                message: "Failed to Pin the Thread",
            });
        }
    }
    catch ( error ){
        return NextResponse.json(
            { message: "Internal Server Error" } ,
            { status : 500 }
        );
    }
}

//DELETE used to remove threads from the PINNED table
//and remove from the NOTEBOOK of a specific USER
export async function DELETE(req: Request){
    const {user_id, thread_id} = await req.json();

    try{
        const result = await database.query({
            text: `DELETE FROM pinned WHERE
            user_id = $1 AND thread_id = $2`,
            values: [user_id, thread_id]
        });

        if (result.rows.length === 1){
            return NextResponse.json({
                message: "Thread Unpinned Sucessfully!!!",

            });
        }
        else{
            return NextResponse.json({
                message : "Failed to Unpin Thread"
            });
        }
    }
    catch ( error ){
        return NextResponse.json(
            { message: "Internal Server Error" } ,
            { status : 500 }
        );
    }
}