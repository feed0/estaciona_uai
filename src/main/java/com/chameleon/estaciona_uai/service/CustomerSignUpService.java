package com.chameleon.estaciona_uai.service;

import com.chameleon.estaciona_uai.domain.user.Customer;
import com.chameleon.estaciona_uai.dto.CustomerSignupDto;
import com.chameleon.estaciona_uai.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public void signup(CustomerSignupDto customerSignupDto) {
        Customer customer = new Customer();
        customer.setName(customerSignupDto.getName());
        customer.setEmail(customerSignupDto.getEmail());
        customer.setPassword(customerSignupDto.getPassword());

        customerRepository.save(customer);

        System.out.println("Customer signed up: " + customerSignupDto);
    }
}