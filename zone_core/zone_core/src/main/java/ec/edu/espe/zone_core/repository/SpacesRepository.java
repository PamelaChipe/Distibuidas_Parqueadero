package ec.edu.espe.zone_core.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import ec.edu.espe.zone_core.model.Spaces;

public interface SpacesRepository extends JpaRepository<Spaces, UUID> {

    List<Spaces> findByZoneId(UUID id);
    


}
