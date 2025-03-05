package com.cars24.slack_hrbp.data.dao;

import java.util.List;

public interface ListAllEmployeesUnderMangerDao {
    List<List<String>> getAllEmployeesUnderManager(String userId);
}
