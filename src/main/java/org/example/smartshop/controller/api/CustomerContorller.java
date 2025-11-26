package org.example.smartshop.controller.api;

import jakarta.validation.Valid;
import org.example.smartshop.dto.request.CustomerRequest;
import org.example.smartshop.dto.response.CustomerResponse;
import org.example.smartshop.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/customers")
public class CustomerContorller {

    @Autowired
    private CustomerService customerService;


    @PostMapping("/create")
    public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
