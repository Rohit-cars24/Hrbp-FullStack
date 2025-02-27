package com.cars24.slack_hrbp.service.impl;

import com.cars24.slack_hrbp.data.dao.impl.UsernameDaoImpl;
import com.cars24.slack_hrbp.data.entity.AttendanceEntity;
import com.cars24.slack_hrbp.service.UsernameService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsernameServiceImpl implements UsernameService {

    private final UsernameDaoImpl usernameDao;

    @Override
    public List<AttendanceEntity> getCustomerDetails(String userId) {

        List<AttendanceEntity> resp = usernameDao.getUserDetails(userId);

        return resp;
    }
}
