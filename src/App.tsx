import { useState } from "react";
import LoginForm from "./Auth/LoginForm";
import RegisterForm from "./Auth/RegisterForm";
import Task from "./Components/Task";
import "./App.css";

export type TaskType = {
  id: number;
  title: string;
  completed: boolean;
};

export type User = {
  email: string;
  password: string;
  tasks: TaskType[];
};

function Home({
  user,
  setLoggedInUser,
  setUsers,
}: {
  user: User;
  setLoggedInUser: (user: User | null) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) {
  const [input, setInput] = useState("");

  const handleCheck = (id: number) => {
    const updatedTasks = user.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    updateUserTasks(updatedTasks);
  };

  const handleUpdate = (id: number) => {
    const newTitle = prompt("Enter new title:");
    if (newTitle) {
      const updatedTasks = user.tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      );
      updateUserTasks(updatedTasks);
    }
  };

  const handleDelete = (id: number) => {
    const updatedTasks = user.tasks.filter((task) => task.id !== id);
    updateUserTasks(updatedTasks);
  };

  const addTask = () => {
    const title = input.trim();
    if (!title) return alert("Task cannot be empty!");

    const newTask = {
      id: user.tasks.length ? user.tasks[user.tasks.length - 1].id + 1 : 1,
      title,
      completed: false,
    };

    const updatedTasks = [...user.tasks, newTask];
    updateUserTasks(updatedTasks);
    setInput("");
  };

  const updateUserTasks = (newTasks: TaskType[]) => {
    const updatedUser = { ...user, tasks: newTasks };
    setLoggedInUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.email === user.email ? updatedUser : u))
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">My Tasks</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Task description ..."
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      {user.tasks.length === 0 ? (
        <p className="text-sm text-gray-600">No tasks yet.</p>
      ) : (
        user.tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onCheck={handleCheck}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))
      )}
      <div className="text-center mt-4">
        <button
          className="text-red-600 underline text-sm"
          onClick={() => setLoggedInUser(null)}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState<User[]>([
    {
      email: "demo@example.com",
      password: "1234",
      tasks: [
        { id: 1, title: "Buy groceries", completed: false },
        { id: 2, title: "Read a book", completed: true },
      ],
    },
  ]);

  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const handleLogin = (success: boolean, user?: User) => {
    setMessage(success ? "" : "Invalid credentials.");
    if (success && user) {
      setLoggedInUser(user);
    }
  };

  const handleRegister = (email: string, password: string) => {
    const newUser = { email, password, tasks: [] };
    setUsers([...users, newUser]);
    setMessage("Registered successfully.");
    setLoggedInUser(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        {!loggedInUser ? (
          <div>
            <h2 className="text-2xl font-bold text-center mb-4">
              {isLogin ? "Login" : "Register"}
            </h2>
            {isLogin ? (
              <LoginForm users={users} onLogin={handleLogin} />
            ) : (
              <RegisterForm users={users} onRegister={handleRegister} />
            )}
            <p className="text-center mt-4 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                }}
                className="text-blue-600 underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        ) : (
          <Home
            user={loggedInUser}
            setLoggedInUser={setLoggedInUser}
            setUsers={setUsers}
          />
        )}

        {message && (
          <div className="text-center mt-4 text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
