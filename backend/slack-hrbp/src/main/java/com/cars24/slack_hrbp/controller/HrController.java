package com.cars24.slack_hrbp.controller;

import com.cars24.slack_hrbp.data.dao.impl.ListAllEmployeesUnderManagerDaoImpl;
import com.cars24.slack_hrbp.data.entity.EmployeeEntity;
import com.cars24.slack_hrbp.data.request.EmployeeUpdateRequest;
import com.cars24.slack_hrbp.data.request.CreateEmployeeRequest;
import com.cars24.slack_hrbp.data.request.PasswordUpdateRequest;
import com.cars24.slack_hrbp.data.response.EmployeeDisplayResponse;
import com.cars24.slack_hrbp.data.response.GetUserResponse;
import com.cars24.slack_hrbp.service.impl.EmployeeServiceImpl;
import com.cars24.slack_hrbp.service.impl.HrServiceImpl;
import com.cars24.slack_hrbp.service.impl.MonthBasedServiceImpl;
import com.cars24.slack_hrbp.service.impl.UseridAndMonthImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/hr")
@RequiredArgsConstructor
@Valid

public class HrController {

    private final HrServiceImpl hrService;
    private final MonthBasedServiceImpl monthBasedService;
    private final UseridAndMonthImpl useridandmonth;
    private final EmployeeServiceImpl employeeService;
    private final ListAllEmployeesUnderManagerDaoImpl listAllEmployeesUnderManagerDao;

    @PreAuthorize("hasRole('HR')")
    @PostMapping("/createUser")
    public ResponseEntity<String> createUser(@Valid @RequestBody CreateEmployeeRequest createEmployeeRequest){
        log.info("HrController createEmployeeRequest, {}", createEmployeeRequest);
        String response = hrService.createUser(createEmployeeRequest);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('HR')")
    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody EmployeeUpdateRequest employeeUpdateRequest) {
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

        System.out.println("getUserDetails is called");

        Map<String, Map<String, String>> resp = useridandmonth.getCustomerDetails(userId);
        System.out.println(resp);
        return resp;

    }

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/update/{userId}")
    public EmployeeEntity getEmployeeDetails(@PathVariable String userId){

        EmployeeEntity resp = hrService.getUser(userId);
        System.out.println(resp);
        return resp;
    }

    @PreAuthorize("hasRole('HR')")
    @PostMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest passwordUpdateRequest){
        System.out.println("Update Password called");
        String response = employeeService.updatePassword(passwordUpdateRequest);
        System.out.println(response);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }


    @PreAuthorize("hasRole('HR')")
    @GetMapping("/download/{userid}/{month}")
    public ResponseEntity<byte[]> downloadAttendanceExcel(@PathVariable String userid, @PathVariable String month) {
        try {
            byte[] excelData = useridandmonth.generateAttendanceExcel(userid, month);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=attendance.xlsx");

            return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PreAuthorize("hasRole('HR')")
    @GetMapping("/displayUsers/{userId}")
    public ResponseEntity<List<GetUserResponse>> getAllUsers(@PathVariable String userId,
                                                             @RequestParam(value = "page", defaultValue = "1") int page,
                                                             @RequestParam(value = "limit", defaultValue = "2") int limit) {
        List<GetUserResponse> responses = new ArrayList<>();


        // Fix: Convert to zero-based index
        if (page > 0) page -= 1;

        Page<List<String>> users = listAllEmployeesUnderManagerDao.getAllEmployeesUnderManager(userId, page, limit);

        // Fix: Iterate over users.getContent()
        for (List<String> userDto : users.getContent()) {
            if (userDto.size() >= 3) {  // Ensure list contains required values
                GetUserResponse res = new GetUserResponse();
                res.setUserId(userDto.get(0));  // Manually set values
                res.setEmail(userDto.get(1));
                res.setUsername(userDto.get(2));
                responses.add(res);
            }
        }

        return ResponseEntity.ok().body(responses);
    }

}


