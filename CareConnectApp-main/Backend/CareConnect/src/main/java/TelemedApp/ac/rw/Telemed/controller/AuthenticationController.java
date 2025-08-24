package TelemedApp.ac.rw.Telemed.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.slf4j.LoggerFactory;


import TelemedApp.ac.rw.Telemed.modal.User;
import TelemedApp.ac.rw.Telemed.service.AuthenticationService;
import TelemedApp.ac.rw.Telemed.service.TwoFactorAuthService;
import TelemedApp.ac.rw.Telemed.service.PatientService;
import TelemedApp.ac.rw.Telemed.modal.Patient;
import TelemedApp.ac.rw.Telemed.util.EmailEncoder;
import TelemedApp.ac.rw.Telemed.service.EmailService;
import TelemedApp.ac.rw.Telemed.service.UserService;

import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final TwoFactorAuthService twoFactorAuthService;
    
    private final EmailEncoder emailEncoder;
    private final EmailService emailService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final PatientService patientService;

    public AuthenticationController(AuthenticationService authenticationService, TwoFactorAuthService twoFactorAuthService, PatientService patientService, EmailEncoder emailEncoder, EmailService emailService, UserService userService, PasswordEncoder passwordEncoder) {
        this.authenticationService = authenticationService;
        this.twoFactorAuthService = twoFactorAuthService;
        this.patientService = patientService;
        this.emailEncoder = emailEncoder;
        this.emailService = emailService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) throws UnsupportedEncodingException, MessagingException {
        Map<String, Object> response = new HashMap<>();

        String email = request.get("email");
        String password = request.get("password");

        // Validate input
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            response.put("error", "Email and password are required");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            User user = authenticationService.getUserByEmail(email);
            if (user == null || !authenticationService.checkPassword(user, password)) {
                response.put("error", "Invalid email or password");
                return ResponseEntity.badRequest().body(response);
            }

            // Generate and send OTP
            String otp = twoFactorAuthService.generateOTP(email);
            twoFactorAuthService.sendOtpEmail(email, otp);

            response.put("message", "OTP sent to your email");
            response.put("email", email); // Include email in response for OTP verification
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "An error occurred during login: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping(value = "/verify-otp", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String email = request.get("email");
        String otp = request.get("otp");

        // Validate input
        if (email == null || email.trim().isEmpty() || otp == null || otp.trim().isEmpty()) {
            response.put("error", "Email and OTP are required");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            if (!twoFactorAuthService.verifyOTP(email, otp)) {
                response.put("error", "Invalid or expired OTP");
                return ResponseEntity.badRequest().body(response);
            }

            // Get user data
            User user = authenticationService.getUserByEmail(email);
            if (user == null) {
                response.put("error", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create a map with only the user fields we want to send
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("username", user.getUsername());
            userResponse.put("email", user.getEmail());
            userResponse.put("role", user.getRole());
            
            // Get associated patient data if user is a patient
            if ("PATIENT".equals(user.getRole())) {
                Patient patient = patientService.getPatientByUserId(user.getId());
                if (patient != null) {
                    response.put("patient", patient);
                    response.put("patientId", patient.getId());
                }
            }

            response.put("user", userResponse);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "An error occurred during OTP verification: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping(value = "/request-otp", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> requestOtp(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String email = request.get("email");
        User user = authenticationService.getUserByEmail(email);
        if (user == null) {
            response.put("error", "User not found");
            return ResponseEntity.badRequest().body(response);
        }

        String otp = twoFactorAuthService.generateOTP(email);
        response.put("otp", otp); // For demonstration purposes, we return it in the response
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-reset-link")
    public ResponseEntity<Map<String, Object>> sendResetLink(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            User user = authenticationService.getUserByEmail(email);
            
            if (user == null) {
                response.put("error", "Email not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Generate reset link with encoded email
            String encodedEmail = emailEncoder.encodeEmail(email);
            String resetLink = "http://localhost:5173/reset-password/" + encodedEmail;

            // Send email
            emailService.sendResetLink(email, resetLink);
            
            response.put("message", "Password reset link sent to your email");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", "Error sending reset link: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String encodedEmail = request.get("encodedEmail");
            String newPassword = request.get("password");
            
            // Validate password
            if (newPassword == null || newPassword.trim().isEmpty()) {
                response.put("error", "New password is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Password strength validation (same as in account creation)
            if (newPassword.length() < 8) {
                response.put("error", "Password must be at least 8 characters long");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Decode email
            String email = emailEncoder.decodeEmail(encodedEmail);
            
            // Validate email exists
            User user = authenticationService.getUserByEmail(email);
            if (user == null) {
                response.put("error", "Invalid reset link");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Update password using SHA256PasswordEncoder (same as account creation)
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
            
            // Log password info for debugging (remove in production)
            LoggerFactory.getLogger(AuthenticationController.class).info("Original password length: {}", newPassword.length());
            LoggerFactory.getLogger(AuthenticationController.class).info("Encoded password: {}", encodedPassword);
            LoggerFactory.getLogger(AuthenticationController.class).info("Encoded password length: {}", encodedPassword.length());
            
            userService.updatePassword(user);
            
            response.put("message", "Password reset successful");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            LoggerFactory.getLogger(AuthenticationController.class).error("Error in password reset process", e);
            response.put("error", "Failed to reset password");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            
            // Validate email format
            if (email == null || email.trim().isEmpty()) {
                response.put("error", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Check if user exists
            User user = authenticationService.getUserByEmail(email);
            if (user == null) {
                response.put("error", "No account found with this email");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Generate encoded email for reset link
            String encodedEmail = emailEncoder.encodeEmail(email);
            String resetLink = "http://localhost:5173/reset-password/" + encodedEmail;

            // Send reset email
            emailService.sendResetLink(email, resetLink);
            
            response.put("message", "Password reset instructions sent to your email");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            LoggerFactory.getLogger(AuthenticationController.class).error("Error in forgot password process", e);
            response.put("error", "Failed to process password reset request");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password/{encodedEmail}")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @PathVariable String encodedEmail,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String newPassword = request.get("password");
            String confirmPassword = request.get("confirmPassword");

            // Validate password
            if (newPassword == null || newPassword.trim().isEmpty()) {
                response.put("error", "New password is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Check password confirmation
            if (!newPassword.equals(confirmPassword)) {
                response.put("error", "Passwords do not match");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate password strength
            if (newPassword.length() < 8) {
                response.put("error", "Password must be at least 8 characters long");
                return ResponseEntity.badRequest().body(response);
            }

            // Decode email and find user
            String email = emailEncoder.decodeEmail(encodedEmail);
            User user = authenticationService.getUserByEmail(email);
            
            if (user == null) {
                response.put("error", "Invalid reset link");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userService.updatePassword(user);
            
            response.put("message", "Password has been reset successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            LoggerFactory.getLogger(AuthenticationController.class).error("Error in password reset process", e);
            response.put("error", "Failed to reset password");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
