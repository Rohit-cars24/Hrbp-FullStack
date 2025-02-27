package com.cars24.slack_hrbp.data.request;

import lombok.Data;

@Data

public class UserUpdateRequest {
    String userid;
    String managerid;
    String managername;
}
