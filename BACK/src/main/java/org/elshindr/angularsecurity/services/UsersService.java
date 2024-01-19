package org.elshindr.angularsecurity.services;

import jakarta.persistence.EntityNotFoundException;
import org.elshindr.angularsecurity.configurations.WebSecurityConfig;
import org.elshindr.angularsecurity.models.User;
import org.elshindr.angularsecurity.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsersService {

    @Autowired
    private UserRepository userRepo;
    private PasswordEncoder pwdEncoder;
    private User userCur;


    public UsersService(WebSecurityConfig wbSecurtyConf){
        this.pwdEncoder = wbSecurtyConf.passwordEncoder();
    }


    public User create(User newUser){
        System.out.println("SERVICE AUTH CREATE");
        //System.out.println(newUser.toString());

        //System.out.println(this.userRepo.findAll().stream().filter(u -> u.getEmail().equals(newUser.getEmail())).toList().isEmpty());
        if(newUser != null && !newUser.getEmail().isEmpty() && this.userRepo.findAll().stream().filter(u -> u.getEmail().equals(newUser.getEmail())).toList().isEmpty()){
            User user = new User(newUser.getLastname(), newUser.getFirstname(), this.pwdEncoder.encode(newUser.getPassword()), newUser.getEmail(), null);

            this.userRepo.save(user);
            return user;
        }


        return null;
    }



    public Boolean deleteProfil(Integer id){

        try {

            this.userRepo.getReferenceById(id).setRoles(null);
            this.userRepo.deleteById(id);
            System.out.println(this.userRepo.getReferenceById(id));

            // Si la référence est null, l'utilisateur a été supprimé avec succès
            if (this.userRepo.getReferenceById(id) == null) {
                return true;
            }

            return false;
        } catch (EntityNotFoundException e) {
            // Gérer l'exception EntityNotFoundException
            return true;
        }
    }

    public Boolean updateProfil(Integer id, User user){

            this.userRepo.getReferenceById(id).setRoles(user.getRoles());
            this.userRepo.save(user);

            // Si la référence null,  supprimé avec succès
            if (this.userRepo.getReferenceById(id) == null) {
                return true;
            }

            return false;

    }

    /**
     * Getter et Setter userCur
     */

    public User getUserCur() {
        return userCur;
    }

    public void setUserCur(User userCur) {
        this.userCur = userCur;
    }
}
