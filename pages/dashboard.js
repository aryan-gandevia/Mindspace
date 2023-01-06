import { useAuthState } from "react-firebase-hooks/auth";
import {auth, db} from "../utils/firebase";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import Message from "../components/message";
import {BsTrash2Fill} from 'react-icons/bs';
import {AiFillEdit} from 'react-icons/ai';
import Link from "next/link";

export default function Dashboard () {

    const route = useRouter(); // Route of the page
    const [user, loading] = useAuthState(auth); // The user's state
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
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('user', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot => {
            setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }));
        return unsubscribe;
    };


    //Delete post
    const deletePost = async(id) => {
        const docRef = doc(db, 'posts', id);
        await deleteDoc(docRef);
    }

    // Get users data
    useEffect(() => {
        getData();

    }, [user,loading]);

    return (
        <div>
            <h1> 
                Your Posts
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
                            className = "text-pink-600 flex items-enter justify-center gap-2 py-2 text-sm">
                                <BsTrash2Fill className= "text-2xl"/>
                                Delete
                            </button>

                            {/* button to edit the posrt */}
                            <Link href = {{pathname: "/post", query: post}}>
                                <button className = "text-green-400 flex items-enter justify-center gap-2 py-2 text-sm">
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
            <button className = "font-medium text-white bg-cyan-500 py-2 px-4 w-full my-6"
             onClick={ () => auth.signOut()}>
                Sign out
            </button>
        </div>
    );
}