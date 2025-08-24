package TelemedApp.ac.rw.Telemed.controller;

import TelemedApp.ac.rw.Telemed.modal.SearchResult;
import TelemedApp.ac.rw.Telemed.service.SearchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/search")
@CrossOrigin
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping(value = "/globalSearch", produces = MediaType.APPLICATION_JSON_VALUE)
    public SearchResult globalSearch(@RequestParam String query) {
        return searchService.globalSearch(query);
    }

    @GetMapping("/patients")
    public SearchResult searchPatients(@RequestParam String query) {
        SearchResult result = new SearchResult();
        result.setPatients(searchService.searchPatients(query));
        return result;
    }

    @GetMapping("/doctors")
    public SearchResult searchDoctors(@RequestParam String query) {
        SearchResult result = new SearchResult();
        result.setDoctors(searchService.searchDoctors(query));
        return result;
    }

    @GetMapping("/medical-records")
    public SearchResult searchMedicalRecords(@RequestParam String query) {
        SearchResult result = new SearchResult();
        result.setMedicalRecords(searchService.searchMedicalRecords(query));
        return result;
    }
}
