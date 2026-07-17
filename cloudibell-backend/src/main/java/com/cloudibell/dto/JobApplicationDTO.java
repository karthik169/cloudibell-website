package com.cloudibell.dto;

import com.cloudibell.enums.ApplicationStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobApplicationDTO {

    private Long id;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String resumeUrl;

    private String coverLetter;

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private ApplicationStatus status;
}