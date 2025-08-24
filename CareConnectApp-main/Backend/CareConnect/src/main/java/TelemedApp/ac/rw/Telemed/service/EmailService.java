package TelemedApp.ac.rw.Telemed.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendResetLink(String toEmail, String resetLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        
        helper.setTo(toEmail);
        helper.setSubject("Password Reset Request");
        
        String emailContent = String.format("""
            <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your password. Click the link below to proceed:</p>
                <p><a href="%s">Reset Password</a></p>
                <p>If you didn't request this, please ignore this email.</p>
            </body>
            </html>
            """, resetLink);
            
        helper.setText(emailContent, true);
        mailSender.send(message);
    }
} 