package com.cars24.slack_hrbp.service;

import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;

public interface HrService {
    public String createUser(CreateEmployeeRequest createEmployeeRequest);

    String updateUser(EmployeeUpdateRequest employeeUpdateRequest);
}
