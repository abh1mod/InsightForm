import { useState } from "react";


const SignUpComp = ({name, email, password,setName, setEmail, setPassword, loading, onFormSubmit}) =>{
    const [confirmPassword, setConfirmPassword] = useState("");
  
    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    const isPasswordValid = passwordRegex.test(password);
    const doPasswordsMatch = password === confirmPassword;


  const inputClass = "w-full p-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:border-gray-700 transition duration-200 ease-in-out";
    return (
         <form onSubmit={onFormSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading || confirmPassword.length > 0}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={inputClass}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading || isPasswordValid === false}
          />
          {!isPasswordValid && password.length > 0 && (
            <p className="text-sm text-red-500 mt-1">
              Must be 8+ chars, with uppercase, lowercase, digit & special char.
            </p>
          )}
          {confirmPassword.length > 0 && !doPasswordsMatch && (
            <p className="text-sm text-red-500 mt-1">Passwords do not match.</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
             disabled={!isPasswordValid || !doPasswordsMatch || loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
    )
}

export default SignUpComp;