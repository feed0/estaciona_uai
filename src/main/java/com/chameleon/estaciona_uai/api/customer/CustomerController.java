package com.chameleon.estaciona_uai.api.customer;

import com.chameleon.estaciona_uai.api.customer.dto.CustomerSignupRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody CustomerSignupRequest customerSignupRequest) {
        customerService.signup(customerSignupRequest);
        return new ResponseEntity<>("Customer signed up successfully", HttpStatus.CREATED);
    }
}