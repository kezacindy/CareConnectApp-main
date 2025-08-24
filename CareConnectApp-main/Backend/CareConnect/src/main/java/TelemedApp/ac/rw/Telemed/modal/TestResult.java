package TelemedApp.ac.rw.Telemed.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class TestResult {
    @Id
    private UUID id = UUID.randomUUID();  // Generate a random UUID for each instance
    private String testName;
    private String result;

    @ManyToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "id")
    @JsonBackReference("appointment-results")  // Add unique reference name
    private Appointment appointment;

    @Enumerated(EnumType.STRING)
    private TestResultStatus status;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public TestResultStatus getStatus() {
        return status;
    }

    public void setStatus(TestResultStatus status) {
        this.status = status;
    }
}
