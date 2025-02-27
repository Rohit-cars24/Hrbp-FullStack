package com.cars24.slack_hrbp.service.impl;

import com.cars24.slack_hrbp.data.dao.HrDao;
import com.cars24.slack_hrbp.data.dao.impl.HrDaoImpl;
import com.cars24.slack_hrbp.data.response.CreateUserRequest;
import com.cars24.slack_hrbp.service.HrService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor

public class HrServiceImpl implements HrService {

    private final HrDaoImpl hrDao;

    @Override
    public String createUser(CreateUserRequest createUserRequest) {
        log.info("UserServiceImpl createUserRequest, {}", createUserRequest);
        return hrDao.createUser(createUserRequest);
    }
}
