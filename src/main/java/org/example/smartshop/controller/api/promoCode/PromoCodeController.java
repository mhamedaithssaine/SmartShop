package org.example.smartshop.controller.api.promoCode;

import jakarta.validation.Valid;
import org.example.smartshop.dto.api.reponse.ApiRetour;
import org.example.smartshop.dto.request.PromoCodeRequest;
import org.example.smartshop.dto.response.PromoCodeResponse;
import org.example.smartshop.service.PromoCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promo-codes")
public class PromoCodeController {

    @Autowired
    private PromoCodeService promoCodeService;


    @PostMapping
    public ResponseEntity<ApiRetour<PromoCodeResponse>> create(@Valid @RequestBody PromoCodeRequest request) {
        PromoCodeResponse response = promoCodeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiRetour.success("Code promo créé avec succès", response));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiRetour<PromoCodeResponse>> getPromoCodeById(@PathVariable Long id) {
        PromoCodeResponse response = promoCodeService.findById(id);
        return ResponseEntity.ok(
                ApiRetour.success("Code promo récupéré avec succès", response)
        );
    }


    @GetMapping("/code/{code}")
    public ResponseEntity<ApiRetour<PromoCodeResponse>> getPromoCodeByCode(@PathVariable String code) {
        PromoCodeResponse response = promoCodeService.findByCode(code);
        return ResponseEntity.ok(
                ApiRetour.success("Code promo récupéré avec succès", response)
        );
    }


    @GetMapping
    public ResponseEntity<ApiRetour<List<PromoCodeResponse>>> getAllPromoCodes() {
        List<PromoCodeResponse> promoCodes = promoCodeService.findAll();
        return ResponseEntity.ok(
                ApiRetour.success("Liste des codes promo récupérée avec succès", promoCodes)
        );
    }


    @GetMapping("/actifs")
    public ResponseEntity<ApiRetour<List<PromoCodeResponse>>> getActivePromoCodes() {
        List<PromoCodeResponse> promoCodes = promoCodeService.findActivePromoCodes();
        return ResponseEntity.ok(
                ApiRetour.success("Codes promo actifs récupérés", promoCodes)
        );
    }


    @GetMapping("/valides")
    public ResponseEntity<ApiRetour<List<PromoCodeResponse>>> getValidPromoCodes() {
        List<PromoCodeResponse> promoCodes = promoCodeService.findValidPromoCodes();
        return ResponseEntity.ok(
                ApiRetour.success("Codes promo valides récupérés", promoCodes)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiRetour<PromoCodeResponse>> updatePromoCode(
            @PathVariable Long id,
            @Valid @RequestBody PromoCodeRequest request) {

        PromoCodeResponse response = promoCodeService.update(id, request);
        return ResponseEntity.ok(
                ApiRetour.success("Code promo mis à jour avec succès", response)
        );
    }


    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiRetour<PromoCodeResponse>> toggleActivePromoCode(@PathVariable Long id) {
        PromoCodeResponse response = promoCodeService.toggleActive(id);
        return ResponseEntity.ok(
                ApiRetour.success("Statut du code promo modifié", response)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiRetour<Void>> deletePromoCode(@PathVariable Long id) {
        promoCodeService.delete(id);
        return ResponseEntity.ok(
                ApiRetour.success("Code promo supprimé avec succès")
        );
    }
}