package com.cars24.slack_hrbp.controller;


import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;

import com.cars24.slack_hrbp.service.impl.HrUpdateServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/hr")
@RequiredArgsConstructor

public class HrUpdateController {

    private final HrUpdateServiceImpl hrUpdateService;

    @PreAuthorize("asRole('HR')")
    @GetMapping("/update/{userid}")
    public CreateEmployeeRequest getUser(@PathVariable String userid){
        CreateEmployeeRequest resp=hrUpdateService.getUserDetails(userid);
        return resp;
    }

    @PostMapping("/update/{userid}")
    public ResponseEntity<String> updateUser(@RequestBody EmployeeUpdateRequest employeeUpdateRequest){

        String resp=hrUpdateService.updateUserDetails(employeeUpdateRequest);
        return ResponseEntity.ok(resp);
    }

}
