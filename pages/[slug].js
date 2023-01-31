import React from "react";
import Message from "../components/message";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase";
import {toast} from "react-toastify";
import { arrayUnion, Timestamp, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";

// The function that is used for comments.
export default function Details () {

    const router = useRouter(); // Routing the user
    const routeData = router.query; // Retrieving the selected post's data when comments button is pressed
    const [message, setMessage] = useState(""); // The comment
    const [allMessage, setAllMessages] = useState([]); // All the comments on the post


    // Submit a message
    const submitMessage = async () => {
        // Check if user is logged in. If not, route the user to the login page.
        if (!auth.currentUser) {
            return router.push("/auth/login");
        }
        
        // Check if comment being submitted is empty. If it is empty, show a toast error with what the error is, and stay on the page.
        if (!message) {
            toast.error("Your comment is empty!", {
                autoClose: 1500
            });
            return;
        }

        const docRef = doc(db, 'posts', routeData.id); // The specific post selected, with the post and the docRef identifier as the post's id
        
        // adds a new field to the post in the database, which is the field 'comments'
        await updateDoc(docRef, {
            // in the field comments, hold the comments typed, the avatar of who sent it, the username, and the time the comment was made.
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            }),
        });

        setMessage(''); // start off the message as nothing.
    };


    //Loads the comments of the specific post, in chronological order. Also checks if this is a valid route by the user or invalid.
    const getComments = async () => {
        // if statements so that if the user tries manually entering some sort of random extension to the URL, it returns them back to the home screen instead of a random,
        // undefined slug
        if (routeData.id === undefined) {
            return router.push("/");
        }
        console.log(router.pathname);
        const docRef = doc(db, 'posts', routeData.id);
        const update = onSnapshot(docRef, (snapshot) => { // uses onSnapshot to live update when comments are added
            console.log(snapshot.data().comments);
            if (snapshot.data().comments === undefined) { 
            }
            setAllMessages(snapshot.data().comments);
        });
        return update;

    };

    // Loading the comments properly
    useEffect(() => {
        if (!router.isReady) { // if the route isn't ready, do nothing yet
            return;
        }
        getComments(); // fetch the comments to display
    }, [router.isReady] // dependency to stop it from continuously looping
    );

    return (
        <div>

            {/* Loads the specific message */}
            <Message {...routeData}>
            </Message>
            <div className = "my-4">
                    <div className = "flex">

                        {/* Inputting the comment */}
                        <input
                        onChange = {(e) => setMessage(e.target.value)}
                        className = "bg-dark-grey w-full p-2 text-white"
                        type = "text"
                        value = {message}
                        placeholder = "Type something..." />

                        {/* Submit button to submit the comment */}
                        <button 
                        onClick = {submitMessage}
                        className = "bg-cyan-700 hover:bg-cyan-500 text-white text-sm py-2 px-4">
                            Submit
                        </button>
                    </div>
                    <div className = "py-6">
                        <h2 className = "font-bold">
                            Comments
                        </h2>

                        {/* Loading all comments */}
                        {allMessage?.map(message => (
                            <div className = "bg-black p-4 my-4 border-2 shaodw-white" key={message.time}>
                                <div className = "flex items-center gap-2 mb-4">
                                    <img
                                     className = "w-10 rounded-full"
                                     src = {message.avatar}/>
                                    <h2>
                                        {message.userName}
                                    </h2>
                                </div>
                                <h2>
                                    {message.message}
                                </h2>
                            </div>

                        ))}
                    </div>
            </div>
        </div>
    );
}