package com.findmymeds.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class FindMyMedsApplication {

	public static void main(String[] args) {
		SpringApplication.run(FindMyMedsApplication.class, args);
	}
}
