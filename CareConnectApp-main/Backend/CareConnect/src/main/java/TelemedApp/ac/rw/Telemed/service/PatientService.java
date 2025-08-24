package TelemedApp.ac.rw.Telemed.service;

import TelemedApp.ac.rw.Telemed.modal.Patient;
import TelemedApp.ac.rw.Telemed.modal.Appointment;
import TelemedApp.ac.rw.Telemed.modal.TestResult;
import TelemedApp.ac.rw.Telemed.repository.PatientRepository;
import TelemedApp.ac.rw.Telemed.repository.AppointmentRepository;
import TelemedApp.ac.rw.Telemed.repository.TestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

@Service
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(UUID id) {
        return patientRepository.findById(id).orElse(null);
    }

    public Patient getPatientByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public void deletePatient(UUID id) {
        patientRepository.deleteById(id);
    }

    public Patient getPatientByUserId(UUID userId) {
        return patientRepository.findByUserId(userId);
    }

    public List<TestResult> getPatientTestResults(Patient patient) {
        // First get all appointments for the patient
        List<Appointment> appointments = appointmentRepository.findByPatient(patient);
        
        // Then get all test results for these appointments
        List<TestResult> allTestResults = new ArrayList<>();
        for (Appointment appointment : appointments) {
            List<TestResult> appointmentResults = testResultRepository.findByAppointment(appointment);
            allTestResults.addAll(appointmentResults);
        }
        
        return allTestResults;
    }
}
