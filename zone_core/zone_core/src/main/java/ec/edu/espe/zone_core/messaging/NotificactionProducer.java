package ec.edu.espe.zone_core.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor

public class NotificactionProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private static final String ACTION_CREATE = "CREATE";
    private static final String ACTION_UPDATE = "UPDATE";
    private static final String ACTION_DELETE = "DELETE";
    private static final String ENTITY_ZONE = "ENTIDAD ZONA";
    private static final String ENTITY_SPACE = "ENTIDAD ESPACIO";
    private static final String SEVERITY_INFO = "INFO";
    private static final String SEVERITY_WARN = "WARN";
    private static final String SEVERITY_ERROR = "ERROR";

    public void sendNotification(String action,
                                 String entityType,
                                 UUID entityId,
                                 String message,
                                 String severity,
                                 Map<String, Object> data) {

        NotificationEvent event = NotificationEvent.builder()
                .id(UUID.randomUUID())
                .microservice("microservice - zonas")
                .action(action)
                .entityType(entityType)
                .entityId(String.valueOf(entityId))
                .message(message)
                .timestamp(LocalDateTime.now())
                .data(data != null ? data : new HashMap<>())
                .severity(severity)
                .build();

        try {
            log.debug("Sending Notification Event: {}", event);
            rabbitTemplate.convertAndSend("notifications.exchange", "notifications.routingkey", event);
            log.info("Notification enviada: {} - {}", action, event);
        } catch (Exception e){
            log.error("Error enviando Notification Event: {} - {}", action, event, e);

        }
    }

    public void sendZoneCreated(UUID idZone, String zoneName){
        Map<String, Object> data = new HashMap<>();
        data.put("idZone", idZone);
        data.put("zoneName", zoneName);
        data.put("IP", "localhost"); //agregar método para la ip
        data.put("HostName", "PC"); // agregar metodo para el hostname
        sendNotification(ACTION_CREATE, ENTITY_ZONE, idZone, zoneName, SEVERITY_INFO, data);
        log.info("Zone created: {} - {}", idZone, zoneName);
    }

    public void sendZoneUpdated(UUID idZone, String zoneName){
        Map<String, Object> data = new HashMap<>();
        data.put("idZone", idZone);
        data.put("zoneName", zoneName);
        sendNotification(ACTION_UPDATE, ENTITY_ZONE, idZone, zoneName, SEVERITY_WARN, data);
        log.info("Zone updated: {} - {}", idZone, zoneName);
    }

    public void sendZoneDeleted(UUID idZone,  String zoneName){
        Map<String, Object> data = new HashMap<>();
        data.put("idZone", idZone);
        data.put("IP", "localhost");
        data.put("HostName", "PC");
        sendNotification(ACTION_DELETE, ENTITY_ZONE, idZone, zoneName, SEVERITY_ERROR, data);
        log.info("Zone deleted: {}", idZone);
    }

    public void sendSpaceCreated(UUID idSpace, String zoneName){
        Map<String, Object> data = new HashMap<>();
        data.put("idSpace", idSpace);
        data.put("zoneName", zoneName);
        data.put("IP", "locakhost");
        data.put("HostName", "PC");
        sendNotification(ACTION_CREATE, ENTITY_SPACE, idSpace, zoneName, SEVERITY_INFO, data);
        log.info("Space creada: {} - {}", idSpace, zoneName);
    }

    public void sendSpaceUpdated(UUID idSpace, String zoneName){
        Map<String, Object> data = new HashMap<>();
        data.put("idSpace", idSpace);
        data.put("zoneName", zoneName);
        data.put("IP", "locakhost");
        data.put("HostName", "PC");
        sendNotification(ACTION_UPDATE, ENTITY_SPACE, idSpace, zoneName, SEVERITY_WARN, data);
        log.info("Space updated: {} - {}", idSpace, zoneName);
    }

    public void sendSpaceDeleted(UUID idSpace, String spaceName){
        Map<String, Object> data = new HashMap<>();
        data.put("idSpace", idSpace);
        data.put("spaceName", spaceName);
        data.put("IP", "locakhost");
        data.put("HostName", "PC");
        sendNotification(ACTION_DELETE, ENTITY_SPACE, idSpace, spaceName, SEVERITY_ERROR, data);
        log.info("Space deleted: {} - {}", idSpace, spaceName);
    }
}


// crear lo mismo en el microservicio de usuario, es decir notificación para cada entidad, en usuario y vehiculo,aproximadamente 12 operaciones


