package com.niyat.ride;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;
import java.sql.SQLException;


@SpringBootApplication
public class RideApplication {
    public static void main(String[] args) {
        SpringApplication.run(RideApplication.class, args);
    }


}