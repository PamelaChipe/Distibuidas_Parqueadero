package ec.edu.espe.zone_core.dto;

import ec.edu.espe.zone_core.model.SpaceStatus;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data //creación aut. getters y stters
@Builder //instanciación de objetos
public class SpaceResponseDto {
        private String codigo;
        private SpaceStatus status;
        private boolean isReserved;
        private Integer priority;
        private UUID idZone;
        private UUID id;
        private String zoneName;
}
