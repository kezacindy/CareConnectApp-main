package TelemedApp.ac.rw.Telemed.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
public class MedicalRecord {
    @Id
    private UUID id = UUID.randomUUID();
    private String condition;
    private String treatment;
    private String notes;
    private LocalDateTime recordDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonBackReference("patient-records")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    @JsonBackReference  // Prevent serialization of the doctor object in the MedicalRecord context
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    private DiagnosisType diagnosisType;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDateTime recordDate) {
        this.recordDate = recordDate;
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

    public DiagnosisType getDiagnosisType() {
        return diagnosisType;
    }

    public void setDiagnosisType(DiagnosisType diagnosisType) {
        this.diagnosisType = diagnosisType;
    }
}
