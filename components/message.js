export default function Message ({children, avatar, username, description,}) {
    return (
        <div className = " bg-white p-8 m-4">
            <div className = "flex item-center gap-2">
                <img src = {avatar} className = "w-10 rounded-full" />
                <h2 className = "text-black">
                    {username}
                </h2>
            </div>
            <div className= "py-4">
                <p className = "text-black"> 
                    {description}
                </p>
            </div>
            {children}
        </div>
    );
}