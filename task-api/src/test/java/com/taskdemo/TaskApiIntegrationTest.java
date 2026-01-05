package com.taskdemo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskdemo.model.Task;
import com.taskdemo.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TaskApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    @Test
    void testCompleteTaskLifecycle() throws Exception {
        // Create a task
        Task newTask = new Task(null, "Integration Test Task", "Test Description", "new");

        String createResponse = mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newTask)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Integration Test Task"))
                .andExpect(jsonPath("$.status").value("new"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Task createdTask = objectMapper.readValue(createResponse, Task.class);
        Long taskId = createdTask.getId();

        // Get the task by ID
        mockMvc.perform(get("/api/tasks/" + taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(taskId))
                .andExpect(jsonPath("$.title").value("Integration Test Task"));

        // Update the task
        Task updatedTask = new Task(taskId, "Updated Task", "Updated Description", "in-progress");

        mockMvc.perform(put("/api/tasks/" + taskId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedTask)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task"))
                .andExpect(jsonPath("$.status").value("in-progress"));

        // Verify update persisted
        mockMvc.perform(get("/api/tasks/" + taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task"));

        // Delete the task
        mockMvc.perform(delete("/api/tasks/" + taskId))
                .andExpect(status().isNoContent());

        // Verify deletion
        mockMvc.perform(get("/api/tasks/" + taskId))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllTasksWithStatusFilter() throws Exception {
        // Create tasks with different statuses
        taskRepository.save(new Task(null, "Task 1", "Description 1", "new"));
        taskRepository.save(new Task(null, "Task 2", "Description 2", "new"));
        taskRepository.save(new Task(null, "Task 3", "Description 3", "in-progress"));
        taskRepository.save(new Task(null, "Task 4", "Description 4", "done"));

        // Get all tasks
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)));

        // Filter by status "new"
        mockMvc.perform(get("/api/tasks?status=new"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].status").value("new"))
                .andExpect(jsonPath("$[1].status").value("new"));

        // Filter by status "in-progress"
        mockMvc.perform(get("/api/tasks?status=in-progress"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("in-progress"));

        // Filter by status "done"
        mockMvc.perform(get("/api/tasks?status=done"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("done"));
    }

    @Test
    void testDataPersistence() throws Exception {
        // Create a task
        Task newTask = new Task(null, "Persistence Test", "Test Description", "new");

        String createResponse = mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newTask)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Task createdTask = objectMapper.readValue(createResponse, Task.class);

        // Verify it's persisted in database
        mockMvc.perform(get("/api/tasks/" + createdTask.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Persistence Test"));

        // Verify it appears in the list
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + createdTask.getId() + ")].title").value("Persistence Test"));
    }

    @Test
    void testValidationErrors() throws Exception {
        // Test missing title
        Task invalidTask = new Task(null, "", "Description", "new");

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidTask)))
                .andExpect(status().isBadRequest());

        // Test invalid status
        Task task = new Task(null, "Valid Title", "Description", "invalid-status");

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }
}
