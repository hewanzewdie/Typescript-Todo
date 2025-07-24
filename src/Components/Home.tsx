import { useState, useEffect } from "react";
import Task from "./Task";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

type TaskType = {
  id: string; 
  title: string;
  completed: boolean;
};

export default function Home({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string|null>(null);
  const [editValue, setEditValue] = useState("");
  const navigate = useNavigate();
  const db = getFirestore();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedTasks: TaskType[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedTasks.push({
          id: docSnap.id, 
          title: data.title,
          completed: data.completed,
        });
      });
      setTasks(loadedTasks);
    });
    return () => unsubscribe();
  }, [user, db]);

  const addTask = async () => {
    const title = input.trim();
    if (!title) {
      setError("Task cannot be empty!");
      return;
    }
    if (!user) return;
    setInput("");
    await addDoc(collection(db, "tasks"), {
      title,
      completed: false,
      uid: user.uid,
    });
  };

  const handleCheck = async (id: string) => {
    if (!user) return;
    const taskRef = doc(db, "tasks", id);
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await updateDoc(taskRef, { completed: !task.completed });
  };

  const handleUpdate = (id: string) => {
    setEditId(id);
    const task = tasks.find(t => t.id === id);
    setEditValue(task ? task.title : "");
  };

  const handleEditSave = async () => {
    if (!editValue.trim()) {
      setError("Task name can't be empty.");
      return;
    }
    if (editId !== null && user) {
      const taskRef = doc(db, "tasks", editId);
      await updateDoc(taskRef, { title: editValue.trim() });
      setEditId(null);
      setEditValue("");
      setError("");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
  };

  const handleLogout = async () => {
    await getAuth().signOut();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">My Tasks</h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>
      )}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          className="w-full p-2 border rounded"
          placeholder="Task description..."
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-600">No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            <Task task={task} onCheck={handleCheck} onUpdate={handleUpdate} onDelete={handleDelete} />
            {editId === task.id && (
              <div className="flex gap-2 my-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button onClick={handleEditSave} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                <button onClick={() => setEditId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
              </div>
            )}
          </div>
        ))
      )}
      <div className="text-center mt-4">
        <button className="text-white bg-red-600 p-2 hover:underline rounded-lg w-20 text-sm" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
