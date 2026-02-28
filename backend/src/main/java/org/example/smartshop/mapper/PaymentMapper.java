package org.example.smartshop.mapper;

import org.example.smartshop.dto.response.PaymentResponse;
import org.example.smartshop.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(source = "commande.id", target = "commandeId")
    @Mapping(target = "montantRestantCommande", ignore = true)
    PaymentResponse toResponse(Payment payment);

    List<PaymentResponse> toResponses(List<Payment> payments);
}