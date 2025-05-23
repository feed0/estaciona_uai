package com.chameleon.estaciona_uai.api.user.customer;

import com.chameleon.estaciona_uai.api.user.customer.dto.CustomerSignupRequest;
import com.chameleon.estaciona_uai.domain.user.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public void signup(CustomerSignupRequest customerSignupRequest) {
        Customer customer = new Customer();
        customer.setName(customerSignupRequest.getName());
        customer.setEmail(customerSignupRequest.getEmail());
        customer.setPassword(customerSignupRequest.getPassword());

        customerRepository.save(customer);

        System.out.println("Customer signed up: " + customerSignupRequest);
    }
}