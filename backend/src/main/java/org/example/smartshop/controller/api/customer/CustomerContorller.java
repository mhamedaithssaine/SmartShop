package org.example.smartshop.controller.api.customer;

import jakarta.validation.Valid;
import org.example.smartshop.dto.api.reponse.ApiRetour;
import org.example.smartshop.dto.request.CustomerRequest;
import org.example.smartshop.dto.request.CustomerUpdateRequest;
import org.example.smartshop.dto.response.CustomerResponse;
import org.example.smartshop.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/customers")
public class CustomerContorller {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<ApiRetour<List<CustomerResponse>>> getAllCustomers() {
        List<CustomerResponse> responses = customerService.findAll();
        return ResponseEntity.ok(ApiRetour.success("Liste des clients récupérée avec succès", responses));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiRetour<CustomerResponse>> create(@Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiRetour.success("Client créer avec succéss",response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiRetour<CustomerResponse>> getCustomerById(@PathVariable Long id){
        CustomerResponse response = customerService.findById(id);
        return ResponseEntity.ok(ApiRetour.success("Client recupére avec succéss",response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiRetour<CustomerResponse>> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerUpdateRequest request) {
        CustomerResponse response = customerService.update(id, request);
        return ResponseEntity.ok(ApiRetour.success("Client mise à jour avec succéss",response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiRetour<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.ok(ApiRetour.success("Client supprime avec succéss"));
    }

}
