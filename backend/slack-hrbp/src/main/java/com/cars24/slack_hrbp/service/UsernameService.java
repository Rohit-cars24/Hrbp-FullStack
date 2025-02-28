package com.cars24.slack_hrbp.service;

import java.util.Date;
import java.util.Map;

public interface UsernameService {
    public Map<String, Map<String, String>> getCustomerDetails(String userid);

    Map<String, Map<String, String>> getCustomerDetails(String userid, String month);
}
