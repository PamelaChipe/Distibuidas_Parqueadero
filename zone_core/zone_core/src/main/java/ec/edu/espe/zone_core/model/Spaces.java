package ec.edu.espe.zone_core.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.util.UUID;

@Entity
@Table(name = "spaces")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Spaces {

    @Id
    @ColumnDefault("gen_random_uuid()")
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 20, name = "codigo")
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "estado")
    private SpaceStatus status;

    @Column(name = "reservado")
    private boolean isReserved;

    @Column(name = "prioridad")
    private Integer priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }
}
