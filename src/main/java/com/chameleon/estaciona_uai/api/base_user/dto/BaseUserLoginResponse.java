package com.chameleon.estaciona_uai.api.base_user.dto;

import com.chameleon.estaciona_uai.domain.user.UserType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class BaseUserLoginResponse {

    @NotNull(message = "UUID is required.")
    private UUID userId;

    @NotNull
    @NotEmpty
    @Enumerated(EnumType.STRING)
    private UserType userType;
}