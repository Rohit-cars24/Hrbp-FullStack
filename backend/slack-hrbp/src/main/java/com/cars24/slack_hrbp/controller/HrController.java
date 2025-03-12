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
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

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
//    private final Map<String, byte[]> reportStorage = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newCachedThreadPool();


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
        System.out.println(employeeUpdateRequest);
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

    // SSE Endpoint to listen for events
    @GetMapping(value = "/events/{userid}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents(@PathVariable String userid) {
        SseEmitter emitter = new SseEmitter(0L); // No timeout
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            try {
                // Send "Generating Excel" message first
                emitter.send(SseEmitter.event().data("Generating Excel..."));

                // Simulate report generation delay (replace with actual logic)
                Thread.sleep(5000); // Simulate processing delay

                // Send "Download Ready" message
                emitter.send(SseEmitter.event().data("Excel Downloaded successfully"));

                emitter.send(SseEmitter.event().data("DONE"));

                emitter.complete(); // Close connection after sending
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    // API to trigger Excel generation & notify frontend
    @GetMapping("/download/{userid}/{month}")
    public void downloadReport(@PathVariable String userid, @PathVariable String month, HttpServletResponse response) {
        SseEmitter emitter = emitters.get(userid);
        try {
            // Notify frontend that generation has started
            if (emitter != null) {
                emitter.send(SseEmitter.event().name("status").data("Excel is being generated..."));
            }

            // Generate Excel
            byte[] excelData = useridandmonth.generateAttendanceExcel(userid, month);

            // Set response headers for file download
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=Attendance_" + userid + "_" + month + ".xlsx");
            response.getOutputStream().write(excelData);
            response.flushBuffer();

            // Notify frontend that download is ready
            if (emitter != null) {
                emitter.send(SseEmitter.event().name("status").data("Excel Downloaded Successfully!"));
                emitter.complete();
            }
        } catch (IOException e) {
            e.printStackTrace();
            if (emitter != null) {
                try {
                    emitter.send(SseEmitter.event().name("status").data("Failed to generate Excel."));
                    emitter.complete();
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
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


