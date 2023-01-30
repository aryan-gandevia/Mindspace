import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth, db} from "../utils/firebase";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import Message from "../components/message";
import {BsTrash2Fill} from 'react-icons/bs';
import {AiFillEdit} from 'react-icons/ai';
import Link from "next/link";

// The function that displays the "your account" page of the website, accessed by clicking on the avatar on the top right of the screen.
export default function Dashboard () {

    const route = useRouter(); // Route of the page
    const [user, loading] = useAuthState(auth); // The user and their loading state
    const [posts, setPosts] = useState ([]); // All the posts by the user


    // See if user is logged
    const getData = async () => {
        if (loading) {
            return;
        }
        if (!user) {
            return route.push('/');
        }

        // All of user's posts
        const collectionRef = collection(db, 'posts'); // the database of posts
        const q = query(collectionRef, where('user', '==', user.uid)); // only holding the posts with the userid being the same as this user (their own posts)
        const update = onSnapshot(q, (snapshot => { // update the posts in live time with onSnapshot()
            setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }));
        return update;
    };


    //Delete post
    const deletePost = async(id) => {
        const docRef = doc(db, 'posts', id); // selects the post to delete
        await deleteDoc(docRef); // uses in-built delete function
    }

    // Get users data, and only runs once in the beginning of the page's launch, and if any state changes in the dependency
    useEffect(() => {
        getData();

    }, [user,loading]);

    return (
        <div>

            {/* The heading of the page */}
            <h1 className = "text-lg"> 
                Collection of Your Posts:
            </h1>

            {/* The user's posts*/}
            <div>
                {posts.map((post) => {
                    return (
                    <Message {...post} key={post.id}>
                        <div className = "flex gap-4">

                            {/* Button to delete the post */}
                            <button 
                            onClick = {() => deletePost(post.id)}
                            className = "text-pink-600 hover:bg-gray-200 flex items-enter justify-center gap-2 py-2 px-2 text-sm">
                                <BsTrash2Fill className= "text-2xl"/>
                                Delete
                            </button>

                            {/* button to edit the post */}
                            <Link href = {{pathname: "/post", query: post}}>
                                <button className = "text-green-400 hover:bg-gray-200 flex items-enter justify-center gap-2 py-2 px-2 text-sm">
                                    <AiFillEdit className= "text-2xl"/>
                                    Edit
                                </button>
                            </Link>
                        </div>
                    </Message>
                    );
                })}    
            </div>

            {/* Sign out button */}
            <button className = "font-medium text-white bg-cyan-700 hover:bg-cyan-500 py-2 px-4 w-full my-6"
             onClick={ () => auth.signOut()}>
                Sign out
            </button>
        </div>
    );
}