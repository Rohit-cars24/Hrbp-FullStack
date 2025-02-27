package com.cars24.slack_hrbp.data.dao.impl;


import com.cars24.slack_hrbp.data.dao.UserDao;
import com.cars24.slack_hrbp.data.dto.UserDto;
import com.cars24.slack_hrbp.data.entity.UserEntity;
import com.cars24.slack_hrbp.data.repository.UserRepository;
import com.cars24.slack_hrbp.data.request.UserUpdateRequest;
import com.cars24.slack_hrbp.util.Utils;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j

public class UserDaoImpl implements UserDao {

    @Autowired
    UserRepository userRepository;

    @Autowired
    Utils utils;

    @Override
    public UserDto createUser(UserEntity userEntity) {

        log.info("[createUser] UserDaoImpl{}", userEntity);

        UserEntity response = userRepository.save(userEntity);

        UserDto signUpResponse = new UserDto();
        BeanUtils.copyProperties(userEntity, signUpResponse);

        return signUpResponse;

    }

    @Override
    public UserDto displayCustomer(String id) {

        log.info("[displayCustomer] UserDaoImpl {}", id);

        UserDto userDto = new UserDto();
        UserEntity userEntity = userRepository.findByUserId(id);
        BeanUtils.copyProperties(userEntity, userDto);
        return userDto;
    }

    @Override
    public UserDto updateUser(String id, UserUpdateRequest userUpdateRequest) {

        log.info("[displayCustomer] UserDaoImpl id, {}, request, {}", id, userUpdateRequest);

        UserEntity userEntity = userRepository.findByUserId(id);

//        if(userUpdateRequest.getFirstName().length() != 0)
//            userEntity.setFirstName(userUpdateRequest.getFirstName());
//
//        if(userUpdateRequest.getLastName().length() != 0)
//            userEntity.setLastName(userUpdateRequest.getLastName());
//
//        if(userUpdateRequest.getPhone().length() != 0)
//            userEntity.setPhone(userUpdateRequest.getPhone());
//
//        if(userUpdateRequest.getCity().length() != 0)
//            userEntity.setCity(userUpdateRequest.getCity());

        userRepository.save(userEntity);
        System.out.println(userEntity);

        UserDto response = new UserDto();
        BeanUtils.copyProperties(userEntity, response);

        log.info(response.getLastName(), " ", response.getFirstName());


        return response;
    }

    @Transactional
    @Override
    public UserDto deleteUser(String id) {

        log.info("[deleteCustomer] UserDaoImpl {}", id);

        UserEntity userEntity = userRepository.findByUserId(id);
        UserDto response = new UserDto();

        BeanUtils.copyProperties(userEntity, response);

        userRepository.deleteByUserId(id);
        return response;

    }
}
