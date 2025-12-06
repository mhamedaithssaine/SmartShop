package org.example.smartshop.util;

import jakarta.servlet.http.HttpSession;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.example.smartshop.exception.ForbiddenException;
import org.example.smartshop.exception.UnauthorizedException;
import org.example.smartshop.model.enums.UserRole;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class SessionUtil {

    public static final String SESSION_USER_ID = "USER_ID";
    public static final String SESSION_USER_ROLE = "USER_ROLE";
    public static final String SESSION_CUSTOMER_ID = "CUSTOMER_ID";

    public static Long requireUserId(HttpSession session) {
        Object userId = session.getAttribute(SESSION_USER_ID);
        if (userId == null) {
            throw new UnauthorizedException("Vous devez être connecté pour accéder à cette ressource");
        }
        return (Long) userId;
    }

    public static UserRole getCurrentRole(HttpSession session) {
        Object roleObj = session.getAttribute(SESSION_USER_ROLE);
        return roleObj != null ? (UserRole) roleObj : null;
    }

    public static Long getCurrentCustomerId(HttpSession session) {
        Object customerId = session.getAttribute(SESSION_CUSTOMER_ID);
        return customerId != null ? (Long) customerId : null;
    }
}