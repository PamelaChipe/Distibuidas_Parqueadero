package ec.edu.espe.zone_core.repository;

import ec.edu.espe.zone_core.model.Spaces;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpacesRepository extends JpaRepository<Spaces, UUID> {
    List<Spaces> findByZoneId(UUID zoneId);
}
