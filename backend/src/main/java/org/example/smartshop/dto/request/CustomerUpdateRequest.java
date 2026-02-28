package org.example.smartshop.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CustomerUpdateRequest {
    @NotBlank(message = "Le nom du client est obligatoire")
    private String nom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$", message = "Format de téléphone marocain invalide")
    private String telephone;

    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;
}