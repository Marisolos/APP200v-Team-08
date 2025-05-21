<template>
    <canvas ref="canvas" width="800" height="200"></canvas>
  </template>
  
  <script>
  import carImage from "@/assets/logo.png";
  
  export default {
    name: "CanvasAnimation",
    mounted() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
  
      const car = new Image();
      car.src = carImage;
  
      let x = canvas.width;
      const speed = 2;
  
      car.onload = () => {
        function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const carWidth = 120;
            const carHeight = (car.height / car.width) * carWidth;
            ctx.drawImage(car, x, 50, carWidth, carHeight);

          x -= speed;
          if (x < -100) x = canvas.width;
          requestAnimationFrame(animate);
        }
        animate();
      };
  
      car.onerror = () => {
        console.error("🚫 Failed to load car image");
      };
    }
  };
  </script>
  
  