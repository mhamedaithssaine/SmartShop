package org.example.smartshop.config.security;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.smartshop.exception.ForbiddenException;
import org.example.smartshop.exception.UnauthorizedException;
import org.example.smartshop.model.enums.UserRole;
import org.example.smartshop.util.SessionUtil;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        String path = request.getRequestURI();
        String method = request.getMethod();

        if (isPublicPath(path, method)) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session == null) {
            throw new UnauthorizedException("Vous devez être connecté pour accéder à cette ressource");
        }

        Object userIdObj = session.getAttribute(SessionUtil.SESSION_USER_ID);
        if (userIdObj == null) {
            throw new UnauthorizedException("Vous devez être connecté pour accéder à cette ressource");
        }

        UserRole role = (UserRole) session.getAttribute(SessionUtil.SESSION_USER_ROLE);

        if (path.startsWith("/api/customers")) {
            requireAdmin(role);
            return true;
        }

        if (path.startsWith("/api/products")) {
            if ("GET".equalsIgnoreCase(method)) {
                return true;
            }
            requireAdmin(role);
            return true;
        }

        if (path.startsWith("/api/commandes")) {
            if ("GET".equalsIgnoreCase(method)) {
                return true;
            } else {
                requireAdmin(role);
                return true;
            }
        }

        if (isPaymentPath(path)) {
            requireAdmin(role);
            return true;
        }

        if (path.startsWith("/api/promo-codes")) {
            requireAdmin(role);
            return true;
        }

        if(path.startsWith("/api/users")){
            requireAdmin(role);
            return true;
        }

        return true;
    }


    // aide
    private boolean isPublicPath(String path, String method) {
        if ("/api/auth/login".equals(path) && "POST".equalsIgnoreCase(method)) {
            return true;
        }

        return false;
    }

    private boolean isPaymentPath(String path) {
        if (path.matches("^/api/commandes/\\d+/paiements.*$")) {
            return true;
        }
        if (path.startsWith("/api/paiements")) {
            return true;
        }
        return false;
    }

    private void requireAdmin(UserRole role) {
        if (role != UserRole.ADMIN) {
            throw new ForbiddenException("Accès refusé : rôle ADMIN requis");
        }
    }
}