package com.chameleon.estaciona_uai.domain.parking;

import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpace;
import com.chameleon.estaciona_uai.domain.user.Manager;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "parking")
public class Parking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Parking name is required")
    @Size(min = 2, max = 100, message = "Parking name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 200, message = "Address must be between 5 and 200 characters")
    private String address;

    @OneToOne
    private Manager manager;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ParkingSpace> parkingSpaces;

    private LocalTime openAt;
    private LocalTime closeAt;

    private String documentation;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
