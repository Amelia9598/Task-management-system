"use client";

import { TaskPriority, TaskStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TaskFiltersProps {
  status: string;
  priority: string;
  sortBy: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onSortChange: (sortBy: string) => void;
  onReset: () => void;
}

export function TaskFilters({
  status,
  priority,
  sortBy,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onReset,
}: TaskFiltersProps) {
  const hasFilters = status !== "all" || priority !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Date Created</SelectItem>
          <SelectItem value="dueDate">Due Date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="title">Title</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9 gap-1">
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
