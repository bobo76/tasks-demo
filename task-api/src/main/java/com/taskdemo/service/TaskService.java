package com.taskdemo.service;

import com.taskdemo.exception.InvalidStatusException;
import com.taskdemo.exception.ResourceNotFoundException;
import com.taskdemo.model.Task;
import com.taskdemo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    private static final List<String> VALID_STATUSES = Arrays.asList("new", "in-progress", "done");

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByStatus(String status) {
        validateStatus(status);
        return taskRepository.findByStatus(status);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task createTask(Task task) {
        validateStatus(task.getStatus());
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        validateStatus(taskDetails.getStatus());

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }

    private void validateStatus(String status) {
        if (status == null || !VALID_STATUSES.contains(status.toLowerCase())) {
            throw new InvalidStatusException("Status must be one of: " + String.join(", ", VALID_STATUSES));
        }
    }
}
