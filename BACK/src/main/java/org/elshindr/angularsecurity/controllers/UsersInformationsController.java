package org.elshindr.angularsecurity.controllers;

import org.elshindr.angularsecurity.configurations.JWTConfig;
import org.elshindr.angularsecurity.models.Response;
import org.elshindr.angularsecurity.models.User;
import org.elshindr.angularsecurity.repositories.UserRepository;
import org.elshindr.angularsecurity.services.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * UsersInformationsController
 * Controller de récupération et gestion des informations utilisateurs
 */
@RestController
public class UsersInformationsController {
    private UserRepository userRepo;
    private PasswordEncoder pwdEncoder;
    private JWTConfig jwtConfig;
    private UsersService userSvc;

    public UsersInformationsController(JWTConfig jwtConfig, UserRepository userRepo, PasswordEncoder pwdEncoder, UsersService userSvc){
        this.userRepo = userRepo;
        this.pwdEncoder = pwdEncoder;
        this.jwtConfig = jwtConfig;
        this.userSvc = userSvc;
    }


    @PostMapping("/profil")
    public ResponseEntity<?> getProfil(){
        return ResponseEntity.ok(userRepo.findDistinctByEmail(this.userSvc.getUserCur().getEmail()).get());
    }


    @PostMapping("/profil/all")
    @Secured({"ROLE_ADMIN", "ROLE_MODER"})
    public ResponseEntity<?> getAllProfils(){
        System.out.println("======== GET ALL PROFILS ======");

        return ResponseEntity.ok().body(userRepo.findAll());
    }

    @DeleteMapping("/profil/all/{id}")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> deleteProfil(@PathVariable Integer id){
        System.out.println("======== DELETE PROFIL ======");

        if(this.userSvc.deleteProfil(id)){
            return ResponseEntity.ok().body(userRepo.findAll());
        }

        return ResponseEntity.badRequest().body(new Response("Erreur dans la suppression! :( "));
    }

    @PutMapping("/profil/all/{id}")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> updateProfil(@PathVariable Integer id, @RequestBody User user){
        System.out.println("======== Update PROFIL ======");

        if(this.userSvc.updateProfil(id, user)){
            return  ResponseEntity.ok().body(userRepo.findAll());
        }

        return ResponseEntity.badRequest().body(new Response("Erreur à la mise à jour"));
    }

}
