<template>
  <div
    class="text-gray-600 min-h-screen"
  >
    <div :id="String($route.name || 'index')">
      <router-view />
    </div>
  </div>
</template>
