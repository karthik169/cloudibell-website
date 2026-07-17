package com.cloudibell.dto;

import java.time.LocalDate;

import com.cloudibell.enums.JobStatus;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobDTO {

    private Long id;

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Experience is required")
    private String experience;

    @NotBlank(message = "Employment Type is required")
    private String employmentType;

    @NotBlank(message = "Salary is required")
    private String salary;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Skills are required")
    private String skills;

    @NotNull(message = "Status is required")
    private JobStatus status;

    @NotNull(message = "Posted date is required")
    private LocalDate postedDate;

    @NotNull(message = "Application deadline is required")
    @FutureOrPresent(message = "Application deadline cannot be in the past")
    private LocalDate applicationDeadline;
}