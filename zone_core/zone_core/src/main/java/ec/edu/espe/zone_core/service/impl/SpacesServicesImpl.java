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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpacesServicesImpl implements SpacesService {

    @Autowired
    private NotificactionProducer notificactionProducer;

    //inyeccion de dependencias con autowired
    @Autowired
    private SpacesRepository spacesRepository;
    private final ZoneRepository zoneRepository;
    //inyección de dependencias utilizando constructores vacios
    /*public SpacesServicesImpl() {
        zoneRepository = null;
    }*/


    @Override
    public SpaceResponseDto createSpace(SpacesRequestDto dto) {

        Zone zone = zoneRepository.findById(dto.getIdZone())
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        Spaces objSpace =   Spaces.builder()
                .code(dto.getCodigo())
                .status(dto.getStatus())
                .isReserved(dto.isReserved())
                .priority(dto.getPriority())
                .zone(zone)
                .build();

        Spaces savedSpaces = spacesRepository.save(objSpace);
        System.out.println(">>> Enviando notificación al microservicio: ID=" + savedSpaces.getId() + ", CODE=" + savedSpaces.getCode());
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

        objSpaces.setCode(dto.getCodigo());
        objSpaces.setStatus(dto.getStatus());
        objSpaces.setPriority(dto.getPriority());
        objSpaces.setZone(zone);

        Spaces updated = spacesRepository.save(objSpaces);
        notificactionProducer.sendSpaceUpdated(updated.getId(), updated.getCode());
        return convertToDto(updated);
    }

    @Override
    public void deleteSpace(UUID id) {
        Spaces objSpaces = spacesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Space not found"));

        spacesRepository.delete(objSpaces);
        notificactionProducer.sendSpaceDeleted(objSpaces.getId(), objSpaces.getCode());
    }

    @Override
    public List<SpaceResponseDto> getAllSpaces() {
        /*spacesRepository.findAll().stream()
                .map (spaces -> convertToDto(spaces))
                .collect(Collectors.toList());*/

        //devuelve un listado, stream permite interacturar un arreglo como se pueda un arreglo
        return spacesRepository.findAll().stream()
                //actua en cada uno de los objetos realizado la operacion del convert
                .map(this::convertToDto)
                //recolecta en un listado
                .collect(Collectors.toList());
    }


    @Override
    public SpaceResponseDto getSpaceById(UUID id) {

        Spaces objSpaces = spacesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Space not found"));

        return convertToDto(objSpaces);
    }


    private SpaceResponseDto convertToDto(Spaces objSpace){
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
}
