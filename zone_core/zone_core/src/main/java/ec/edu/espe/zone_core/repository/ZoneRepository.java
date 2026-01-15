package ec.edu.espe.zone_core.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import ec.edu.espe.zone_core.model.Zone;

public interface ZoneRepository extends JpaRepository<Zone, UUID> {

}
