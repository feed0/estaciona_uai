package com.chameleon.estaciona_uai.api.manager.dto.response;

import com.chameleon.estaciona_uai.domain.user.Admin;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ManagerManagesAdminResponse {
    private UUID id;
    private String name;
    private String email;

    public static ManagerManagesAdminResponse fromEntity(Admin admin) {
        ManagerManagesAdminResponse response = new ManagerManagesAdminResponse();
        response.setId(admin.getId());
        response.setName(admin.getName());
        response.setEmail(admin.getEmail());
        return response;
    }
}