import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Router, { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {toast} from "react-toastify";

export default function Post () {
    // form state
    const [post, setPost] = useState({description: ""});

    // the user
    const [user, loading] = useAuthState(auth);

    // routing of user
    const route = useRouter();

    //editing a post
    const routeData = route.query;


    // Submit Post
    const submitPost = async (e) => {
        e.preventDefault();

        //Run checks on post for validity
        if (!post.description) {
            toast.error("Your post is empty!", {
                autoClose: 2000 
            });
            return route.push("/post");
        }

        if (post.description.length > 300) {
            toast.error("Your post is too long!", {
                autoClose: 2000 
            });
            return route.push("/post");
        }


        if (post?.hasOwnProperty("id")) {
            const docRef = doc(db, 'posts', post.id);
            const updatedPost = {...post, timestamp: serverTimestamp()};
            await updateDoc(docRef, updatedPost);
            return route.push('/');
        } else {

            // Make a new post
            const collectionRef = collection(db, 'posts');
            await addDoc(collectionRef, {
                ...post,
                timestamp: serverTimestamp(),
                user: user.uid,
                avatar: user.photoURL,
                username: user.displayName
            });
            setPost({ description: ""});
            toast.success("A new post has been made!", {autoClose: 2000} );
            return route.push('/');
        }
    };

    //Check our user
    const checkUser = async () => {
        if (loading) {
            return;
        }
        if (!user) {
            route.push('/');
        }
        if (routeData.id) {
            setPost({description: routeData.description, id: routeData.id});
        }
    };

    useEffect (() => {
        checkUser();
    }, [user, loading]);


    return (
        <div className="my-20 p-12 bg-slate-500 shadow-lg shadow-slate-500/50 rounded-lg max-w-lg mx-auto">
            <form onSubmit= {submitPost}>
                <h1 className = "text-2xl font-bold">
                    {post.hasOwnProperty("id") ? "Edit your post" : "Create your own post"}
                </h1>
                <div className="py-2">
                    <h3 className = "text-lg font-medium py-2">
                        Description
                    </h3>
                    <textarea 
                    value = {post.description}
                    onChange = {(e) => setPost({...post, description: e.target.value})}
                    className = "bg-gray-800 h-40 w-full text-white p-2 text-sm"></textarea>
                    <p className={`text-white font-medium text-sm ${post.description.length > 300 ? "text-pink-300" : ""}`}> {post.description.length}/300</p>
                </div>
                <button 
                type = "submit"

                className = "w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm">
                    Submit
                </button>
            </form>
        </div>
    );
}