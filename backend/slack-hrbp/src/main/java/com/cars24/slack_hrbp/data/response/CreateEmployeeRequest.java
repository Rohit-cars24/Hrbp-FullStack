package com.cars24.slack_hrbp.data.response;

import lombok.Data;

@Data
public class CreateEmployeeRequest {
    private String userId;
    private String userName;
    private String password;
    private String email;
    private String role;
    private String encryptedPassword;
    private String managerName;
    private String managerId;
}
