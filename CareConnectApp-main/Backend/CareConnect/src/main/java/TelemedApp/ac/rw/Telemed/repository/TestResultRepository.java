package TelemedApp.ac.rw.Telemed.repository;

import TelemedApp.ac.rw.Telemed.modal.TestResult;
import TelemedApp.ac.rw.Telemed.modal.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, UUID> {
    List<TestResult> findByAppointment(Appointment appointment);
}
