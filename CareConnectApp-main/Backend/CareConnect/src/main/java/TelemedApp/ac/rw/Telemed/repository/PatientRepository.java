package TelemedApp.ac.rw.Telemed.repository;

import TelemedApp.ac.rw.Telemed.modal.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Patient findByEmail(String email);
    Patient findByUserId(UUID userId);
}
