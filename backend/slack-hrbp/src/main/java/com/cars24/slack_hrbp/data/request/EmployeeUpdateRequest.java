package com.cars24.slack_hrbp.data.request;

import lombok.Data;

@Data

public class EmployeeUpdateRequest {
    String userId;
    String managerId;
    String managerName;
    String role;
}
