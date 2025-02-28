package com.cars24.slack_hrbp.service;

import java.util.Map;

public interface UseridAndMonth {
    public Map<String, Map<String, String>> getCustomerDetails(String userid);

    Map<String, Map<String, String>> getCustomerDetails(String userid, String month);
}
