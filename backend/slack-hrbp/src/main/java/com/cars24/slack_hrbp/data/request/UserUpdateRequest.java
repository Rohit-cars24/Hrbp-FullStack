package com.cars24.slack_hrbp.data.request;

import lombok.Data;

@Data

public class UserUpdateRequest {
    String phone;
    String city;
    String firstName;
    String lastName;
}
