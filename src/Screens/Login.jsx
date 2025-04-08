import { useContext, useEffect, useState } from "react";
import "../App.css";
import { useFirebase } from "../../Context/FirebaseContext";
import { Navigate, useNavigate } from "react-router-dom";
import { ChatContext } from "../../Context/ChatContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const loginFirebaseHere = useFirebase();

  const submitHandle = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      const result = await loginFirebaseHere.loginWithEandP(email, password);

      navigate("/chatlist", { replace: true });
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandle} className="mt-6">
        <div className="form-container">
          <h1 className="form-title text-4xl font-bold">Login</h1>
          <input
            className="form-input focus-within:outline focus-within:outline-white p-2"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <div className="form-input flex justify-center items-center focus-within:outline focus-within:outline-white p-3">
            <input
              className="h-[6vh] focus:outline-none p-2"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "-webkit-fill-available" }}
            />
            <div className="" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </div>
          </div>
          <br />
          <button type="submit" className="google-signin-button">
            Login
          </button>
          {err && (
            <span className="flex justify-center mt-4">
              Wrong Email or Password
            </span>
          )}
        </div>
      </form>

      <h1 className="text-center my-5 font-bold">OR</h1>

      <div className="text-center my-5 flex justify-center space-x-2">
        <p>If you don't have an account then</p>
        <p
          className="cursor-pointer text-blue-700 font-semibold"
          onClick={() => navigate("/")}>
          SignUp
        </p>
      </div>
    </div>
  );
};

export default Login;
