package org.example.smartshop.controller.api.user;

import jakarta.validation.Valid;
import org.example.smartshop.dto.api.reponse.ApiRetour;
import org.example.smartshop.dto.request.UserRequest;
import org.example.smartshop.dto.response.UserResponse;
import org.example.smartshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping
    public ResponseEntity<ApiRetour<UserResponse>> create(@Valid @RequestBody UserRequest request) {
        UserResponse response = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiRetour.success("Utilisateur ADMIN créé avec succès", response));
    }


    @GetMapping
    public ResponseEntity<ApiRetour<List<UserResponse>>> getAll() {
        List<UserResponse> users = userService.findAll();
        return ResponseEntity.ok(
                ApiRetour.success("Liste des utilisateurs récupérée avec succès", users)
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiRetour<UserResponse>> getById(@PathVariable Long id) {
        UserResponse response = userService.findById(id);
        return ResponseEntity.ok(
                ApiRetour.success("Utilisateur récupéré avec succès", response)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiRetour<UserResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {

        UserResponse response = userService.update(id, request);
        return ResponseEntity.ok(
                ApiRetour.success("Utilisateur mis à jour avec succès", response)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiRetour<Void>> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(
                ApiRetour.success("Utilisateur supprimé avec succès")
        );
    }
}