package org.example.smartshop.service;

import org.example.smartshop.dto.request.ProductRequest;
import org.example.smartshop.dto.response.ProductResponse;
import org.example.smartshop.exception.ResourceNotFoundException;
import org.example.smartshop.mapper.ProductMapper;
import org.example.smartshop.model.Product;
import org.example.smartshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    // Créer un produit
    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = productMapper.toEntity(request);
        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

    // Liste Produit
    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return productRepository.findByIsDeletedFalse()
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Modifier un produit
    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec l'ID: " + id));

        product.setNom(request.getNom());
        product.setPrixUnitaire(request.getPrixUnitaire());
        product.setStockDisponible(request.getStockDisponible());
        product.setCategorie(request.getCategorie());

        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

}