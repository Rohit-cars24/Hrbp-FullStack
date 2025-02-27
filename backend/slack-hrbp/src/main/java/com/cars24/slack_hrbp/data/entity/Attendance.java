package com.cars24.slack_hrbp.data.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data

@Document(collection = "Attendance")
public class Attendance {

    @Id
    private String id;
    private String userid;
    private String username;
    private String date;
    private String type;
    private String reason;

}