package com.cars24.slack_hrbp.data.dao.impl;

import com.cars24.slack_hrbp.data.dao.HrUpdateDao;
import com.cars24.slack_hrbp.data.entity.EmployeeEntity;
import com.cars24.slack_hrbp.data.repository.HrUpdateRepository;
import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;
import com.cars24.slack_hrbp.excpetion.UserDoesntExistException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Slf4j
@RequiredArgsConstructor
@Service
public class HrUpdateDaoImpl implements HrUpdateDao {

    private final HrUpdateRepository hrUpdateRepository;

    @Override
    public CreateEmployeeRequest getUserDetails(String userId) {

        EmployeeEntity employee = hrUpdateRepository.findByUserId(userId);
        if (employee == null) {
            log.warn("No employee found with userId: {}", userId);
            throw new UserDoesntExistException("No employee found with userId");

        }

        // Convert EmployeeEntity to CreateEmployeeRequest
        CreateEmployeeRequest response = new CreateEmployeeRequest();
        response.setUserId(employee.getUserId());
        response.setUsername(employee.getUsername());
        response.setPassword(employee.getEncryptedPassword());
        response.setEmail(employee.getEmail());
        response.setRoles(employee.getRoles());
        response.setEncryptedPassword(employee.getEncryptedPassword());
        response.setManagerName(employee.getManagerName());
        response.setManagerId(employee.getManagerId());

        log.info("Response from Repository: {}", response);
        return response;
    }

    @Override
    public String updateUserDetails(EmployeeUpdateRequest employeeUpdateRequest) {
        boolean flag=hrUpdateRepository.existsByUserId(employeeUpdateRequest.getUserid());
        EmployeeEntity employee = hrUpdateRepository.findByUserId(employeeUpdateRequest.getUserid());


        if(flag){
            if (!employeeUpdateRequest.getRole().equals(employee.getRoles().isEmpty() ? null : employee.getRoles().get(0))) {
                employee.setRoles(Arrays.asList(employeeUpdateRequest.getRole()));
                log.info("New Role Assigned ");
            }
            if (!employeeUpdateRequest.getManagerid().equals((employee.getManagerId()))){
                employee.setManagerId(employeeUpdateRequest.getManagerid());
                log.info("New Manager Id Assigned");
                employee.setManagerName(employeeUpdateRequest.getManagername());
                log.info("New Manager Name Assigned");
            }
            hrUpdateRepository.save(employee);
            log.info("Data Updated to database :" +employee);

            return "Successfully Data Updated";

        }

        else{
            //no need bcz ,such circumstance wont come
            throw new UserDoesntExistException("User Does not Exist");
        }

    }
}
