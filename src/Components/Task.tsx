export type TaskProps = {
  task: {
    id: number;
    title: string;
    completed: boolean;
  };
  onCheck: (id: number) => void;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function Task({ task, onCheck, onUpdate, onDelete }: TaskProps) {
  return (
    <div className="border rounded-xl p-3 mb-2">
      <div className="flex items-center justify-between">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onCheck(task.id)}
        />
        <label
          className={` ${
            task.completed ? "text-gray-500/50 line-through" : ""
          }`}
        >
          {task.title}
        </label>
        <div className="flex justify-between">
          <button
            className="bg-green-500 text-white rounded-xl p-2 m-2"
            onClick={() => onUpdate(task.id)}
          >
            Update
          </button>
          <button
            className="bg-red-500 text-white rounded-xl p-2 m-2"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
