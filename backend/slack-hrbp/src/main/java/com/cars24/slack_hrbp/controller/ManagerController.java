package com.cars24.slack_hrbp.controller;


import com.cars24.slack_hrbp.service.impl.MonthBasedServiceImpl;
import com.cars24.slack_hrbp.service.impl.UseridAndMonthImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/manager")
@Slf4j
@RequiredArgsConstructor

public class ManagerController {

    private final MonthBasedServiceImpl monthBasedService;
    private final UseridAndMonthImpl useridandmonth;

    @PreAuthorize("hasrole('MANAGER')")
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

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/{userid}/{month}")
    public Map<String, Map<String, String>> getUserDetails(@PathVariable String userid, @PathVariable String month){

        Map<String, Map<String, String>> resp = useridandmonth.getCustomerDetails(userid,month);
        return resp;

    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/{userId}")
    public Map<String, Map<String, String>> getUserDetails(@PathVariable String userId){

        Map<String, Map<String, String>> resp = useridandmonth.getCustomerDetails(userId);
        return resp;

    }

}
