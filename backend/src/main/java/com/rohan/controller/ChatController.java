package com.rohan.controller;

import com.rohan.request.ChatRequest;
import com.rohan.response.ChatResponse;
import com.rohan.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest chatRequest) {
        try {
            ChatResponse response = chatService.processChatMessage(chatRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ChatResponse("Sorry, I am experiencing technical difficulties. Please try again later."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
