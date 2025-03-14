package com.cars24.slack_hrbp.controller;

import com.cars24.slack_hrbp.data.request.PasswordUpdateRequest;
import com.cars24.slack_hrbp.service.impl.EmployeeServiceImpl;
import com.cars24.slack_hrbp.service.impl.UseridAndMonthImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RequestMapping("/employee")
@Slf4j
@RestController

public class EmployeeController {

    private final UseridAndMonthImpl usernameService;
    private final EmployeeServiceImpl employeeService;
    private final UseridAndMonthImpl useridandmonth;

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/{userid}/{month}")
    public Map<String, Map<String, String>> getUserDetails(@PathVariable String userid, @PathVariable String month){
        Map<String, Map<String, String>> resp = useridandmonth.getCustomerDetails(userid,month);
        return resp;
    }

//    @PreAuthorize("hasRole('EMPLOYEE')")
//    @GetMapping("/getDetails")
//    public ResponseEntity<Map<String, Map<String, String>>> getUserDetails(@RequestBody String userid){
//        Map<String, Map<String, String>> responses = usernameService.getCustomerDetails(userid);
//        return ResponseEntity.ok().body(responses);
//    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(@RequestBody PasswordUpdateRequest passwordUpdateRequest){
        String response = employeeService.updatePassword(passwordUpdateRequest);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/{userId}")
    public Map<String, Map<String, String>> getUserDetails(@PathVariable String userId){

        System.out.println("GetUserDetails Manager called");
        Map<String, Map<String, String>> resp = useridandmonth.getCustomerDetails(userId);
        System.out.println(resp);
        return resp;

    }

}
