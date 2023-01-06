import Link from 'next/link';

export default function Message ({children, avatar, username, description, title, tag, user}) {
    return (
        <div className = " bg-white p-8 m-4">
            <div className = "flex item-center gap-2">

                {/* Picture of user */}
                <Link href = {{pathname: "/user", query: {user, username}}}>
                    <img src = {avatar} className = "w-10 rounded-full" />
                </Link>
                
                {/* Username */}
                <h2 className = "text-black">
                    {username}
                </h2>
            </div>

            {/* Title */}
            <div className= "py-1">
                <p className = "text-xl font-black text-blue-900">
                    {title}
                </p>
            </div>

            {/* Tag */}
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