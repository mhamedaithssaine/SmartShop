package org.example.smartshop.mapper;

import org.example.smartshop.dto.request.PromoCodeRequest;
import org.example.smartshop.dto.response.PromoCodeResponse;
import org.example.smartshop.model.PromoCode;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PromoCodeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actif", constant = "true")
    @Mapping(target = "nombreUtilisations", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PromoCode toEntity(PromoCodeRequest request);

    @Mapping(target = "utilisable", expression = "java(promoCode.isUtilisable())")
    PromoCodeResponse toResponse(PromoCode promoCode);
}