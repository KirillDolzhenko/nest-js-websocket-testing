import './styles/App.scss';
import { io } from 'socket.io-client';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './components/pages/Auth/Auth';

// export const socket = io('http://localhost:3010', {
//   autoConnect: false,
// });

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />

          <Route path="/*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
