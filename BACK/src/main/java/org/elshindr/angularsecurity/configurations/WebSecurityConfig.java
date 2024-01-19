package org.elshindr.angularsecurity.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;
import java.util.Map;


/**
 * WebSecurityConfig
 * Configuration Globale de Spring Security
 */
@Configuration
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = false)
public class WebSecurityConfig implements WebMvcConfigurer {

    /**
     * Encodage des passwords user avec BCrypt
     * @return
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        String encodingId = "bcrypt";
        return new DelegatingPasswordEncoder(encodingId, Map.of(encodingId, new BCryptPasswordEncoder()));
    }


    @Bean
    CorsConfigurationSource corsConfigSource(){
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:4200/"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }


    /**
     * Mapping gestion du Cross Origin
     * @param //registry
     */
    /*
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200/")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .exposedHeaders("Authorization");
    }
*/

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JWTAuthorizationFilter jwtFilter, JWTConfig jwtConfig) throws Exception{

        /*
        http.authorizeHttpRequests(
                auth -> auth.requestMatchers(HttpMethod.GET,  "connexion/**").permitAll()
                            .requestMatchers(HttpMethod.POST, "connexion/**").permitAll()
                            .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                            .csrfTokenRequestHandler(new XorCsrfTokenRequestAttributeHandler()::handle)
                )
                .headers( headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                            .logoutSuccessHandler((req, resp, auth) -> resp.setStatus(HttpStatus.OK.value()))
                            .deleteCookies(jwtConfig.getCookie())
                );

        return http.build();*/



        return http.build();
    }
}