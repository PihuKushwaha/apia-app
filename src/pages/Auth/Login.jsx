import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuthContext();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">APIA</h1>
        <p className="text-sm text-gray-500 mb-4">
          {mode === "login" ? "Officer login" : "Create officer account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          {error && <p className="text-xs text-alertRed">{error}</p>}

          <button disabled={loading} type="submit" className="bg-navy text-white w-full rounded py-2 text-sm">
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-xs text-navy underline mt-3"
        >
          {mode === "login" ? "New officer? Create account" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}