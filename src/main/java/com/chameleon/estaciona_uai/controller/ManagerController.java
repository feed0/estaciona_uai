package com.chameleon.estaciona_uai.controller;

import com.chameleon.estaciona_uai.dto.ManagerSignupDto;
import com.chameleon.estaciona_uai.service.ManagerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String>signup(@RequestBody ManagerSignupDto managerSignupDto) {
        managerService.signup(managerSignupDto);
        return new ResponseEntity<>("Manager signed up successfully", HttpStatus.CREATED);
    }
}
