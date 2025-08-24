package TelemedApp.ac.rw.Telemed.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import TelemedApp.ac.rw.Telemed.modal.Appointment;
import TelemedApp.ac.rw.Telemed.modal.AppointmentStatus;
import TelemedApp.ac.rw.Telemed.modal.Doctor;
import TelemedApp.ac.rw.Telemed.service.AppointmentService;
import TelemedApp.ac.rw.Telemed.service.DoctorService;
import TelemedApp.ac.rw.Telemed.service.PatientService;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin
public class AdminStatsController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/appointments/status-by-doctor")
    public ResponseEntity<List<Map<String, Object>>> getAppointmentStatusByDoctor() {
        List<Map<String, Object>> stats = doctorService.getAllDoctors().stream()
            .map(doctor -> {
                Map<String, Object> doctorStats = new HashMap<>();
                List<Appointment> doctorAppointments = appointmentService.getAppointmentsByDoctor(doctor);
                
                doctorStats.put("doctorName", doctor.getName());
                doctorStats.put("doctorId", doctor.getId());
                doctorStats.put("totalAppointments", doctorAppointments.size());
                doctorStats.put("completedAppointments", 
                    doctorAppointments.stream()
                        .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                        .count());
                doctorStats.put("scheduledAppointments", 
                    doctorAppointments.stream()
                        .filter(a -> a.getStatus() == AppointmentStatus.SCHEDULED)
                        .count());
                
                return doctorStats;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/patients/appointments-frequency")
    public ResponseEntity<List<Map<String, Object>>> getPatientAppointmentFrequency() {
        List<Map<String, Object>> stats = patientService.getAllPatients().stream()
            .map(patient -> {
                Map<String, Object> patientStats = new HashMap<>();
                List<Appointment> patientAppointments = appointmentService.getAppointmentsByPatient(patient);
                
                patientStats.put("patientName", patient.getName());
                patientStats.put("patientId", patient.getId());
                patientStats.put("totalAppointments", patientAppointments.size());
                
                return patientStats;
            })
            .sorted((p1, p2) -> Integer.compare(
                (Integer) p2.get("totalAppointments"), 
                (Integer) p1.get("totalAppointments")))
            .limit(10)  // Get top 10 patients by appointment frequency
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/appointments/time-slots")
    public ResponseEntity<Map<String, Long>> getPopularTimeSlots() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        Map<String, Long> timeSlotStats = appointments.stream()
            .collect(Collectors.groupingBy(
                Appointment::getTime,
                Collectors.counting()
            ));
        
        return ResponseEntity.ok(timeSlotStats);
    }

    @GetMapping("/doctors/workload")
    public ResponseEntity<List<Map<String, Object>>> getDoctorWorkload() {
        LocalDate today = LocalDate.now();
        
        List<Map<String, Object>> workloadStats = doctorService.getAllDoctors().stream()
            .map(doctor -> {
                Map<String, Object> workload = new HashMap<>();
                List<Appointment> doctorAppointments = appointmentService.getAppointmentsByDoctor(doctor);
                
                // Today's appointments
                long todayAppointments = doctorAppointments.stream()
                    .filter(a -> a.getDate().equals(today.toString()))
                    .count();
                
                // This week's appointments
                long weeklyAppointments = doctorAppointments.stream()
                    .filter(a -> {
                        LocalDate appointmentDate = LocalDate.parse(a.getDate());
                        return !appointmentDate.isBefore(today.minusDays(7));
                    })
                    .count();
                
                workload.put("doctorName", doctor.getName());
                workload.put("doctorId", doctor.getId());
                workload.put("specialization", doctor.getSpecialization());
                workload.put("todayAppointments", todayAppointments);
                workload.put("weeklyAppointments", weeklyAppointments);
                workload.put("averageWeeklyLoad", weeklyAppointments / 7.0);
                
                return workload;
            })
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(workloadStats);
    }

    @GetMapping("/specializations/demand")
    public ResponseEntity<Map<String, Object>> getSpecializationDemand() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get appointments grouped by doctor specialization
        Map<String, Long> specializationDemand = appointmentService.getAllAppointments().stream()
            .collect(Collectors.groupingBy(
                appointment -> appointment.getDoctor().getSpecialization(),
                Collectors.counting()
            ));
            
        // Get number of doctors per specialization
        Map<String, Long> doctorsPerSpecialization = doctorService.getAllDoctors().stream()
            .collect(Collectors.groupingBy(
                Doctor::getSpecialization,
                Collectors.counting()
            ));
            
        // Calculate demand ratio (appointments per doctor)
        Map<String, Double> demandRatio = new HashMap<>();
        specializationDemand.forEach((specialization, appointments) -> {
            Long doctors = doctorsPerSpecialization.get(specialization);
            if (doctors != null && doctors > 0) {
                demandRatio.put(specialization, appointments.doubleValue() / doctors);
            }
        });
        
        stats.put("appointmentsPerSpecialization", specializationDemand);
        stats.put("doctorsPerSpecialization", doctorsPerSpecialization);
        stats.put("demandRatio", demandRatio);
        
        return ResponseEntity.ok(stats);
    }
}