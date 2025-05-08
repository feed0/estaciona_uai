package com.chameleon.estaciona_uai.domain.parking;

import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpace;
import com.chameleon.estaciona_uai.domain.user.Manager;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "parkings")
public class Parking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @OneToOne
    private Manager manager;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ParkingSpace> parkingSpaces;

    private LocalTime openAt;
    private LocalTime closeAt;

    private String address;

    private String documentation;
}
