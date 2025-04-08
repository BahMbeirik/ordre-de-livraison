package com.ordre.livresion.models;

import jakarta.persistence.*;
import java.util.Map;

@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String tel;
    
    @ElementCollection
    @CollectionTable(name = "client_address1", 
                    joinColumns = @JoinColumn(name = "client_id"))
    @MapKeyColumn(name = "coordinate_key")
    @Column(name = "coordinate_value")
    private Map<String, Double> address1;
    
    private String address2;
    
    // Constructeurs
    public Client() {}
    
    public Client(String name, String tel, Map<String, Double> address1, String address2) {
        this.name = name;
        this.tel = tel;
        this.address1 = address1;
        this.address2 = address2;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getTel() {
        return tel;
    }
    
    public void setTel(String tel) {
        this.tel = tel;
    }
    
    public Map<String, Double> getAddress1() {
        return address1;
    }
    
    public void setAddress1(Map<String, Double> address1) {
        this.address1 = address1;
    }
    
    public String getAddress2() {
        return address2;
    }
    
    public void setAddress2(String address2) {
        this.address2 = address2;
    }
}