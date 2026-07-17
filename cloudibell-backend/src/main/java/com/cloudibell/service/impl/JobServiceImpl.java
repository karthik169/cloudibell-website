package com.cloudibell.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cloudibell.dto.JobDTO;
import com.cloudibell.entity.Job;
import com.cloudibell.exception.ResourceNotFoundException;
import com.cloudibell.repository.JobRepository;
import com.cloudibell.service.JobService;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Override
    public Job createJob(JobDTO jobDTO) {

        Job job = new Job();

        job.setTitle(jobDTO.getTitle());
        job.setDepartment(jobDTO.getDepartment());
        job.setLocation(jobDTO.getLocation());
        job.setExperience(jobDTO.getExperience());
        job.setEmploymentType(jobDTO.getEmploymentType());
        job.setSalary(jobDTO.getSalary());
        job.setDescription(jobDTO.getDescription());
        job.setSkills(jobDTO.getSkills());
        job.setStatus(jobDTO.getStatus());
        job.setPostedDate(jobDTO.getPostedDate());
        job.setApplicationDeadline(jobDTO.getApplicationDeadline());

        return jobRepository.save(job);
    }

    @Override
    public List<Job> getAllJobs() {

        return jobRepository.findAll();

    }

    @Override
    public Job getJobById(Long id) {

        return jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found with id : " + id));

    }

    @Override
    public Job updateJob(Long id, JobDTO jobDTO) {

        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found with id : " + id));

        existingJob.setTitle(jobDTO.getTitle());
        existingJob.setDepartment(jobDTO.getDepartment());
        existingJob.setLocation(jobDTO.getLocation());
        existingJob.setExperience(jobDTO.getExperience());
        existingJob.setEmploymentType(jobDTO.getEmploymentType());
        existingJob.setSalary(jobDTO.getSalary());
        existingJob.setDescription(jobDTO.getDescription());
        existingJob.setSkills(jobDTO.getSkills());
        existingJob.setStatus(jobDTO.getStatus());
        existingJob.setPostedDate(jobDTO.getPostedDate());
        existingJob.setApplicationDeadline(jobDTO.getApplicationDeadline());

        return jobRepository.save(existingJob);

    }

    @Override
    public void deleteJob(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found with id : " + id));

        jobRepository.delete(job);

    }

}