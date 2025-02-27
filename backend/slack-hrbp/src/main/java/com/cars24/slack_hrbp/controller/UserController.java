package com.cars24.slack_hrbp.controller;

import com.cars24.slack_hrbp.data.dto.UserDto;
import com.cars24.slack_hrbp.data.request.SignUpRequest;
import com.cars24.slack_hrbp.data.request.UserUpdateRequest;
import com.cars24.slack_hrbp.data.response.GetUserResponse;
import com.cars24.slack_hrbp.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/users")
@Service
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping(path = "/display/{id}")
    public GetUserResponse getUser(@PathVariable("id") String id){

        log.info("[UserController] GetUserResponse {}", id);

        UserDto userDto = new UserDto();
        UserDto userDetails = userService.displayCustomer(id);

        GetUserResponse getUserResponse = new GetUserResponse();
        BeanUtils.copyProperties(userDetails, getUserResponse);

        return getUserResponse;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> createUser(@RequestBody SignUpRequest signUpRequest) {
        log.info("[createUser] UserController {}", signUpRequest);

        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(signUpRequest, userDto);

        UserDto createdUser = userService.createUser(userDto);

        if (createdUser != null) {
            // Return a success message with HTTP 201 Created status
            return ResponseEntity.status(201).body(Map.of("message", "Signup successful!"));
        } else {
            // Return an error message with HTTP 400 Bad Request status
            return ResponseEntity.status(400).body(Map.of("message", "Signup failed!"));
        }
    }



    @PutMapping("/edit/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable("id") String id, @RequestBody UserUpdateRequest userUpdateRequest){

        UserDto userDto = new UserDto();
        System.out.println(userUpdateRequest);
        UserDto updatedUser = userService.updateUser(id, userUpdateRequest);

        return ResponseEntity.ok().body(updatedUser);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<UserDto> deleteUser(@PathVariable("id") String id){

        UserDto userDto = new UserDto();

        UserDto deletedUser = userService.deleteUser(id);

        return ResponseEntity.ok().body(deletedUser);
    }

    @GetMapping("/displayUsers")
    public ResponseEntity<List<GetUserResponse>> getAllUsers(@RequestParam(value = "page", defaultValue = "1") int page,
                                                             @RequestParam(value = "limit", defaultValue = "2") int limit){
        List<GetUserResponse> responses = new ArrayList<>();

        List<UserDto> users = userService.getAllUsers(page, limit);

        for(UserDto userDto : users){
            GetUserResponse res = new GetUserResponse();
            BeanUtils.copyProperties(userDto, res);
            responses.add(res);
        }

        return ResponseEntity.ok().body(responses);

    }
}