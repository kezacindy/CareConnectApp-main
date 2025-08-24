package TelemedApp.ac.rw.Telemed.dto;

import TelemedApp.ac.rw.Telemed.modal.Appointment;
import TelemedApp.ac.rw.Telemed.modal.AppointmentStatus;
import java.util.UUID;

public class AppointmentDTO {
    private UUID id;
    private String date;
    private String time;
    private AppointmentStatus status;
    private DoctorDTO doctor;
    private PatientDTO patient;

    public AppointmentDTO(Appointment appointment) {
        this.id = appointment.getId();
        this.date = appointment.getDate();
        this.time = appointment.getTime();
        this.status = appointment.getStatus();
        
        if (appointment.getDoctor() != null) {
            this.doctor = new DoctorDTO(appointment.getDoctor());
        }
        
        if (appointment.getPatient() != null) {
            this.patient = new PatientDTO(appointment.getPatient());
        }
    }

    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }
    public String getTime() {
        return time;
    }
    public void setTime(String time) {
        this.time = time;
    }   
    public AppointmentStatus getStatus() {
        return status;
    }
    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
    public DoctorDTO getDoctor() {
        return doctor;
    }
    public void setDoctor(DoctorDTO doctor) {
        this.doctor = doctor;
    }   
    public PatientDTO getPatient() {
        return patient;
    }
    public void setPatient(PatientDTO patient) {
        this.patient = patient;
    }


} 