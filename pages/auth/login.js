import {FcGoogle} from "react-icons/fc";
import {signInWithPopup, GoogleAuthProvider, signInWithRedirect} from "firebase/auth";
import {auth} from "../../utils/firebase";
import { useRouter } from "next/router";
import {useAuthState} from "react-firebase-hooks/auth";
import {useEffect} from "react";

// The function that deals with user authentication, specifically logging in. 
// FUTURE PLANS: add different types of login methods, such as phone number, different mail applications
export default function Login () {

    const route = useRouter(); // Pathing of the application (what page it goes to)
    const [user, loading] = useAuthState(auth); // State of the user, logged in or not

    const googleProvider = new GoogleAuthProvider(); // Creates a variable to hold the google authentication via email for users to login with

    // Login via google.
    // Function follows asynchronous promise-based behavior, so that it will either reject or accept the action of trying to login.
    // Useful so that if it is rejected, an error is caught and thrown to the console, to help understand the error and handle it accordingly.
    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider); // Popup to sign in with google
            route.push("/"); // Go back to homepage/stay while waiting
        } catch (error) {
            console.log(error); // Outputting error to console
        }
    };

    // if user is logged in, don't let them go back to login
    useEffect(() => { // the userEffect function, which checks if the user is logged in. If they are and try manually putting '/auth/login' path, it returns them to home.
        if (user) {
            route.push ("/");
        } else {
            console.log("login");
        }
    }, [user] // the useEffect dependency value, which makes sure useEffect runs once when the function is called, and again if user state changes.
    );

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