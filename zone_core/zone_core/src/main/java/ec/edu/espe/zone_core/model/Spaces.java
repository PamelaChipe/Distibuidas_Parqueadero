package ec.edu.espe.zone_core.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.UUID;

@Entity
@Table(name = "espacios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Spaces {

    @Id
    @ColumnDefault("gen_random_uuid()")
    @Generated
    private UUID id;

    @Column(nullable = false, unique = true, name = "codigo", length = 10)
    private String code;

    @Column(nullable = false, name = "estado")
    @Enumerated(EnumType.STRING)
    private SpaceStatus status;

    @Column(name = "reservado")
    private boolean isReserved;

    @Column(name = "orden")
    private Integer priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_zone")
    private Zone zone;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }
}
