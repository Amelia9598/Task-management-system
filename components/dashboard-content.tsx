"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { Task, TaskStatus } from "@/lib/types";
import { TaskList } from "@/components/tasks/task-list";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskStats } from "@/components/tasks/task-stats";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await response.json();
  return data.tasks;
};

export function DashboardContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  // Build query string
  const queryParams = new URLSearchParams();
  if (statusFilter !== "all") queryParams.set("status", statusFilter);
  if (priorityFilter !== "all") queryParams.set("priority", priorityFilter);
  queryParams.set("sortBy", sortBy);
  queryParams.set("sortOrder", sortBy === "priority" ? "asc" : "desc");

  const { data: tasks = [], isLoading, mutate } = useSWR<Task[]>(
    `/api/tasks?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // For stats, we need all tasks regardless of filters
  const { data: allTasks = [] } = useSWR<Task[]>(
    "/api/tasks",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const handleTaskSuccess = useCallback((task: Task) => {
    mutate();
  }, [mutate]);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    mutate();
  }, [mutate]);

  const handleStatusChange = useCallback((taskId: string, status: TaskStatus) => {
    // Optimistic update
    mutate(
      (currentTasks) =>
        currentTasks?.map((t) =>
          t.id === taskId ? { ...t, status } : t
        ),
      { revalidate: false }
    );
  }, [mutate]);

  const handleResetFilters = useCallback(() => {
    setStatusFilter("all");
    setPriorityFilter("all");
  }, []);

  const handleOpenForm = useCallback(() => {
    setEditingTask(null);
    setIsFormOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track your tasks efficiently
          </p>
        </div>
        <Button onClick={handleOpenForm} className="gap-2 sm:w-auto w-full">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TaskStats tasks={allTasks} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold">Your Tasks</h2>
          <TaskFilters
            status={statusFilter}
            priority={priorityFilter}
            sortBy={sortBy}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
          />
        </div>

        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
        onSuccess={handleTaskSuccess}
      />
    </div>
  );
}
