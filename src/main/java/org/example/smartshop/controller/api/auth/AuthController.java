package org.example.smartshop.controller.api.auth;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.example.smartshop.dto.api.reponse.ApiRetour;
import org.example.smartshop.dto.request.LoginRequest;
import org.example.smartshop.dto.response.UserResponse;
import org.example.smartshop.model.User;
import org.example.smartshop.model.enums.UserRole;
import org.example.smartshop.service.AuthService;
import org.example.smartshop.util.SessionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    @Autowired
    private AuthService authService;

    // login
    @PostMapping("/login")
    public ResponseEntity<ApiRetour<UserResponse>> login(@Valid @RequestBody LoginRequest request, HttpSession session) {

        User user = authService.authenticate(request);

        session.setAttribute(SessionUtil.SESSION_USER_ID, user.getId());
        session.setAttribute(SessionUtil.SESSION_USER_ROLE, user.getRole());

        if (user.getCustomer() != null) {
            session.setAttribute(SessionUtil.SESSION_CUSTOMER_ID, user.getCustomer().getId());
        } else {
            session.removeAttribute(SessionUtil.SESSION_CUSTOMER_ID);
        }

        UserResponse body = authService.toResponse(user);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiRetour.success("Connexion réussie", body));
    }


    // logout
    @PostMapping("/logout")
    public ResponseEntity<ApiRetour<Void>> logout(HttpSession session) {

        Long userId = (Long) session.getAttribute(SessionUtil.SESSION_USER_ID);
        authService.markLogout(userId);

        session.invalidate();

        return ResponseEntity.ok(
                ApiRetour.success("Déconnexion réussie")
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiRetour<UserResponse>> me(HttpSession session) {

        Long userId = SessionUtil.requireUserId(session);
       UserRole role = SessionUtil.getCurrentRole(session);
        Long customerId = SessionUtil.getCurrentCustomerId(session);

        UserResponse dto = UserResponse.builder()
                .id(userId)
                .role(role)
                .customerId(customerId)
                .build();

        return ResponseEntity.ok(
                ApiRetour.success("Utilisateur courant", dto)
        );
    }

}
