# Adding Custom Visualizers to ScreenSavy

This guide explains how to add your own custom visualizers to ScreenSavy.

## Overview

ScreenSavy visualizers are standalone HTML files that contain all necessary JavaScript and CSS. They are embedded as iframes in the application and can be either audio-reactive or ambient (non-interactive).

## Quick Start

### 1. Create Your Visualizer HTML File

Create a self-contained HTML file with your visualization code. Here's a basic template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Custom Visualizer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        body {
            background: #000;
        }
        canvas {
            display: block;
            width: 100vw;
            height: 100vh;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        function animate() {
            // Your animation code here
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw something
            ctx.fillStyle = '#fff';
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                10, 10
            );
            
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', resize);
        resize();
        animate();
    </script>
</body>
</html>
```

### 2. Add the File to the Project

Place your HTML file in the `public/visualizers/` directory:

```
public/
└── visualizers/
    ├── CELESTIAL.html
    ├── SUPER_NOVA.html
    ├── your-visualizer.html  ← Add your file here
    └── ...
```

### 3. Register the Visualizer

Edit `src/lib/visualizers.ts` to add your visualizer metadata:

```typescript
export const VISUALIZERS: VisualizerDefinition[] = [
  // ... existing visualizers ...
  {
    slug: 'my-visualizer',
    displayName: {
      en: 'My Custom Visualizer',
      ru: 'Мой Визуализатор'
    },
    category: 'ambient', // or 'audio'
    iframeSrc: '/visualizers/your-visualizer.html',
    summary: {
      en: 'A beautiful custom visualization',
      ru: 'Красивая пользовательская визуализация'
    },
    overlay: {
      actionType: 'ambient', // or 'microphone' / 'systemAudio'
      highlights: {
        en: [
          'Custom particle effects',
          'Smooth animations',
          'Responsive design'
        ],
        ru: [
          'Пользовательские эффекты частиц',
          'Плавные анимации',
          'Адаптивный дизайн'
        ]
      },
      instructions: {
        en: 'Simply watch and enjoy the ambient visualization.',
        ru: 'Просто наблаждайтесь визуализацией.'
      }
    }
  }
];
```

### 4. Create a Route (Optional)

If you want a direct URL for your visualizer, create a route file:

```
app/modes/visualizers/my-visualizer/page.tsx
```

With this content:

```typescript
import { VisualizerDetail } from '@/components/screensavy/VisualizerDetail';

export default function MyVisualizerPage() {
  return <VisualizerDetail slug="my-visualizer" />;
}
```

## Audio-Reactive Visualizers

For audio-reactive visualizers, you need to request microphone access:

```javascript
// Request microphone access
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    source.connect(analyser);
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function animate() {
      analyser.getByteFrequencyData(dataArray);
      
      // Use dataArray for audio-reactive visuals
      // dataArray[0] = low frequencies
      // dataArray[bufferLength-1] = high frequencies
      
      requestAnimationFrame(animate);
    }
    
    animate();
  })
  .catch(err => {
    console.error('Microphone access denied:', err);
  });
```

## Best Practices

### Performance

- Use `requestAnimationFrame` for smooth animations
- Avoid heavy computations in the animation loop
- Use canvas for better performance with many elements
- Consider using WebGL for complex visualizations

### Responsiveness

- Always handle window resize events
- Use viewport units (vw, vh) for sizing
- Test on different screen sizes and aspect ratios

### Styling

- Set `overflow: hidden` on body to prevent scrollbars
- Use `position: fixed` for full-screen elements
- Set appropriate background colors

### Audio Handling

- Always handle permission denials gracefully
- Provide visual feedback when waiting for audio input
- Test with different audio sources (microphone, system audio)

## Example: Simple Particle System

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Particle System</title>
    <style>
        * { margin: 0; padding: 0; overflow: hidden; }
        body { background: #000; }
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        let particles = [];
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 3 + 1;
                this.hue = Math.random() * 360;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        }
        
        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', resize);
        resize();
        animate();
    </script>
</body>
</html>
```

## Troubleshooting

### Visualizer doesn't appear

- Check that the HTML file is in `public/visualizers/`
- Verify the `iframeSrc` path in `visualizers.ts`
- Check browser console for errors

### Audio not working

- Ensure HTTPS is used (required for microphone access)
- Check browser permissions for microphone
- Verify AudioContext is properly initialized

### Performance issues

- Reduce particle count or complexity
- Use `will-change` CSS property for animated elements
- Consider using Web Workers for heavy computations
- Profile with browser DevTools

## Resources

- [Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [RequestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [WebGL Fundamentals](https://webglfundamentals.org/)

---

Happy visualizing! 🎨✨
