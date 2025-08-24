package TelemedApp.ac.rw.Telemed.service;

import TelemedApp.ac.rw.Telemed.modal.Appointment;
import TelemedApp.ac.rw.Telemed.modal.AppointmentStatus;
import TelemedApp.ac.rw.Telemed.modal.Doctor;
import TelemedApp.ac.rw.Telemed.modal.Patient;
import TelemedApp.ac.rw.Telemed.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

@Service
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(UUID id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public List<Appointment> getAppointmentsByPatient(Patient patient) {
        return appointmentRepository.findByPatient(patient);
    }

    public List<Appointment> getAppointmentsByDoctor(Doctor doctor) {
        return appointmentRepository.findByDoctor(doctor);
    }

    public List<Appointment> getAppointmentsByDate(String date) {
        return appointmentRepository.findByDate(date);
    }

    public Appointment saveAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(UUID id) {
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> getDoctorAppointmentsByDate(UUID doctorId, String date) {
        return appointmentRepository.findByDoctorIdAndDate(doctorId, date);
    }

    public List<Appointment> getDoctorUpcomingAppointments(UUID doctorId) {
        return appointmentRepository.findByDoctorIdAndDateGreaterThanOrderByDateAsc(
            doctorId, 
            LocalDate.now().toString()
        );
    }


    public List<Appointment> getAppointmentsByDoctorAndStatus(Doctor doctor, AppointmentStatus status) {
        return appointmentRepository.findByDoctorAndStatus(doctor, status);
    }


}
