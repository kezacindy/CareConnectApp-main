package TelemedApp.ac.rw.Telemed.dto;

import TelemedApp.ac.rw.Telemed.modal.Doctor;
import java.util.UUID;

public class DoctorDTO {
    private UUID id;
    private String name;
    private String specialization;
    private String email;

    public DoctorDTO(Doctor doctor) {
        this.id = doctor.getId();
        this.name = doctor.getName();
        this.specialization = doctor.getSpecialization();
        this.email = doctor.getEmail();
    }

    public UUID getId() {
        return id;
    }  
    public String getName() {
        return name;
    }
    public String getSpecialization() {
        return specialization;
    }
    public String getEmail() {
        return email;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    
}