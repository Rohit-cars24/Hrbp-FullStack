package com.cars24.slack_hrbp.data.dao;

import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;

public interface HrUpdateDao {
    CreateEmployeeRequest getUserDetails(String userid);

    String updateUserDetails(EmployeeUpdateRequest employeeUpdateRequest);
}
