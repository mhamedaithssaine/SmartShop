package org.example.smartshop.service;

import org.example.smartshop.dto.request.CustomerRequest;
import org.example.smartshop.dto.response.CustomerResponse;
import org.example.smartshop.exception.ValidationException;
import org.example.smartshop.mapper.CustomerMapper;
import org.example.smartshop.model.Customer;
import org.example.smartshop.model.User;
import org.example.smartshop.model.enums.UserRole;
import org.example.smartshop.repository.CustomerRepository;
import org.example.smartshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private UserRepository userRepository;

    // create Custmer
    @Transactional
    public CustomerResponse create(CustomerRequest request){
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Ce email existe déja !");
        }

        if (userRepository.existsByUsername(request.getEmail())) {
            throw new ValidationException("Ce username existe déja !");
        }

        User user = User.builder()
                .username(request.getEmail())
                .password(request.getPassword())
                .role(UserRole.CUSTOMER)
                .build();


        Customer customer = customerMapper.toEntity(request);
        customer.setUser(user);
        customer = customerRepository.save(customer);
        return customerMapper.toResponse(customer);


    }

}
