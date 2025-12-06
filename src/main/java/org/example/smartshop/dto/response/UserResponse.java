package org.example.smartshop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Data;
import org.example.smartshop.model.enums.UserRole;

import java.time.LocalDateTime;

@Data
@Builder
@JsonPropertyOrder({
        "id",
        "username",
        "lastLoginAt",
        "lastLogoutAt",
        "role",
        "customerId"
})

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private Long id;
    private String username;
    private LocalDateTime lastLoginAt;
    private LocalDateTime lastLogoutAt;
    private UserRole role ;
    private Long customerId;
}
