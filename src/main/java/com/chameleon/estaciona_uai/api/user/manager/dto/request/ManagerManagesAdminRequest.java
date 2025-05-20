package com.chameleon.estaciona_uai.api.user.manager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagerManagesAdminRequest {

    @NotEmpty @NotNull
    private String name;

    @Email @NotEmpty @NotNull
    private String email;

    @NotEmpty @NotNull
    private String password;
}