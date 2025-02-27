package com.cars24.slack_hrbp.service.impl;

import com.cars24.slack_hrbp.data.dao.UserDao;
import com.cars24.slack_hrbp.data.dto.UserDto;
import com.cars24.slack_hrbp.data.entity.UserEntity;
import com.cars24.slack_hrbp.data.repository.UserRepository;
import com.cars24.slack_hrbp.data.request.UserUpdateRequest;
import com.cars24.slack_hrbp.excpetion.UserServiceException;
import com.cars24.slack_hrbp.service.UserService;
import com.cars24.slack_hrbp.util.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service

public class UserServiceImpl implements UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    Utils utils;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDto createUser(UserDto user) {
        log.info("[createUser] UserServiceImpl {}", user);

        // Validate required fields are provided
        if (user.getFirstName() == null || user.getLastName() == null || user.getEmail() == null || user.getPassword() == null)
            throw new UserServiceException("Empty fields are not allowed");

        // Check if the email already exists in the system
        if (userRepository.existsByEmail(user.getEmail()))
            throw new UserServiceException("Record already exists");

        // Create a new UserEntity object
        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(user, userEntity);

        // Generate a unique user ID
        userEntity.setUserId(utils.generateUserId(10));

        // Hash the password before storing it
        userEntity.setEncryptedPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        // Assign roles (default to "CUSTOMER" if no roles are provided)
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            // Default role is ROLE_CUSTOMER if no roles are provided
            userEntity.setRoles(List.of("ROLE_CUSTOMER"));
        } else {
            // Ensure roles are prefixed with "ROLE_" if not already
            List<String> formattedRoles = user.getRoles().stream()
                    .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)  // Add ROLE_ prefix if not present
                    .collect(Collectors.toList());
            userEntity.setRoles(formattedRoles);  // Set the formatted roles
        }

        // Save the user entity
        UserEntity savedUser = userRepository.save(userEntity);

        // Convert saved entity back to DTO to return the response
        UserDto signUpResponse = new UserDto();
        BeanUtils.copyProperties(savedUser, signUpResponse);
        return signUpResponse;
    }



    @Override
    public UserDetails loadUserByUsername(String username) throws UserServiceException {
        log.info("[loadUserByUsername] UserServiceImpl {} ", username);

        // Find the user entity by email (which is the username)
        UserEntity userEntity = userRepository.findByEmail(username);

        // If no user is found, throw an exception
        if (userEntity == null)
            throw new UserServiceException("User hasn't signed up");

        // Convert roles to Spring Security authorities
        List<GrantedAuthority> authorities = userEntity.getRoles().stream()
                .map(role -> role.startsWith("ROLE_") ? new SimpleGrantedAuthority(role) : new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());

        // Return a new User object with the username, password, and authorities (roles)
        return new User(username, userEntity.getEncryptedPassword(), authorities);
    }

    public UserDto getUser(String email){

        UserDto response = new UserDto();
        UserEntity userEntity = userRepository.findByEmail(email);

        if(userEntity == null)
            throw new UserServiceException("No entry by the given user id");

        BeanUtils.copyProperties(userEntity, response);
        return response;
    }

    @Override
    public UserDto displayCustomer(String userId) {
        log.info("[display] UserServiceImpl {}", userId);

        return userDao.displayCustomer(userId);
    }

    @Override
    public UserDto updateUser(String id, UserUpdateRequest userUpdateRequest) {
        if(!userRepository.existsByUserId(id)){
            throw new UserServiceException("User not found");
        }

        return userDao.updateUser(id, userUpdateRequest);

    }

    @Override
    public UserDto deleteUser(String id) {

        if(!userRepository.existsByUserId(id)){
            throw new UserServiceException("User not found");
        }

        return userDao.deleteUser(id);
    }

    @Override
    public List<UserDto> getAllUsers(int page, int limit) {

        Pageable pageable = (Pageable) PageRequest.of(page, limit);

        if(page > 0)
            page -= 1;

        List<UserDto> users = new ArrayList<>();

        Page<UserEntity> userPage = userRepository.findAll(pageable);
        List<UserEntity> response = userPage.getContent();

        for(UserEntity res : response){
            UserDto user = new UserDto();
            BeanUtils.copyProperties(res, user);
            users.add(user);
        }

        return users;
    }
}
