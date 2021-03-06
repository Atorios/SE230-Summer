package com.example.ktws.repository;

import com.example.ktws.domain.User;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<User,Long> {
    Optional<User> findByName(String name);
}
