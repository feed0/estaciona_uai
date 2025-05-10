package com.chameleon.estaciona_uai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerSignupDto {
    private String name;
    private String email;
    private String password;
}