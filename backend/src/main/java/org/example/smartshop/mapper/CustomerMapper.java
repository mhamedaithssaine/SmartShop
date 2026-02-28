package org.example.smartshop.mapper;

import org.example.smartshop.dto.request.CustomerRequest;
import org.example.smartshop.dto.response.CustomerResponse;
import org.example.smartshop.model.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CustomerMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tier", constant = "BASIC")
    @Mapping(target = "totalOrders", constant = "0")
    @Mapping(target = "totalSpent", expression = "java(java.math.BigDecimal.ZERO)")
    @Mapping(target = "firstOrderDate", ignore = true)
    @Mapping(target = "lastOrderDate", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Customer toEntity(CustomerRequest dto);

    CustomerResponse toResponse(Customer customer);


}
