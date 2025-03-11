package com.cars24.slack_hrbp.service.impl;

import com.cars24.slack_hrbp.data.dao.impl.HrDaoImpl;
import com.cars24.slack_hrbp.data.dao.impl.ListAllEmployeesUnderManagerDaoImpl;
import com.cars24.slack_hrbp.data.dto.UserDto;
import com.cars24.slack_hrbp.data.entity.EmployeeEntity;
import com.cars24.slack_hrbp.data.repository.EmployeeRepository;
import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.request.CreateEmployeeRequest;
import com.cars24.slack_hrbp.data.response.EmployeeDisplayResponse;
import com.cars24.slack_hrbp.data.response.UpdateEmployeeResponse;
import com.cars24.slack_hrbp.excpetion.UserServiceException;
import com.cars24.slack_hrbp.service.HrService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor

public class HrServiceImpl implements HrService {

    private final HrDaoImpl hrDao;
    private final EmployeeRepository employeeRepository;
    private final ListAllEmployeesUnderManagerDaoImpl listAllEmployeesUnderManagerDao;


    @Override
    public String createUser(CreateEmployeeRequest createEmployeeRequest) {
        log.info("UserServiceImpl createEmployeeRequest, {}", createEmployeeRequest);

        if(employeeRepository.existsByEmail(createEmployeeRequest.getEmail()))
            throw new UserServiceException("Email already exists");
        if(employeeRepository.existsByUserId(createEmployeeRequest.getUserId()))
            throw new UserServiceException("UserId already exists");
        return hrDao.createUser(createEmployeeRequest);
    }

    @Override
    public String updateUser(EmployeeUpdateRequest employeeUpdateRequest) {
        if(!employeeRepository.existsByUserId(employeeUpdateRequest.getManagerId()))
            throw new UserServiceException("ManagerId does not exist");
        System.out.println("Request reached Service for update user");
        return hrDao.updateUser(employeeUpdateRequest);
    }
    @Override
    public EmployeeEntity getUser(String userid) {
        return hrDao.getUser(userid);
    }

    @Override
    public List<EmployeeDisplayResponse> getAllUsers() {
        return hrDao.getAllUsers();
    }

//    @Override
//    public List<UserDto> paginatedUsers(String UserId, int page, int limit) {
//        Pageable pageable = (Pageable) PageRequest.of(page, limit);
//
//        if(page > 0)
//            page -= 1;
//
//        List<UserDto> users = new ArrayList<>();
//
//        Page<EmployeeEntity> userPage = employeeRepository.findAll(pageable);
//        List<EmployeeEntity> response = userPage.getContent();
//
//        for(EmployeeEntity res : response){
//            UserDto user = new UserDto();
//            BeanUtils.copyProperties(res, user);
//            users.add(user);
//        }
//
//        return users;
//    }
}
