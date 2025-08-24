package TelemedApp.ac.rw.Telemed.service;

import TelemedApp.ac.rw.Telemed.modal.User;
import TelemedApp.ac.rw.Telemed.repository.UserRepository;
import TelemedApp.ac.rw.Telemed.security.SHA256PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;
    

    private final PasswordEncoder passwordEncoder = new SHA256PasswordEncoder();

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword ,user.getPassword());
        
    }
}
