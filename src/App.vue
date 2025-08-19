<template>
  <header class="page-header">
    <h1>Digital Speechzies</h1>
    <h2>Zwischen Körper, Sprache und Fragmenten</h2>
  </header>
  <RouterView/>
  <div class="made-with-love">
    Made with 
    <a href="https://github.com/TheLethalGoose" target="_blank" class="heart-link">
      ♡
    </a>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 6rem;
}

.made-with-love {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.heart-link {
  color: red;
  text-decoration: none;
  margin-left: 0.3rem;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>