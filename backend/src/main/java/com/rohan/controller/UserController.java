package com.rohan.controller;

import com.rohan.model.User;
import com.rohan.service.imp.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/user/profile")
public ResponseEntity<User> createUserHandler(
        @RequestHeader("Authorization") String jwt
    )throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        return ResponseEntity.ok(user);
    }
}

