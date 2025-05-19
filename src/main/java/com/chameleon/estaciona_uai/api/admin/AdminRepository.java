package com.chameleon.estaciona_uai.api.admin;

import com.chameleon.estaciona_uai.domain.user.Admin;
import com.chameleon.estaciona_uai.domain.user.Manager;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {
    List<Admin> findAllByManager(Manager manager);

    Optional<Admin> findByEmail(@Email @NotEmpty @NotNull String email);
}