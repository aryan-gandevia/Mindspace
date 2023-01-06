import Head from 'next/head'
import { Inter } from '@next/font/google'
import Message from '../components/message'
import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Link from 'next/link';


export default function Home() {


  const [value, setValue] = useState(""); // Value of what is being searched

  //Creating a state with all parts
  const [allPosts, setAllPosts] = useState([]); // All of the posts

  // If nothing is being searched
  if (value.length == 0) {

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
  } 

  // If something is being searched, only display the posts with the searched tag 
  if (value.length > 0) {

    // Gets all the posts
    const getPosts = async () => {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('tag', '==', value));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setAllPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
        });
        return unsubscribe;
      };
      
    useEffect(() => {
      getPosts();
    });
  }

    return (
      <div>
        
        {/* Top part of the page */}
        <div className = "my-12 text-lg font-medium">
          <h2>
            See what's on other people's minds!
            <hr></hr>
          </h2>
      
          {/* Search bar at top of page*/}
          <input  //search bar
              type = "text"
              className="w-full flex justify-center"
              placeholder="Search for a specific tag..."
              onChange = {e => setValue(e.target.value)} />
  
          {/* Displaying all the posts */}
          {allPosts.map(post => (
            <Message key={post.id} {...post}>
              <Link href = {{pathname: `/${post.id}`, query: {...post}}}>

                {/* Comments button */}
                <button className = "text-black flex p-1 rounded-lg bg-cyan-500">
                  {post.comments?.length > 0 ? post.comments?.length : 0} Comments
                </button>
              </Link>
            </Message>))}
        </div>
      </div>
    )
}
