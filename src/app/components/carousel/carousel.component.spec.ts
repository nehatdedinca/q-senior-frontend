import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CarouselComponent } from './carousel.component';
import { AssetSlide } from '../../models/collectible-asset';

const SLIDES: AssetSlide[] = [
  { caption: 'Front', icon: 'directions_car' },
  { caption: 'Side', icon: 'image' },
  { caption: 'Interior', imageUrl: 'https://example.com/interior.jpg' },
];

/** Host wrapper so `autoplayMs`/`slides` are bound as real template inputs, exactly how the
 *  component is used in production (signal inputs must be set before the carousel's
 *  constructor runs to be observed there). */
@Component({
  standalone: true,
  imports: [CarouselComponent],
  template: `<app-carousel [slides]="slides" [autoplayMs]="autoplayMs"></app-carousel>`,
})
class HostComponent {
  slides: AssetSlide[] = SLIDES;
  autoplayMs = 0;
}

function createHost(slides: AssetSlide[], autoplayMs: number): ComponentFixture<HostComponent> {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentInstance.slides = slides;
  fixture.componentInstance.autoplayMs = autoplayMs;
  fixture.detectChanges();
  return fixture;
}

describe('CarouselComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  function getCarousel(fixture: ComponentFixture<HostComponent>): CarouselComponent {
    return fixture.debugElement.query(By.directive(CarouselComponent))
      .componentInstance as CarouselComponent;
  }

  it('should create', () => {
    const fixture = createHost(SLIDES, 0);
    expect(getCarousel(fixture)).toBeTruthy();
  });

  it('shows the first slide as active by default', () => {
    const fixture = createHost(SLIDES, 0);
    const carousel = getCarousel(fixture);

    expect(carousel['activeIndex']()).toBe(0);
    expect(carousel['activeSlide']()).toEqual(SLIDES[0]);

    const caption = fixture.debugElement.query(By.css('.carousel__caption'));
    expect(caption.nativeElement.textContent.trim()).toBe('Front');
  });

  it('renders an image when imageUrl is set, and an icon placeholder otherwise', () => {
    const fixture = createHost(SLIDES, 0);
    const carousel = getCarousel(fixture);

    // Slide 0 has no imageUrl -> placeholder icon.
    let img = fixture.debugElement.query(By.css('.carousel__slide img'));
    let icon = fixture.debugElement.query(By.css('.carousel__placeholder mat-icon'));
    expect(img).toBeNull();
    expect(icon.nativeElement.textContent.trim()).toBe('directions_car');

    carousel['goTo'](2);
    fixture.detectChanges();

    img = fixture.debugElement.query(By.css('.carousel__slide img'));
    expect(img.nativeElement.getAttribute('src')).toBe('https://example.com/interior.jpg');
    expect(img.nativeElement.getAttribute('alt')).toBe('Interior');
  });

  it('next() advances to the next slide and wraps around to the first', () => {
    const fixture = createHost(SLIDES, 0);
    const carousel = getCarousel(fixture);

    carousel['next']();
    expect(carousel['activeIndex']()).toBe(1);

    carousel['next']();
    expect(carousel['activeIndex']()).toBe(2);

    carousel['next'](); // wraps
    expect(carousel['activeIndex']()).toBe(0);
  });

  it('previous() moves back and wraps around to the last slide', () => {
    const fixture = createHost(SLIDES, 0);
    const carousel = getCarousel(fixture);

    carousel['previous'](); // wraps from 0 -> last
    expect(carousel['activeIndex']()).toBe(2);

    carousel['previous']();
    expect(carousel['activeIndex']()).toBe(1);
  });

  it('goTo(index) jumps directly to the requested slide', () => {
    const fixture = createHost(SLIDES, 0);
    const carousel = getCarousel(fixture);

    carousel['goTo'](2);
    expect(carousel['activeIndex']()).toBe(2);
  });

  it('clicking the prev/next buttons navigates the carousel', () => {
    const fixture = createHost(SLIDES, 0);
    const carousel = getCarousel(fixture);

    const [prevBtn, nextBtn] = fixture.debugElement.queryAll(By.css('.carousel__nav'));
    nextBtn.nativeElement.click();
    fixture.detectChanges();
    expect(carousel['activeIndex']()).toBe(1);

    prevBtn.nativeElement.click();
    fixture.detectChanges();
    expect(carousel['activeIndex']()).toBe(0);
  });

  it('clicking a dot indicator navigates directly to that slide', () => {
    const fixture = createHost(SLIDES, 0);
    const carousel = getCarousel(fixture);

    const dots = fixture.debugElement.queryAll(By.css('.carousel__dot'));
    expect(dots.length).toBe(SLIDES.length);

    dots[2].nativeElement.click();
    fixture.detectChanges();
    expect(carousel['activeIndex']()).toBe(2);
  });

  it('hides navigation arrows and dots when there is only one slide', () => {
    const fixture = createHost([SLIDES[0]], 0);

    expect(fixture.debugElement.query(By.css('.carousel__nav'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.carousel__dots'))).toBeNull();
  });

  it('renders nothing for the active slide area when there are no slides', () => {
    const fixture = createHost([], 0);
    const carousel = getCarousel(fixture);

    expect(carousel['activeSlide']()).toBeNull();
    expect(fixture.debugElement.query(By.css('.carousel__slide'))).toBeNull();
  });

  it('auto-advances slides on the configured interval', fakeAsync(() => {
    const fixture = createHost(SLIDES, 1000);
    const carousel = getCarousel(fixture);

    expect(carousel['activeIndex']()).toBe(0);
    tick(1000);
    expect(carousel['activeIndex']()).toBe(1);
    tick(1000);
    expect(carousel['activeIndex']()).toBe(2);

    fixture.destroy();
    tick(1000); // flush any remaining timers after teardown
  }));

  it('does not auto-advance when autoplayMs is 0 (disabled)', fakeAsync(() => {
    const fixture = createHost(SLIDES, 0);
    const carousel = getCarousel(fixture);

    tick(10000);
    expect(carousel['activeIndex']()).toBe(0);

    fixture.destroy();
  }));

  it('pauses autoplay on mouseenter and resumes on mouseleave', fakeAsync(() => {
    const fixture = createHost(SLIDES, 1000);
    const carousel = getCarousel(fixture);
    const root = fixture.debugElement.query(By.css('.carousel'));

    root.triggerEventHandler('mouseenter', {});
    tick(3000);
    expect(carousel['activeIndex']()).toBe(0); // paused, no movement

    root.triggerEventHandler('mouseleave', {});
    tick(1000);
    expect(carousel['activeIndex']()).toBe(1); // resumed

    fixture.destroy();
    tick(1000);
  }));

  it('clears the autoplay timer on destroy (no further advances, no dangling timer errors)', fakeAsync(() => {
    const fixture = createHost(SLIDES, 1000);
    const carousel = getCarousel(fixture);

    fixture.destroy();
    // If the timer wasn't cleared this would still advance activeIndex (but the component
    // instance would also be detached) - mainly this proves no error is thrown by leftover timers.
    tick(5000);
    expect(carousel['activeIndex']()).toBe(0);
  }));
});
