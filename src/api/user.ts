import { supabase } from "@/lib/supabase";
import { SupabaseBaseService } from "./supabase.base";
import {
  IUser,
  ICreateUserInput,
  IUpdateUserInput,
  ILoginInput,
  IUpdatePasswordInput,
  ApiResponse,
  PaginatedResponse,
} from "@/shared";

const AUTH_EMAIL_DOMAIN = "aam-motors.com";
const toEmail = (username: string) => `${username}@${AUTH_EMAIL_DOMAIN}`;

class UserService extends SupabaseBaseService<IUser, ICreateUserInput, IUpdateUserInput> {
  constructor() {
    super("User");
  }

  async login(credentials: ILoginInput): Promise<ApiResponse<{ user: IUser; token: string }>> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: toEmail(credentials.username),
      password: credentials.password,
    });

    if (error) throw { message: error.message };

    const { data: profile } = await supabase
      .from("User")
      .select("id, username, createdAt")
      .eq("id", data.user.id)
      .single();

    return {
      success: true,
      message: "Signed in successfully",
      data: {
        user: profile as IUser,
        token: data.session.access_token,
      },
    };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getAll(): Promise<PaginatedResponse<IUser>> {
    const { data, error, count } = await supabase
      .from("User")
      .select("id, username, createdAt", { count: "exact" })
      .order("createdAt", { ascending: false });

    if (error) throw { message: error.message };

    return {
      success: true,
      message: "OK",
      data: (data ?? []) as IUser[],
      meta: { total: count ?? 0, page: 1, limit: count ?? 0, totalPages: 1 },
    };
  }

  async createUser(input: ICreateUserInput): Promise<ApiResponse<IUser>> {
    const { data, error } = await supabase.auth.signUp({
      email: toEmail(input.username),
      password: input.password,
      options: { data: { username: input.username } },
    });

    if (error) throw { message: error.message };
    if (!data.user) throw { message: "User creation failed" };

    const { data: profile, error: profileError } = await supabase
      .from("User")
      .insert({ id: data.user.id, username: input.username })
      .select()
      .single();

    if (profileError) throw { message: profileError.message };
    return { success: true, message: "User created successfully", data: profile as IUser };
  }

  async updatePassword(input: IUpdatePasswordInput): Promise<ApiResponse<void>> {
    if (input.newPassword !== input.confirmPassword) {
      throw { message: "Passwords do not match" };
    }
    const { error } = await supabase.auth.updateUser({ password: input.newPassword });
    if (error) throw { message: error.message };
    return { success: true, message: "Password updated successfully", data: undefined as void };
  }
}

export const userServices = new UserService();
export type { IUser, ICreateUserInput, IUpdateUserInput, ILoginInput, IUpdatePasswordInput };
