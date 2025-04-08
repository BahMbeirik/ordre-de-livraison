package com.ordre.livresion.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {
        // 1. Récupérer le header "Authorization"
        String authHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // 2. Vérifier s'il est présent et commence par "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwtToken = authHeader.substring(7);
            try {
                // 3. Extraire le username depuis le token
                username = jwtUtil.extractUsername(jwtToken);
            } catch (Exception e) {
                // En cas d'erreur de parsing ou de validation
                System.out.println("JWT token invalid or expired: " + e.getMessage());
            }
        }

        // 4. Si on a un username et pas encore d'authentification dans le contexte
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Charger l'utilisateur depuis la DB
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

            // 5. Vérifier la validité du token
            if (jwtUtil.validateToken(jwtToken, userDetails.getUsername())) {
                // Créer l'objet d'authentification
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Placer l'authentification dans le contexte de Spring Security
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 7. Poursuivre la chaîne de filtres
        filterChain.doFilter(request, response);
    }
}