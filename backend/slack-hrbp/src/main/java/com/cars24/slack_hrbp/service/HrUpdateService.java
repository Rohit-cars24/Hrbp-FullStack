package com.cars24.slack_hrbp.service;

import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;


public interface HrUpdateService {
    CreateEmployeeRequest getUserDetails(String userid);

    String updateUserDetails(EmployeeUpdateRequest employeeUpdateRequest);
}
