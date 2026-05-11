"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format, isPast, isToday, isTomorrow } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Circle,
    className: "bg-muted text-muted-foreground",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    className: "bg-warning/20 text-warning-foreground",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-success/20 text-success",
  },
};

const priorityConfig = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-warning/20 text-warning-foreground" },
  high: { label: "High", className: "bg-destructive/20 text-destructive" },
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusInfo = statusConfig[task.status];
  const priorityInfo = priorityConfig[task.priority];
  const StatusIcon = statusInfo.icon;

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d, yyyy");
  };

  const isDueDatePast = task.dueDate && task.status !== "completed" && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      onDelete(task.id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      onStatusChange(task.id, newStatus);
      toast.success(newStatus === "completed" ? "Task completed!" : "Status updated");
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <>
      <Card className={cn(
        "group transition-all hover:shadow-md",
        task.status === "completed" && "opacity-70"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <button
                onClick={() => handleStatusChange(task.status === "completed" ? "pending" : "completed")}
                className="mt-1 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
              >
                <StatusIcon className={cn("h-5 w-5", task.status === "completed" && "text-success")} />
                <span className="sr-only">Toggle status</span>
              </button>
              <div className="min-w-0 flex-1">
                <CardTitle className={cn(
                  "text-base font-medium leading-snug",
                  task.status === "completed" && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </CardTitle>
                {task.description && (
                  <CardDescription className="mt-1 line-clamp-2">
                    {task.description}
                  </CardDescription>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                  <Circle className="mr-2 h-4 w-4" />
                  Mark as Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={cn("text-xs", priorityInfo.className)}>
              {priorityInfo.label}
            </Badge>
            {task.dueDate && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs gap-1",
                  isDueDatePast && "bg-destructive/20 text-destructive"
                )}
              >
                <Calendar className="h-3 w-3" />
                {formatDueDate(task.dueDate)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              &quot;{task.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
