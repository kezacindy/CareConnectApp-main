package TelemedApp.ac.rw.Telemed.controller;

import TelemedApp.ac.rw.Telemed.dto.AppointmentDTO;
import TelemedApp.ac.rw.Telemed.modal.Appointment;
import TelemedApp.ac.rw.Telemed.modal.AppointmentStatus;
import TelemedApp.ac.rw.Telemed.modal.Doctor;
import TelemedApp.ac.rw.Telemed.modal.Patient;
import TelemedApp.ac.rw.Telemed.service.AppointmentService;
import TelemedApp.ac.rw.Telemed.service.DoctorService;
import TelemedApp.ac.rw.Telemed.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping(value ="/api/appointments", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        List<Map<String, Object>> response = appointments.stream()
            .map(appointment -> {
                Map<String, Object> appointmentMap = new HashMap<>();
                appointmentMap.put("id", appointment.getId());
                appointmentMap.put("date", appointment.getDate());
                appointmentMap.put("time", appointment.getTime());
                appointmentMap.put("status", appointment.getStatus());
                appointmentMap.put("doctor", appointment.getDoctor());
                appointmentMap.put("patient", appointment.getPatient());
                return appointmentMap;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable UUID id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        return appointment != null ? ResponseEntity.ok(appointment) : ResponseEntity.notFound().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByPatient(@PathVariable UUID patientId) {
        Patient patient = new Patient();
        patient.setId(patientId);
        List<Appointment> appointments = appointmentService.getAppointmentsByPatient(patient);
        
        List<AppointmentDTO> appointmentDTOs = appointments.stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(appointmentDTOs);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDoctor(@PathVariable UUID doctorId) {
        Doctor doctor = doctorService.getDoctorById(doctorId);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(doctor);
        List<AppointmentDTO> appointmentDTOs = appointments.stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(appointmentDTOs);
    }

    @GetMapping("/doctor/user/{userId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDoctorUserId(@PathVariable UUID userId) {
        Doctor doctor = doctorService.getDoctorByUserId(userId);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(doctor);
        List<AppointmentDTO> appointmentDTOs = appointments.stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(appointmentDTOs);
    }

    @GetMapping("/date/{date}")
    public List<Appointment> getAppointmentsByDate(@PathVariable String date) {
        return appointmentService.getAppointmentsByDate(date);
    }

    @PostMapping(
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> createAppointment(
            @RequestParam UUID patientId,
            @RequestParam UUID doctorId,
            @RequestBody Appointment appointmentRequest) {
        try {
            // Validate patient exists
            Patient patient = patientService.getPatientById(patientId);
            if (patient == null) {
                return ResponseEntity.badRequest()
                    .body("Patient with ID " + patientId + " not found");
            }

            // Validate doctor exists
            Doctor doctor = doctorService.getDoctorById(doctorId);
            if (doctor == null) {
                return ResponseEntity.badRequest()
                    .body("Doctor with ID " + doctorId + " not found");
            }

            // Create and populate the appointment
            Appointment appointment = new Appointment();
            appointment.setDate(appointmentRequest.getDate());
            appointment.setTime(appointmentRequest.getTime());    
            appointment.setPatient(patient);
            appointment.setDoctor(doctor);
            appointment.setStatus(AppointmentStatus.SCHEDULED);

            // Save appointment
            Appointment savedAppointment = appointmentService.saveAppointment(appointment);
            return ResponseEntity.ok(savedAppointment);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error creating appointment: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Appointment> updateAppointment(@PathVariable UUID id, @RequestBody Appointment appointment) {
        Appointment existingAppointment = appointmentService.getAppointmentById(id);
        if (existingAppointment == null) {
            return ResponseEntity.notFound().build();
        }
        appointment.setId(id);
        return ResponseEntity.ok(appointmentService.saveAppointment(appointment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID id) {
        Appointment existingAppointment = appointmentService.getAppointmentById(id);
        if (existingAppointment == null) {
            return ResponseEntity.notFound().build();
        }
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/doctor/{doctorId}/scheduled-patients")
  public ResponseEntity<List<Patient>> getScheduledPatientsByDoctor(@PathVariable UUID doctorId) {
    try {
        Doctor doctor = doctorService.getDoctorById(doctorId);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }

        // Get all appointments for the doctor with SCHEDULED status
        List<Patient> scheduledPatients = appointmentService.getAppointmentsByDoctor(doctor)
            .stream()
            .filter(appointment -> appointment.getStatus() == AppointmentStatus.SCHEDULED)
            .map(Appointment::getPatient)
            .distinct()  
            .collect(Collectors.toList());

        return ResponseEntity.ok(scheduledPatients);
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}
}
