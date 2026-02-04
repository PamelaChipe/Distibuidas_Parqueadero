package ec.edu.espe.zone_core.messaging;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class NotificactionProducer {

    public void sendZoneCreated(UUID id, String name) {
        // no-op
    }

    public void sendZoneUpdated(UUID id, String name) {
        // no-op
    }

    public void sendZoneDeleted(UUID id, String name) {
        // no-op
    }

    public void sendSpaceCreated(UUID id, String code) {
        // no-op
    }

    public void sendSpaceUpdated(UUID id, String code) {
        // no-op
    }

    public void sendSpaceDeleted(UUID id, String code) {
        // no-op
    }
}
