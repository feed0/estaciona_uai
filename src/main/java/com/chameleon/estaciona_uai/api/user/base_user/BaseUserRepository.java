package com.chameleon.estaciona_uai.api.user.base_user;

import com.chameleon.estaciona_uai.domain.user.BaseUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BaseUserRepository extends JpaRepository<BaseUser, UUID> {
    Optional<BaseUser> findByEmail(String email);
}