package com.cars24.slack_hrbp.service;

import com.cars24.slack_hrbp.data.entity.AttendanceEntity;

import java.util.List;

public interface UsernameService {
    public List<AttendanceEntity> getCustomerDetails(String userid);
}
