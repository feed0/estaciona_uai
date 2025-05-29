package com.chameleon.estaciona_uai.api.user.manager.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ManagerResponse {
    private UUID id;
    private String name;
    private String email;
}