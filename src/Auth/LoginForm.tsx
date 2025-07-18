import { useState } from "react";
import { User } from "../App";

type Props = {
  users: User[];
  onLogin: (success: boolean, user?: User) => void;
};

export default function LoginForm({ users, onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = users.find(
      (user) => user.email === email && user.password === password
    );
    onLogin(!!match, match);
    setEmail("");
    setPassword("");
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
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
}
