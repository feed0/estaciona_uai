package com.chameleon.estaciona_uai.api.como_usar;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/como-usar")
public class ComoUsarController {

    private final ComoUsarService comoUsarService;

    public ComoUsarController(ComoUsarService comoUsarService) {
        this.comoUsarService = comoUsarService;
    }

    @GetMapping
    public ResponseEntity<String> hello(@RequestParam("number") int number) {
        String response = comoUsarService.comoUsar(new ComoUsarDto(number));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
