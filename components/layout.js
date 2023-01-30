import Nav from "./nav";

// Function that constructs/renders the page layout:
// Nav (navbar) at the top of the screen, followed by 
// the rest of the props needing to be loaded (in code: {children}) wrapped by the '<main>' tag.
export default function Layout ({children}) {
    return (
        <div className= "mx-6 md:max-w-2xl md:mx-auto font-montserrat">
            <Nav/>
            <main>
                {children}
            </main>
        </div>
    )
}