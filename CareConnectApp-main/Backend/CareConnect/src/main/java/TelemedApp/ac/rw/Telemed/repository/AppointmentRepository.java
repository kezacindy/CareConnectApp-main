package TelemedApp.ac.rw.Telemed.repository;

import TelemedApp.ac.rw.Telemed.modal.Appointment;
import TelemedApp.ac.rw.Telemed.modal.AppointmentStatus;
import TelemedApp.ac.rw.Telemed.modal.Doctor;
import TelemedApp.ac.rw.Telemed.modal.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByDate(String date);
    List<Appointment> findByDoctorIdAndDate(UUID doctorId, String date);
    List<Appointment> findByDoctorIdAndDateGreaterThanOrderByDateAsc(UUID doctorId, String date);

    List<Appointment> findByDoctorAndStatus(Doctor doctor, AppointmentStatus status);
}
