package ec.edu.espe.zone_core.repository;

import ec.edu.espe.zone_core.model.Zone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ZoneRepository extends JpaRepository<Zone, UUID> {
}
