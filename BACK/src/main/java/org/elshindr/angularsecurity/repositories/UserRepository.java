package org.elshindr.angularsecurity.repositories;

import org.elshindr.angularsecurity.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * UserRepository
 * Interface de récupération des données du model User via JPA
 */
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findDistinctByEmail(String email);
    Optional<User> findDistinctById(Integer id);
}
