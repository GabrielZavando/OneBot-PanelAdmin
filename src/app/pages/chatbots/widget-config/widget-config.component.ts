import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { 
  WidgetConfig, 
  DEFAULT_WIDGET_CONFIG,
  Chatbot,
  WidgetConfigResponse,
  WidgetConfigUpdateResponse
} from '../../../interfaces';
import { WidgetService } from '../../../services';
import { WidgetPreviewComponent } from '../widget-preview/widget-preview.component';

@Component({
  selector: 'app-widget-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, WidgetPreviewComponent],
  templateUrl: './widget-config.component.html',
  styleUrl: './widget-config.component.css'
})
export class WidgetConfigComponent implements OnInit, OnChanges {
  @Input() chatbot: Chatbot | null = null;
  @Input() isVisible: boolean = false;

  widgetForm: FormGroup;
  isLoading = false;
  isSaving = false;
  embedCode = '';
  previewUrl = '';
  previewConfig: WidgetConfig | null = null;
  showPreview = false;
  
  // Opciones para los selectores
  bubblePositions = [
    { value: 'bottom-right', label: 'Abajo Derecha' },
    { value: 'bottom-left', label: 'Abajo Izquierda' },
    { value: 'top-right', label: 'Arriba Derecha' },
    { value: 'top-left', label: 'Arriba Izquierda' }
  ];

  chatPositions = [
    { value: 'corner', label: 'Esquina' },
    { value: 'center', label: 'Centro' },
    { value: 'sidebar', label: 'Barra lateral' }
  ];

  animationTypes = [
    { value: 'fade', label: 'Desvanecer' },
    { value: 'slide', label: 'Deslizar' },
    { value: 'bounce', label: 'Rebotar' },
    { value: 'none', label: 'Sin animación' }
  ];

  fontFamilies = [
    { value: 'Inter, system-ui, sans-serif', label: 'Inter' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' }
  ];

  constructor(
    private fb: FormBuilder,
    private widgetService: WidgetService
  ) {
    this.widgetForm = this.createForm();
  }

  ngOnInit(): void {
    this.setupFormWatchers();
    // Inicializar vista previa con configuración por defecto
    if (this.chatbot) {
      this.previewConfig = this.widgetService.createDefaultWidgetConfig(this.chatbot.id);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatbot'] && this.chatbot) {
      this.loadWidgetConfig();
      // Inicializar vista previa
      this.previewConfig = this.widgetService.createDefaultWidgetConfig(this.chatbot.id);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Apariencia
      primaryColor: [DEFAULT_WIDGET_CONFIG.appearance.primaryColor, Validators.required],
      secondaryColor: [DEFAULT_WIDGET_CONFIG.appearance.secondaryColor, Validators.required],
      backgroundColor: [DEFAULT_WIDGET_CONFIG.appearance.backgroundColor, Validators.required],
      textColor: [DEFAULT_WIDGET_CONFIG.appearance.textColor, Validators.required],
      bubbleBackgroundColor: [DEFAULT_WIDGET_CONFIG.appearance.bubbleBackgroundColor, Validators.required],
      bubbleIconColor: [DEFAULT_WIDGET_CONFIG.appearance.bubbleIconColor, Validators.required],
      bubbleShadow: [DEFAULT_WIDGET_CONFIG.appearance.bubbleShadow],
      fontFamily: [DEFAULT_WIDGET_CONFIG.appearance.fontFamily, Validators.required],
      fontSize: [DEFAULT_WIDGET_CONFIG.appearance.fontSize, [Validators.required, Validators.min(10), Validators.max(20)]],
      borderRadius: [DEFAULT_WIDGET_CONFIG.appearance.borderRadius, [Validators.required, Validators.min(0), Validators.max(50)]],
      borderWidth: [DEFAULT_WIDGET_CONFIG.appearance.borderWidth, [Validators.required, Validators.min(0), Validators.max(10)]],
      borderColor: [DEFAULT_WIDGET_CONFIG.appearance.borderColor, Validators.required],
      hasGradient: [DEFAULT_WIDGET_CONFIG.appearance.hasGradient],
      gradientFrom: [DEFAULT_WIDGET_CONFIG.appearance.gradientFrom],
      gradientTo: [DEFAULT_WIDGET_CONFIG.appearance.gradientTo],
      opacity: [DEFAULT_WIDGET_CONFIG.appearance.opacity, [Validators.required, Validators.min(0.1), Validators.max(1)]],

      // Comportamiento
      autoOpen: [DEFAULT_WIDGET_CONFIG.behavior.autoOpen],
      autoOpenDelay: [DEFAULT_WIDGET_CONFIG.behavior.autoOpenDelay, [Validators.required, Validators.min(0), Validators.max(60)]],
      allowClose: [DEFAULT_WIDGET_CONFIG.behavior.allowClose],
      closeOnEscape: [DEFAULT_WIDGET_CONFIG.behavior.closeOnEscape],
      allowMinimize: [DEFAULT_WIDGET_CONFIG.behavior.allowMinimize],
      allowResize: [DEFAULT_WIDGET_CONFIG.behavior.allowResize],
      enableAnimations: [DEFAULT_WIDGET_CONFIG.behavior.enableAnimations],
      animationType: [DEFAULT_WIDGET_CONFIG.behavior.animationType, Validators.required],
      animationDuration: [DEFAULT_WIDGET_CONFIG.behavior.animationDuration, [Validators.required, Validators.min(100), Validators.max(2000)]],
      enableSounds: [DEFAULT_WIDGET_CONFIG.behavior.enableSounds],
      rememberState: [DEFAULT_WIDGET_CONFIG.behavior.rememberState],

      // Posición
      bubblePosition: [DEFAULT_WIDGET_CONFIG.position.bubblePosition, Validators.required],
      bubbleMarginX: [DEFAULT_WIDGET_CONFIG.position.bubbleMarginX, [Validators.required, Validators.min(0), Validators.max(100)]],
      bubbleMarginY: [DEFAULT_WIDGET_CONFIG.position.bubbleMarginY, [Validators.required, Validators.min(0), Validators.max(100)]],
      bubbleSize: [DEFAULT_WIDGET_CONFIG.position.bubbleSize, [Validators.required, Validators.min(40), Validators.max(100)]],
      chatPosition: [DEFAULT_WIDGET_CONFIG.position.chatPosition, Validators.required],
      chatWidth: [DEFAULT_WIDGET_CONFIG.position.chatWidth, [Validators.required, Validators.min(300), Validators.max(800)]],
      chatHeight: [DEFAULT_WIDGET_CONFIG.position.chatHeight, [Validators.required, Validators.min(400), Validators.max(800)]],
      mobileBreakpoint: [DEFAULT_WIDGET_CONFIG.position.mobileBreakpoint, [Validators.required, Validators.min(320), Validators.max(1200)]],
      mobileWidth: [DEFAULT_WIDGET_CONFIG.position.mobileWidth, Validators.required],
      mobileHeight: [DEFAULT_WIDGET_CONFIG.position.mobileHeight, Validators.required],

      // Chat
      showHeader: [DEFAULT_WIDGET_CONFIG.chat.showHeader],
      headerTitle: [DEFAULT_WIDGET_CONFIG.chat.headerTitle, Validators.required],
      headerSubtitle: [DEFAULT_WIDGET_CONFIG.chat.headerSubtitle],
      showAvatar: [DEFAULT_WIDGET_CONFIG.chat.showAvatar],
      avatarUrl: [DEFAULT_WIDGET_CONFIG.chat.avatarUrl],
      welcomeMessage: [DEFAULT_WIDGET_CONFIG.chat.welcomeMessage, Validators.required],
      placeholderText: [DEFAULT_WIDGET_CONFIG.chat.placeholderText, Validators.required],
      allowFileUpload: [DEFAULT_WIDGET_CONFIG.chat.allowFileUpload],
      maxFileSize: [DEFAULT_WIDGET_CONFIG.chat.maxFileSize, [Validators.required, Validators.min(1), Validators.max(50)]],
      showTypingIndicator: [DEFAULT_WIDGET_CONFIG.chat.showTypingIndicator],
      showTimestamps: [DEFAULT_WIDGET_CONFIG.chat.showTimestamps],
      maxMessages: [DEFAULT_WIDGET_CONFIG.chat.maxMessages, [Validators.required, Validators.min(10), Validators.max(200)]],
      showPoweredBy: [DEFAULT_WIDGET_CONFIG.chat.showPoweredBy],
      customBranding: [DEFAULT_WIDGET_CONFIG.chat.customBranding]
    });
  }

  private setupFormWatchers(): void {
    // Actualizar vista previa en tiempo real cuando cambien los valores
    this.widgetForm.valueChanges.subscribe(() => {
      // Aquí se puede implementar la vista previa en tiempo real
      this.updatePreview();
    });
  }

  private loadWidgetConfig(): void {
    if (!this.chatbot) return;

    this.isLoading = true;
    this.widgetService.getWidgetConfig(this.chatbot.id).subscribe({
      next: (response: WidgetConfigResponse) => {
        if (response.success && response.data) {
          this.populateForm(response.data);
        } else {
          // Si no existe configuración, crear una por defecto
          const defaultConfig = this.widgetService.createDefaultWidgetConfig(this.chatbot!.id);
          this.populateForm(defaultConfig);
        }
        this.generateEmbedCode();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading widget config:', error);
        // Cargar configuración por defecto en caso de error
        const defaultConfig = this.widgetService.createDefaultWidgetConfig(this.chatbot!.id);
        this.populateForm(defaultConfig);
        this.generateEmbedCode();
        this.isLoading = false;
      }
    });
  }

  private populateForm(config: WidgetConfig): void {
    this.widgetForm.patchValue({
      // Apariencia
      primaryColor: config.appearance.primaryColor,
      secondaryColor: config.appearance.secondaryColor,
      backgroundColor: config.appearance.backgroundColor,
      textColor: config.appearance.textColor,
      bubbleBackgroundColor: config.appearance.bubbleBackgroundColor,
      bubbleIconColor: config.appearance.bubbleIconColor,
      bubbleShadow: config.appearance.bubbleShadow,
      fontFamily: config.appearance.fontFamily,
      fontSize: config.appearance.fontSize,
      borderRadius: config.appearance.borderRadius,
      borderWidth: config.appearance.borderWidth,
      borderColor: config.appearance.borderColor,
      hasGradient: config.appearance.hasGradient,
      gradientFrom: config.appearance.gradientFrom,
      gradientTo: config.appearance.gradientTo,
      opacity: config.appearance.opacity,

      // Comportamiento
      autoOpen: config.behavior.autoOpen,
      autoOpenDelay: config.behavior.autoOpenDelay,
      allowClose: config.behavior.allowClose,
      closeOnEscape: config.behavior.closeOnEscape,
      allowMinimize: config.behavior.allowMinimize,
      allowResize: config.behavior.allowResize,
      enableAnimations: config.behavior.enableAnimations,
      animationType: config.behavior.animationType,
      animationDuration: config.behavior.animationDuration,
      enableSounds: config.behavior.enableSounds,
      rememberState: config.behavior.rememberState,

      // Posición
      bubblePosition: config.position.bubblePosition,
      bubbleMarginX: config.position.bubbleMarginX,
      bubbleMarginY: config.position.bubbleMarginY,
      bubbleSize: config.position.bubbleSize,
      chatPosition: config.position.chatPosition,
      chatWidth: config.position.chatWidth,
      chatHeight: config.position.chatHeight,
      mobileBreakpoint: config.position.mobileBreakpoint,
      mobileWidth: config.position.mobileWidth,
      mobileHeight: config.position.mobileHeight,

      // Chat
      showHeader: config.chat.showHeader,
      headerTitle: config.chat.headerTitle,
      headerSubtitle: config.chat.headerSubtitle,
      showAvatar: config.chat.showAvatar,
      avatarUrl: config.chat.avatarUrl,
      welcomeMessage: config.chat.welcomeMessage,
      placeholderText: config.chat.placeholderText,
      allowFileUpload: config.chat.allowFileUpload,
      maxFileSize: config.chat.maxFileSize,
      showTypingIndicator: config.chat.showTypingIndicator,
      showTimestamps: config.chat.showTimestamps,
      maxMessages: config.chat.maxMessages,
      showPoweredBy: config.chat.showPoweredBy,
      customBranding: config.chat.customBranding
    });
  }

  private buildConfigFromForm(): WidgetConfig {
    const formValue = this.widgetForm.value;
    
    return {
      chatbotId: this.chatbot!.id,
      appearance: {
        primaryColor: formValue.primaryColor,
        secondaryColor: formValue.secondaryColor,
        backgroundColor: formValue.backgroundColor,
        textColor: formValue.textColor,
        bubbleBackgroundColor: formValue.bubbleBackgroundColor,
        bubbleIconColor: formValue.bubbleIconColor,
        bubbleShadow: formValue.bubbleShadow,
        fontFamily: formValue.fontFamily,
        fontSize: formValue.fontSize,
        borderRadius: formValue.borderRadius,
        borderWidth: formValue.borderWidth,
        borderColor: formValue.borderColor,
        hasGradient: formValue.hasGradient,
        gradientFrom: formValue.gradientFrom,
        gradientTo: formValue.gradientTo,
        opacity: formValue.opacity
      },
      behavior: {
        autoOpen: formValue.autoOpen,
        autoOpenDelay: formValue.autoOpenDelay,
        allowClose: formValue.allowClose,
        closeOnEscape: formValue.closeOnEscape,
        allowMinimize: formValue.allowMinimize,
        allowResize: formValue.allowResize,
        enableAnimations: formValue.enableAnimations,
        animationType: formValue.animationType,
        animationDuration: formValue.animationDuration,
        enableSounds: formValue.enableSounds,
        rememberState: formValue.rememberState
      },
      position: {
        bubblePosition: formValue.bubblePosition,
        bubbleMarginX: formValue.bubbleMarginX,
        bubbleMarginY: formValue.bubbleMarginY,
        bubbleSize: formValue.bubbleSize,
        chatPosition: formValue.chatPosition,
        chatWidth: formValue.chatWidth,
        chatHeight: formValue.chatHeight,
        mobileBreakpoint: formValue.mobileBreakpoint,
        mobileWidth: formValue.mobileWidth,
        mobileHeight: formValue.mobileHeight
      },
      chat: {
        showHeader: formValue.showHeader,
        headerTitle: formValue.headerTitle,
        headerSubtitle: formValue.headerSubtitle,
        showAvatar: formValue.showAvatar,
        avatarUrl: formValue.avatarUrl || this.chatbot?.avatarUrl || '',
        welcomeMessage: formValue.welcomeMessage,
        placeholderText: formValue.placeholderText,
        allowFileUpload: formValue.allowFileUpload,
        maxFileSize: formValue.maxFileSize,
        allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        showTypingIndicator: formValue.showTypingIndicator,
        showTimestamps: formValue.showTimestamps,
        maxMessages: formValue.maxMessages,
        showPoweredBy: formValue.showPoweredBy,
        customBranding: formValue.customBranding
      }
    };
  }

  private updatePreview(): void {
    // Generar configuración para la vista previa en tiempo real
    if (this.chatbot && this.widgetForm.valid) {
      this.previewConfig = this.buildConfigFromForm();
      this.generateEmbedCode();
    }
  }

  private generateEmbedCode(): void {
    if (this.chatbot) {
      this.embedCode = this.widgetService.generateEmbedCode(this.chatbot.id);
      this.previewUrl = this.widgetService.generatePreviewUrl(this.chatbot.id);
    }
  }

  onSave(): void {
    if (!this.chatbot || !this.widgetForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    const config = this.buildConfigFromForm();
    const formattedConfig = this.widgetService.formatConfigForAPI(config);

    this.widgetService.updateWidgetConfig(this.chatbot.id, formattedConfig).subscribe({
      next: (response: WidgetConfigUpdateResponse) => {
        if (response.success) {
          console.log('Widget config saved successfully');
          // Aquí puedes agregar una notificación de éxito
        }
        this.isSaving = false;
      },
      error: (error: any) => {
        console.error('Error saving widget config:', error);
        // Aquí puedes agregar una notificación de error
        this.isSaving = false;
      }
    });
  }

  onReset(): void {
    if (this.chatbot) {
      const defaultConfig = this.widgetService.createDefaultWidgetConfig(this.chatbot.id);
      this.populateForm(defaultConfig);
    }
  }

  onClose(): void {
    // Emitir evento para cerrar el componente
    window.dispatchEvent(new CustomEvent('closeWidgetConfig'));
  }

  copyEmbedCode(): void {
    navigator.clipboard.writeText(this.embedCode).then(() => {
      console.log('Embed code copied to clipboard');
      // Aquí puedes agregar una notificación de éxito
    }).catch(err => {
      console.error('Failed to copy embed code:', err);
    });
  }

  openPreview(): void {
    if (this.previewUrl) {
      window.open(this.previewUrl, '_blank');
    }
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.widgetForm.controls).forEach(key => {
      this.widgetForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.widgetForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
    }
    return '';
  }

  // Getters para facilitar el acceso en el template
  get hasGradient(): boolean {
    return this.widgetForm.get('hasGradient')?.value || false;
  }

  get showHeader(): boolean {
    return this.widgetForm.get('showHeader')?.value || false;
  }

  get allowFileUpload(): boolean {
    return this.widgetForm.get('allowFileUpload')?.value || false;
  }

  get enableAnimations(): boolean {
    return this.widgetForm.get('enableAnimations')?.value || false;
  }

  get autoOpen(): boolean {
    return this.widgetForm.get('autoOpen')?.value || false;
  }
}
