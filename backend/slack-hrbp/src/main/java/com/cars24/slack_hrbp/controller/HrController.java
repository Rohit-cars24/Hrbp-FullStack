package com.cars24.slack_hrbp.controller;

import com.cars24.slack_hrbp.data.request.UserUpdateRequest;
import com.cars24.slack_hrbp.data.response.ApiResponse;
import com.cars24.slack_hrbp.data.response.CreateUserRequest;
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
    public ResponseEntity<String> createUser(@RequestBody CreateUserRequest createUserRequest){
        log.info("HrController createUserRequest, {}", createUserRequest);
        String response = hrService.createUser(createUserRequest);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("asRole('HR')")
    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserUpdateRequest userUpdateRequest){

    }

}
