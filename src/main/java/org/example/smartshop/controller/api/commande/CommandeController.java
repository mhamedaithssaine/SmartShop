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

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;


    // 1) créer commande
    @PostMapping
    public ResponseEntity<ApiRetour<CommandeResponse>> creerCommande(@Valid @RequestBody CommandeRequest request) {

        CommandeResponse response = commandeService.creerCommande(request);

        String message = response.getStatut() == CommandeStatut.REJECTED
                ? "Commande créée mais rejetée (stock insuffisant)"
                : "Commande créée avec succès";

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiRetour.success(message, response));
    }

    // 2) get commande by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiRetour<CommandeResponse>> getCommandeById(@PathVariable Long id) {
        CommandeResponse response = commandeService.getCommandeById(id);
        return ResponseEntity.ok(
                ApiRetour.success("Détails de la commande récupérés avec succès", response)
        );
    }

    // 3) Historique des commandes
    @GetMapping("/client/{customerId}")
    public ResponseEntity<ApiRetour<List<CommandeResponse>>> getCommandesByCustomer(@PathVariable Long customerId) {

        List<CommandeResponse> responses = commandeService.getCommandesByCustomer(customerId);
        return ResponseEntity.ok(
                ApiRetour.success("Historique des commandes du client récupéré avec succès", responses)
        );
    }

    // 4) confirmation  commande
    @PostMapping("/{id}/confirmer")
    public ResponseEntity<ApiRetour<CommandeResponse>> confirmerCommande(@PathVariable Long id) {

        CommandeResponse response = commandeService.confirmerCommande(id);
        return ResponseEntity.ok(
                ApiRetour.success("Commande confirmée avec succès", response)
        );
    }



    // annule commande
    @PostMapping("/{id}/annuler")
    public ResponseEntity<ApiRetour<CommandeResponse>> annulerCommande(@PathVariable Long id) {

        CommandeResponse response = commandeService.annulerCommande(id);
        return ResponseEntity.ok(
                ApiRetour.success("Commande annulée avec succès", response)
        );
    }
}