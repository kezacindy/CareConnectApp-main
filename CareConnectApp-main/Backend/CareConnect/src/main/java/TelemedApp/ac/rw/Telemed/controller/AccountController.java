package TelemedApp.ac.rw.Telemed.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import TelemedApp.ac.rw.Telemed.modal.AccountCreationRequest;
import TelemedApp.ac.rw.Telemed.modal.Doctor;
import TelemedApp.ac.rw.Telemed.modal.Gender;
import TelemedApp.ac.rw.Telemed.modal.Patient;
import TelemedApp.ac.rw.Telemed.modal.User;
import TelemedApp.ac.rw.Telemed.security.SHA256PasswordEncoder;
import TelemedApp.ac.rw.Telemed.service.DoctorService;
import TelemedApp.ac.rw.Telemed.service.PatientService;
import TelemedApp.ac.rw.Telemed.service.UserService;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin
public class AccountController {

    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    private final UserService userService;
    private final PatientService patientService;
    private final PasswordEncoder passwordEncoder;
    private final DoctorService doctorService;

    public AccountController(UserService userService, 
                             PatientService patientService, 
                             PasswordEncoder passwordEncoder,
                             DoctorService doctorService) {
        this.userService = userService;
        this.patientService = patientService;
        this.passwordEncoder = new SHA256PasswordEncoder();
        this.doctorService = doctorService;
    }

    @PostMapping(value ="/createAccount" ,consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> createAccount(@RequestBody AccountCreationRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
           

            // Check if email already exists
            if (userService.getUserByEmail(request.getEmail()) != null) {
                logger.warn("Account creation failed: Email already exists - {}", request.getEmail());
                response.put("error", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            // Create user object
            User userObj = new User();
            userObj.setEmail(request.getEmail());
            userObj.setUsername(request.getUsername());
            
            // Encode password before saving
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            logger.info("Original password length: {}", request.getPassword().length());
            logger.info("Encoded password: {}", encodedPassword);
            logger.info("Encoded password length: {}", encodedPassword.length());
            userObj.setPassword(encodedPassword);
            
            userObj.setRole(request.getRole());

            // Save user
            User savedUser = userService.saveUser(userObj);

            if (savedUser == null) {
                logger.error("Failed to save user: {}", request.getEmail());
                response.put("error", "Failed to create account");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            // Optional: Create patient profile if needed
            if (request.getRole().equals("PATIENT")) {
                Patient patient = new Patient();
                patient.setUser(savedUser);
                patient.setName(request.getName());
                patient.setEmail(request.getEmail());
                patient.setPhone(request.getPhone());
                patient.setDateOfBirth(request.getDateOfBirth());
                patient.setGender(Gender.valueOf(request.getGender().toUpperCase()));
                patient.setAddress(request.getAddress());
                patientService.savePatient(patient);
            }

            logger.info("Account created successfully for email: {}", request.getEmail());
            response.put("message", "Account created successfully");
            response.put("userId", savedUser.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error creating account", e);
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping(value = "/doctor/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> registerDoctor(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 1. First validate if email already exists
            String email = (String) request.get("email");
            if (userService.getUserByEmail(email) != null) {
                response.put("error", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            // 2. Create and save User first
            User user = new User();
            user.setEmail(email);
            user.setUsername((String) request.get("username"));
            user.setPassword(passwordEncoder.encode((String) request.get("password")));
            user.setRole("DOCTOR");

            User savedUser = userService.saveUser(user);

            // 3. Create and save Doctor
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setName((String) request.get("name"));
            doctor.setEmail(email);
            doctor.setPhone((String) request.get("phone"));
            doctor.setSpecialization((String) request.get("specialization"));
            doctor.setExperience(Integer.parseInt(request.get("experience").toString()));
            doctor.setLicenseNumber((String) request.get("licenseNumber"));

            Doctor savedDoctor = doctorService.saveDoctor(doctor);

            // 4. Prepare success response
            response.put("message", "Doctor registered successfully");
            response.put("userId", savedUser.getId());
            response.put("doctorId", savedDoctor.getId());
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error registering doctor: ", e);
            response.put("error", "Failed to register doctor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
