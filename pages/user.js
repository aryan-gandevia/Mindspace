import Message from "../components/message";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase";
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Link from "next/link";

export default function User () {

    const router = useRouter();
    const routeData = router.query;
    const [allPosts, setAllPosts] = useState([]);

    console.log(routeData.user);

   // const user_id = routeData.map((character) => character);





    const getPosts = async () => {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('user', '==', routeData.user));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAllPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
          });
          return unsubscribe;
      };
    
      useEffect(() => {
        getPosts();
      }, [router.isReady]);

    return (
        <div>
            <h1 >
                {routeData.username}'s posts:
            </h1>
            {allPosts.map(post => (
                <Message key = {post.id} {...post}>
                     <Link href = {{pathname: `/${post.id}`, query: {...post}}}>

                     {/* Comments button*/}
                     <button className = "text-black flex p-1 rounded-lg bg-cyan-500">
                         {post.comments?.length > 0 ? post.comments?.length : 0} Comments
                     </button>
                     </Link>   
                </Message>
            ))}
        </div>
    );
}