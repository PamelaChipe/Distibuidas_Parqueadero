package ec.edu.espe.zone_core.controller;

import ec.edu.espe.zone_core.dto.ZoneRequestDto;
import ec.edu.espe.zone_core.dto.ZoneResponseDto;
import ec.edu.espe.zone_core.service.ZoneServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/zones")
@RequiredArgsConstructor
public class ZoneController {

    private final ZoneServices zoneServices;

    @PostMapping
    public ResponseEntity<ZoneResponseDto> createZone(@Valid @RequestBody ZoneRequestDto dto) {
        ZoneResponseDto created = zoneServices.createZone(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public List<ZoneResponseDto> getAllZones() {
        return zoneServices.getAllZones();
    }

    @GetMapping("/{id}")
    public ZoneResponseDto getZoneById(@PathVariable UUID id) {
        try {
            return zoneServices.getZoneById(id);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }

    @PutMapping("/{id}")
    public ZoneResponseDto updateZone(@PathVariable UUID id, @Valid @RequestBody ZoneRequestDto dto) {
        try {
            return zoneServices.updateZone(id, dto);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteZone(@PathVariable UUID id) {
        try {
            zoneServices.deleteZone(id);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }
}
