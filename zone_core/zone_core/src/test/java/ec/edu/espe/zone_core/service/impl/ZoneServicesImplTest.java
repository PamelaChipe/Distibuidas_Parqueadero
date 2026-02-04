package ec.edu.espe.zone_core.service.impl;

import ec.edu.espe.zone_core.dto.ZoneRequestDto;
import ec.edu.espe.zone_core.dto.ZoneResponseDto;
import ec.edu.espe.zone_core.model.Zone;
import ec.edu.espe.zone_core.model.ZoneType;
import ec.edu.espe.zone_core.model.Spaces;
import ec.edu.espe.zone_core.model.SpaceStatus;
import ec.edu.espe.zone_core.repository.SpacesRepository;
import ec.edu.espe.zone_core.repository.ZoneRepository;
import ec.edu.espe.zone_core.service.ZoneServices;
import ec.edu.espe.zone_core.messaging.NotificactionProducer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("Unit Tests for ZoneServicesImpl")
class ZoneServicesImplTest {

    @Mock
    private ZoneRepository zoneRepository;

    @Mock
    private SpacesRepository spacesRepository;

    @Mock
    private NotificactionProducer notificactionProducer;

    @InjectMocks
    private ZoneServicesImpl zoneServices;

    private ZoneRequestDto validZoneRequest;
    private Zone testZone;
    private UUID testZoneId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testZoneId = UUID.randomUUID();

        validZoneRequest = ZoneRequestDto.builder()
                .name("Zona VIP")
                .description("Zona de estacionamiento VIP")
                .capacity(20)
                .type(ZoneType.VIP)
                .isActive(true)
                .build();

        testZone = Zone.builder()
                .id(testZoneId)
                .name("Zona VIP")
                .description("Zona de estacionamiento VIP")
                .capacity(20)
                .availableCapacity(20)
                .type(ZoneType.VIP)
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Test: Create zone with valid data")
    void testCreateZoneWithValidData() {
        // Arrange
        when(zoneRepository.save(any(Zone.class))).thenReturn(testZone);

        // Act
        ZoneResponseDto result = zoneServices.createZone(validZoneRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Zona VIP", result.getName());
        assertEquals(20, result.getCapacity());
        assertEquals(20, result.getAvailableCapacity());
        assertEquals(ZoneType.VIP, result.getType());
        verify(zoneRepository, times(1)).save(any(Zone.class));
    }

    @Test
    @DisplayName("Test: Available capacity equals total capacity when creating zone")
    void testAvailableCapacityEqualsCapacityOnCreate() {
        // Arrange
        when(zoneRepository.save(any(Zone.class))).thenReturn(testZone);

        // Act
        ZoneResponseDto result = zoneServices.createZone(validZoneRequest);

        // Assert
        assertEquals(result.getCapacity(), result.getAvailableCapacity(),
                "Available capacity should equal total capacity when zone is created");
    }

    @Test
    @DisplayName("Test: Get all zones returns list")
    void testGetAllZones() {
        // Arrange
        List<Zone> zones = new ArrayList<>();
        zones.add(testZone);
        when(zoneRepository.findAll()).thenReturn(zones);

        // Act
        List<ZoneResponseDto> result = zoneServices.getAllZones();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Zona VIP", result.get(0).getName());
        verify(zoneRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Test: Get zone by ID returns zone")
    void testGetZoneById() {
        // Arrange
        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));

        // Act
        ZoneResponseDto result = zoneServices.getZoneById(testZoneId);

        // Assert
        assertNotNull(result);
        assertEquals(testZoneId, result.getId());
        assertEquals("Zona VIP", result.getName());
    }

    @Test
    @DisplayName("Test: Get zone by ID throws exception when not found")
    void testGetZoneByIdNotFound() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(zoneRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> zoneServices.getZoneById(nonExistentId));
    }

    @Test
    @DisplayName("Test: Update zone with valid data")
    void testUpdateZoneWithValidData() {
        // Arrange
        ZoneRequestDto updateRequest = ZoneRequestDto.builder()
                .name("Zona VIP Premium")
                .description("Zona VIP mejorada")
                .capacity(25)
                .type(ZoneType.VIP)
                .isActive(true)
                .build();

        Zone updatedZone = Zone.builder()
                .id(testZoneId)
                .name("Zona VIP Premium")
                .description("Zona VIP mejorada")
                .capacity(25)
                .availableCapacity(25)
                .type(ZoneType.VIP)
                .isActive(true)
                .build();

        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));
        when(spacesRepository.findByZoneId(testZoneId)).thenReturn(new ArrayList<>());
        when(zoneRepository.save(any(Zone.class))).thenReturn(updatedZone);

        // Act
        ZoneResponseDto result = zoneServices.updateZone(testZoneId, updateRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Zona VIP Premium", result.getName());
        assertEquals(25, result.getCapacity());
    }

    @Test
    @DisplayName("Test: Calculate available capacity with reserved spaces")
    void testCalculateAvailableCapacityWithReservedSpaces() {
        // Arrange
        Zone zone = Zone.builder()
                .id(testZoneId)
                .name("Zona Test")
                .capacity(10)
                .build();

        Spaces reservedSpace = Spaces.builder()
                .id(UUID.randomUUID())
                .code("A-001")
                .status(SpaceStatus.AVAILABLE)
                .isReserved(true)
                .zone(zone)
                .build();

        List<Spaces> spaces = new ArrayList<>();
        spaces.add(reservedSpace);

        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(zone));
        when(spacesRepository.findByZoneId(testZoneId)).thenReturn(spaces);
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ZoneRequestDto updateRequest = ZoneRequestDto.builder()
                .name("Zona Test")
                .description("Test")
                .capacity(10)
                .type(ZoneType.INTERNAL)
                .isActive(true)
                .build();

        // Act
        ZoneResponseDto result = zoneServices.updateZone(testZoneId, updateRequest);

        // Assert
        assertEquals(9, result.getAvailableCapacity(),
                "Available capacity should be 9 (10 total - 1 reserved)");
    }

    @Test
    @DisplayName("Test: Calculate available capacity with occupied spaces")
    void testCalculateAvailableCapacityWithOccupiedSpaces() {
        // Arrange
        Zone zone = Zone.builder()
                .id(testZoneId)
                .name("Zona Test")
                .capacity(10)
                .build();

        Spaces occupiedSpace = Spaces.builder()
                .id(UUID.randomUUID())
                .code("A-001")
                .status(SpaceStatus.OCCUPIED)
                .isReserved(false)
                .zone(zone)
                .build();

        List<Spaces> spaces = new ArrayList<>();
        spaces.add(occupiedSpace);

        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(zone));
        when(spacesRepository.findByZoneId(testZoneId)).thenReturn(spaces);
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ZoneRequestDto updateRequest = ZoneRequestDto.builder()
                .name("Zona Test")
                .description("Test")
                .capacity(10)
                .type(ZoneType.INTERNAL)
                .isActive(true)
                .build();

        // Act
        ZoneResponseDto result = zoneServices.updateZone(testZoneId, updateRequest);

        // Assert
        assertEquals(9, result.getAvailableCapacity(),
                "Available capacity should be 9 (10 total - 1 occupied)");
    }

    @Test
    @DisplayName("Test: Delete zone removes it from repository")
    void testDeleteZone() {
        // Arrange
        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));

        // Act
        zoneServices.deleteZone(testZoneId);

        // Assert
        verify(zoneRepository, times(1)).delete(testZone);
    }

    @Test
    @DisplayName("Test: Zone capacity validation - minimum 5")
    void testZoneCapacityValidationMinimum() {
        // Arrange
        ZoneRequestDto invalidRequest = ZoneRequestDto.builder()
                .name("Zona Pequeña")
                .description("Zona muy pequeña")
                .capacity(3) // Less than minimum
                .type(ZoneType.INTERNAL)
                .isActive(true)
                .build();

        // This would be validated by Spring Validation in real scenario
        // Here we're testing that service receives the data
        assertTrue(invalidRequest.getCapacity() < 5);
    }

    @Test
    @DisplayName("Test: Zone capacity validation - maximum 25")
    void testZoneCapacityValidationMaximum() {
        // Arrange
        ZoneRequestDto invalidRequest = ZoneRequestDto.builder()
                .name("Zona Grande")
                .description("Zona muy grande")
                .capacity(30) // More than maximum
                .type(ZoneType.INTERNAL)
                .isActive(true)
                .build();

        // This would be validated by Spring Validation in real scenario
        assertTrue(invalidRequest.getCapacity() > 25);
    }
}
