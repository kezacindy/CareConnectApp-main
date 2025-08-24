package TelemedApp.ac.rw.Telemed.controller;

import TelemedApp.ac.rw.Telemed.modal.Doctor;
import TelemedApp.ac.rw.Telemed.modal.MedicalRecord;
import TelemedApp.ac.rw.Telemed.modal.Patient;
import TelemedApp.ac.rw.Telemed.service.DoctorService;
import TelemedApp.ac.rw.Telemed.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping(value ="/api/medicalrecords", produces = MediaType.APPLICATION_JSON_VALUE)
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;
    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordService.getAllMedicalRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable UUID id) {
        MedicalRecord medicalRecord = medicalRecordService.getMedicalRecordById(id);
        return medicalRecord != null ? ResponseEntity.ok(medicalRecord) : ResponseEntity.notFound().build();
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalRecord> getMedicalRecordsByPatient(@PathVariable UUID patientId) {
        Patient patient = new Patient();
        patient.setId(patientId);
        return medicalRecordService.getMedicalRecordsByPatient(patient);
    }

    @PostMapping(value = "/saveRecords",consumes = MediaType.APPLICATION_JSON_VALUE)
    public MedicalRecord createMedicalRecord(@RequestBody MedicalRecord medicalRecord) {
        return medicalRecordService.saveMedicalRecord(medicalRecord);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MedicalRecord> updateMedicalRecord(@PathVariable UUID id, @RequestBody MedicalRecord medicalRecord) {
        MedicalRecord existingRecord = medicalRecordService.getMedicalRecordById(id);
        if (existingRecord == null) {
            return ResponseEntity.notFound().build();
        }
        medicalRecord.setId(id);
        return ResponseEntity.ok(medicalRecordService.saveMedicalRecord(medicalRecord));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable UUID id) {
        MedicalRecord existingRecord = medicalRecordService.getMedicalRecordById(id);
        if (existingRecord == null) {
            return ResponseEntity.notFound().build();
        }
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/doctor/{doctorId}")
public ResponseEntity<?> getMedicalRecordsByDoctor(@PathVariable UUID doctorId) {
    try {
        Doctor doctor = doctorService.getDoctorById(doctorId);
        if (doctor == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Doctor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        List<MedicalRecord> medicalRecords = medicalRecordService.getMedicalRecordsByDoctor(doctor);
        
        // Convert medical records to DTOs with patient information
        List<Map<String, Object>> recordsWithPatientInfo = medicalRecords.stream()
            .map(record -> {
                Map<String, Object> recordMap = new HashMap<>();
                recordMap.put("id", record.getId());
                recordMap.put("condition", record.getCondition());
                recordMap.put("treatment", record.getTreatment());
                recordMap.put("notes", record.getNotes());
                recordMap.put("recordDate", record.getRecordDate());
                recordMap.put("diagnosisType", record.getDiagnosisType());
                
                // Add patient information
                if (record.getPatient() != null) {
                    Map<String, Object> patientInfo = new HashMap<>();
                    patientInfo.put("id", record.getPatient().getId());
                    patientInfo.put("name", record.getPatient().getName());
                    patientInfo.put("email", record.getPatient().getEmail());
                    recordMap.put("patient", patientInfo);
                }
                
                return recordMap;
            })
            .collect(Collectors.toList());

        if (recordsWithPatientInfo.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No medical records found for this doctor");
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(recordsWithPatientInfo);
        
    } catch (Exception e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Error: " + e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}
    
}
