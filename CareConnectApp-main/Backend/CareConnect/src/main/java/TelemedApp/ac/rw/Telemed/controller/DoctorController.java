package TelemedApp.ac.rw.Telemed.controller;

import TelemedApp.ac.rw.Telemed.modal.Appointment;
import TelemedApp.ac.rw.Telemed.modal.Doctor;
import TelemedApp.ac.rw.Telemed.service.DoctorService;
import TelemedApp.ac.rw.Telemed.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDate;

@RestController
@RequestMapping(value = "/api/doctors", produces = MediaType.APPLICATION_JSON_VALUE )
@CrossOrigin
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable UUID id) {
        Doctor doctor = doctorService.getDoctorById(id);
        return doctor != null ? ResponseEntity.ok(doctor) : ResponseEntity.notFound().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Doctor> getDoctorByEmail(@PathVariable String email) {
        Doctor doctor = doctorService.getDoctorByEmail(email);
        return doctor != null ? ResponseEntity.ok(doctor) : ResponseEntity.notFound().build();
    }

    @GetMapping("/license/{licenseNumber}")
    public ResponseEntity<Doctor> getDoctorByLicenseNumber(@PathVariable String licenseNumber) {
        Doctor doctor = doctorService.getDoctorByLicenseNumber(licenseNumber);
        return doctor != null ? ResponseEntity.ok(doctor) : ResponseEntity.notFound().build();
    }

    @PostMapping(value="/registerDoctor", produces= MediaType.APPLICATION_JSON_VALUE , consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createDoctor(@RequestBody Doctor doctor) {
        if (doctorService.getDoctorByEmail(doctor.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Doctor Already exists");
        }
        return ResponseEntity.ok(doctorService.saveDoctor(doctor));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Doctor> updateDoctor(@PathVariable UUID id, @RequestBody Doctor doctor) {
        Doctor existingDoctor = doctorService.getDoctorById(id);
        if (existingDoctor == null) {
            return ResponseEntity.notFound().build();
        }
        doctor.setId(id);
        return ResponseEntity.ok(doctorService.saveDoctor(doctor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDoctor(@PathVariable UUID id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Doctor doctor = doctorService.getDoctorById(id);
            if (doctor == null) {
                response.put("error", "Doctor not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            doctorService.deleteDoctor(id);
            response.put("message", "Doctor and associated user deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to delete doctor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    @GetMapping("/specialization/{specialization}")
public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String specialization) {
    List<Doctor> doctors = doctorService.getDoctorsBySpecialization(specialization);
    if (doctors.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(doctors);
}

@GetMapping("/user/{userId}")
public ResponseEntity<Doctor> getDoctorByUserId(@PathVariable UUID userId) {
    try {
        Doctor doctor = doctorService.getDoctorByUserId(userId);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(doctor);
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}

@GetMapping("/user/{userId}/details")
public ResponseEntity<?> getDoctorDetailsWithAppointments(@PathVariable UUID userId) {
    try {
        Doctor doctor = doctorService.getDoctorByUserId(userId);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }

        // Create a response object with all needed information
        Map<String, Object> response = new HashMap<>();
        response.put("doctor", doctor);
        
        // Get today's appointments
        List<Appointment> todayAppointments = appointmentService.getDoctorAppointmentsByDate(
            doctor.getId(), 
            LocalDate.now().toString()
        );
        response.put("todayAppointments", todayAppointments);

        // Get upcoming appointments
        List<Appointment> upcomingAppointments = appointmentService.getDoctorUpcomingAppointments(
            doctor.getId()
        );
        response.put("upcomingAppointments", upcomingAppointments);

        // Get total number of patients
        int totalPatients = doctor.getPatients().size();
        response.put("totalPatients", totalPatients);

        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body("Error fetching doctor details: " + e.getMessage());
    }
}
}

