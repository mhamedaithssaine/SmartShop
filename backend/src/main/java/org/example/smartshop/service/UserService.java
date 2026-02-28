package org.example.smartshop.service;

import org.example.smartshop.dto.request.UserRequest;
import org.example.smartshop.dto.response.UserResponse;
import org.example.smartshop.exception.ResourceNotFoundException;
import org.example.smartshop.exception.ValidationException;
import org.example.smartshop.mapper.UserMapper;
import org.example.smartshop.model.User;
import org.example.smartshop.model.enums.UserRole;
import org.example.smartshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    //create user
    public UserResponse create(UserRequest request){
        if(userRepository.existsByUsername(request.getUsername())){
            throw new ValidationException("Ce username est déja utilise ");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .role(UserRole.ADMIN)
                .build();
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    //find by id
    @Transactional(readOnly = true)
    public UserResponse findById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Utilisateur non trouve !"));

        return userMapper.toResponse(user);
    }

    // find all
    @Transactional(readOnly = true)
    public List<UserResponse> findAll(){
        List<User> users = userRepository.findAll();
        return userMapper.toResponse(users);
    }

    // update user
    public UserResponse update(Long id, UserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouve"));

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new ValidationException("Ce username est déja utilise");
        }

        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());

        user.setRole(UserRole.ADMIN);

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    // DELETE
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouve"));

        userRepository.delete(user);
    }

}
