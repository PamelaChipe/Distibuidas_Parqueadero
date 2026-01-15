package ec.edu.espe.zone_core.service;

import ec.edu.espe.zone_core.dto.SpacesRequestDto;
import ec.edu.espe.zone_core.dto.SpaceResponseDto;

import ec.edu.espe.zone_core.model.Zone;

import java.util.List;
import java.util.UUID;


public interface SpacesService {

    SpaceResponseDto createSpace(SpacesRequestDto zone );
    SpaceResponseDto updateSpace(UUID id, SpacesRequestDto zone);

    void deleteSpace(UUID id);
    List<SpaceResponseDto> getAllSpaces();

    SpaceResponseDto getSpaceById(UUID id);

}
