package com.chameleon.estaciona_uai.api.manager;

import com.chameleon.estaciona_uai.api.manager.dto.ManagerSignupRequest;
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
    public ResponseEntity<String>signup(@RequestBody ManagerSignupRequest managerSignupRequest) {
        managerService.signup(managerSignupRequest);
        return new ResponseEntity<>("Manager signed up successfully", HttpStatus.CREATED);
    }
}
