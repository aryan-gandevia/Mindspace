import Link from 'next/link';

// The function that is used to format the messages/posts which are displayed on the screen.
// The messages include the user's avatar, username, post description, title, its associated search tag
// and the user itself incase the user information is needed to be sent.
export default function Message ({children, avatar, username, description, title, tag, user}) {
    
    return (
        <div className = " bg-white p-8 m-4">
            <div className = "flex item-center gap-2">

                {/* Picture of user */}
                <Link href = {{pathname: "/user", query: {user, username, avatar}}}>
                    <img src = {avatar} className = "w-10 rounded-full border-black hover:border-2" />
                </Link>
                
                {/* Username */}
                <h2 className = "text-black p-2">
                    {username}
                </h2>
            </div>

            {/* Title */}
            <div className= "py-1">
                <p className = "text-xl font-black text-blue-900">
                    {title}
                </p>
            </div>

            {/* Search tag */}
            <div>
                <p className = "text-sm text-green-400">
                    {tag}
                </p>
            </div>

                {/* Description */}
                <p className = "text-black py-4"> 
                    {description}
                </p>
            {children}
        </div>
    );
}