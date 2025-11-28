package org.example.smartshop.repository;

import org.example.smartshop.model.CommandeLigne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandeLigneRepository extends JpaRepository<CommandeLigne, Long> {

}