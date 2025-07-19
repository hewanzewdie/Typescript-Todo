import { useState, useEffect } from "react";
import Task from "./Task";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

type TaskType = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<number|null>(null);
  const [editValue, setEditValue] = useState("");
  const navigate = useNavigate();
  const db = getFirestore();
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedTasks: TaskType[] = [];
      querySnapshot.forEach((docSnap) => {
        loadedTasks.push({ id: docSnap.data().id, title: docSnap.data().title, completed: docSnap.data().completed });
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
    const newTask: TaskType = {
      id: Date.now(),
      title,
      completed: false,
    };
    await addDoc(collection(db, "tasks"), { ...newTask, uid: user.uid });
  };

  const handleCheck = async (id: number) => {
    if (!user) return;
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      await updateDoc(doc(db, "tasks", docSnap.id), { completed: !docSnap.data().completed });
    });
  };

  const handleUpdate = (id: number) => {
    setEditId(id);
    const task = tasks.find(t => t.id === id);
    setEditValue(task ? task.title : "");
  };

  const handleEditSave = async () => {
    if (editId !== null && editValue.trim() && user) {
      const q = query(collection(db, "tasks"), where("uid", "==", user.uid), where("id", "==", editId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await updateDoc(doc(db, "tasks", docSnap.id), { title: editValue });
      });
      setEditId(null);
      setEditValue("");
    }
    setError("Task name can't be empty.")
  };

  const handleDelete = async (id: number) => {
    if (!user) return;
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "tasks", docSnap.id));
    });
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
              <div className="flex gap-2 mt-2">
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
