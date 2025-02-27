package com.cars24.slack_hrbp.data.dao;


import com.cars24.slack_hrbp.data.dto.UserDto;
import com.cars24.slack_hrbp.data.entity.UserEntity;
import com.cars24.slack_hrbp.data.request.UserUpdateRequest;

public interface UserDao {

    UserDto createUser(UserEntity user);

    UserDto displayCustomer(String id);

    UserDto updateUser(String id, UserUpdateRequest userUpdateRequest);

    UserDto deleteUser(String id);
}