<template>
  <div class="layout-home" >
    <nav>
      <nuxt-link to="/">home</nuxt-link>
      <nuxt-link to="/talks/">talks</nuxt-link>
    </nav>
    <main>
      <nav class="action-bar">
        <a class="btn" href="https://docs.google.com/forms/d/e/1FAIpQLSfTaa-_wOFOQv3dZ7Ord9TJ3vN8wNdzUY5VQqzFiTg_WMQwEw/viewform?c=0&w=1">
          <div>
            submit new talk
          </div>
        </a>
      </nav>
      <nuxt/>
    </main>
  </div>
</template>

<script>

export default {
}
</script>

<style>

html {
  background-color: HSLA(195,29%,97%,1.00);
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  line-height: 1;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
  color: #2b2b2b;
  background-repeat: no-repeat;
  background-size: 1900px;
  background-position: 50% -460px;

}

/* html {
  background-image: url('/tm-big.jpg');
} */

html *,
html ::before,
html ::after {
  box-sizing: inherti;
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.layout-home {
  height: 100%;
  margin: 0 auto;
  max-width: 1240px;
  display: grid;
  grid-column-gap: 60px;
  grid-template-columns: 3fr 9fr;
  justify-content: center;
}

/* .layout-home nav,
.layout-home main {
  outline: 2px solid red;
} */

.action-bar {
  display: flex;
  justify-content: flex-end;
  padding: 40px 0;
}



.btn {
  display: inline-block;
  position: relative;
	background: linear-gradient(-90deg, #EE7752, #E73C7E, #23A6D5, #23D5AB, #EE7752);
	background-size: 400% 100%;
  text-transform: uppercase;
  font-weight: 700;
  border: none;
  border-radius: 0.25em;
  font-size: 13px;
  letter-spacing: 1px;
  padding: 0;
  margin: 0;
  animation: Gradient 4s ease infinite;
  text-decoration: none;

}

.btn div {
  color: black;
  min-height: 48px;
  line-height: 48px;
  padding: 0 1.618em;
  border-radius: inherit;
  background-size: inherit;
  background-image: inherit;
  animation: Gradient 4s ease infinite;
  position: relative;
  z-index: 1;
  mix-blend-mode: overlay;
  font-family: 'Helvetica Neue';

}

@keyframes Gradient {
	50% {
		background-position: 140% 50%;
    transform: skew(-2deg);
	}
}

.btn::after {
  content: '';
  position: absolute;
  background-size: inherit;
  background-image: inherit;
  animation: inherit;
  left: 0px;
  right: 0px;
  top: 2px;
  height: 100%;
  filter: blur(0.5rem);
}


</style>
