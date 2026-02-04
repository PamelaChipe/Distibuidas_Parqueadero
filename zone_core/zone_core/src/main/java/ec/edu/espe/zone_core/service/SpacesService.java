package ec.edu.espe.zone_core.service;

import ec.edu.espe.zone_core.dto.SpaceResponseDto;
import ec.edu.espe.zone_core.dto.SpacesRequestDto;

import java.util.List;
import java.util.UUID;

public interface SpacesService {
    SpaceResponseDto createSpace(SpacesRequestDto dto);

    SpaceResponseDto updateSpace(UUID id, SpacesRequestDto dto);

    void deleteSpace(UUID id);

    List<SpaceResponseDto> getAllSpaces();

    SpaceResponseDto getSpaceById(UUID id);
}
