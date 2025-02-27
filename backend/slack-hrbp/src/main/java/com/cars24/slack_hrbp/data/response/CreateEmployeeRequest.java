package com.cars24.slack_hrbp.data.response;

import lombok.Data;

import java.util.List;

@Data
public class CreateEmployeeRequest {
    private String userId;
    private String username;
    private String password;
    private String email;
    private List<String> roles;
    private String encryptedPassword;
    private String managerName;
    private String managerId;
}
