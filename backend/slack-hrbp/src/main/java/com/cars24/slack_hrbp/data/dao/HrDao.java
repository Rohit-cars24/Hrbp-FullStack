package com.cars24.slack_hrbp.data.dao;

import com.cars24.slack_hrbp.data.response.CreateUserRequest;

public interface HrDao {
    String createUser(CreateUserRequest createUserRequest);
}
