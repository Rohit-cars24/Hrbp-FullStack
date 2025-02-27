package com.cars24.slack_hrbp.data.dao.impl;

import com.cars24.slack_hrbp.data.dao.HrDao;
import com.cars24.slack_hrbp.data.entity.UserEntity;
import com.cars24.slack_hrbp.data.repository.UserRepository;
import com.cars24.slack_hrbp.data.response.CreateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service

public class HrDaoImpl implements HrDao {

    private final UserRepository userRepository;

    @Override
    public String createUser(CreateUserRequest createUserRequest) {
        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(createUserRequest, userEntity);
        userRepository.save(userEntity);
        return "Creation of employee account was successful";
    }
}
