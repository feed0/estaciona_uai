package com.chameleon.estaciona_uai.api.base_user;

import com.chameleon.estaciona_uai.api.base_user.dto.BaseUserLoginRequest;
import com.chameleon.estaciona_uai.api.base_user.dto.BaseUserLoginResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/base-users")
public class BaseUserController {

    private final BaseUserService baseUserService;

    @Autowired
    public BaseUserController(BaseUserService baseUserService) {
        this.baseUserService = baseUserService;
    }

    @PostMapping("/login")
    public ResponseEntity<BaseUserLoginResponse> login(@Valid @RequestBody BaseUserLoginRequest loginDto) {
        BaseUserLoginResponse userType = baseUserService.login(loginDto.getEmail(), loginDto.getPassword());
        return ResponseEntity.ok(userType);
    }
}