package com.cloudibell.service.impl;

import com.cloudibell.dto.JobApplicationDTO;
import com.cloudibell.entity.Job;
import com.cloudibell.entity.JobApplication;
import com.cloudibell.enums.ApplicationStatus;
import com.cloudibell.exception.ResourceNotFoundException;
import com.cloudibell.repository.JobApplicationRepository;
import com.cloudibell.repository.JobRepository;
import com.cloudibell.service.JobApplicationService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;

    public JobApplicationServiceImpl(JobApplicationRepository jobApplicationRepository,
                                     JobRepository jobRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public JobApplication createApplication(JobApplicationDTO applicationDTO) {

        Job job = jobRepository.findById(applicationDTO.getJobId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + applicationDTO.getJobId()));

        JobApplication application = new JobApplication();

        application.setApplicantName(applicationDTO.getApplicantName());
        application.setEmail(applicationDTO.getEmail());
        application.setPhone(applicationDTO.getPhone());
        application.setResumeUrl(applicationDTO.getResumeUrl());
        application.setCoverLetter(applicationDTO.getCoverLetter());
        application.setApplicationDate(LocalDate.now());

        if (applicationDTO.getStatus() == null) {
            application.setStatus(ApplicationStatus.APPLIED);
        } else {
            application.setStatus(applicationDTO.getStatus());
        }

        application.setJob(job);

        return jobApplicationRepository.save(application);
    }

    @Override
    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    @Override
    public JobApplication getApplicationById(Long id) {
        return jobApplicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id));
    }

    @Override
    public JobApplication updateApplication(Long id, JobApplicationDTO applicationDTO) {

        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id));

        Job job = jobRepository.findById(applicationDTO.getJobId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + applicationDTO.getJobId()));

        application.setApplicantName(applicationDTO.getApplicantName());
        application.setEmail(applicationDTO.getEmail());
        application.setPhone(applicationDTO.getPhone());
        application.setResumeUrl(applicationDTO.getResumeUrl());
        application.setCoverLetter(applicationDTO.getCoverLetter());
        application.setStatus(applicationDTO.getStatus());
        application.setJob(job);

        return jobApplicationRepository.save(application);
    }

    @Override
    public void deleteApplication(Long id) {

        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id));

        jobApplicationRepository.delete(application);
    }
}