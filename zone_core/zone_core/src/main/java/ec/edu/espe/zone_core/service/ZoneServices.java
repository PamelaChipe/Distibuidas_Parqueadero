//refactorizar esta clase
// esta implementa en zona service implements
//implementación de dependencias por constructor


package ec.edu.espe.zone_core.service;

import java.util.List;
import java.util.UUID;
import ec.edu.espe.zone_core.dto.ZoneRequestDto;
import ec.edu.espe.zone_core.dto.ZoneResponseDto;

public interface ZoneServices {

    ZoneResponseDto createZone(ZoneRequestDto zone);
    ZoneResponseDto updateZone(UUID id, ZoneRequestDto zone);
    void deleteZone(UUID id);

    List<ZoneResponseDto> getAllZones();

    ZoneResponseDto getZoneById(UUID id);
} 