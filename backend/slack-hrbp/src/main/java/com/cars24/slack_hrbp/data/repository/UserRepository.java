package com.cars24.slack_hrbp.data.repository;

import com.cars24.slack_hrbp.data.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, String>, PagingAndSortingRepository<UserEntity, String> {

    boolean existsByEmail(String email);

    UserEntity findByEmail(String email);

    UserEntity findByUserId(String id);

    boolean existsByUserId(String id);

    void deleteByUserId(String id);

    Page<UserEntity> findAll(Pageable pageable);
}
