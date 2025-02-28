package com.cars24.slack_hrbp.controller;

import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.response.CreateEmployeeRequest;
import com.cars24.slack_hrbp.data.response.EmployeeDisplayResponse;
import com.cars24.slack_hrbp.service.impl.HrServiceImpl;
import com.cars24.slack_hrbp.service.impl.MonthBasedServiceImpl;
import com.cars24.slack_hrbp.service.impl.UseridAndMonthImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/hr")
@RequiredArgsConstructor

public class HrController {

    private final HrServiceImpl hrService;
    private final MonthBasedServiceImpl monthBasedService;
    private final UseridAndMonthImpl useridandmonth;

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

    @PreAuthorize("asRole('HR')")
    @GetMapping("/allUsers")
    public ResponseEntity<List<EmployeeDisplayResponse>> displayAllUser(){
        List<EmployeeDisplayResponse> response = hrService.getAllUsers();
        return ResponseEntity.ok().body(response);
    }


    @PreAuthorize("hasrole('HR')")
    @GetMapping("bymonth")
    public ResponseEntity<Map<String, Map<String, String>>> getByMonth(@RequestParam String monthYear) {
        try {
            Map<String, Map<String, String>> reportData = monthBasedService.generateAttendanceReport(monthYear);
            return ResponseEntity.ok().body(reportData);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating report: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/{userid}/{month}")
    public Map<String, Map<String, String>> getUserDetails(@PathVariable String userid, @PathVariable String month){

        Map<String, Map<String, String>> resp = useridandmonth.getCustomerDetails(userid,month);
        return resp;

    }

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/{userId}")
    public Map<String, Map<String, String>> getUserDetails(@PathVariable String userId){

        Map<String, Map<String, String>> resp = useridandmonth.getCustomerDetails(userId);
        return resp;

    }

}
