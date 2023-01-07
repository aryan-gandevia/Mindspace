import Message from "../components/message";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase";
import {toast} from "react-toastify";
import { collection, arrayUnion, Timestamp, doc, getDoc, onSnapshot, orderBy, query, updateDoc, getAuth } from "firebase/firestore";
import Link from 'next/link';
import { PT_Sans } from "@next/font/google";


export default function AllUsers () {


    const router = useRouter(); // Routing the user
    const [allPosts, setAllPosts] = useState([]);


    // Gets all the posts
    const getPosts = async () => {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAllPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
          });
          return unsubscribe;
    };

  
    useEffect(() => {
      getPosts();
    });
    

    return (
        <div>
          {allPosts.map(post => {{post.username}})}
          


            {/* {allPosts.map(post => (
                <div>
                    {post.id}
                </div>
            ))} */}

        </div>
    );
}