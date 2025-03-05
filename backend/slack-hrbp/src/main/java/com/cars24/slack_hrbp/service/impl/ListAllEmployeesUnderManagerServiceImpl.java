package com.cars24.slack_hrbp.service.impl;


import com.cars24.slack_hrbp.data.dao.impl.ListAllEmployeesUnderManagerDaoImpl;
import com.cars24.slack_hrbp.service.ListAllEmployeesUnderManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class ListAllEmployeesUnderManagerServiceImpl implements ListAllEmployeesUnderManagerService {

    private final ListAllEmployeesUnderManagerDaoImpl listAllEmployeesUnderManagerDao;
    @Override
    public List<List<String>> getAllEmployeesUnderManager(String userId) {
        return listAllEmployeesUnderManagerDao.getAllEmployeesUnderManager(userId);
    }
}
