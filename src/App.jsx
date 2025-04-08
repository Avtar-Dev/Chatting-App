import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatList from "./Screens/ChatList";
import ChatScreen from "./Screens/ChatScreen";
import "./App.css";
import SignUp from "./Screens/SignUp";
import Login from "./Screens/Login";
import { FirebaseProvider } from "../Context/FirebaseContext";
import { isEmptyObject } from "./utils/EmpObj";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);

    return isEmptyObject(currentUser) ? <Navigate to="/login" /> : children;
  };
  return (
    <div className="main-div">
      <FirebaseProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<SignUp />} />

            <Route
              path="/chatlist"
              element={
                <ProtectedRoute>
                  <ChatList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatscreen"
              element={
                <ProtectedRoute>
                  <ChatScreen />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </FirebaseProvider>
    </div>
  );
}

export default App;
