import { useState } from "react";
import "../App.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useFirebase, storage, db } from "../../Context/FirebaseContext";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState("");

  const firebaseHere = useFirebase();
  const navigate = useNavigate();

  const submitHandle = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    const online = false;

    if (!name || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const result = await firebaseHere.signUpwithEandP(email, password);
      console.log("result", result);
      alert("Signin Successfull", result);
      navigate("/login");

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(result.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", result.user.uid), {
              uid: result.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
              online,
            });

            await setDoc(doc(db, "userChats", result.user.uid), {});
          } catch (err) {
            console.log(err);
            setErr(true);
          }
        });
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Update state with the file name
    }
  };
  return (
    <div>
      <form onSubmit={submitHandle} className="mt-6">
        <div className="form-container">
          <h1 className="form-title text-4xl font-bold">SignIn</h1>
          <div>
            <input
              className="form-input focus-within:outline focus-within:outline-white p-2"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br /> <br />
            <input
              className="form-input focus-within:outline focus-within:outline-white p-2"
              autoComplete="off"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br /> <br />
            <div className="form-input flex justify-center items-center focus-within:outline focus-within:outline-white p-1">
              <input
                className="h-[6vh] focus:outline-none p-1"
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
                    class="size-6"
                    onClick={() => setShowPassword(!showPassword)}>
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
                    class="size-6">
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
            <div className="flex items-center">
              <label htmlFor="file" className="cursor-pointer">
                <img
                  src="gallery3.jpg"
                  alt="Upload"
                  className="w-12 h-12 rounded-2xl"
                />
              </label>

              <input
                type="file"
                id="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <span className="text-gray-700 max-w-min ml-auto">
                {fileName || null}
              </span>
            </div>
            <br />
            <button type="submit" className="google-signin-button">
              Create Account
            </button>
            {err && (
              <span className="flex justify-center mt-4">
                Something went wrong
              </span>
            )}
          </div>
        </div>
      </form>
      <h1 className="text-center my-5 font-bold">OR</h1>
      <button
        className="google-signin-button"
        onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
};

export default SignUp;
