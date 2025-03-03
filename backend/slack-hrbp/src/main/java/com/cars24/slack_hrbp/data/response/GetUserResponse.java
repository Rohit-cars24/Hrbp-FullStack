package com.cars24.slack_hrbp.data.response;

import lombok.Data;

@Data

public class GetUserResponse {
    private String username;
    private String managername;
    private String managerid;
    private String email;
    private String role;
}