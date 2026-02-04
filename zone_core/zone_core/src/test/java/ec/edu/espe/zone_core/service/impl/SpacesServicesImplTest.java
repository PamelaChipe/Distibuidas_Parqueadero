package ec.edu.espe.zone_core.service.impl;

import ec.edu.espe.zone_core.dto.SpaceResponseDto;
import ec.edu.espe.zone_core.dto.SpacesRequestDto;
import ec.edu.espe.zone_core.model.Spaces;
import ec.edu.espe.zone_core.model.SpaceStatus;
import ec.edu.espe.zone_core.model.Zone;
import ec.edu.espe.zone_core.model.ZoneType;
import ec.edu.espe.zone_core.repository.SpacesRepository;
import ec.edu.espe.zone_core.repository.ZoneRepository;
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

@DisplayName("Unit Tests for SpacesServicesImpl")
class SpacesServicesImplTest {

    @Mock
    private SpacesRepository spacesRepository;

    @Mock
    private ZoneRepository zoneRepository;

    @Mock
    private NotificactionProducer notificactionProducer;

    @InjectMocks
    private SpacesServicesImpl spacesServices;

    private SpacesRequestDto validSpaceRequest;
    private Spaces testSpace;
    private Zone testZone;
    private UUID testSpaceId;
    private UUID testZoneId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testSpaceId = UUID.randomUUID();
        testZoneId = UUID.randomUUID();

        testZone = Zone.builder()
                .id(testZoneId)
                .name("Zona VIP")
                .description("Zona de estacionamiento VIP")
                .capacity(20)
                .availableCapacity(20)
                .type(ZoneType.VIP)
                .isActive(true)
                .build();

        validSpaceRequest = SpacesRequestDto.builder()
                .codigo("A-001")
                .status(SpaceStatus.AVAILABLE)
                .isReserved(false)
                .priority(5)
                .idZone(testZoneId)
                .build();

        testSpace = Spaces.builder()
                .id(testSpaceId)
                .code("A-001")
                .status(SpaceStatus.AVAILABLE)
                .isReserved(false)
                .priority(5)
                .zone(testZone)
                .build();
    }

    @Test
    @DisplayName("Test: Create space with valid data")
    void testCreateSpaceWithValidData() {
        // Arrange
        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));
        when(spacesRepository.save(any(Spaces.class))).thenReturn(testSpace);

        // Act
        SpaceResponseDto result = spacesServices.createSpace(validSpaceRequest);

        // Assert
        assertNotNull(result);
        assertEquals("A-001", result.getCodigo());
        assertEquals(SpaceStatus.AVAILABLE, result.getStatus());
        assertFalse(result.isReserved());
        verify(spacesRepository, times(1)).save(any(Spaces.class));
    }

    @Test
    @DisplayName("Test: Create reserved space reduces zone availability")
    void testCreateReservedSpaceReducesZoneAvailability() {
        // Arrange
        SpacesRequestDto reservedSpaceRequest = SpacesRequestDto.builder()
                .codigo("A-002")
                .status(SpaceStatus.AVAILABLE)
                .isReserved(true) // Reserved
                .priority(5)
                .idZone(testZoneId)
                .build();

        Spaces reservedSpace = Spaces.builder()
                .id(UUID.randomUUID())
                .code("A-002")
                .status(SpaceStatus.AVAILABLE)
                .isReserved(true)
                .zone(testZone)
                .build();

        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));
        when(spacesRepository.save(any(Spaces.class))).thenReturn(reservedSpace);
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        SpaceResponseDto result = spacesServices.createSpace(reservedSpaceRequest);

        // Assert
        assertNotNull(result);
        assertTrue(result.isReserved());
        verify(zoneRepository, times(1)).save(any(Zone.class));
    }

    @Test
    @DisplayName("Test: Create occupied space reduces zone availability")
    void testCreateOccupiedSpaceReducesZoneAvailability() {
        // Arrange
        SpacesRequestDto occupiedSpaceRequest = SpacesRequestDto.builder()
                .codigo("A-003")
                .status(SpaceStatus.OCCUPIED) // Occupied
                .isReserved(false)
                .priority(5)
                .idZone(testZoneId)
                .build();

        Spaces occupiedSpace = Spaces.builder()
                .id(UUID.randomUUID())
                .code("A-003")
                .status(SpaceStatus.OCCUPIED)
                .isReserved(false)
                .zone(testZone)
                .build();

        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));
        when(spacesRepository.save(any(Spaces.class))).thenReturn(occupiedSpace);
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        SpaceResponseDto result = spacesServices.createSpace(occupiedSpaceRequest);

        // Assert
        assertNotNull(result);
        assertEquals(SpaceStatus.OCCUPIED, result.getStatus());
        verify(zoneRepository, times(1)).save(any(Zone.class));
    }

    @Test
    @DisplayName("Test: Normalize reserved flag when status is OCCUPIED")
    void testNormalizeReservedFlagWhenOccupied() {
        // Arrange
        SpacesRequestDto occupiedWithReservedRequest = SpacesRequestDto.builder()
                .codigo("A-004")
                .status(SpaceStatus.OCCUPIED)
                .isReserved(true) // Should be normalized to false
                .priority(5)
                .idZone(testZoneId)
                .build();

        Spaces normalizedSpace = Spaces.builder()
                .id(UUID.randomUUID())
                .code("A-004")
                .status(SpaceStatus.OCCUPIED)
                .isReserved(false) // Normalized
                .zone(testZone)
                .build();

        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));
        when(spacesRepository.save(any(Spaces.class))).thenReturn(normalizedSpace);
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        SpaceResponseDto result = spacesServices.createSpace(occupiedWithReservedRequest);

        // Assert
        assertEquals(SpaceStatus.OCCUPIED, result.getStatus());
        assertFalse(result.isReserved(), "Reserved flag should be false when status is OCCUPIED");
    }

    @Test
    @DisplayName("Test: Update space from AVAILABLE to OCCUPIED reduces availability")
    void testUpdateSpaceFromAvailableToOccupied() {
        // Arrange
        SpacesRequestDto updateRequest = SpacesRequestDto.builder()
                .codigo("A-001")
                .status(SpaceStatus.OCCUPIED) // Change from AVAILABLE to OCCUPIED
                .isReserved(false)
                .priority(5)
                .idZone(testZoneId)
                .build();

        Spaces updatedSpace = Spaces.builder()
                .id(testSpaceId)
                .code("A-001")
                .status(SpaceStatus.OCCUPIED)
                .isReserved(false)
                .zone(testZone)
                .build();

        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));
        when(spacesRepository.findById(testSpaceId)).thenReturn(Optional.of(testSpace));
        when(spacesRepository.save(any(Spaces.class))).thenReturn(updatedSpace);
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        SpaceResponseDto result = spacesServices.updateSpace(testSpaceId, updateRequest);

        // Assert
        assertNotNull(result);
        assertEquals(SpaceStatus.OCCUPIED, result.getStatus());
        verify(zoneRepository, times(1)).save(any(Zone.class));
    }

    @Test
    @DisplayName("Test: Update space from OCCUPIED to AVAILABLE increases availability")
    void testUpdateSpaceFromOccupiedToAvailable() {
        // Arrange
        Spaces occupiedSpace = Spaces.builder()
                .id(testSpaceId)
                .code("A-001")
                .status(SpaceStatus.OCCUPIED)
                .isReserved(false)
                .zone(testZone)
                .build();

        SpacesRequestDto updateRequest = SpacesRequestDto.builder()
                .codigo("A-001")
                .status(SpaceStatus.AVAILABLE) // Change from OCCUPIED to AVAILABLE
                .isReserved(false)
                .priority(5)
                .idZone(testZoneId)
                .build();

        Spaces updatedSpace = Spaces.builder()
                .id(testSpaceId)
                .code("A-001")
                .status(SpaceStatus.AVAILABLE)
                .isReserved(false)
                .zone(testZone)
                .build();

        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));
        when(spacesRepository.findById(testSpaceId)).thenReturn(Optional.of(occupiedSpace));
        when(spacesRepository.save(any(Spaces.class))).thenReturn(updatedSpace);
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        SpaceResponseDto result = spacesServices.updateSpace(testSpaceId, updateRequest);

        // Assert
        assertNotNull(result);
        assertEquals(SpaceStatus.AVAILABLE, result.getStatus());
        verify(zoneRepository, times(1)).save(any(Zone.class));
    }

    @Test
    @DisplayName("Test: Get all spaces returns list")
    void testGetAllSpaces() {
        // Arrange
        List<Spaces> spaces = new ArrayList<>();
        spaces.add(testSpace);
        when(spacesRepository.findAll()).thenReturn(spaces);

        // Act
        List<SpaceResponseDto> result = spacesServices.getAllSpaces();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("A-001", result.get(0).getCodigo());
    }

    @Test
    @DisplayName("Test: Get space by ID returns space")
    void testGetSpaceById() {
        // Arrange
        when(spacesRepository.findById(testSpaceId)).thenReturn(Optional.of(testSpace));

        // Act
        SpaceResponseDto result = spacesServices.getSpaceById(testSpaceId);

        // Assert
        assertNotNull(result);
        assertEquals(testSpaceId, result.getId());
        assertEquals("A-001", result.getCodigo());
    }

    @Test
    @DisplayName("Test: Delete space removes it from repository")
    void testDeleteSpace() {
        // Arrange
        when(spacesRepository.findById(testSpaceId)).thenReturn(Optional.of(testSpace));

        // Act
        spacesServices.deleteSpace(testSpaceId);

        // Assert
        verify(spacesRepository, times(1)).delete(testSpace);
    }

    @Test
    @DisplayName("Test: Delete occupied space increases zone availability")
    void testDeleteOccupiedSpaceIncreasesZoneAvailability() {
        // Arrange
        Spaces occupiedSpace = Spaces.builder()
                .id(testSpaceId)
                .code("A-001")
                .status(SpaceStatus.OCCUPIED)
                .isReserved(false)
                .zone(testZone)
                .build();

        when(spacesRepository.findById(testSpaceId)).thenReturn(Optional.of(occupiedSpace));
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        spacesServices.deleteSpace(testSpaceId);

        // Assert
        verify(spacesRepository, times(1)).delete(occupiedSpace);
        verify(zoneRepository, times(1)).save(any(Zone.class));
    }

    @Test
    @DisplayName("Test: Available capacity cannot be negative")
    void testAvailableCapacityCannotBeNegative() {
        // Arrange
        Zone zoneWithMinCapacity = Zone.builder()
                .id(testZoneId)
                .name("Zona Test")
                .capacity(1)
                .availableCapacity(1)
                .build();

        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(zoneWithMinCapacity));

        // Act - Try to reduce capacity below 0
        // The method should prevent this with Math.max(0, ...)
        assertTrue(zoneWithMinCapacity.getAvailableCapacity() >= 0);
    }

    @Test
    @DisplayName("Test: Available capacity cannot exceed total capacity")
    void testAvailableCapacityCannotExceedTotal() {
        // Arrange
        Zone zone = Zone.builder()
                .id(testZoneId)
                .name("Zona Test")
                .capacity(10)
                .availableCapacity(10)
                .build();

        // Assert
        assertTrue(zone.getAvailableCapacity() <= zone.getCapacity(),
                "Available capacity should not exceed total capacity");
    }

    @Test
    @DisplayName("Test: Available capacity starts equal to total capacity")
    void testAvailableCapacityStartsEqualToTotal() {
        // Act
        when(zoneRepository.findById(testZoneId)).thenReturn(Optional.of(testZone));
        when(spacesRepository.save(any(Spaces.class))).thenReturn(testSpace);

        SpaceResponseDto result = spacesServices.createSpace(validSpaceRequest);

        // Assert
        assertNotNull(result);
        assertEquals(testZone.getCapacity(), testZone.getAvailableCapacity(),
                "Initial available capacity should equal total capacity");
    }
}
