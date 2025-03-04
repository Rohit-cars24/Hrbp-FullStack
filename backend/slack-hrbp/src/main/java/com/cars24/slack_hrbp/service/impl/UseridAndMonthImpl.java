package com.cars24.slack_hrbp.service.impl;

import com.cars24.slack_hrbp.data.dao.impl.UseridAndMonthDaoImpl;
import com.cars24.slack_hrbp.service.UseridAndMonth;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UseridAndMonthImpl implements UseridAndMonth {

    private final UseridAndMonthDaoImpl useridAndMonthDao;

    @Override
    public Map<String, Map<String, String>> getCustomerDetails(String userId) {

        Map<String, Map<String, String>> resp = useridAndMonthDao.getUserDetails(userId);
        return resp;

    }

    @Override
    public Map<String, Map<String, String>> getCustomerDetails(String userId, String month) {
        Map<String, Map<String, String>> resp = useridAndMonthDao.getUserDetails(userId,month);
        return resp;
    }
}
