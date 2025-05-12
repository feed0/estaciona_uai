package com.chameleon.estaciona_uai.api.como_usar;

import org.springframework.stereotype.Service;

@Service
public class ComoUsarService {

    private static final String FRASE = "Como usar";

    public String comoUsar(ComoUsarDto comoUsarDto) {
        int comprimento = FRASE.length();
        int index = Math.abs(comoUsarDto.getNumber()) % comprimento;
        return Character.toString(FRASE.charAt(index));
    }
}
