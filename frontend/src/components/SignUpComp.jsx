
const SignUpComp = ({name, email, password,setName, setEmail, setPassword, loading, onFormSubmit}) =>{
    return (
         <form onSubmit={onFormSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
    )
}

export default SignUpComp;