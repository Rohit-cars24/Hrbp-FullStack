package com.cars24.slack_hrbp.service;

import com.cars24.slack_hrbp.data.entity.EmployeeEntity;
import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.request.CreateEmployeeRequest;
import com.cars24.slack_hrbp.data.response.EmployeeDisplayResponse;
import com.cars24.slack_hrbp.data.response.UpdateEmployeeResponse;

import java.util.List;

public interface HrService {
    public String createUser(CreateEmployeeRequest createEmployeeRequest);

    String updateUser(EmployeeUpdateRequest employeeUpdateRequest);

    List<EmployeeDisplayResponse> getAllUsers();

    EmployeeEntity getUser(String userid);
}
