package com.cloudibell.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cloudibell.dto.JobDTO;
import com.cloudibell.entity.Job;
import com.cloudibell.service.JobService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    // Create Job
    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody JobDTO jobDTO) {

        Job savedJob = jobService.createJob(jobDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
    }

    // Get All Jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {

        List<Job> jobs = jobService.getAllJobs();

        return ResponseEntity.ok(jobs);
    }

    // Get Job By Id
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {

        Job job = jobService.getJobById(id);

        return ResponseEntity.ok(job);
    }

    // Update Job
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobDTO jobDTO) {

        Job updatedJob = jobService.updateJob(id, jobDTO);

        return ResponseEntity.ok(updatedJob);
    }

    // Delete Job
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {

        jobService.deleteJob(id);

        return ResponseEntity.ok("Job deleted successfully.");
    }

}