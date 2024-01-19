package org.elshindr.angularsecurity.dtos;

/**
 * LoginDto
 * Modele d'authentification par mail + pwd
 */
public class LoginDto {
    private String email;
    private String pwd;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return pwd;
    }

    public void setPassword(String password) {
        this.pwd = password;
    }

    @Override
    public String toString() {
        return "LoginDto{" +
                "email='" + email + '\'' +
                ", pwd='" + pwd + '\'' +
                '}';
    }
}
