import ReactDOM from 'react-dom/client';
import App from './App';
import {AuthGate} from './components/AuthGate';
import './style.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<AuthGate><App/></AuthGate>);
