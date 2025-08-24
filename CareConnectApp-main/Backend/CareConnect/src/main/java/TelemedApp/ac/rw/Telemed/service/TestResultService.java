package TelemedApp.ac.rw.Telemed.service;

import TelemedApp.ac.rw.Telemed.modal.TestResult;
import TelemedApp.ac.rw.Telemed.modal.Appointment;
import TelemedApp.ac.rw.Telemed.repository.TestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class TestResultService {
    
    @Autowired
    private TestResultRepository testResultRepository;

    public List<TestResult> getAllTestResults() {
        return testResultRepository.findAll();
    }

    public TestResult getTestResultById(UUID id) {
        return testResultRepository.findById(id).orElse(null);
    }

    public List<TestResult> getTestResultsByAppointment(Appointment appointment) {
        return testResultRepository.findByAppointment(appointment);
    }

    public TestResult saveTestResult(TestResult testResult) {
        return testResultRepository.save(testResult);
    }

    public void deleteTestResult(UUID id) {
        testResultRepository.deleteById(id);
    }
}
