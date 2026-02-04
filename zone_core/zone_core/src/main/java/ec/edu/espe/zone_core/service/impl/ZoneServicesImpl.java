package ec.edu.espe.zone_core.service.impl;

import ec.edu.espe.zone_core.dto.ZoneRequestDto;
import ec.edu.espe.zone_core.dto.ZoneResponseDto;
import ec.edu.espe.zone_core.messaging.NotificactionProducer;
import ec.edu.espe.zone_core.model.Zone;
import ec.edu.espe.zone_core.model.Spaces;
import ec.edu.espe.zone_core.repository.SpacesRepository;
import ec.edu.espe.zone_core.repository.ZoneRepository;
import ec.edu.espe.zone_core.service.ZoneServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ZoneServicesImpl implements ZoneServices {

    private final NotificactionProducer notificactionProducer;
    private final ZoneRepository zoneRepository;
    private final SpacesRepository spacesRepository;

    @Override
    public ZoneResponseDto createZone(ZoneRequestDto dto) {
        Zone zone = Zone.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .capacity(dto.getCapacity())
                .availableCapacity(dto.getCapacity())
                .isActive(dto.getIsActive())
                .type(dto.getType())
                .build();

        Zone saved = zoneRepository.save(zone);
        notificactionProducer.sendZoneCreated(saved.getId(), saved.getName());
        return convertToDto(saved);
    }

    @Override
    public ZoneResponseDto updateZone(UUID id, ZoneRequestDto dto) {

        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        zone.setName(dto.getName());
        zone.setDescription(dto.getDescription());
        zone.setCapacity(dto.getCapacity());
        zone.setIsActive(dto.getIsActive());
        zone.setType(dto.getType());

        zone.setAvailableCapacity(calculateAvailableCapacity(zone, dto.getCapacity()));

        Zone updated = zoneRepository.save(zone);
        notificactionProducer.sendZoneUpdated(updated.getId(), updated.getName());
        return convertToDto(updated);
    }

    @Override
    public void deleteZone(UUID id) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zone not found"));
        zoneRepository.delete(zone);
        notificactionProducer.sendZoneDeleted(zone.getId(), zone.getName());
    }

    @Override
    public List<ZoneResponseDto> getAllZones() {
        return zoneRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public ZoneResponseDto getZoneById(UUID id) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zone not found"));
        return convertToDto(zone);
    }

    private ZoneResponseDto convertToDto(Zone objSpace) {
        return ZoneResponseDto.builder()
                .id(objSpace.getId())
                .name(objSpace.getName())
                .description(objSpace.getDescription())
                .capacity(objSpace.getCapacity())
                .availableCapacity(objSpace.getAvailableCapacity())
                .isActive(objSpace.getIsActive())
                .type(objSpace.getType())
                .build();
    }

    private Integer calculateAvailableCapacity(Zone zone, Integer newCapacity) {
        int capacityValue = newCapacity != null ? newCapacity : 0;
        long blocked = spacesRepository.findByZoneId(zone.getId()).stream()
                .filter(space -> space.isReserved()
                        || space.getStatus() == ec.edu.espe.zone_core.model.SpaceStatus.OCCUPIED)
                .count();
        return Math.max(0, capacityValue - (int) blocked);
    }
}
