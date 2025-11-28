package org.example.smartshop.mapper;

import org.example.smartshop.dto.response.CommandeLigneResponse;
import org.example.smartshop.dto.response.CommandeResponse;
import org.example.smartshop.model.Commande;
import org.example.smartshop.model.CommandeLigne;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommandeMapper {

    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.nom", target = "customerNom")
    @Mapping(source = "customer.tier", target = "customerTier")
    CommandeResponse toResponse(Commande commande);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.nom", target = "productNom")
    CommandeLigneResponse toLigneResponse(CommandeLigne ligne);
}