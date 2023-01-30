import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Router, { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {toast} from "react-toastify";
import {IoMdArrowDropdown} from "react-icons/io";


// Function for the dropdown menu in the post function
function DropdownItem (props) {
    return (
         <a className = "text-black"> {props.text}</a>        
    );
}

// The function that serves as the 'post' screen
export default function Post () {

    // Whether the dropdown menu is open or not, default false/unopened
    const [open, setOpen] = useState(false); 

    // form state, all values defualted as empty string
    const [post, setPost] = useState({description: "", title: "", tag: ""});

    // the user
    const [user, loading] = useAuthState(auth); 

    // routing of user
    const route = useRouter();

    //editing a post
    const routeData = route.query;


    // Submit Post
    const submitPost = async (e) => {
        e.preventDefault();



        //Run checks on potential post's validity:

        //Title validity
        if (!post.title) {
            toast.error ("Your title is empty!", {
                autoClose: 2000
            });
            return route.push("/post");
        }
        if (post.title.length > 50) {
            toast.error ("Your title is too long!", {
                autoClose: 2000
            });
            return route.push("/post");
        }

        //Description validity
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

        // If post is being edited, bringing the selected post
        if (post?.hasOwnProperty("id")) {
            const docRef = doc(db, 'posts', post.id);
            const updatedPost = {...post, timestamp: serverTimestamp()};
            await updateDoc(docRef, updatedPost);
            return route.push('/');
        } else {

            // Make a new post
            const collectionRef = collection(db, 'posts');
            await addDoc(collectionRef, { // on top of all the information given for the post, also add the userid, avatar and username.
                ...post,
                timestamp: serverTimestamp(),
                user: user.uid,
                avatar: user.photoURL,
                username: user.displayName
            });
            setPost({ description: "", title: "", tag: ""});
            toast.success("A new post has been made!", {autoClose: 2000} );
            return route.push('/'); // back to home page once post is made
        }
    };

    //Check our user's state or where they are coming from. If editing a post, Bring information from this post to the edit section so the post can edit
    // existing information.
    const checkUser = async () => {
        if (loading) {
            return;
        }
        if (!user) {
            route.push('/');
        }
        if (routeData.id) {
            setPost({description: routeData.description, title: routeData.title, tag: routeData.tag, id: routeData.id});
        }
    };

    useEffect (() => { // load the page once and check if the user is editing a post or making a new one (as done in checkUser() function)
        checkUser();
    }, [user, loading]);


    return (
        <div className="my-20 p-12 bg-slate-500 shadow-lg shadow-slate-500/50 rounded-lg max-w-lg mx-auto">
            
            {/* Form to change the post */}
            <form onSubmit= {submitPost}>
                <h1 className = "text-2xl font-bold">
                    {post.hasOwnProperty("id") ? "Edit your post" : "Create your own post"}
                </h1>
                <div className="py-2">

                    {/* Changing the title of the post */}
                    <h2 className = "text-lg font-medium py-2">
                        Title
                    </h2>
                    <textarea
                    value = {post.title}
                    onChange = {(e) => setPost({ ...post, title: e.target.value})}
                    className = "bg-gray-800 h-10 w-full text-white p-2 text-sm">
                    </textarea>
                    <p className={`text-white font-medium text-sm ${post.title.length > 50 ? "text-pink-300" : ""}`}> 
                        {post.title.length}/50
                    </p>

                    {/* Changing the tag of the post */}
                    <h4 className = "text-lg font-medium py-2" placeholder="Tag">
                        Tag &#40;Click in the box to Change&#41;
                    </h4>
                        <div className = "menu-container">
                            <div 
                            className = "menu-trigger border-2 w-full" onClick = {() => {setOpen(!open)}}>
                                {post.tag.length == 0 && (
                                    <h7>
                                        Click here:
                                    </h7>
                                )}
                                <h7 className = "text-green-400">
                                    {post.tag}
                                </h7>
                            </div>
                                    
                                {/* All the options of the potential tags */}
                                <div className = {`dropdown-menu ${open? 'active' : 'inactive'}`}>
                                    <ul>
                                        <li>
                                            <button
                                            type = "button"
                                            onMouseDown= {() => {
                                                setPost({...post, tag: "video games"});
                                                setOpen(!open);
                                            }}>
                                                <DropdownItem text = {"video games"}/>
                                            </button>
                                        </li>

                                        <li>
                                        <button
                                         type = "button"
                                         onMouseDown= {() => {
                                            setPost({...post, tag: "sports"});
                                            setOpen(!open);
                                         }}>
                                             <DropdownItem text = {"sports"}/>
                                        </button>
                                        </li>

                                        <li>
                                        <button
                                         type = "button"
                                         onMouseDown= {() => {
                                            setPost({...post, tag: "education"});
                                            setOpen(!open);
                                         }}>
                                             <DropdownItem text = {"education"}/>
                                        </button>
                                        </li>

                                        <li>
                                        <button
                                         type = "button"
                                         onMouseDown= {() => {
                                            setPost({...post, tag: "world news"});
                                            setOpen(!open);
                                         }}>
                                             <DropdownItem text = {"world news"}/>
                                        </button>
                                        </li>

                                        <li>
                                        <button
                                         type = "button"
                                         onMouseDown= {() => {
                                            setPost({...post, tag: "music"});
                                            setOpen(!open);
                                         }}>
                                             <DropdownItem text = {"music"}/>
                                        </button>
                                        </li>

                                        <li>
                                        <button
                                         type = "button"
                                         onMouseDown= {() => {
                                            setPost({...post, tag: "media news"});
                                            setOpen(!open);
                                         }}>
                                             <DropdownItem text = {"media news"}/>
                                        </button>
                                        </li>
                                        <li>
                                        <button
                                         type = "button"
                                         onMouseDown= {() => {
                                            setPost({...post, tag: "other"});
                                            setOpen(!open);
                                         }}>
                                             <DropdownItem text = {"other"}/>
                                        </button>
                                        </li>
                                    </ul>
                                </div>
                        </div>
                   

                    {/* Changing the post's content */}
                    <h3 className = "text-lg font-medium py-2">
                        Description
                    </h3>
                    <textarea 
                    value = {post.description}
                    onChange = {(e) => setPost({...post, description: e.target.value})}
                    className = "bg-gray-800 h-40 w-full text-white p-2 text-sm"></textarea>
                    <p className={`text-white font-medium text-sm ${post.description.length > 300 ? "text-pink-300" : ""}`}> 
                        {post.description.length}/300
                    </p>
                </div>

                {/* Button to submit */}
                <button 
                type = "submit"
                className = "w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium p-2 my-2 rounded-lg text-sm">
                    Submit
                </button>
            </form>
        </div>
    );
}



