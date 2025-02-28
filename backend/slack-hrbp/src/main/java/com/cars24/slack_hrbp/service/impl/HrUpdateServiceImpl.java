package com.cars24.slack_hrbp.service.impl;

import com.cars24.slack_hrbp.data.dao.impl.HrUpdateDaoImpl;
import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;

import com.cars24.slack_hrbp.service.HrUpdateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class HrUpdateServiceImpl implements HrUpdateService {
    private final HrUpdateDaoImpl hrUpdateDao;

    @Override
    public CreateEmployeeRequest getUserDetails(String userid) {
        CreateEmployeeRequest resp= hrUpdateDao.getUserDetails(userid);

        return resp;
    }

    @Override
    public String updateUserDetails(EmployeeUpdateRequest employeeUpdateRequest) {
        return hrUpdateDao.updateUserDetails(employeeUpdateRequest);
    }
}
