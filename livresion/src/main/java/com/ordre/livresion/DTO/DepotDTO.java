package com.ordre.livresion.DTO;

public class DepotDTO {
  private Long id;
  private String name;
  private Long chefId;
  
  // constructors, getters, setters
  
  
    public DepotDTO() {}
  
    public DepotDTO(Long id, String name, Long chefId) {
      this.id = id;
      this.name = name;
      this.chefId = chefId;
    }
  
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

    

    public void setChefId(Long chefId) {
      this.chefId = chefId;
    }
    
}