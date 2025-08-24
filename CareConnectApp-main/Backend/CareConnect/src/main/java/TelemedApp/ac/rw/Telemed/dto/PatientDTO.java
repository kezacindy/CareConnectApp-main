package TelemedApp.ac.rw.Telemed.dto;

import TelemedApp.ac.rw.Telemed.modal.Patient;
import java.util.UUID;

public class PatientDTO {
    private UUID id;
    private String name;
    private String email;

    public PatientDTO(Patient patient) {
        this.id = patient.getId();
        this.name = patient.getName();
        this.email = patient.getEmail();
    }

    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
} 