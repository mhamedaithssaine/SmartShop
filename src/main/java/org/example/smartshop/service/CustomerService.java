package org.example.smartshop.service;

import org.example.smartshop.dto.request.CustomerRequest;
import org.example.smartshop.dto.request.CustomerUpdateRequest;
import org.example.smartshop.dto.response.CustomerResponse;
import org.example.smartshop.exception.ResourceNotFoundException;
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

    // get customer by id
    @Transactional
    public CustomerResponse findById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer non trouvé avec l'ID: " + id));
        return customerMapper.toResponse(customer);
    }

    // update
    @Transactional
    public CustomerResponse update(Long id, CustomerUpdateRequest  request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer non trouvé avec l'ID: " + id));

        if (!customer.getEmail().equals(request.getEmail()) && customerRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Ce email existe déjà !");
        }

        customer.setNom(request.getNom());
        customer.setEmail(request.getEmail());
        customer.setTelephone(request.getTelephone());

        if (!customer.getUser().getUsername().equals(request.getEmail())) {
            if (userRepository.existsByUsername(request.getEmail())) {
                throw new ValidationException("Ce username existe déjà !");
            }
            customer.getUser().setUsername(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            customer.getUser().setPassword(request.getPassword());
        }

        customer = customerRepository.save(customer);
        return customerMapper.toResponse(customer);
    }



}
