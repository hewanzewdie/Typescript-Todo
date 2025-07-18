import { useState } from "react";
import { User } from "../App";

type Props = {
  users: User[];
  onRegister: (email: string, password: string) => void;
};

export default function RegisterForm({ users, onRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exists = users.find((user) => user.email === email);
    if (!exists) {
      if (password === confirmPassword) {
        onRegister(email, password);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        alert("Passwords don't match");
      }
    } else {
      alert("User already exists");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full p-2 border rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Register
      </button>
    </form>
  );
}
