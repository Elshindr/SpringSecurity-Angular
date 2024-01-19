package org.elshindr.angularsecurity.controllers;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.elshindr.angularsecurity.configurations.JWTConfig;
import org.elshindr.angularsecurity.dtos.LoginDto;
import org.elshindr.angularsecurity.models.Response;
import org.elshindr.angularsecurity.models.User;
import org.elshindr.angularsecurity.repositories.UserRepository;
import org.elshindr.angularsecurity.services.UsersService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

/**
 * AuthentifcationController
 * Controller de Création de compte et d'Authentification
 */
@RestController
@RequestMapping("connexion")
public class AuthentifcationController {

    private UserRepository userRepo;
    private PasswordEncoder pwdEncoder;
    private JWTConfig jwtConfig;
    private UsersService userSvc;

    public AuthentifcationController(JWTConfig jwtConfig, UserRepository userRepo, PasswordEncoder pwdEncoder, UsersService userSvc){
        this.userRepo = userRepo;
        this.pwdEncoder = pwdEncoder;
        this.userSvc = userSvc;
        this.jwtConfig = jwtConfig;
    }


    ///
    /// SE CONNECTER
    ///

    @GetMapping("/connexion")
    public ResponseEntity<?> connexion(HttpServletRequest request) {
         String xsrfToken = request.getHeader("X-XSRF-TOKEN");

         HttpHeaders headers = new HttpHeaders();
         headers.add("X-XSRF-TOKEN", xsrfToken);


        return ResponseEntity.ok().headers(headers).body(new Response("Connexion trouvée"));
    }


    @PostMapping("/connexion")
    public ResponseEntity<?>  getLogin(@RequestBody LoginDto loginDto){

        System.out.println("===================== GET LOGIN /connexion");
        System.out.println(loginDto.toString());


        return this.userRepo.findDistinctByEmail(loginDto.getEmail())
                .filter(user -> pwdEncoder.matches(loginDto.getPassword(), user.getPassword()))
                .map(user -> {

                    this.userSvc.setUserCur(user);

                    HttpHeaders headers = new HttpHeaders();
                    headers.add(HttpHeaders.SET_COOKIE, buildJWTCookie(user));
                    return ResponseEntity.ok().headers(headers).body(user);//.build();

                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }


    /**
     * Construction du cookie d'authentification selon un user connecté donné
     *
     * @param user utilisateur connecté.
     * @return cookie sous la forme d'une chaîne de caractères
     */
    private String buildJWTCookie(User user) {

        Keys.secretKeyFor(SignatureAlgorithm.HS512);

        String jetonJWT = Jwts.builder()
                .setSubject(user.getEmail())
                .addClaims(Map.of("roles", user.getRoles()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpireIn() * 1000))
                .signWith(jwtConfig.getSecretKey())
                .compact();

        ResponseCookie tokenCookie = ResponseCookie.from(jwtConfig.getCookie(), jetonJWT)
                .httpOnly(true)
                .maxAge(jwtConfig.getExpireIn() * 1000)
                .path("/")
                .build();

        return tokenCookie.toString();
    }



    ///
    /// SE CREER UN COMPTE
    ///

    @GetMapping("/inscription")
    public ResponseEntity<?> inscription() {
        return ResponseEntity.ok().body(new Response("Inscription trouvée"));
    }


    @PostMapping("/inscription")
    public ResponseEntity<?>  create(@RequestBody User newUser){
        System.out.println("===================== CREATE /inscription");
        User user = this.userSvc.create(newUser);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response("Erreur à la création de l'utilisateur"));
        }

        return ResponseEntity.ok().body(new Response("OK"));
    }



    ///
    /// SE DECO
    ///

    @PostMapping("/logout")
    public ResponseEntity<?>  logout(){
        System.out.println("===================== DECONNEXION ");

        return ResponseEntity.ok().body(new Response("Déconnecté"));
    }

}
