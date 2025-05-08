package com.chameleon.estaciona_uai.domain.user;

import java.util.List;

import com.chameleon.estaciona_uai.domain.parking.Parking;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Manager extends BaseUser {
    @OneToOne(mappedBy = "manager", cascade = CascadeType.ALL)
    private Parking parking;

    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL)
    private List<Admin> admins;
}
