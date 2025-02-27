package com.cars24.slack_hrbp.data.dao.impl;

import com.cars24.slack_hrbp.data.dao.UsernameDao;
import com.cars24.slack_hrbp.data.entity.AttendanceEntity;
import com.cars24.slack_hrbp.data.repository.UsernameRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class UsernameDaoImpl implements UsernameDao {

    private final UsernameRepository usernameRepository;

    @Override
    public List<AttendanceEntity> getUserDetails(String userid) {

        log.info("{}", userid);
        List<AttendanceEntity> resp=usernameRepository.findByUserid(userid);

        for (AttendanceEntity entity : resp) {
            log.info("User Attendance Details: {}", entity);
        }

        return resp;
    }
}
