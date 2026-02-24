// import { createClient } from "@supabase/supabase-js";
// import "expo-sqlite/localStorage/install";
// import "react-native-url-polyfill/auto";

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: localStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

import { useSession } from "@clerk/clerk-expo";
import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import "react-native-url-polyfill/auto";

export function useSupabase() {
  const { session } = useSession();

  return useMemo(() => {
    return createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      },
    );
  }, [session]);
}
