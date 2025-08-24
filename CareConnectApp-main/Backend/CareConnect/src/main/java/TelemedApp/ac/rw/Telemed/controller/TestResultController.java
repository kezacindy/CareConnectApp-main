package TelemedApp.ac.rw.Telemed.controller;

import TelemedApp.ac.rw.Telemed.modal.TestResult;
import TelemedApp.ac.rw.Telemed.service.TestResultService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/test-results", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin
public class TestResultController {

    @Autowired
    private TestResultService testResultService;

    @GetMapping
    public List<TestResult> getAllTestResults() {
        return testResultService.getAllTestResults();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestResult> getTestResultById(@PathVariable UUID id) {
        TestResult testResult = testResultService.getTestResultById(id);
        return testResult != null ? ResponseEntity.ok(testResult) : ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/saveTestResult", consumes = MediaType.APPLICATION_JSON_VALUE)
    public TestResult createTestResult(@RequestBody TestResult testResult) {
        return testResultService.saveTestResult(testResult);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestResult> updateTestResult(@PathVariable UUID id, @RequestBody TestResult testResult) {
        TestResult existingTestResult = testResultService.getTestResultById(id);
        if (existingTestResult == null) {
            return ResponseEntity.notFound().build();
        }
        testResult.setId(id);
        return ResponseEntity.ok(testResultService.saveTestResult(testResult));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestResult(@PathVariable UUID id) {
        TestResult existingTestResult = testResultService.getTestResultById(id);
        if (existingTestResult == null) {
            return ResponseEntity.notFound().build();
        }
        testResultService.deleteTestResult(id);
        return ResponseEntity.ok().build();
    }
}
