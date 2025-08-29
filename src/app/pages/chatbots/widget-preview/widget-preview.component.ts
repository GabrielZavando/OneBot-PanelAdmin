import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetConfig } from '../../../interfaces';

@Component({
  selector: 'app-widget-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-preview.component.html',
  styleUrl: './widget-preview.component.css'
})
export class WidgetPreviewComponent implements OnChanges {
  @Input() config: WidgetConfig | null = null;
  @Input() isOpen: boolean = false;

  previewStyles: any = {};
  bubbleStyles: any = {};
  chatStyles: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.updatePreviewStyles();
    }
  }

  private updatePreviewStyles(): void {
    if (!this.config) return;

    const { appearance, position, behavior } = this.config;

    // Estilos de la burbuja
    this.bubbleStyles = {
      'background-color': appearance.bubbleBackgroundColor,
      'color': appearance.bubbleIconColor,
      'width.px': position.bubbleSize,
      'height.px': position.bubbleSize,
      'border-radius': '50%',
      'box-shadow': appearance.bubbleShadow ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
      'position': 'absolute',
      'bottom.px': position.bubbleMarginY,
      'right.px': position.bubbleMarginX,
      'cursor': 'pointer',
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'transition': behavior.enableAnimations ? `all ${behavior.animationDuration}ms ease` : 'none',
      'opacity': appearance.opacity
    };

    // Aplicar posición de la burbuja
    this.updateBubblePosition();

    // Estilos del chat
    this.chatStyles = {
      'background': appearance.hasGradient 
        ? `linear-gradient(135deg, ${appearance.gradientFrom}, ${appearance.gradientTo})`
        : appearance.backgroundColor,
      'color': appearance.textColor,
      'font-family': appearance.fontFamily,
      'font-size.px': appearance.fontSize,
      'border-radius.px': appearance.borderRadius,
      'border': `${appearance.borderWidth}px solid ${appearance.borderColor}`,
      'width.px': position.chatWidth,
      'height.px': position.chatHeight,
      'position': 'absolute',
      'box-shadow': '0 8px 30px rgba(0, 0, 0, 0.2)',
      'display': this.isOpen ? 'flex' : 'none',
      'flex-direction': 'column',
      'overflow': 'hidden'
    };

    // Aplicar posición del chat
    this.updateChatPosition();
  }

  private updateBubblePosition(): void {
    const { position } = this.config!;
    
    // Reset all position properties
    delete this.bubbleStyles['top'];
    delete this.bubbleStyles['bottom'];
    delete this.bubbleStyles['left'];
    delete this.bubbleStyles['right'];

    switch (position.bubblePosition) {
      case 'bottom-right':
        this.bubbleStyles['bottom.px'] = position.bubbleMarginY;
        this.bubbleStyles['right.px'] = position.bubbleMarginX;
        break;
      case 'bottom-left':
        this.bubbleStyles['bottom.px'] = position.bubbleMarginY;
        this.bubbleStyles['left.px'] = position.bubbleMarginX;
        break;
      case 'top-right':
        this.bubbleStyles['top.px'] = position.bubbleMarginY;
        this.bubbleStyles['right.px'] = position.bubbleMarginX;
        break;
      case 'top-left':
        this.bubbleStyles['top.px'] = position.bubbleMarginY;
        this.bubbleStyles['left.px'] = position.bubbleMarginX;
        break;
    }
  }

  private updateChatPosition(): void {
    const { position } = this.config!;
    
    // Reset all position properties
    delete this.chatStyles['top'];
    delete this.chatStyles['bottom'];
    delete this.chatStyles['left'];
    delete this.chatStyles['right'];

    const bubbleSize = position.bubbleSize;
    const margin = 10; // Margen entre la burbuja y el chat

    switch (position.chatPosition) {
      case 'corner':
        // Posicionar el chat cerca de la burbuja
        if (position.bubblePosition.includes('bottom')) {
          this.chatStyles['bottom.px'] = position.bubbleMarginY + bubbleSize + margin;
        } else {
          this.chatStyles['top.px'] = position.bubbleMarginY + bubbleSize + margin;
        }
        
        if (position.bubblePosition.includes('right')) {
          this.chatStyles['right.px'] = position.bubbleMarginX;
        } else {
          this.chatStyles['left.px'] = position.bubbleMarginX;
        }
        break;
        
      case 'center':
        this.chatStyles['top'] = '50%';
        this.chatStyles['left'] = '50%';
        this.chatStyles['transform'] = 'translate(-50%, -50%)';
        break;
        
      case 'sidebar':
        this.chatStyles['top'] = '0';
        this.chatStyles['bottom'] = '0';
        this.chatStyles['height'] = '100%';
        if (position.bubblePosition.includes('right')) {
          this.chatStyles['right'] = '0';
        } else {
          this.chatStyles['left'] = '0';
        }
        break;
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.updatePreviewStyles();
  }

  getHeaderStyles(): any {
    if (!this.config) return {};

    return {
      'background': this.config.appearance.hasGradient 
        ? `linear-gradient(90deg, ${this.config.appearance.primaryColor}, ${this.config.appearance.secondaryColor})`
        : this.config.appearance.primaryColor,
      'color': 'white',
      'padding': '16px',
      'display': this.config.chat.showHeader ? 'block' : 'none'
    };
  }

  getAnimationClass(): string {
    if (!this.config?.behavior.enableAnimations) return '';
    
    const type = this.config.behavior.animationType;
    return `animate-${type}`;
  }
}
