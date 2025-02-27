package com.cars24.slack_hrbp.data.repository;

import com.cars24.slack_hrbp.data.entity.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByDateStartingWith(String monthYear); // Fetch records for a specific month and year
}