import Message from "../components/message";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase";
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Link from "next/link";

// The function that serves as the page where you can see individual users and their posts.
export default function User () {

    const router = useRouter(); // the routing of the user
    const routeData = router.query; // information brought from the previous page that is useful for this page
    const [allPosts, setAllPosts] = useState([]); // all the posts to be displayed

    // get the desired user's posts to display
    const getPosts = async () => {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('user', '==', routeData.user)); // Only retrieve posts that have the userid as the user we clicked on
        const update = onSnapshot(q, (snapshot) => {
            setAllPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
          });
          return update;
      };
    
      useEffect(() => { // run the function once
        getPosts();
      }, [router.isReady]);

    return (
        <div>
             <div className = "flex item-center gap-2 items-stretch">

                <img src = {routeData.avatar} className = "w-12 rounded-full border-2" />

                {/* Username */}
                <h1 className = "text-white p-2 text-lg">
                    {routeData.username}'s posts:
                </h1>
            </div>
            
            {allPosts.map(post => (
                <Message key = {post.id} {...post}>
                     <Link href = {{pathname: `/${post.id}`, query: {...post}}}>

                     {/* Comments button*/}
                     <button className = "text-black flex p-1 rounded-lg px-3 bg-gray-200 hover:bg-gray-400">
                         {post.comments?.length > 0 ? post.comments?.length : 0} Comments
                     </button>
                     </Link>   
                </Message>
            ))}
        </div>
    );
}