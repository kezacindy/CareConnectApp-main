package TelemedApp.ac.rw.Telemed.controller;

import TelemedApp.ac.rw.Telemed.modal.Patient;
import TelemedApp.ac.rw.Telemed.modal.TestResult;
import TelemedApp.ac.rw.Telemed.service.PatientService;
import TelemedApp.ac.rw.Telemed.modal.MedicalRecord;
import TelemedApp.ac.rw.Telemed.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/patients", produces = MediaType.APPLICATION_JSON_VALUE)
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private MedicalRecordService medicalRecordService;

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable UUID id) {
        Patient patient = patientService.getPatientById(id);
        return patient != null ? ResponseEntity.ok(patient) : ResponseEntity.notFound().build();
    }

    @GetMapping("/email/{email}" )
    public ResponseEntity<?> getPatientByEmail(@PathVariable String email) {
        Patient patient = patientService.getPatientByEmail(email);
        if (patient != null) {
            return ResponseEntity.ok(patient);
        } else {
            return ResponseEntity.notFound().build();
        }

    }

    @PostMapping(value="/savePatients", produces = MediaType.APPLICATION_JSON_VALUE ,consumes = MediaType.APPLICATION_JSON_VALUE)
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Patient> updatePatient(@PathVariable UUID id, @RequestBody Patient patient) {
        Patient existingPatient = patientService.getPatientById(id);
        if (existingPatient == null) {
            return ResponseEntity.notFound().build();
        }
        patient.setId(id);
        return ResponseEntity.ok(patientService.savePatient(patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable UUID id) {
        Patient existingPatient = patientService.getPatientById(id);
        if (existingPatient == null) {
            return ResponseEntity.notFound().build();
        }
        patientService.deletePatient(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/medical-records/user/{userId}")
    public ResponseEntity<?> getMedicalRecordsByUserId(@PathVariable UUID userId) {
        try {
            // First get the patient using userId
            Patient patient = patientService.getPatientByUserId(userId);
            if (patient == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patient not found for user ID: " + userId);
            }

            // Then get medical records using patient ID
            List<MedicalRecord> medicalRecords = medicalRecordService.getMedicalRecordsByPatientId(patient.getId());
            
            return ResponseEntity.ok(medicalRecords);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving medical records: " + e.getMessage());
        }
    }

    @GetMapping("/records/{userId}")
    public ResponseEntity<?> getPatientRecords(@PathVariable UUID userId) {
        try {
            Patient patient = patientService.getPatientByUserId(userId);
            if (patient == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No patient found for this user ID");
            }
            
            List<MedicalRecord> records = medicalRecordService.getMedicalRecordsByPatient(patient);
            return ResponseEntity.ok(records);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving records: " + e.getMessage());
        }
    }

    @GetMapping("/test-results/{userId}")
    public ResponseEntity<?> getPatientTestResults(@PathVariable UUID userId) {
        try {
            // First get the patient using userId
            Patient patient = patientService.getPatientByUserId(userId);
            if (patient == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patient not found for user ID: " + userId);
            }

            // Get all test results through appointments
            List<TestResult> testResults = patientService.getPatientTestResults(patient);
            
            if (testResults.isEmpty()) {
                return ResponseEntity.ok()
                    .body("No test results found for this patient");
            }
            
            return ResponseEntity.ok(testResults);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving test results: " + e.getMessage());
        }
    }
}
