package com.cars24.slack_hrbp.data.repository;


import com.cars24.slack_hrbp.data.entity.AttendanceEntity;
import com.cars24.slack_hrbp.data.entity.EmployeeEntity;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrUpdateRepository extends MongoRepository<EmployeeEntity, String> {
    EmployeeEntity findByUserId(String userId);

    boolean existsByUserId(String userId);
}

