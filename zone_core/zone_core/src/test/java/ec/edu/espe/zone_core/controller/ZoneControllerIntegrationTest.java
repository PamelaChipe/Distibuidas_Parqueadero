package ec.edu.espe.zone_core.controller;

import ec.edu.espe.zone_core.dto.ZoneRequestDto;
import ec.edu.espe.zone_core.model.ZoneType;
import ec.edu.espe.zone_core.model.Zone;
import ec.edu.espe.zone_core.repository.ZoneRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
@AutoConfigureMockMvc
@DisplayName("Integration Tests for ZoneController with Testcontainers")
class ZoneControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("db_parkin_zone_test")
            .withUsername("postgres")
            .withPassword("postgres");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ZoneRepository zoneRepository;

    private ZoneRequestDto validZoneRequest;

    @BeforeEach
    void setUp() {
        zoneRepository.deleteAll();

        validZoneRequest = ZoneRequestDto.builder()
                .name("Zona VIP Test")
                .description("Zona de estacionamiento VIP para pruebas")
                .capacity(20)
                .type(ZoneType.VIP)
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Test: POST /api/zones creates zone successfully")
    void testCreateZoneSuccessfully() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/zones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validZoneRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Zona VIP Test"))
                .andExpect(jsonPath("$.capacity").value(20))
                .andExpect(jsonPath("$.availableCapacity").value(20))
                .andExpect(jsonPath("$.type").value("VIP"));
    }

    @Test
    @DisplayName("Test: GET /api/zones returns all zones")
    void testGetAllZones() throws Exception {
        // Arrange - Create a zone first
        mockMvc.perform(post("/api/zones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validZoneRequest)));

        // Act & Assert
        mockMvc.perform(get("/api/zones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("Test: GET /api/zones/{id} returns specific zone")
    void testGetZoneById() throws Exception {
        // Arrange - Create a zone first
        Zone createdZone = Zone.builder()
                .name("Zona Internal")
                .description("Test zone")
                .capacity(15)
                .availableCapacity(15)
                .type(ZoneType.INTERNAL)
                .isActive(true)
                .build();
        Zone savedZone = zoneRepository.save(createdZone);

        // Act & Assert
        mockMvc.perform(get("/api/zones/" + savedZone.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedZone.getId().toString()))
                .andExpect(jsonPath("$.name").value("Zona Internal"))
                .andExpect(jsonPath("$.capacity").value(15))
                .andExpect(jsonPath("$.availableCapacity").value(15));
    }

    @Test
    @DisplayName("Test: PUT /api/zones/{id} updates zone successfully")
    void testUpdateZoneSuccessfully() throws Exception {
        // Arrange - Create a zone first
        Zone createdZone = Zone.builder()
                .name("Zona Original")
                .description("Original zone")
                .capacity(10)
                .availableCapacity(10)
                .type(ZoneType.EXTERNAL)
                .isActive(true)
                .build();
        Zone savedZone = zoneRepository.save(createdZone);

        ZoneRequestDto updateRequest = ZoneRequestDto.builder()
                .name("Zona Updated")
                .description("Updated zone")
                .capacity(25)
                .type(ZoneType.VIP)
                .isActive(true)
                .build();

        // Act & Assert
        mockMvc.perform(put("/api/zones/" + savedZone.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Zona Updated"))
                .andExpect(jsonPath("$.capacity").value(25));
    }

    @Test
    @DisplayName("Test: DELETE /api/zones/{id} deletes zone successfully")
    void testDeleteZoneSuccessfully() throws Exception {
        // Arrange - Create a zone first
        Zone createdZone = Zone.builder()
                .name("Zona to Delete")
                .description("Zone for deletion")
                .capacity(10)
                .availableCapacity(10)
                .type(ZoneType.INTERNAL)
                .isActive(true)
                .build();
        Zone savedZone = zoneRepository.save(createdZone);

        // Act & Assert
        mockMvc.perform(delete("/api/zones/" + savedZone.getId()))
                .andExpect(status().isNoContent());

        // Verify zone is deleted
        mockMvc.perform(get("/api/zones/" + savedZone.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test: Database persistence - zone saved correctly")
    void testZonePersistenceToDB() {
        // Arrange
        Zone zone = Zone.builder()
                .name("Persistent Zone")
                .description("Zone to persist")
                .capacity(20)
                .availableCapacity(20)
                .type(ZoneType.VIP)
                .isActive(true)
                .build();

        // Act
        Zone savedZone = zoneRepository.save(zone);

        // Assert
        Zone retrievedZone = zoneRepository.findById(savedZone.getId()).orElseThrow();
        assert retrievedZone.getName().equals("Persistent Zone");
        assert retrievedZone.getCapacity() == 20;
        assert retrievedZone.getAvailableCapacity() == 20;
    }

    @Test
    @DisplayName("Test: Available capacity is initialized correctly")
    void testAvailableCapacityInitialized() throws Exception {
        // Act
        mockMvc.perform(post("/api/zones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validZoneRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.capacity").value(validZoneRequest.getCapacity()))
                .andExpect(jsonPath("$.availableCapacity").value(validZoneRequest.getCapacity()));
    }

    @Test
    @DisplayName("Test: Zone capacity validation - invalid minimum capacity")
    void testZoneCapacityValidationMinimum() throws Exception {
        // Arrange
        ZoneRequestDto invalidRequest = ZoneRequestDto.builder()
                .name("Invalid Zone")
                .description("Invalid capacity")
                .capacity(3) // Less than minimum (5)
                .type(ZoneType.INTERNAL)
                .isActive(true)
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/zones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test: Zone capacity validation - invalid maximum capacity")
    void testZoneCapacityValidationMaximum() throws Exception {
        // Arrange
        ZoneRequestDto invalidRequest = ZoneRequestDto.builder()
                .name("Invalid Zone")
                .description("Invalid capacity")
                .capacity(30) // More than maximum (25)
                .type(ZoneType.INTERNAL)
                .isActive(true)
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/zones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test: Zone with missing required field returns error")
    void testZoneCreationWithMissingRequiredField() throws Exception {
        // Arrange
        String invalidJson = "{\"description\": \"Missing name\", \"capacity\": 10, \"type\": \"VIP\"}";

        // Act & Assert
        mockMvc.perform(post("/api/zones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}
