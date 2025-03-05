package com.cars24.slack_hrbp.data.repository;

import com.cars24.slack_hrbp.data.entity.EmployeeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends MongoRepository<EmployeeEntity, String>, PagingAndSortingRepository<EmployeeEntity, String> {

    boolean existsByEmail(String email);

    EmployeeEntity findByEmail(String email);

    EmployeeEntity findByUserId(String id);

    boolean existsByUserId(String id);

    void deleteByUserId(String id);

    Page<EmployeeEntity> findAll(Pageable pageable);

    List<EmployeeEntity> findByManagerId(String id);

}
