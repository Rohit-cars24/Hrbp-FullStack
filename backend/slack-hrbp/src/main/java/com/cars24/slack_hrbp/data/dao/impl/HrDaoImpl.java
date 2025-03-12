package com.cars24.slack_hrbp.data.dao.impl;

import com.cars24.slack_hrbp.data.dao.HrDao;
import com.cars24.slack_hrbp.data.entity.EmployeeEntity;
import com.cars24.slack_hrbp.data.repository.EmployeeRepository;
import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.request.CreateEmployeeRequest;
import com.cars24.slack_hrbp.data.response.EmployeeDisplayResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Data
@Slf4j

public class HrDaoImpl implements HrDao {

    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
//    private final UpdateEmployeeResponse updateEmployeeResponse;

    @Override
    public String createUser(CreateEmployeeRequest createEmployeeRequest) {
        EmployeeEntity employeeEntity = new EmployeeEntity();
        BeanUtils.copyProperties(createEmployeeRequest, employeeEntity);
        employeeEntity.setEncryptedPassword(bCryptPasswordEncoder.encode(createEmployeeRequest.getPassword()));
        employeeEntity.setEmailVerificationStatus(false);
        employeeEntity.setRoles(createEmployeeRequest.getRoles());
        employeeRepository.save(employeeEntity);
        return "Creation of employee account was successful";
    }

    @Override
    public String updateUser(EmployeeUpdateRequest employeeUpdateRequest) {

        EmployeeEntity entity = employeeRepository.findByUserId(employeeUpdateRequest.getManagerId());

        EmployeeEntity employeeEntity = employeeRepository.findByUserId(employeeUpdateRequest.getUserId());
        log.info("HrDaoImpl employeeUpdateRequest, {}", employeeUpdateRequest);
//        log.info("HrDaoImpl employeeEntity, {}", employeeEntity);
        employeeEntity.setManagerId(employeeUpdateRequest.getManagerId());
        employeeEntity.setManagerName(entity.getUsername());
        employeeEntity.setRoles(List.of(employeeUpdateRequest.getRole()));
        employeeRepository.save(employeeEntity);
        return "Update was successful";
    }

    @Override
    public Page<List<String>> getAllUsers(String userId, int page, int limit) {

        Pageable pageable = PageRequest.of(page, limit);

        Page<EmployeeEntity> employeePage = employeeRepository.findAll(pageable);

        List<List<String>> employeeIds = employeePage.getContent().stream().map(bt -> {
            List<String> inside = new ArrayList<>();
            inside.add(bt.getUserId());
            inside.add(bt.getEmail());
            inside.add(bt.getUsername());
            return inside;
        }).collect(Collectors.toList());

        return new PageImpl<>(employeeIds, pageable, employeePage.getTotalElements());
    }

    @Override
    public EmployeeEntity getUser(String userid) {

        EmployeeEntity employeeEntity=employeeRepository.findByUserId(userid);

        return employeeEntity;
    }

    @Override
    public long getTotalEmployeesCount(){
       return employeeRepository.count();
    }
}
