package com.cars24.slack_hrbp.data.dao.impl;

import com.cars24.slack_hrbp.data.dao.EmployeeDao;
import com.cars24.slack_hrbp.data.entity.EmployeeEntity;
import com.cars24.slack_hrbp.data.repository.EmployeeRepository;
import com.cars24.slack_hrbp.data.request.PasswordUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service

public class EmployeeDaoImpl implements EmployeeDao {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmployeeRepository employeeRepository;

    @Override
    public String updatePassword(PasswordUpdateRequest passwordUpdateRequest) {
        EmployeeEntity entity = employeeRepository.findByUserId(passwordUpdateRequest.getUserId());

        String encryptedPassword = bCryptPasswordEncoder.encode(passwordUpdateRequest.getNewPassword());

        entity.setEncryptedPassword(encryptedPassword);
        employeeRepository.save(entity);

        return "Password updated successfully";
    }

}
