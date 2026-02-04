package ec.edu.espe.zone_core.service;

import ec.edu.espe.zone_core.dto.ZoneRequestDto;
import ec.edu.espe.zone_core.dto.ZoneResponseDto;

import java.util.List;
import java.util.UUID;

public interface ZoneServices {
    ZoneResponseDto createZone(ZoneRequestDto dto);

    ZoneResponseDto updateZone(UUID id, ZoneRequestDto dto);

    void deleteZone(UUID id);

    List<ZoneResponseDto> getAllZones();

    ZoneResponseDto getZoneById(UUID id);
}
