package com.rohan.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptions {

    // Seller Exception
    @ExceptionHandler(SellerException.class)
    public ResponseEntity<EroorDetails> sellerExceptionHandler(
            SellerException se, WebRequest request) {

        EroorDetails errorDetails = new EroorDetails(
                LocalDateTime.now(),
                se.getMessage(),
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // Product Exception
    @ExceptionHandler(ProductException.class)
    public ResponseEntity<EroorDetails> productExceptionHandler(
            ProductException pe, WebRequest request) {

        EroorDetails errorDetails = new EroorDetails(
                LocalDateTime.now(),
                pe.getMessage(),
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }
}