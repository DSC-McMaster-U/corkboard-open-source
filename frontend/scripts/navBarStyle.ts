import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

export const navBarStyle: BottomTabNavigationOptions['tabBarStyle'] = {
  position: 'absolute',
  bottom: 10,
  left: 16,
  right: 16,
  height: 64,
  borderRadius: 24,
  backgroundColor: '#F5E2D2',
  borderTopWidth: 0,
  elevation: 8,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  paddingBottom: 10,
  paddingTop: 8,
};