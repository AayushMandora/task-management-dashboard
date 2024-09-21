"use client";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const statuses = ["To-Do", "In-Progress", "Completed"];

export default function KanbanBoard() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [tasks, setTasks] = useState<any>([]);

  // Fetch All tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  });

  // Handle drag and drop
  const onDragEnd = async (result: any) => {
    console.log(result);

    const { destination, source, draggableId } = result;
    console.log("Source:", source);
    console.log("Destination:", destination);

    if (!destination) {
      console.error("No destination found");
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedTask = tasks.find((task: any) => task._id === draggableId);

    if (draggedTask) {
      const updatedTask = { ...draggedTask, status: destination.droppableId };

      try {
        const response = await fetch(
          `http://localhost:5000/api/tasks/${draggedTask._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedTask),
          }
        );
        setTasks(await response.json());

        if (!response.ok) {
          throw new Error("Error updating task");
        }
      } catch (err) {
        console.error("Error updating task:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kanban Board</h1>
      <div className="grid grid-cols-3 gap-6">
        <DragDropContext onDragEnd={onDragEnd}>
          {statuses.map((status) => (
            <KanbanColumn key={status} status={status} tasks={tasks} />
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  status: string;
  tasks: Array<{ _id: string; title: string; status: string }>;
}

const KanbanColumn = ({ status = "To-Do", tasks = [] }: KanbanColumnProps) => {
  const filteredTasks = tasks.filter((task: any) => task.status === status);

  return (
    <div className="bg-white/15 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">{status}</h2>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-[300px]"
          >
            {filteredTasks.map((task: any, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-black/40 p-4 rounded-lg shadow"
                  >
                    <div className="text-lg font-bold">{task.title}</div>
                    <div className="text-sm">{task.description}</div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
