import DrawerNavigator from './drawer'; // Importando o DrawerNavigator sem NavigationContainer

export default function RootLayout() {
  return <DrawerNavigator />; // Usando apenas o Drawer como a navegação principal
}
