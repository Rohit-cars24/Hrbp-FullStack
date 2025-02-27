package com.cars24.slack_hrbp.service;

import java.util.Map;

public interface UsernameService {
    public Map<String, Map<String, String>> getCustomerDetails(String userid);
}
