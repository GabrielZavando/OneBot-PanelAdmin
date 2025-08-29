import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotData, Chatbot, ChatbotsResponse, ChatbotResponse } from '../../interfaces';
import { ChatbotService, WidgetService } from '../../services';
import { WidgetConfigComponent } from './widget-config/widget-config.component';
import { MOCK_CHATBOTS } from '../../data/mock-chatbots';

@Component({
  selector: 'app-chatbots',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, WidgetConfigComponent],
  templateUrl: './chatbots.component.html',
  styleUrl: './chatbots.component.css'
})
export class Chatbots implements OnInit {
  showCreateForm = false;
  showWidgetConfig = false;
  selectedChatbot: Chatbot | null = null;
  chatbots: Chatbot[] = [];
  isLoadingChatbots = true; // Inicializamos en true para mostrar el spinner desde el inicio
  chatbotForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder, 
    private chatbotService: ChatbotService,
    private widgetService: WidgetService
  ) {
    this.chatbotForm = this.createForm();
    
    // Escuchar evento desde el sidebar
    window.addEventListener('openChatbotForm', () => {
      this.openCreateForm();
    });

    // Escuchar evento para cerrar configuración de widget
    window.addEventListener('closeWidgetConfig', () => {
      this.closeWidgetConfig();
    });
  }

  ngOnInit(): void {
    this.loadChatbots();
  }

  loadChatbots(): void {
    console.log('Loading chatbots started, isLoadingChatbots:', this.isLoadingChatbots);
    
    // Cargar datos inmediatamente para pruebas
    this.chatbots = MOCK_CHATBOTS;
    this.isLoadingChatbots = false;
    
    console.log('Loading chatbots completed, chatbots count:', this.chatbots.length);
    console.log('isLoadingChatbots:', this.isLoadingChatbots);
  }

  openWidgetConfig(chatbot: Chatbot): void {
    this.selectedChatbot = chatbot;
    this.showWidgetConfig = true;
  }

  closeWidgetConfig(): void {
    this.showWidgetConfig = false;
    this.selectedChatbot = null;
  }

  deleteChatbot(chatbot: Chatbot): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el chatbot "${chatbot.name}"?`)) {
      this.chatbotService.deleteChatbot(chatbot.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.chatbots = this.chatbots.filter(c => c.id !== chatbot.id);
            console.log('Chatbot eliminado exitosamente');
          }
        },
        error: (error: any) => {
          console.error('Error deleting chatbot:', error);
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'testing':
        return 'En pruebas';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  }

  getProviderLabel(provider: string): string {
    switch (provider) {
      case 'openai':
        return 'OpenAI';
      case 'gemini':
        return 'Gemini';
      case 'anthropic':
        return 'Anthropic';
      default:
        return provider;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      systemPrompt: ['', [Validators.required, Validators.minLength(20)]],
      avatarUrl: [''],
      llmProvider: ['openai', Validators.required],
      
      // OpenAI specific fields
      openaiModel: ['gpt-4o', Validators.required],
      openaiTemperature: [0.7, [Validators.required, Validators.min(0), Validators.max(2)]],
      openaiMaxTokens: [1024, [Validators.required, Validators.min(1), Validators.max(4096)]],
      openaiTopP: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
      openaiStream: [true],
      openaiIncludeUsage: [true],
      
      // Gemini specific fields
      geminiModel: ['gemini-1.5-pro', Validators.required],
      geminiTemperature: [0.8, [Validators.required, Validators.min(0), Validators.max(2)]],
      geminiTopK: [40, [Validators.required, Validators.min(1), Validators.max(100)]],
      geminiMaxOutputTokens: [2048, [Validators.required, Validators.min(1), Validators.max(8192)]],
      geminiStream: [true],
      geminiResponseMimeType: ['application/json', Validators.required],
      
      // Anthropic specific fields
      anthropicModel: ['claude-3-5-sonnet-20240620', Validators.required],
      anthropicTemperature: [0.6, [Validators.required, Validators.min(0), Validators.max(1)]],
      anthropicMaxTokens: [1024, [Validators.required, Validators.min(1), Validators.max(4096)]],
      anthropicTopP: [0.9, [Validators.required, Validators.min(0), Validators.max(1)]],
      anthropicStream: [false],
      
      // Vectorstore fields (optional for all providers)
      vectorstoreEnabled: [false],
      collection: [''],
      vectorSize: [1536, [Validators.min(1)]],
      
      active: [true]
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.chatbotForm.reset();
    this.setDefaultValues();
    this.setupProviderValidation();
  }

  private setDefaultValues(): void {
    this.chatbotForm.patchValue({
      llmProvider: 'openai',
      
      // OpenAI defaults
      openaiModel: 'gpt-4o',
      openaiTemperature: 0.7,
      openaiMaxTokens: 1024,
      openaiTopP: 1,
      openaiStream: true,
      openaiIncludeUsage: true,
      
      // Gemini defaults
      geminiModel: 'gemini-1.5-pro',
      geminiTemperature: 0.8,
      geminiTopK: 40,
      geminiMaxOutputTokens: 2048,
      geminiStream: true,
      geminiResponseMimeType: 'application/json',
      
      // Anthropic defaults
      anthropicModel: 'claude-3-5-sonnet-20240620',
      anthropicTemperature: 0.6,
      anthropicMaxTokens: 1024,
      anthropicTopP: 0.9,
      anthropicStream: false,
      
      // Common defaults
      vectorstoreEnabled: false,
      vectorSize: 1536,
      active: true
    });
  }

  onProviderChange(): void {
    this.setupProviderValidation();
  }

  private setupProviderValidation(): void {
    const provider = this.chatbotForm.get('llmProvider')?.value;
    
    // Reset validators for all provider-specific fields
    this.resetProviderValidators();
    
    if (provider === 'openai') {
      this.setOpenAIValidators();
    } else if (provider === 'gemini') {
      this.setGeminiValidators();
    } else if (provider === 'anthropic') {
      this.setAnthropicValidators();
    }
    
    // Update vectorstore validation
    this.updateVectorstoreValidation();
  }

  private resetProviderValidators(): void {
    const openaiFields = ['openaiModel', 'openaiTemperature', 'openaiMaxTokens', 'openaiTopP'];
    const geminiFields = ['geminiModel', 'geminiTemperature', 'geminiTopK', 'geminiMaxOutputTokens', 'geminiResponseMimeType'];
    const anthropicFields = ['anthropicModel', 'anthropicTemperature', 'anthropicMaxTokens', 'anthropicTopP'];
    
    [...openaiFields, ...geminiFields, ...anthropicFields].forEach(field => {
      this.chatbotForm.get(field)?.clearValidators();
      this.chatbotForm.get(field)?.updateValueAndValidity();
    });
  }

  private setOpenAIValidators(): void {
    this.chatbotForm.get('openaiModel')?.setValidators([Validators.required]);
    this.chatbotForm.get('openaiTemperature')?.setValidators([Validators.required, Validators.min(0), Validators.max(2)]);
    this.chatbotForm.get('openaiMaxTokens')?.setValidators([Validators.required, Validators.min(1), Validators.max(4096)]);
    this.chatbotForm.get('openaiTopP')?.setValidators([Validators.required, Validators.min(0), Validators.max(1)]);
    
    ['openaiModel', 'openaiTemperature', 'openaiMaxTokens', 'openaiTopP'].forEach(field => {
      this.chatbotForm.get(field)?.updateValueAndValidity();
    });
  }

  private setGeminiValidators(): void {
    this.chatbotForm.get('geminiModel')?.setValidators([Validators.required]);
    this.chatbotForm.get('geminiTemperature')?.setValidators([Validators.required, Validators.min(0), Validators.max(2)]);
    this.chatbotForm.get('geminiTopK')?.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
    this.chatbotForm.get('geminiMaxOutputTokens')?.setValidators([Validators.required, Validators.min(1), Validators.max(8192)]);
    this.chatbotForm.get('geminiResponseMimeType')?.setValidators([Validators.required]);
    
    ['geminiModel', 'geminiTemperature', 'geminiTopK', 'geminiMaxOutputTokens', 'geminiResponseMimeType'].forEach(field => {
      this.chatbotForm.get(field)?.updateValueAndValidity();
    });
  }

  private setAnthropicValidators(): void {
    this.chatbotForm.get('anthropicModel')?.setValidators([Validators.required]);
    this.chatbotForm.get('anthropicTemperature')?.setValidators([Validators.required, Validators.min(0), Validators.max(1)]);
    this.chatbotForm.get('anthropicMaxTokens')?.setValidators([Validators.required, Validators.min(1), Validators.max(4096)]);
    this.chatbotForm.get('anthropicTopP')?.setValidators([Validators.required, Validators.min(0), Validators.max(1)]);
    
    ['anthropicModel', 'anthropicTemperature', 'anthropicMaxTokens', 'anthropicTopP'].forEach(field => {
      this.chatbotForm.get(field)?.updateValueAndValidity();
    });
  }

  private updateVectorstoreValidation(): void {
    const vectorstoreEnabled = this.chatbotForm.get('vectorstoreEnabled')?.value;
    
    if (vectorstoreEnabled) {
      this.chatbotForm.get('collection')?.setValidators([Validators.required]);
      this.chatbotForm.get('vectorSize')?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      this.chatbotForm.get('collection')?.clearValidators();
      this.chatbotForm.get('vectorSize')?.clearValidators();
    }
    
    this.chatbotForm.get('collection')?.updateValueAndValidity();
    this.chatbotForm.get('vectorSize')?.updateValueAndValidity();
  }

  onVectorstoreToggle(): void {
    this.updateVectorstoreValidation();
  }

  isOpenAI(): boolean {
    return this.chatbotForm.get('llmProvider')?.value === 'openai';
  }

  isGemini(): boolean {
    return this.chatbotForm.get('llmProvider')?.value === 'gemini';
  }

  isAnthropic(): boolean {
    return this.chatbotForm.get('llmProvider')?.value === 'anthropic';
  }

  isVectorstoreEnabled(): boolean {
    return this.chatbotForm.get('vectorstoreEnabled')?.value;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.chatbotForm.reset();
  }

  onSubmit(): void {
    if (this.chatbotForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.chatbotForm.value;
      
      const chatbotData: ChatbotData = {
        name: formValue.name,
        description: formValue.description,
        systemPrompt: formValue.systemPrompt,
        avatarUrl: formValue.avatarUrl || '',
        llmProvider: formValue.llmProvider,
        active: formValue.active
      };

      // Add provider-specific configuration
      if (formValue.llmProvider === 'openai') {
        chatbotData.openai = {
          model: formValue.openaiModel,
          temperature: formValue.openaiTemperature,
          maxTokens: formValue.openaiMaxTokens,
          topP: formValue.openaiTopP,
          stream: formValue.openaiStream,
          streamOptions: {
            includeUsage: formValue.openaiIncludeUsage
          },
          tools: [] // Por ahora dejamos las herramientas vacías
        };
      } else if (formValue.llmProvider === 'gemini') {
        chatbotData.gemini = {
          model: formValue.geminiModel,
          temperature: formValue.geminiTemperature,
          topK: formValue.geminiTopK,
          maxOutputTokens: formValue.geminiMaxOutputTokens,
          stream: formValue.geminiStream,
          responseMimeType: formValue.geminiResponseMimeType
        };
      } else if (formValue.llmProvider === 'anthropic') {
        chatbotData.anthropic = {
          model: formValue.anthropicModel,
          temperature: formValue.anthropicTemperature,
          maxTokens: formValue.anthropicMaxTokens,
          topP: formValue.anthropicTopP,
          stream: formValue.anthropicStream
        };
      }

      // Add vectorstore configuration if enabled
      if (formValue.vectorstoreEnabled) {
        chatbotData.vectorstore = {
          enabled: formValue.vectorstoreEnabled,
          collection: formValue.collection,
          vectorSize: formValue.vectorSize
        };
      }

      this.chatbotService.createChatbot(chatbotData).subscribe({
        next: (response: ChatbotResponse) => {
          console.log('Chatbot creado exitosamente:', response);
          this.closeCreateForm();
          this.isSubmitting = false;
          // Recargar la lista de chatbots
          this.loadChatbots();
          // Aquí puedes agregar una notificación de éxito
          // this.notificationService.showSuccess('Chatbot creado exitosamente');
        },
        error: (error: any) => {
          console.error('Error al crear chatbot:', error);
          this.isSubmitting = false;
          // Aquí puedes agregar una notificación de error
          // this.notificationService.showError('Error al crear chatbot');
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.chatbotForm.controls).forEach(key => {
        this.chatbotForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.chatbotForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `${fieldName} debe ser mayor a ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} debe ser menor a ${field.errors['max'].max}`;
    }
    return '';
  }
}
