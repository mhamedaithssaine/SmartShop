package org.example.smartshop.service;

import org.example.smartshop.dto.request.CommandeLigneRequest;
import org.example.smartshop.dto.request.CommandeRequest;
import org.example.smartshop.dto.response.CommandeResponse;
import org.example.smartshop.exception.ValidationException;
import org.example.smartshop.mapper.CommandeMapper;
import org.example.smartshop.model.Commande;
import org.example.smartshop.model.Customer;
import org.example.smartshop.model.Product;
import org.example.smartshop.model.enums.CommandeStatut;
import org.example.smartshop.repository.CommandeRepository;
import org.example.smartshop.repository.CustomerRepository;
import org.example.smartshop.repository.ProductRepository;
import org.example.smartshop.service.auto.AutoCommandeProcessor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommandeServiceTest {

    @Mock
    private CommandeRepository commandeRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CommandeMapper commandeMapper;

    @Mock
    private AutoCommandeProcessor autoCommandeProcessor;

    @InjectMocks
    private CommandeService commandeService;

    private Customer customer;
    private Product product;

    @BeforeEach
    void setUp() {
        customer = Customer.builder()
                .id(1L)
                .nom("ilhaam")
                .email("ilhame@email.com")
                .telephone("0772060970")
                .build();

        product = Product.builder()
                .id(10L)
                .nom("M-1l")
                .prixUnitaire(BigDecimal.valueOf(12.24))
                .stockDisponible(10)
                .categorie("l'aux")
                .build();
    }

    @Test
    void creerCommande_stockSuffisant_retournePending() {
        Long customerId = 1L;
        Long productId = 10L;

        CommandeLigneRequest ligneRequest = CommandeLigneRequest.builder()
                .productId(productId)
                .quantite(2)
                .build();

        CommandeRequest request = CommandeRequest.builder()
                .customerId(customerId)
                .codePromo(null)
                .lignes(List.of(ligneRequest))
                .build();


        when(customerRepository.findById(customerId))
                .thenReturn(Optional.of(customer));

        when(productRepository.findByIdAndNotDeleted(productId))
                .thenReturn(Optional.of(product));


        when(autoCommandeProcessor.verifierStock(anyList()))
                .thenReturn(true);

        when(commandeRepository.save(any(Commande.class)))
                .thenAnswer(invocation -> {
                    Commande c = invocation.getArgument(0);
                    c.setId(100L);
                    return c;
                });

        when(commandeMapper.toResponse(any(Commande.class)))
                .thenAnswer(invocation -> {
                    Commande c = invocation.getArgument(0);
                    return CommandeResponse.builder()
                            .id(c.getId())
                            .customerId(c.getCustomer().getId())
                            .statut(c.getStatut())
                            .build();
                });

        doNothing().when(autoCommandeProcessor)
                .calculerMontants(any(Commande.class), eq(customer));

        CommandeResponse response = commandeService.creerCommande(request);

        assertThat(response.getStatut()).isEqualTo(CommandeStatut.PENDING);
        assertThat(response.getCustomerId()).isEqualTo(customerId);
        assertThat(response.getId()).isEqualTo(100L);

        verify(commandeRepository, times(1)).save(any(Commande.class));

        verify(autoCommandeProcessor, times(1))
                .calculerMontants(any(Commande.class), eq(customer));
    }

    @Test
    void creerCommande_sansLignes_leveValidationException() {
        CommandeRequest commandeRequest = CommandeRequest.builder()
                .customerId(1L)
                .codePromo(null)
                .lignes(List.of())
                .build();

        assertThrows(ValidationException.class,
                () -> commandeService.creerCommande(commandeRequest)
        );
        verify(commandeRepository, never()).save(any());
    }
}