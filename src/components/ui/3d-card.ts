export interface CardConfig {
  translateZ?: number;
  translateX?: number;
  translateY?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
}

export class Card3DController {
  private container: HTMLElement;
  private body: HTMLElement;
  private items: NodeListOf<HTMLElement>;
  private rect: DOMRect;
  private centerX: number;
  private centerY: number;
  private isMobile: boolean;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.body = container.querySelector('.card-body') as HTMLElement;
    this.items = container.querySelectorAll('.card-item');
    this.rect = this.container.getBoundingClientRect();
    this.centerX = this.rect.width / 2;
    this.centerY = this.rect.height / 2;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    this.init();
  }
  
  private init(): void {
    // Only add event listeners if not on mobile
    if (!this.isMobile) {
      this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
      this.container.addEventListener('mouseenter', () => this.handleMouseEnter());
      
      // Update rect and centers on window resize
      window.addEventListener('resize', () => {
        this.rect = this.container.getBoundingClientRect();
        this.centerX = this.rect.width / 2;
        this.centerY = this.rect.height / 2;
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        if (this.isMobile) {
          this.removeEffects();
        }
      });
    } else {
      // Remove 3D effects on mobile
      this.removeEffects();
    }
  }

  private removeEffects(): void {
    // Reset all transforms and remove preserve-3d
    this.body.style.transform = 'none';
    this.body.style.transformStyle = 'flat';
    this.items.forEach(item => {
      item.style.transform = 'none';
      item.style.transformStyle = 'flat';
    });
  }
  
  private handleMouseMove(e: MouseEvent): void {
    if (this.isMobile) return;
    
    const mouseX = e.clientX - this.rect.left;
    const mouseY = e.clientY - this.rect.top;
    
    const rotateX = ((mouseY - this.centerY) / this.centerY) * -10;
    const rotateY = ((mouseX - this.centerX) / this.centerX) * 10;
    
    this.body.style.transform = `
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `;
    
    this.items.forEach(item => {
      const config: CardConfig = {
        translateZ: Number(item.dataset.translateZ) || 0,
        translateX: Number(item.dataset.translateX) || 0,
        translateY: Number(item.dataset.translateY) || 0,
        rotateX: Number(item.dataset.rotateX) || 0,
        rotateY: Number(item.dataset.rotateY) || 0,
        rotateZ: Number(item.dataset.rotateZ) || 0
      };
      
      this.applyTransform(item, config);
    });
  }
  
  private handleMouseLeave(): void {
    if (this.isMobile) return;
    
    this.body.style.transform = 'rotateX(0deg) rotateY(0deg)';
    this.items.forEach(item => {
      item.style.transform = 'none';
    });
  }
  
  private handleMouseEnter(): void {
    if (this.isMobile) return;
    
    this.body.style.transition = 'transform 0.2s ease-out';
    this.items.forEach(item => {
      item.style.transition = 'transform 0.2s ease-out';
    });
  }
  
  private applyTransform(element: HTMLElement, config: CardConfig): void {
    if (this.isMobile) return;
    
    element.style.transform = `
      translateZ(${config.translateZ}px)
      translateX(${config.translateX}px)
      translateY(${config.translateY}px)
      rotateX(${config.rotateX}deg)
      rotateY(${config.rotateY}deg)
      rotateZ(${config.rotateZ}deg)
    `;
  }
}