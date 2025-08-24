package TelemedApp.ac.rw.Telemed.service;

import TelemedApp.ac.rw.Telemed.modal.User;
import TelemedApp.ac.rw.Telemed.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        User userFound = userRepository.findByEmail(user.getEmail());
        if (userFound == null) {
            return userRepository.save(user);
        }
        return null;
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    public User updatePassword(User user) {
        return userRepository.save(user);
    }
}
