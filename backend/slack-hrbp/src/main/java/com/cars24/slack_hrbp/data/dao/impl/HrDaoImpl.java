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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Data
@Slf4j

public class HrDaoImpl implements HrDao {

    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

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
        EmployeeEntity employeeEntity = employeeRepository.findByUserId(employeeUpdateRequest.getUserid());
        log.info("HrDaoImpl employeeUpdateRequest, {}", employeeUpdateRequest);
        log.info("HrDaoImpl employeeEntity, {}", employeeEntity);
        employeeEntity.setManagerId(employeeUpdateRequest.getManagerid());
        employeeEntity.setManagerName(employeeUpdateRequest.getManagername());
        employeeRepository.save(employeeEntity);
        return "Update was successful";
    }

    @Override
    public List<EmployeeDisplayResponse> getAllUsers() {

        List<EmployeeEntity> emp = employeeRepository.findAll();
        List<EmployeeDisplayResponse> responses = new ArrayList<>();

        for(EmployeeEntity entity : emp){
            System.out.println(entity);
            EmployeeDisplayResponse edp = new EmployeeDisplayResponse();
            BeanUtils.copyProperties(entity, edp);
            responses.add(edp);
        }

        return responses;
    }
}
