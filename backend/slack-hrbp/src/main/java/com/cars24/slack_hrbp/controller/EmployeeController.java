package com.cars24.slack_hrbp.controller;

import com.cars24.slack_hrbp.data.entity.AttendanceEntity;
import com.cars24.slack_hrbp.data.request.PasswordUpdateRequest;
import com.cars24.slack_hrbp.service.EmployeeService;
import com.cars24.slack_hrbp.service.impl.EmployeeServiceImpl;
import com.cars24.slack_hrbp.service.impl.UsernameServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/employee")
@Slf4j
@RestController

public class EmployeeController {

    private final UsernameServiceImpl usernameService;
    private final EmployeeServiceImpl employeeService;

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/getDetails")
    public ResponseEntity<List<AttendanceEntity>> getUserDetails(@RequestBody String userid){
        List<AttendanceEntity> responses = usernameService.getCustomerDetails(userid);
        return ResponseEntity.ok().body(responses);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(@RequestBody PasswordUpdateRequest passwordUpdateRequest){
        String response = employeeService.updatePassword(passwordUpdateRequest);
        return ResponseEntity.ok().body(response);
    }

}
