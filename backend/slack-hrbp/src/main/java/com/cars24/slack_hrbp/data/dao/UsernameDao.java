package com.cars24.slack_hrbp.data.dao;

import com.cars24.slack_hrbp.data.entity.AttendanceEntity;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface UsernameDao {
    public Map<String, Map<String, String>> getUserDetails(String userid);

    Map<String, Map<String, String>> getUserDetails(String userid, String month);
}
