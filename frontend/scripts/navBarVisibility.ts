import { useNavigation } from "expo-router";
import { useCallback } from "react";
import { navBarStyle } from "./navBarStyle";

export function useNavBarVisibility() {
  const navigation = useNavigation();

  const showNavBar = useCallback(() => {
    navigation.setOptions({ tabBarStyle: navBarStyle });
  }, [navigation]);

  const hideNavBar = useCallback(() => {
    navigation.setOptions({ tabBarStyle: [
        { display: 'none', height: 0, paddingTop: 0, paddingBottom: 0, borderTopWidth: 0}
    ] });
  }, [navigation]);

  return { showNavBar, hideNavBar };
}