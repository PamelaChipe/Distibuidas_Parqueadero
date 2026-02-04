package ec.edu.espe.zone_core.service.impl;

import ec.edu.espe.zone_core.dto.SpaceResponseDto;
import ec.edu.espe.zone_core.dto.SpacesRequestDto;
import ec.edu.espe.zone_core.messaging.NotificactionProducer;
import ec.edu.espe.zone_core.model.Spaces;
import ec.edu.espe.zone_core.model.Zone;
import ec.edu.espe.zone_core.repository.SpacesRepository;
import ec.edu.espe.zone_core.repository.ZoneRepository;
import ec.edu.espe.zone_core.service.SpacesService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.hibernate.sql.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpacesServicesImpl implements SpacesService {

        private final NotificactionProducer notificactionProducer;
        private final SpacesRepository spacesRepository;
        private final ZoneRepository zoneRepository;
        // inyección de dependencias utilizando constructores vacios
        /*
         * public SpacesServicesImpl() {
         * zoneRepository = null;
         * }
         */

        @Override
        public SpaceResponseDto createSpace(SpacesRequestDto dto) {

                Zone zone = zoneRepository.findById(dto.getIdZone())
                                .orElseThrow(() -> new RuntimeException("Zone not found"));

                boolean normalizedReserved = normalizeReserved(dto.getStatus(), dto.isReserved());

                Spaces objSpace = Spaces.builder()
                                .code(dto.getCodigo())
                                .status(dto.getStatus())
                                .isReserved(normalizedReserved)
                                .priority(dto.getPriority())
                                .zone(zone)
                                .build();

                Spaces savedSpaces = spacesRepository.save(objSpace);
                adjustZoneCapacityOnCreate(zone, savedSpaces);
                System.out.println(">>> Enviando notificación al microservicio: ID=" + savedSpaces.getId() + ", CODE="
                                + savedSpaces.getCode());
                notificactionProducer.sendSpaceCreated(savedSpaces.getId(), savedSpaces.getCode());
                System.out.println(">>> Notificación enviada exitosamente al Producer.");
                // ---
                return convertToDto(savedSpaces);
        }

        @Override
        public SpaceResponseDto updateSpace(UUID id, SpacesRequestDto dto) {

                Zone zone = zoneRepository.findById(dto.getIdZone())
                                .orElseThrow(() -> new EntityNotFoundException("Zona no encontrada con id"));

                Spaces objSpaces = spacesRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado"));

                Zone previousZone = objSpaces.getZone();
                boolean wasBlocking = isBlockingCapacity(objSpaces);

                boolean normalizedReserved = normalizeReserved(dto.getStatus(), dto.isReserved());

                objSpaces.setCode(dto.getCodigo());
                objSpaces.setStatus(dto.getStatus());
                objSpaces.setReserved(normalizedReserved);
                objSpaces.setPriority(dto.getPriority());
                objSpaces.setZone(zone);

                Spaces updated = spacesRepository.save(objSpaces);
                adjustZoneCapacityOnUpdate(previousZone, zone, wasBlocking, updated);
                notificactionProducer.sendSpaceUpdated(updated.getId(), updated.getCode());
                return convertToDto(updated);
        }

        @Override
        public void deleteSpace(UUID id) {
                Spaces objSpaces = spacesRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Space not found"));

                spacesRepository.delete(objSpaces);
                adjustZoneCapacityOnDelete(objSpaces.getZone(), objSpaces);
                notificactionProducer.sendSpaceDeleted(objSpaces.getId(), objSpaces.getCode());
        }

        @Override
        public List<SpaceResponseDto> getAllSpaces() {
                /*
                 * spacesRepository.findAll().stream()
                 * .map (spaces -> convertToDto(spaces))
                 * .collect(Collectors.toList());
                 */

                // devuelve un listado, stream permite interacturar un arreglo como se pueda un
                // arreglo
                return spacesRepository.findAll().stream()
                                // actua en cada uno de los objetos realizado la operacion del convert
                                .map(this::convertToDto)
                                // recolecta en un listado
                                .collect(Collectors.toList());
        }

        @Override
        public SpaceResponseDto getSpaceById(UUID id) {

                Spaces objSpaces = spacesRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Space not found"));

                return convertToDto(objSpaces);
        }

        private SpaceResponseDto convertToDto(Spaces objSpace) {
                return SpaceResponseDto.builder()
                                .id(objSpace.getId())
                                .codigo(objSpace.getCode())
                                .status(objSpace.getStatus())
                                .isReserved(objSpace.isReserved())
                                .priority(objSpace.getPriority())
                                .idZone(objSpace.getZone().getId())
                                .zoneName(objSpace.getZone().getName())
                                .build();
        }

        private boolean isBlockingCapacity(Spaces space) {
                return space.isReserved() || space.getStatus() == ec.edu.espe.zone_core.model.SpaceStatus.OCCUPIED;
        }

        private boolean normalizeReserved(ec.edu.espe.zone_core.model.SpaceStatus status, boolean isReserved) {
                return status == ec.edu.espe.zone_core.model.SpaceStatus.OCCUPIED ? false : isReserved;
        }

        private void adjustZoneCapacityOnCreate(Zone zone, Spaces space) {
                if (isBlockingCapacity(space)) {
                        updateZoneAvailableCapacity(zone, -1);
                }
        }

        private void adjustZoneCapacityOnUpdate(Zone previousZone, Zone newZone, boolean wasBlocking, Spaces updated) {
                boolean isBlocking = isBlockingCapacity(updated);

                if (!previousZone.getId().equals(newZone.getId())) {
                        if (wasBlocking) {
                                updateZoneAvailableCapacity(previousZone, 1);
                        }
                        if (isBlocking) {
                                updateZoneAvailableCapacity(newZone, -1);
                        }
                        return;
                }

                if (wasBlocking && !isBlocking) {
                        updateZoneAvailableCapacity(newZone, 1);
                } else if (!wasBlocking && isBlocking) {
                        updateZoneAvailableCapacity(newZone, -1);
                }
        }

        private void adjustZoneCapacityOnDelete(Zone zone, Spaces space) {
                if (isBlockingCapacity(space)) {
                        updateZoneAvailableCapacity(zone, 1);
                }
        }

        private void updateZoneAvailableCapacity(Zone zone, int delta) {
                int totalCapacity = zone.getCapacity() != null ? zone.getCapacity() : 0;
                Integer currentAvailable = zone.getAvailableCapacity();
                if (currentAvailable == null) {
                        currentAvailable = totalCapacity;
                }
                int newAvailable = Math.max(0, Math.min(totalCapacity, currentAvailable + delta));
                zone.setAvailableCapacity(newAvailable);
                zoneRepository.save(zone);
        }
}
