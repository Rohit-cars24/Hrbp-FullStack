package com.cars24.slack_hrbp.controller;

import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;
import com.cars24.slack_hrbp.service.impl.HrServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/hr")
@RequiredArgsConstructor

public class HrController {

    private final HrServiceImpl hrService;

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/dashboard")
    public ResponseEntity<String> getHrDashboard() {
        return ResponseEntity.ok("HR Dashboard Access Granted!");
    }

    @PreAuthorize("hasRole('HR')")
    @PostMapping("/createUser")
    public ResponseEntity<String> createUser(@RequestBody CreateEmployeeRequest createEmployeeRequest){
        log.info("HrController createEmployeeRequest, {}", createEmployeeRequest);
        String response = hrService.createUser(createEmployeeRequest);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("asRole('HR')")
    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody EmployeeUpdateRequest employeeUpdateRequest){
        String response = hrService.updateUser(employeeUpdateRequest);
        return ResponseEntity.ok().body(response);
    }

}
