package com.taskdemo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskdemo.exception.InvalidStatusException;
import com.taskdemo.exception.ResourceNotFoundException;
import com.taskdemo.model.Task;
import com.taskdemo.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TaskService taskService;

    @Test
    void getAllTasks_ShouldReturnAllTasks() throws Exception {
        List<Task> tasks = Arrays.asList(
                new Task(1L, "Task 1", "Description 1", "new"),
                new Task(2L, "Task 2", "Description 2", "in-progress")
        );

        when(taskService.getAllTasks()).thenReturn(tasks);

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Task 1"))
                .andExpect(jsonPath("$[1].title").value("Task 2"));

        verify(taskService, times(1)).getAllTasks();
    }

    @Test
    void getAllTasks_WithStatusFilter_ShouldReturnFilteredTasks() throws Exception {
        List<Task> tasks = Arrays.asList(
                new Task(1L, "Task 1", "Description 1", "new")
        );

        when(taskService.getTasksByStatus("new")).thenReturn(tasks);

        mockMvc.perform(get("/api/tasks?status=new"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].status").value("new"));

        verify(taskService, times(1)).getTasksByStatus("new");
    }

    @Test
    void getTaskById_WithValidId_ShouldReturnTask() throws Exception {
        Task task = new Task(1L, "Task 1", "Description 1", "new");

        when(taskService.getTaskById(1L)).thenReturn(task);

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Task 1"));

        verify(taskService, times(1)).getTaskById(1L);
    }

    @Test
    void getTaskById_WithNonExistentId_ShouldReturn404() throws Exception {
        when(taskService.getTaskById(999L)).thenThrow(new ResourceNotFoundException("Task not found with id: 999"));

        mockMvc.perform(get("/api/tasks/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Task not found with id: 999"));
    }

    @Test
    void createTask_WithValidData_ShouldReturn201() throws Exception {
        Task task = new Task(null, "New Task", "Description", "new");
        Task createdTask = new Task(1L, "New Task", "Description", "new");

        when(taskService.createTask(any(Task.class))).thenReturn(createdTask);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("New Task"));

        verify(taskService, times(1)).createTask(any(Task.class));
    }

    @Test
    void createTask_WithMissingTitle_ShouldReturn400() throws Exception {
        Task task = new Task(null, "", "Description", "new");

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createTask_WithInvalidStatus_ShouldReturn400() throws Exception {
        Task task = new Task(null, "Task", "Description", "invalid");

        when(taskService.createTask(any(Task.class)))
                .thenThrow(new InvalidStatusException("Status must be one of: new, in-progress, done"));

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Status must be one of: new, in-progress, done"));
    }

    @Test
    void createTask_WithTitleTooLong_ShouldReturn400() throws Exception {
        String longTitle = "a".repeat(101);
        Task task = new Task(null, longTitle, "Description", "new");

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createTask_WithDescriptionTooLong_ShouldReturn400() throws Exception {
        String longDescription = "a".repeat(501);
        Task task = new Task(null, "Task", longDescription, "new");

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateTask_WithValidData_ShouldReturn200() throws Exception {
        Task updatedTask = new Task(1L, "Updated Task", "Updated Description", "in-progress");

        when(taskService.updateTask(eq(1L), any(Task.class))).thenReturn(updatedTask);

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedTask)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task"))
                .andExpect(jsonPath("$.status").value("in-progress"));

        verify(taskService, times(1)).updateTask(eq(1L), any(Task.class));
    }

    @Test
    void updateTask_WithNonExistentId_ShouldReturn404() throws Exception {
        Task task = new Task(null, "Task", "Description", "new");

        when(taskService.updateTask(eq(999L), any(Task.class)))
                .thenThrow(new ResourceNotFoundException("Task not found with id: 999"));

        mockMvc.perform(put("/api/tasks/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteTask_WithValidId_ShouldReturn204() throws Exception {
        doNothing().when(taskService).deleteTask(1L);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());

        verify(taskService, times(1)).deleteTask(1L);
    }

    @Test
    void deleteTask_WithNonExistentId_ShouldReturn404() throws Exception {
        doThrow(new ResourceNotFoundException("Task not found with id: 999"))
                .when(taskService).deleteTask(999L);

        mockMvc.perform(delete("/api/tasks/999"))
                .andExpect(status().isNotFound());
    }
}
