import Notebook from "@/components/Notebook";
import { Suspense } from "react";

export default function NotebookBody(){
    return (
        <div>
            <Suspense>
                <Notebook/>
            </Suspense>
        </div>
    );
}