package com.chameleon.estaciona_uai.domain.parking.parking_space;

import com.chameleon.estaciona_uai.domain.parking.Parking;
import com.chameleon.estaciona_uai.domain.user.Admin;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "parking_space")
public class ParkingSpace {

    @Id
    @GeneratedValue
    private UUID id;

    private String identifier;

    @ManyToOne(optional = false)
    private Parking parking;

    @Enumerated(EnumType.STRING)
    private ParkingSpaceStatus status = ParkingSpaceStatus.FREE;

    private LocalDateTime deletedAt;

    @Version
    private long version;

    /* ---------- domain helpers ---------- */

    public void assertFree() {
        if (isDeleted()) {
            throw new IllegalStateException("DELETED");
        }
        if (status != ParkingSpaceStatus.FREE) {
            throw new IllegalStateException("NOT_FREE");
        }
    }

    public void validateOwnership(Admin admin) {
        if (isDeleted()) {
            throw new IllegalStateException("DELETED");
        }
        if (!parking.getManager().equals(admin.getManager())) {
            throw new SecurityException("NOT_OWNER");
        }
    }

    public void softDelete() { this.deletedAt = LocalDateTime.now(); }

    private boolean isDeleted() { return deletedAt != null; }
}
