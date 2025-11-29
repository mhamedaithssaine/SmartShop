package org.example.smartshop.mapper;

import org.example.smartshop.dto.response.PaymentResponse;
import org.example.smartshop.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(source = "commande.id", target = "commandeId")
    @Mapping(source = "commande.customer.nom", target = "customerName")
    PaymentResponse toResponse(Payment payment);
}
