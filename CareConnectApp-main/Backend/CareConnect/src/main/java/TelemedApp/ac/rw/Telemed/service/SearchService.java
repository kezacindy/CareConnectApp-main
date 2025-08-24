package TelemedApp.ac.rw.Telemed.service;

import TelemedApp.ac.rw.Telemed.modal.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    @Autowired
    private EntityManager entityManager;

    @SuppressWarnings("CollectionsToArray")
    public List<Patient> searchPatients(String query) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Patient> cq = cb.createQuery(Patient.class);
        Root<Patient> root = cq.from(Patient.class);

        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%"));
        predicates.add(cb.like(cb.lower(root.get("email")), "%" + query.toLowerCase() + "%"));
        predicates.add(cb.like(cb.lower(root.get("phone")), "%" + query.toLowerCase() + "%"));
        predicates.add(cb.like(cb.lower(root.get("address")), "%" + query.toLowerCase() + "%"));
        if (query.equalsIgnoreCase("MALE") || query.equalsIgnoreCase("FEMALE")) {
            predicates.add(cb.equal(root.get("gender"), Gender.valueOf(query.toUpperCase())));
        }

        cq.where(cb.or(predicates.toArray(new Predicate[0])));
        return entityManager.createQuery(cq).getResultList();
    }

    @SuppressWarnings("CollectionsToArray")
    public List<Doctor> searchDoctors(String query) {
        try{CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Doctor> cq = cb.createQuery(Doctor.class);
        Root<Doctor> root = cq.from(Doctor.class);

        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%"));
        predicates.add(cb.like(cb.lower(root.get("specialization")), "%" + query.toLowerCase() + "%"));
        predicates.add(cb.like(cb.lower(root.get("email")), "%" + query.toLowerCase() + "%"));
        predicates.add(cb.like(cb.lower(root.get("licenseNumber")), "%" + query.toLowerCase() + "%"));

        cq.where(cb.or(predicates.toArray(new Predicate[0])));
        return entityManager.createQuery(cq).getResultList();
        } catch(Exception e){
            System.out.println(e.getMessage());
            return new ArrayList<>();
        }
    }

    @SuppressWarnings("CollectionsToArray")
    public List<MedicalRecord> searchMedicalRecords(String query) {
        try {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<MedicalRecord> cq = cb.createQuery(MedicalRecord.class);
            Root<MedicalRecord> root = cq.from(MedicalRecord.class);

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.like(cb.lower(root.get("condition")), "%" + query.toLowerCase() + "%"));
            predicates.add(cb.like(cb.lower(root.get("treatment")), "%" + query.toLowerCase() + "%"));
            predicates.add(cb.like(cb.lower(root.get("notes")), "%" + query.toLowerCase() + "%"));

            cq.where(cb.or(predicates.toArray(new Predicate[0])));
            return entityManager.createQuery(cq).getResultList();

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ArrayList<>();

        }

    }

    @SuppressWarnings({"CollectionsToArray", "CollectionsToArray"})
    public List<Appointment> searchAppointments(String query) {
        try {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Appointment> cq = cb.createQuery(Appointment.class);
            Root<Appointment> root = cq.from(Appointment.class);

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.like(cb.lower(root.get("appointmentDate")), "%" + query.toLowerCase() + "%"));
            predicates.add(cb.like(cb.lower(root.get("status")), "%" + query.toLowerCase() + "%"));
            predicates.add(cb.like(cb.lower(root.get("notes")), "%" + query.toLowerCase() + "%"));

            cq.where(cb.or(predicates.toArray(new Predicate[0])));
            return entityManager.createQuery(cq).getResultList();

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ArrayList<>();

        }

    }

    // Combined search across all entities
    public SearchResult globalSearch(String query) {
        SearchResult result = new SearchResult();
        result.setPatients(searchPatients(query));
        result.setDoctors(searchDoctors(query));
        result.setMedicalRecords(searchMedicalRecords(query));
        result.setAppointments(searchAppointments(query));
        return result;
    }
}
