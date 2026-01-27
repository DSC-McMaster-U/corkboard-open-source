/**
 * Supabase Storage client with service_role key
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceRoleKey) {
    throw new Error("service_role key not found");
}

export const supabaseStorage = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
