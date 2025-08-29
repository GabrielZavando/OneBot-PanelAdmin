import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatbotData, Chatbot, ChatbotsResponse, ChatbotResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/v1/chatbots';

  constructor(private http: HttpClient) {}

  createChatbot(chatbotData: ChatbotData): Observable<ChatbotResponse> {
    return this.http.post<ChatbotResponse>(this.apiUrl, chatbotData);
  }

  getChatbots(): Observable<ChatbotsResponse> {
    return this.http.get<ChatbotsResponse>(this.apiUrl);
  }

  getChatbotById(id: string): Observable<ChatbotResponse> {
    return this.http.get<ChatbotResponse>(`${this.apiUrl}/${id}`);
  }

  updateChatbot(id: string, chatbotData: Partial<ChatbotData>): Observable<ChatbotResponse> {
    return this.http.put<ChatbotResponse>(`${this.apiUrl}/${id}`, chatbotData);
  }

  deleteChatbot(id: string): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiUrl}/${id}`);
  }
}
