import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsAuthenticated(true);
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
        setAuthing(false);
      });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
    <form onSubmit={signInWithEmail} className="space-y-4 max-w-lg shadow-lg p-10 rounded-xl">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={authing}>
        Login
      </button>
      {error && <div className="text-red-500">{error}</div>}
      <p className="text-center text-sm">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 underline">
          Register
        </Link>
      </p>
    </form>
    </div>
  );
}
