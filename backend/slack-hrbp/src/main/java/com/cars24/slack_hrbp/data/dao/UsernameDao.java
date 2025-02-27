package com.cars24.slack_hrbp.data.dao;

import com.cars24.slack_hrbp.data.entity.AttendanceEntity;

import java.util.List;

public interface UsernameDao {
    public List<AttendanceEntity> getUserDetails(String userid);
}
