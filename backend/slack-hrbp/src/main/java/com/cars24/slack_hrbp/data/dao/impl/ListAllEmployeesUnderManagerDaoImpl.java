package com.cars24.slack_hrbp.data.dao.impl;

import com.cars24.slack_hrbp.data.dao.ListAllEmployeesUnderMangerDao;
import com.cars24.slack_hrbp.data.entity.EmployeeEntity;
import com.cars24.slack_hrbp.data.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j

public class ListAllEmployeesUnderManagerDaoImpl implements ListAllEmployeesUnderMangerDao {

    private final EmployeeRepository employeeRepository;

    @Override
    public List<List<String>> getAllEmployeesUnderManager(String userId) {

        List<List<String>> employeeIds = new ArrayList<>();

        List<EmployeeEntity> lis = employeeRepository.findByManagerId(userId);

        for(EmployeeEntity bt : lis){

            List<String> inside = new ArrayList<>();
            inside.add(bt.getUserId());
            inside.add(bt.getEmail());
            inside.add(bt.getUsername());

            employeeIds.add(inside);

        }

        return employeeIds;

    }
}
