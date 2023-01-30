import '../styles/globals.css'
import Layout from '../components/layout'
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Displays the application itself and its structure.
// Everything wrapped within '<Layout>' so that they are sent as the children of the Layout function, and rendered in properly.
export default function App({ Component, pageProps }) {
  return (
   <Layout>
    <ToastContainer limit = {1} /> {/* Limit of error notifications set to 1 so that errors will not stack up and block the screen*/}
     <Component {...pageProps} />
   </Layout>
  );
}
