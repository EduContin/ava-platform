import Notebook from "@/components/Notebook";
import { Suspense } from "react";

export default function NotebookBody(){
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Notebook/>
            </Suspense>
        </div>
    );
}