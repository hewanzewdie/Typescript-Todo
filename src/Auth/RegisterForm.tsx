import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setAuthing(true);
    setError("");

    createUserWithEmailAndPassword(auth, email, password)
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
    <form onSubmit={signUpWithEmail} className="space-y-4 max-w-lg shadow-lg p-10 rounded-xl">
      <h2 className="text-2xl font-bold text-center">Register</h2>
      <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password" className="w-full p-2 border rounded" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600" disabled={authing}>
        Register
      </button>
      {error && <div className="text-red-500">{error}</div>}
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Login
        </Link>
      </p>
    </form>
    </div>
  );
}
