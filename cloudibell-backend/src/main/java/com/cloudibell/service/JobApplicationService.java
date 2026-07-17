package com.cloudibell.service;

import com.cloudibell.dto.JobApplicationDTO;
import com.cloudibell.entity.JobApplication;

import java.util.List;

public interface JobApplicationService {

    JobApplication createApplication(JobApplicationDTO applicationDTO);

    List<JobApplication> getAllApplications();

    JobApplication getApplicationById(Long id);

    JobApplication updateApplication(Long id, JobApplicationDTO applicationDTO);

    void deleteApplication(Long id);
}