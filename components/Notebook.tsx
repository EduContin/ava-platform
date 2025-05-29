import "../assets/notebook.css";

export default function Notebook() {


    const fetchCategories = async () => {
        fetch("http://localhost:8800/notebook")
    }

    return (
        
        <div className="root">
            <h1 className="notebook-title">Your Notebook</h1>
            {/* Still need to create the logic behind the categories
                and the decoration */}
            <div className="categories">
                <ul className="list-categories">
                    <li className="item-categories">Example1</li>
                    <li className="item-categories">Example2</li>
                    <li className="item-categories">Example3</li>
                    <li className="item-categories">Example4</li>

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