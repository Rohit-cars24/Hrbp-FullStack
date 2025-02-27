package com.cars24.slack_hrbp.data.dao;

import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;

public interface HrDao {
    String createUser(CreateEmployeeRequest createEmployeeRequest);

    String updateUser(EmployeeUpdateRequest employeeUpdateRequest);
}
