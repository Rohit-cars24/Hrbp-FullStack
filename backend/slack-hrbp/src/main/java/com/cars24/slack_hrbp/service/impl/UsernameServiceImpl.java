package com.cars24.slack_hrbp.service.impl;

import com.cars24.slack_hrbp.data.dao.impl.UsernameDaoImpl;
import com.cars24.slack_hrbp.service.UsernameService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UsernameServiceImpl implements UsernameService {

    private final UsernameDaoImpl usernameDao;

    @Override
    public Map<String, Map<String, String>> getCustomerDetails(String userId) {

        Map<String, Map<String, String>> resp = usernameDao.getUserDetails(userId);

        return resp;
    }

    @Override
    public Map<String, Map<String, String>> getCustomerDetails(String userId, String month) {
        Map<String, Map<String, String>> resp = usernameDao.getUserDetails(userId,month);
        return resp;
    }
}
