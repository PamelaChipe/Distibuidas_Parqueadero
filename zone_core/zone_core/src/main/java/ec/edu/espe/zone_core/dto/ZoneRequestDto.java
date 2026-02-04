package ec.edu.espe.zone_core.dto;

import ec.edu.espe.zone_core.model.ZoneType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ZoneRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Capacity is required")
    @Min(value = 5, message = "Capacity must be at least 5")
    @Max(value = 25, message = "Capacity must not exceed 25")
    private Integer capacity;

    @NotNull(message = "Type is required")
    private ZoneType type;

    private Boolean isActive;
}
