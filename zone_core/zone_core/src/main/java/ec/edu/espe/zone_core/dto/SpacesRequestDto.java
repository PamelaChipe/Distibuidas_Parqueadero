package ec.edu.espe.zone_core.dto;

import ec.edu.espe.zone_core.model.SpaceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class SpacesRequestDto {

    @NotBlank(message = "Codigo is required")
    private String codigo;

    @NotNull(message = "Status is required")
    private SpaceStatus status;

    private boolean isReserved;

    private Integer priority;

    @NotNull(message = "Zone id is required")
    private UUID idZone;
}
