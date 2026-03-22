package com.rohan.controller;

import com.rohan.model.Address;
import com.rohan.model.User;
import com.rohan.service.imp.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<User> addAddress(
            @RequestBody Address address,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        User updatedUser = userService.addAddress(user, address);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        return ResponseEntity.ok(user.getAddresses());
    }
}
