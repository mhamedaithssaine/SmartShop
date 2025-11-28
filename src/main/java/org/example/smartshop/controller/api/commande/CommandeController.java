package org.example.smartshop.controller.api.commande;

import jakarta.validation.Valid;
import org.example.smartshop.dto.api.reponse.ApiRetour;
import org.example.smartshop.dto.request.CommandeRequest;
import org.example.smartshop.dto.response.CommandeResponse;
import org.example.smartshop.model.enums.CommandeStatut;
import org.example.smartshop.service.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;


    @PostMapping
    public ResponseEntity<ApiRetour<CommandeResponse>> creerCommande(@Valid @RequestBody CommandeRequest request) {
        CommandeResponse response = commandeService.creerCommande(request);
        String message;

        if (response.getStatut().equals(CommandeStatut.REJECTED)) {
            message = "Stock insuffisant";
        } else {
            message = "Commande créée avec succès";
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiRetour.success(message, response));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiRetour<CommandeResponse>> getCommandeById(@PathVariable Long id) {
        CommandeResponse response = commandeService.findById(id);
        return ResponseEntity.ok(
                ApiRetour.success("Commande récupérée avec succès", response)
        );
    }
}