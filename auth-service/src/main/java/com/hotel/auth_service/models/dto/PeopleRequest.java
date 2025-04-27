// src/main/java/com/hotel/auth_service/models/dto/PeopleRequest.java

package com.hotel.auth_service.models.dto;

import jakarta.validation.constraints.NotBlank;

public class PeopleRequest {
    
    @NotBlank
    private String nombre;
    
    @NotBlank
    private String apellido;
    
    private String telefono;

    // Getters and Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}