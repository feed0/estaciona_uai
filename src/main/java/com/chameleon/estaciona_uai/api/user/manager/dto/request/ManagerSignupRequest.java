package com.chameleon.estaciona_uai.api.user.manager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagerSignupRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Parking name is required")
    @Size(min = 2, max = 100, message = "Parking name must be between 2 and 100 characters")
    private String parkingName;

    @NotBlank(message = "Parking address is required")
    @Size(min = 5, max = 200, message = "Parking address must be between 5 and 200 characters")
    private String parkingAddress;

    @NotNull
    private Double hourlyPrice;
}