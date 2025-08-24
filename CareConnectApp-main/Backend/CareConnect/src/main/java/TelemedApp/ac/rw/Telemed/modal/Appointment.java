package TelemedApp.ac.rw.Telemed.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import java.util.UUID;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Appointment {
    @Id
    private UUID id = UUID.randomUUID();
    private String date;
    private String time;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonBackReference("patient-appointments")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    @JsonBackReference("doctor-appointments")
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @OneToMany(mappedBy = "appointment")
    @JsonManagedReference("appointment-results")
    private Set<TestResult> testResults = new HashSet<>();

    // Getters and Setters
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

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}
