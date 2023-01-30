import Link from "next/link";
import {auth} from "../utils/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { useState } from "react";

// The function that creates the navbar present in each page of the application. 
// Dynamic navbar to change depending on whether or not the user is logged in or not.
export default function Nav () {

    // the user and their authorized state to either show a logged in navbar or non-logged in
    const [user, loading] = useAuthState(auth); 

   // contents of navbar
    return (
        <nav className = "flex justify-between items-center py-3">
            
            {/* Button to click to go to the main page */}
            <Link href = "/">
                <button className = "text-lg font-medium py-2 px-0 hover:bg-gray-700 bg-opacity-25">
                    Mindspace
                 </button>
            </Link>

            <ul className = "flex items-center gap-10">

                {/* If the user isn't logged in, display the "join now" button */}
                {!user && (

                    <Link legacyBehavior href = {"/auth/login"}>
                        <a className = "py-2 px-4 text-sm bg-cyan-700 hover:bg-cyan-500 text-white rounded-mg font-medium ml-8">
                        Join now
                        </a>
                    </Link>
                )}

                {/* If the user is logged in, display the "post" button and user's profile picture to go to the dashboard*/}
                {user && (
                    <div className = "flex items-center gap-6">
                        

                        {/* Post button*/}
                        <Link href = "/post">
                            <button className = "font-medium bg-cyan-700 hover:bg-cyan-500 text-white py-2 px-4 rounded-mg text-sm"> 
                                Post
                            </button>
                        </Link>

                        {/* Go to dashboard button*/}
                        <Link href = "/dashboard">
                            <img className="w-12 rounded-full cursor-pointer hover:border-2" src={user.photoURL}/>
                        </Link>
                    </div>
                )}
            </ul>
        </nav>
    );
}