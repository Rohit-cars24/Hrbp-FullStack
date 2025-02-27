package com.cars24.slack_hrbp.data.repository;

import com.cars24.slack_hrbp.data.entity.AttendanceEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsernameRepository extends MongoRepository<AttendanceEntity,String> {
    List<AttendanceEntity> findByUserid(String userid);
}
