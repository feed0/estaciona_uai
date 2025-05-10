package com.chameleon.estaciona_uai.controller;

import com.chameleon.estaciona_uai.dto.CustomerSignupDto;
import com.chameleon.estaciona_uai.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody CustomerSignupDto customerSignupDto) {
        customerService.signup(customerSignupDto);
        return new ResponseEntity<>("Customer signed up successfully", HttpStatus.CREATED);
    }
}