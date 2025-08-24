package TelemedApp.ac.rw.Telemed.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.InternetAddress;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class TwoFactorAuthService {

    private final Map<String, String> otpStorage = new HashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    @Autowired
    private JavaMailSender mailSender;

    public String generateOTP(String email) {
        byte[] randomBytes = new byte[6];
        secureRandom.nextBytes(randomBytes);
        String otp = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        otpStorage.put(email, otp);
        return otp;
    }

    public boolean verifyOTP(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(email);
            return true;
        }
        return false;
    }

    public void sendOtpEmail(String recipientEmail, String otp) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(recipientEmail);
        helper.setSubject("Your OTP Code");
        String applicationName = "Telemed Application"; 
        helper.setFrom(new InternetAddress("lukatoni442@gmail.com", applicationName));
        String htmlContent = "<html><body>"
                + "<h1>Your OTP Code</h1>"
                + "<p>Your OTP code is: <strong>" + otp + "</strong></p>"
                + "<img src='https://yourfrontenddomain.com/assets/logo.png' alt='Company Logo' width='100' height='50'>"
                + "</body></html>";
        helper.setText(htmlContent, true);

        mailSender.send(message);
        System.out.println("OTP email sent successfully");
    }
}
