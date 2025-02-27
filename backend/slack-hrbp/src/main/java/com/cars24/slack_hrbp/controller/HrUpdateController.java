//package com.cars24.slack_hrbp.controller;
//
//import com.cars24.slack_hrbp.data.response.ApiResponse;
//import com.cars24.slack_hrbp.data.response.CreateUserRequest;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/hr")
//@RequiredArgsConstructor
//
//public class HrUpdateController {
//
////    private final
//
//    @PreAuthorize("hasRole('HR')")
//    @GetMapping("/dashboard")
//    public ResponseEntity<String> getHrDashboard() {
//        return ResponseEntity.ok("HR Dashboard Access Granted!");
//    }
//
//    @PreAuthorize("hasRole('HR)")
//    @GetMapping("/createUser")
//    public ResponseEntity<ApiResponse> createUser(@RequestBody CreateUserRequest createUserRequest){
//        return null;
//    }
//
//    @PostMapping("/updateUser")
//    public ResponseEntity<ApiResponse> updateUser()}
