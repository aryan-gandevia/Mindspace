import {FcGoogle} from "react-icons/fc";
import {signInWithPopup, GoogleAuthProvider, signInWithRedirect} from "firebase/auth";
import {auth} from "../../utils/firebase";
import { useRouter } from "next/router";
import {useAuthState} from "react-firebase-hooks/auth";
import {useEffect} from "react";

export default function Login () {

    const route = useRouter(); // Pathing of the application (what page it goes to)
    const [user, loading] = useAuthState(auth); // State of the user, logged in or not

    //Sign in with Google
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            route.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    // if user is logged in, don't let them go back to login
    useEffect(() => {
        if (user) {
            route.push ("/");
        } else {
            console.log("login");
        }
    }, [user]);

    return (

        /* Login button */
        <div className = "shadow-x1 mt-32 p-10 text-gray-700 bg-white rounded-lg">
            <h2 className = "text-2xl font-medium">
                Join today
            </h2>
            <div className = "py-4">
                <h3 className = "py-4">
                    Sign in with one of the providers
                </h3>

                {/* Login with Google button */}
                <button
                 onClick={GoogleLogin}
                 className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2">
                    <FcGoogle className = "text-2xl"/>
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}