package ec.edu.espe.zone_core.controller;

import ec.edu.espe.zone_core.dto.SpaceResponseDto;
import ec.edu.espe.zone_core.dto.SpacesRequestDto;
import ec.edu.espe.zone_core.service.SpacesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/spaces")
public class SpacesController{

    @Autowired
    private SpacesService spacesService;

    @GetMapping("/")
    public ResponseEntity<List<SpaceResponseDto>> getAllSpaces() {
        return ResponseEntity.ok(spacesService.getAllSpaces());
    }

    @PostMapping("/")
    public ResponseEntity<SpaceResponseDto> createSpaces(@RequestBody SpacesRequestDto request) {
        return ResponseEntity.ok(spacesService.createSpace(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpaceResponseDto> updateSpaces(@PathVariable UUID id, @RequestBody SpacesRequestDto request) {
        return ResponseEntity.ok(spacesService.updateSpace(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSpace(@PathVariable UUID id) {
        spacesService.deleteSpace(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Space deleted successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpaceResponseDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(spacesService.getSpaceById(id));
    }
}
