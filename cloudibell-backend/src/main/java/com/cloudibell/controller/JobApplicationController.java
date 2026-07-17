package com.cloudibell.controller;

import com.cloudibell.dto.JobApplicationDTO;
import com.cloudibell.entity.JobApplication;
import com.cloudibell.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import com.cloudibell.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;
     private final FileStorageService fileStorageService;
    public JobApplicationController(JobApplicationService jobApplicationService,
                                FileStorageService fileStorageService) {
    this.jobApplicationService = jobApplicationService;
    this.fileStorageService = fileStorageService;
}
    @PostMapping
    public ResponseEntity<JobApplication> createApplication(
            @Valid @RequestBody JobApplicationDTO applicationDTO) {

        JobApplication application =
                jobApplicationService.createApplication(applicationDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(application);
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        return ResponseEntity.ok(jobApplicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(jobApplicationService.getApplicationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplication> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationDTO applicationDTO) {

        return ResponseEntity.ok(
                jobApplicationService.updateApplication(id, applicationDTO));
    }
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file) {

        String fileName = fileStorageService.uploadResume(file);

        return ResponseEntity.ok("Resume uploaded successfully: " + fileName);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(@PathVariable Long id) {

        jobApplicationService.deleteApplication(id);

        return ResponseEntity.ok("Application deleted successfully.");
    }
}