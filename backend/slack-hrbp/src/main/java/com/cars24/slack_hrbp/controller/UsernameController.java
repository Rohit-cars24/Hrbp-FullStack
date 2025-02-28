package com.cars24.slack_hrbp.controller;

import com.cars24.slack_hrbp.data.entity.AttendanceEntity;
import com.cars24.slack_hrbp.data.repository.UsernameRepository;
import com.cars24.slack_hrbp.service.impl.UsernameServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/hr")
public class UsernameController {

    private final UsernameServiceImpl usernameService;


    @PreAuthorize("hasRole('HR')")
    @GetMapping("/{userId}")

    public Map<String, Map<String, String>> getUserDetails(@PathVariable String userId){

        Map<String, Map<String, String>> resp=usernameService.getCustomerDetails(userId);
        return resp;

    }

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/{userid}/{month}")

    public Map<String, Map<String, String>> getUserDetails(@PathVariable String userid,@PathVariable String month){



        Map<String, Map<String, String>> resp=usernameService.getCustomerDetails(userid,month);

        return resp;

    }



}
