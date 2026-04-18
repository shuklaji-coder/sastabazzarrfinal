package com.rohan.service;

import com.rohan.request.ChatRequest;
import com.rohan.response.ChatResponse;

public interface ChatService {
    public ChatResponse processChatMessage(ChatRequest chatRequest);
}
