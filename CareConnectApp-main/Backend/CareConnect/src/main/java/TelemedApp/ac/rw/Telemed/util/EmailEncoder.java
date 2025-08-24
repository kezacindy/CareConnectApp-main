package TelemedApp.ac.rw.Telemed.util;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
public class EmailEncoder {
    
    @Value("${app.email.encryption.key}")
    private String secretKey;
    
    private SecretKeySpec keySpec;
    
    @PostConstruct
    public void init() {
        // Ensure key is exactly 16 bytes for AES-128
        byte[] key = new byte[16];
        byte[] originalKey = secretKey.getBytes();
        System.arraycopy(originalKey, 0, key, 0, Math.min(originalKey.length, 16));
        this.keySpec = new SecretKeySpec(key, "AES");
    }

    public String encodeEmail(String email) {
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(email.getBytes());
            return Base64.getUrlEncoder().encodeToString(encrypted);
        } catch (InvalidKeyException | NoSuchAlgorithmException | BadPaddingException | IllegalBlockSizeException | NoSuchPaddingException e) {
            throw new RuntimeException("Error encoding email", e);
        }
    }

    public String decodeEmail(String encodedEmail) {
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decoded = Base64.getUrlDecoder().decode(encodedEmail);
            byte[] decrypted = cipher.doFinal(decoded);
            return new String(decrypted);
        } catch (InvalidKeyException | NoSuchAlgorithmException | BadPaddingException | IllegalBlockSizeException | NoSuchPaddingException e) {
            throw new RuntimeException("Error decoding email", e);
        }
    }
} 