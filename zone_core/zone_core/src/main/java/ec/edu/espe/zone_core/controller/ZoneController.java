package ec.edu.espe.zone_core.controller;

import ec.edu.espe.zone_core.dto.ZoneRequestDto;
import ec.edu.espe.zone_core.dto.ZoneResponseDto;
import ec.edu.espe.zone_core.service.ZoneServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/zones")
@RequiredArgsConstructor
public class ZoneController {

    private final ZoneServices zoneServices;

    @GetMapping
    public ResponseEntity<List<ZoneResponseDto>> getAllZones() {
        return ResponseEntity.ok(zoneServices.getAllZones());
    }

    @PostMapping
    public ResponseEntity<ZoneResponseDto> createZone(@RequestBody ZoneRequestDto request) {
        return ResponseEntity.ok(zoneServices.createZone(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ZoneResponseDto> updateZone(@PathVariable UUID id,
                                                      @RequestBody ZoneRequestDto request) {
        return ResponseEntity.ok(zoneServices.updateZone(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteZone(@PathVariable UUID id) {
        zoneServices.deleteZone(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ZoneResponseDto> getZoneById(@PathVariable UUID id) {
        return ResponseEntity.ok(zoneServices.getZoneById(id));
    }
}
