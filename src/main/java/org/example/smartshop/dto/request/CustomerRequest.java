package org.example.smartshop.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CustomerRequest {
    @NotBlank(message = "Le nom du client est obligatoire")
    private String nom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$", message = "Format de téléphone marocain invalide")
    private String telephone;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Au moins 6 caractères")
    private String password;
}
