import Message from "../components/message";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase";
import {toast} from "react-toastify";
import { arrayUnion, Timestamp, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";

export default function Details () {

    const router = useRouter();
    const routeData = router.query;
    const [message, setMessage] = useState("");
    const [allMessage, setAllMessage] = useState([]);


    //Submit a message
    const submitMessage = async () => {
        //Check if user is logged
        if (!auth.currentUser) {
            return router.push("/auth/login");
        }
        if (!message) {
            toast.error("Your comment is empty!", {
                autoClose: 1500
            });
            return;
        }
        const docRef = doc(db, 'posts', routeData.id);
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            }),
        });

        setMessage('');
    };

    //Get Comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          setAllMessage(snapshot.data().comments);
        });
        return unsubscribe;
    };

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        getComments();
    }, [router.isReady]);

    return (
        <div>
            <Message {...routeData}>
            </Message>
            <div className = "my-4">
                    <div className = "flex">
                        <input
                        onChange = {(e) => setMessage(e.target.value)}
                        className = "bg-dark-grey w-full p-2 text-white"
                        type = "text"
                        value = {message}
                        placeholder = "Type something..." />
                        <button 
                        onClick = {submitMessage}
                        className = "bg-cyan-500 text-white text-sm py-2 px-4">
                            Submit
                        </button>
                    </div>
                    <div className = "py-6">
                        <h2 className = "font-bold">
                            Comments
                        </h2>
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