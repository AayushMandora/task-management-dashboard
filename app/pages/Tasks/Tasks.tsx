"use client";

import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";

const TasksPage = () => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any>([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState<any>({
    title: "",
    description: "",
    status: "To-Do",
    priority: "Low",
    dueDate: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch tasks
  useEffect(() => {
    setLoading(true);
    const fetchTasks = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
      setLoading(false);
    };
    fetchTasks();
  }, [token]);

  // Filter tasks by status and priority
  useEffect(() => {
    const filterTasks = () => {
      let filtered = tasks;

      if (statusFilter) {
        filtered = filtered.filter((task: any) => task.status === statusFilter);
      }

      if (priorityFilter) {
        filtered = filtered.filter(
          (task: any) => task.priority === priorityFilter
        );
      }

      setFilteredTasks(filtered);
    };
    filterTasks();
  }, [statusFilter, priorityFilter, tasks]);

  // Handle add task
  const handleAddTask = async () => {
    let response: any;
    if (!editMode) {
      response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        toast({
          title: "Task Added Successfully",
        });
      }
    } else {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}api/tasks/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTask),
        }
      );
      if (response.ok) {
        toast({
          title: "Task Updated Successfully",
        });
      }
    }

    setTasks(await response.json());
    setNewTask({
      title: "",
      description: "",
      status: "To-Do",
      priority: "Low",
      dueDate: "",
    });
    setShowForm(false);
  };

  // Handle delete task
  const handleDeleteTask = async (id: any) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}api/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const remainingData = await response.json();
    setTasks(remainingData.Data);
  };

  // Handle Edit Function
  const handleUpdateTask = async (id: any) => {
    setEditMode(true);
    setEditId(id);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}api/tasks/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setNewTask(await response.json());
    setShowForm(true);
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex justify-end gap-4 mb-4">
        {/* Clear Filter */}
        {(statusFilter !== "" || priorityFilter !== "") && (
          <Button
            onClick={() => {
              setStatusFilter("");
              setPriorityFilter("");
            }}
          >
            Clear
          </Button>
        )}
        {/* Filter By Status */}
        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[25%] md:w-[180px]">
            <SelectValue placeholder="Filter By Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="To-Do">To Do</SelectItem>
              <SelectItem value="In-Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Filter By Priority */}
        <Select onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[25%] md:w-[180px]">
            <SelectValue placeholder="Filter By Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={() => setShowForm(!showForm)}>+ Add Task</Button>
      </div>

      {/* Task Data Table */}
      <table className="w-full text-left table-auto">
        <thead className="border-b text-xs md:text-lg text-center border-zinc-500">
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 &&
            filteredTasks.map((task: any) => (
              <tr
                key={task._id}
                className="border-b text-xs md:text-lg text-center border-zinc-500"
              >
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>{task.dueDate || "N/A"}</td>
                <td>
                  <div className="flex gap-3 text-xs justify-center">
                    <Button onClick={() => handleDeleteTask(task._id)}>
                      Delete
                    </Button>
                    <Button onClick={() => handleUpdateTask(task._id)}>
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {loading ? (
        <div className="text-center">Loading....</div>
      ) : (
        filteredTasks.length <= 0 && (
          <div className="text-center">
            There is no any task available, add new task.
          </div>
        )
      )}

      {/* Add/Edit Task Form */}
      {showForm && (
        <div
          className="p-4 absolute bg-white rounded-md w-[90%] md:w-[40%] top-[50%] left-[50%] text-black"
          style={{ translate: "-50% -50%" }}
        >
          <h3 className="text-xl mb-4 font-bold">
            {editMode ? "Edit Task" : "Add New Task"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
          >
            <div className="space-y-3">
              <Input
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
              <Input
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />

              {/* Select Status */}
              <Select
                onValueChange={(value) =>
                  setNewTask({ ...newTask, status: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={editMode ? newTask.status : "Select Status"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="To-Do">To Do</SelectItem>
                    <SelectItem value="In-Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Select Priority */}
              <Select
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      editMode ? newTask.priority : "Select Priority"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input
                type="date"
                className="w-[180px]"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />

              <div className="flex gap-3">
                <Button type="submit" className="mt-4">
                  {editMode ? "Edit Task" : "Add Task"}
                </Button>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setShowForm(false);
                  }}
                >
                  Cancle
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
