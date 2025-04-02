// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import ChatList from "./Screens/ChatList";
// import ChatScreen from "./Screens/ChatScreen";
// import "./App.css";
// import SignUp from "./Screens/SignUp";
// import Login from "./Screens/Login";
// import { FirebaseProvider } from "../Context/FirebaseContext";
// import { useContext } from "react";
// import { AuthContext } from "../Context/AuthContext";
// import { isEmptyObject } from "./utils/EmpObj";

// function App() {
//   const { currentUser } = useContext(AuthContext);

//   const ProtectedRoute = ({ children }) => {
//     if (isEmptyObject(currentUser)) {
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };

//   return (
//     <div className="main-div">
//       <FirebaseProvider>
//         <BrowserRouter>
//           <Routes>
//             {/* <Route
//               path="/"
//               element= <SignUp />
//             /> */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/" element={<SignUp />} />
//             <Route
//               path="/chatlist"
//               element={
//                 <ProtectedRoute>
//                   <ChatList />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chatscreen"
//               element={
//                 <ProtectedRoute>
//                   <ChatScreen />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </BrowserRouter>
//       </FirebaseProvider>
//     </div>
//   );
// }
// export default App;

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
// import ProtectedRoute from "./components/ProtectedRoute";

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

            {/* Protected Routes */}
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

            {/* Redirect all unknown routes */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </FirebaseProvider>
    </div>
  );
}

export default App;
