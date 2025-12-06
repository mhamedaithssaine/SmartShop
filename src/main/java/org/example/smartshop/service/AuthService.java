package org.example.smartshop.service;

import org.example.smartshop.dto.request.LoginRequest;
import org.example.smartshop.dto.response.UserResponse;
import org.example.smartshop.exception.UnauthorizedException;
import org.example.smartshop.mapper.UserMapper;
import org.example.smartshop.model.User;
import org.example.smartshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    public User authenticate(LoginRequest request){
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(()-> new UnauthorizedException("Identifiants invalides "));

        if(!user.getPassword().equals(request.getPassword())){
            throw new UnauthorizedException("Le mots de passe incorrecte !");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        return user;
    }

    public void markLogout(Long userId) {
        if (userId == null) return;

        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLogoutAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    public UserResponse toResponse(User user) {
        return userMapper.toResponse(user);
    }


}
