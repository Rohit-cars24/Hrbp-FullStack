package com.cars24.slack_hrbp.controller;

import com.cars24.slack_hrbp.service.impl.AttendanceServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/hr")
@RestController
public class AttendanceController {

    @Autowired
    private AttendanceServiceImpl attendanceService;

    @PreAuthorize("hasrole('HR')")
    @GetMapping("/generate-report")
    public Map<String, Map<String, String>> generateReport(@RequestParam String monthYear) {
        try {
            // Generate the report and get the processed data
            Map<String, Map<String, String>> reportData = attendanceService.generateAttendanceReport(monthYear);
            return reportData; // Return JSON response
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating report: " + e.getMessage());
        }
    }

}