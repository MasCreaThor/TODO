// src/main/java/com/hotel/auth_service/repositories/UserRepository.java

package com.hotel.auth_service.repositories;

import com.hotel.auth_service.models.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}
