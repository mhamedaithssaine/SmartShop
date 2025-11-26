package org.example.smartshop.repository;

import org.example.smartshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    boolean existsByUsername(String username);

}
