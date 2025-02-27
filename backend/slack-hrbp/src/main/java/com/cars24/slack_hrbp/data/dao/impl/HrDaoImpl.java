package com.cars24.slack_hrbp.data.dao.impl;

import com.cars24.slack_hrbp.data.dao.HrDao;
import com.cars24.slack_hrbp.data.entity.UserEntity;
import com.cars24.slack_hrbp.data.repository.UserRepository;
import com.cars24.slack_hrbp.data.response.CreateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service

public class HrDaoImpl implements HrDao {

    private final UserRepository userRepository;

    @Override
    public void createUser(CreateUserRequest createUserRequest) {
        UserEntity userEntity = new UserEntity();

    }
}
