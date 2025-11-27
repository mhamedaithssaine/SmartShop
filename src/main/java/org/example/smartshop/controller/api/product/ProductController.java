package org.example.smartshop.controller.api.product;
import jakarta.validation.Valid;
import org.example.smartshop.dto.api.reponse.ApiRetour;
import org.example.smartshop.dto.request.ProductRequest;
import org.example.smartshop.dto.response.ProductResponse;
import org.example.smartshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;


    @PostMapping
    public ResponseEntity<ApiRetour<ProductResponse>> create(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiRetour.success("Produit créé avec succès", response));
    }

    @GetMapping
    public ResponseEntity<ApiRetour<List<ProductResponse>>> getAllProducts() {
        List<ProductResponse> products = productService.findAll();
        return ResponseEntity.ok(
                ApiRetour.success("Liste des produits récupérée avec succès", products)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiRetour<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        ProductResponse response = productService.update(id, request);
        return ResponseEntity.ok(
                ApiRetour.success("Produit mis à jour avec succès", response)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiRetour<Void>> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(
                ApiRetour.success("Produit supprimé avec succès")
        );
    }


}