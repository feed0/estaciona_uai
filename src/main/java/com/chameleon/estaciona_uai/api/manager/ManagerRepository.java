package com.chameleon.estaciona_uai.api.manager;

import com.chameleon.estaciona_uai.domain.user.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, UUID> {
}
