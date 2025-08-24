package TelemedApp.ac.rw.Telemed.service;

import TelemedApp.ac.rw.Telemed.modal.Doctor;
import TelemedApp.ac.rw.Telemed.modal.MedicalRecord;
import TelemedApp.ac.rw.Telemed.modal.Patient;
import TelemedApp.ac.rw.Telemed.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class MedicalRecordService {
    
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    public MedicalRecord getMedicalRecordById(UUID id) {
        return medicalRecordRepository.findById(id).orElse(null);
    }

    public List<MedicalRecord> getMedicalRecordsByPatient(Patient patient) {
        return medicalRecordRepository.findByPatient(patient);
    }

    public MedicalRecord saveMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public void deleteMedicalRecord(UUID id) {
        medicalRecordRepository.deleteById(id);
    }

    public List<MedicalRecord> getMedicalRecordsByDoctor(Doctor doctor) {
        return medicalRecordRepository.findByDoctor(doctor);
    }

    public List<MedicalRecord> getMedicalRecordsByPatientId(UUID patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }
}
