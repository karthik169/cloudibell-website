package com.cloudibell.service;

import java.util.List;

import com.cloudibell.dto.JobDTO;
import com.cloudibell.entity.Job;

public interface JobService {

    Job createJob(JobDTO jobDTO);

    List<Job> getAllJobs();

    Job getJobById(Long id);

    Job updateJob(Long id, JobDTO jobDTO);

    void deleteJob(Long id);
}