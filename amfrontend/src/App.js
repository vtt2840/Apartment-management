import { BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navigation from './components/Navigation/Nagivation';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

    return (
        <>
        <Router>
            <div className='app-header'>
                <Navigation/>
            </div>
            <div className="App">
                <AppRoutes/>
            </div>
        </Router>

        <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        </>
    );
}

export default App;
