package com.cars24.slack_hrbp.service.impl;

import com.cars24.slack_hrbp.data.dao.impl.HrDaoImpl;
import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.request.CreateEmployeeRequest;
import com.cars24.slack_hrbp.data.response.EmployeeDisplayResponse;
import com.cars24.slack_hrbp.service.HrService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor

public class HrServiceImpl implements HrService {

    private final HrDaoImpl hrDao;

    @Override
    public String createUser(CreateEmployeeRequest createEmployeeRequest) {
        log.info("UserServiceImpl createEmployeeRequest, {}", createEmployeeRequest);
        return hrDao.createUser(createEmployeeRequest);
    }

    @Override
    public String updateUser(EmployeeUpdateRequest employeeUpdateRequest) {
        return hrDao.updateUser(employeeUpdateRequest);
    }

    @Override
    public List<EmployeeDisplayResponse> getAllUsers() {
        return hrDao.getAllUsers();
    }

}
