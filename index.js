import { registerRootComponent } from "expo";
import App from "./App";

// registerRootComponent chama AppRegistry.registerComponent('main', () => App)
// e garante o setup correto do ambiente, tanto no Expo Go quanto em builds nativos.
registerRootComponent(App);
