package com.chameleon.estaciona_uai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EstacionaUaiApplication {

	public static void main(String[] args) {
		SpringApplication.run(EstacionaUaiApplication.class, args);
	}
}
