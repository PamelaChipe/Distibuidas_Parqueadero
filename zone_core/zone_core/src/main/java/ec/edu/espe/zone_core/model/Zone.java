package ec.edu.espe.zone_core.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.UUID;

@Entity
@Table(name = "zonas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Zone {

    @Id
    @ColumnDefault("gen_random_uuid()")
    @Generated
    private UUID id;

    @Column(length = 25, nullable = false, unique = true, name = "nombre")
    private String name;

    @Column(nullable = false, name = "descripcion")
    private String description;

    @Column(nullable = false, name = "capacidad")
    private Integer capacity;

    @Column(name = "estado")
    private Boolean isActive;

    @Column(nullable = false, name = "tipo")
    @Enumerated(EnumType.STRING)
    private ZoneType type;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }
}
