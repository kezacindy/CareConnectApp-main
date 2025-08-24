package TelemedApp.ac.rw.Telemed.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import TelemedApp.ac.rw.Telemed.modal.Appointment;
import TelemedApp.ac.rw.Telemed.modal.AppointmentStatus;
import TelemedApp.ac.rw.Telemed.modal.Doctor;
import TelemedApp.ac.rw.Telemed.modal.Patient;
import TelemedApp.ac.rw.Telemed.service.AppointmentService;
import TelemedApp.ac.rw.Telemed.service.PatientService;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patient/dashboard")
@CrossOrigin
public class PatientDashboardController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/{patientId}")
    public ResponseEntity<Map<String, Object>> getPatientDashboard(@PathVariable UUID patientId) {
        Map<String, Object> dashboard = new HashMap<>();
        try {
            Patient patient = patientService.getPatientById(patientId);
            if (patient == null) {
                return ResponseEntity.notFound().build();
            }

            List<Appointment> allAppointments = appointmentService.getAppointmentsByPatient(patient);
            LocalDate today = LocalDate.now();

            // Get upcoming appointments
            List<Map<String, Object>> upcomingAppointments = allAppointments.stream()
                .filter(a -> {
                    LocalDate appointmentDate = LocalDate.parse(a.getDate());
                    return !appointmentDate.isBefore(today) && 
                           a.getStatus() == AppointmentStatus.SCHEDULED;
                })
                .map(this::appointmentToMap)
                .collect(Collectors.toList());

            // Get appointment history
            List<Map<String, Object>> appointmentHistory = allAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .map(this::appointmentToMap)
                .collect(Collectors.toList());

            // Calculate statistics
            long totalAppointments = allAppointments.size();
            long completedAppointments = appointmentHistory.size();
            long upcomingAppointmentsCount = upcomingAppointments.size();
            long cancelledAppointments = allAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CANCELLED)
                .count();

            // Get today's appointments
            List<Map<String, Object>> todayAppointments = allAppointments.stream()
                .filter(a -> a.getDate().equals(today.toString()))
                .map(this::appointmentToMap)
                .collect(Collectors.toList());

            // Get doctors visited
            List<Map<String, Object>> doctorsVisited = allAppointments.stream()
                .map(a -> a.getDoctor())
                .distinct()
                .map(doctor -> {
                    Map<String, Object> doctorMap = new HashMap<>();
                    doctorMap.put("id", doctor.getId());
                    doctorMap.put("name", doctor.getName());
                    doctorMap.put("specialization", doctor.getSpecialization());
                    return doctorMap;
                })
                .collect(Collectors.toList());

            // Compile dashboard data
            dashboard.put("patientInfo", patientToMap(patient));
            dashboard.put("upcomingAppointments", upcomingAppointments);
            dashboard.put("todayAppointments", todayAppointments);
            dashboard.put("recentAppointments", appointmentHistory.stream()
                .limit(5)
                .collect(Collectors.toList()));
            dashboard.put("doctorsVisited", doctorsVisited);

            // Add statistics
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalAppointments", totalAppointments);
            stats.put("completedAppointments", completedAppointments);
            stats.put("upcomingAppointments", upcomingAppointmentsCount);
            stats.put("cancelledAppointments", cancelledAppointments);
            stats.put("totalDoctorsVisited", doctorsVisited.size());
            dashboard.put("statistics", stats);

            // Add appointment distribution by status
            Map<String, Long> appointmentsByStatus = allAppointments.stream()
                .collect(Collectors.groupingBy(
                    a -> a.getStatus().toString(),
                    Collectors.counting()
                ));
            dashboard.put("appointmentsByStatus", appointmentsByStatus);

            return ResponseEntity.ok(dashboard);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private Map<String, Object> appointmentToMap(Appointment appointment) {
        Map<String, Object> appointmentMap = new HashMap<>();
        appointmentMap.put("id", appointment.getId());
        appointmentMap.put("date", appointment.getDate());
        appointmentMap.put("time", appointment.getTime());
        appointmentMap.put("status", appointment.getStatus());
        appointmentMap.put("doctor", doctorToMap(appointment.getDoctor()));
        return appointmentMap;
    }

    private Map<String, Object> doctorToMap(Doctor doctor) {
        Map<String, Object> doctorMap = new HashMap<>();
        doctorMap.put("id", doctor.getId());
        doctorMap.put("name", doctor.getName());
        doctorMap.put("specialization", doctor.getSpecialization());
        return doctorMap;
    }

    private Map<String, Object> patientToMap(Patient patient) {
        Map<String, Object> patientMap = new HashMap<>();
        patientMap.put("id", patient.getId());
        patientMap.put("name", patient.getName());
        patientMap.put("email", patient.getEmail());
        patientMap.put("phone", patient.getPhone());
        patientMap.put("dateOfBirth", patient.getDateOfBirth());
        patientMap.put("gender", patient.getGender());
        patientMap.put("address", patient.getAddress());
        return patientMap;
    }
} 