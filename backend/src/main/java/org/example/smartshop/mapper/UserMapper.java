package org.example.smartshop.mapper;

import org.example.smartshop.dto.response.UserResponse;
import org.example.smartshop.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "customer.id", target = "customerId")
    UserResponse toResponse(User user);

    List<UserResponse> toResponse(List<User> users);
}
