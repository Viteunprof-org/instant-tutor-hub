export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      course_logins: {
        Row: {
          course_id: number | null
          created_at: string
          id: number
          socket_id: string
          updated_at: string
          user_id: number | null
          version: number
        }
        Insert: {
          course_id?: number | null
          created_at?: string
          id?: number
          socket_id: string
          updated_at?: string
          user_id?: number | null
          version: number
        }
        Update: {
          course_id?: number | null
          created_at?: string
          id?: number
          socket_id?: string
          updated_at?: string
          user_id?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_9072213b336ba388a28d564fa8b"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_b7d90388484daa7e7a81b1f152e"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          accepted: boolean
          accepted_at: string | null
          amount: number | null
          cancelled: boolean
          completed: boolean
          created_at: string
          credits: number
          description: string
          duration: number
          id: number
          level_id: number | null
          matter_id: number | null
          previous_course_id: number | null
          recall: boolean
          student_id: number | null
          teacher_id: number | null
          updated_at: string
          used_credits: number | null
          version: number
          waiting_time: number
        }
        Insert: {
          accepted?: boolean
          accepted_at?: string | null
          amount?: number | null
          cancelled?: boolean
          completed?: boolean
          created_at?: string
          credits: number
          description: string
          duration?: number
          id?: number
          level_id?: number | null
          matter_id?: number | null
          previous_course_id?: number | null
          recall?: boolean
          student_id?: number | null
          teacher_id?: number | null
          updated_at?: string
          used_credits?: number | null
          version: number
          waiting_time?: number
        }
        Update: {
          accepted?: boolean
          accepted_at?: string | null
          amount?: number | null
          cancelled?: boolean
          completed?: boolean
          created_at?: string
          credits?: number
          description?: string
          duration?: number
          id?: number
          level_id?: number | null
          matter_id?: number | null
          previous_course_id?: number | null
          recall?: boolean
          student_id?: number | null
          teacher_id?: number | null
          updated_at?: string
          used_credits?: number | null
          version?: number
          waiting_time?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_040c1822d3764fe32b6c7c71acd"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_41909d41b68fc950fd9bc684721"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_4b431ee08623fa43dc1dd55c8ef"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_aebe8168f557810612578107b9a"
            columns: ["previous_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_fad76a730ee7f68d0a59652fb12"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_intervals: {
        Row: {
          discount_id: number | null
          id: number
          start_date: string
        }
        Insert: {
          discount_id?: number | null
          id?: number
          start_date: string
        }
        Update: {
          discount_id?: number | null
          id?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_afd286ab83d9e0c4a33feb75298"
            columns: ["discount_id"]
            isOneToOne: true
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_to_users: {
        Row: {
          discount_id: number | null
          id: number
          usage_left: number
          user_id: number | null
        }
        Insert: {
          discount_id?: number | null
          id?: number
          usage_left: number
          user_id?: number | null
        }
        Update: {
          discount_id?: number | null
          id?: number
          usage_left?: number
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_79c21733b49bd944585f101b9b3"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_d6166452dca5bc954614d7254ec"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          amount: number
          coupon: string
          created_at: string
          discount_type: Database["public"]["Enums"]["discounts_discount_type_enum"]
          expire_date: string
          id: number
          is_active: boolean
          is_total_usage: boolean
          nb_reminder: number
          total_usage: number | null
          type: string
          updated_at: string
          usage_per_user: number
          user_id: number | null
          version: number
        }
        Insert: {
          amount?: number
          coupon: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discounts_discount_type_enum"]
          expire_date: string
          id?: number
          is_active?: boolean
          is_total_usage?: boolean
          nb_reminder?: number
          total_usage?: number | null
          type?: string
          updated_at?: string
          usage_per_user?: number
          user_id?: number | null
          version: number
        }
        Update: {
          amount?: number
          coupon?: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discounts_discount_type_enum"]
          expire_date?: string
          id?: number
          is_active?: boolean
          is_total_usage?: boolean
          nb_reminder?: number
          total_usage?: number | null
          type?: string
          updated_at?: string
          usage_per_user?: number
          user_id?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_cdc259c59a163fc7936bc3f5047"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      downloads: {
        Row: {
          created_at: string
          id: number
          platform: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: number
          platform: string
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          id?: number
          platform?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          id: number
          name: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: number
          name: string
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: number
          name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      files: {
        Row: {
          course_id: number | null
          created_at: string
          field: string
          file_name: string
          id: number
          mimetype: string
          path: string
          updated_at: string
          user_id: number | null
          version: number
        }
        Insert: {
          course_id?: number | null
          created_at?: string
          field: string
          file_name: string
          id?: number
          mimetype: string
          path: string
          updated_at?: string
          user_id?: number | null
          version: number
        }
        Update: {
          course_id?: number | null
          created_at?: string
          field?: string
          file_name?: string
          id?: number
          mimetype?: string
          path?: string
          updated_at?: string
          user_id?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_61bae8b7a150a72d7edc32a0a4e"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_a7435dbb7583938d5e7d1376041"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          background_color: string
          color: string
          created_at: string
          id: number
          name: string
          updated_at: string
          version: number
        }
        Insert: {
          background_color: string
          color: string
          created_at?: string
          id?: number
          name: string
          updated_at?: string
          version: number
        }
        Update: {
          background_color?: string
          color?: string
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      levels_old_teachers: {
        Row: {
          level_id: number
          old_teacher_id: number
        }
        Insert: {
          level_id: number
          old_teacher_id: number
        }
        Update: {
          level_id?: number
          old_teacher_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_24e4578c14b9d86af64686bf919"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_94b7e78d6bb020b5121584394b5"
            columns: ["old_teacher_id"]
            isOneToOne: false
            referencedRelation: "old_teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: number
          pack_id: number | null
          transaction_id: string
          type: string
          updated_at: string
          user_discount_id: number | null
          user_id: number | null
          version: number
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: number
          pack_id?: number | null
          transaction_id: string
          type: string
          updated_at?: string
          user_discount_id?: number | null
          user_id?: number | null
          version: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: number
          pack_id?: number | null
          transaction_id?: string
          type?: string
          updated_at?: string
          user_discount_id?: number | null
          user_id?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_70c2c3d40d9f661ac502de51349"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_96e7f2c8ac6ecec618419635578"
            columns: ["user_discount_id"]
            isOneToOne: false
            referencedRelation: "discount_to_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_a7c239e7a6041e2e11cb313d966"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      matter_levels: {
        Row: {
          id: number
          level_id: number | null
          matter_id: number | null
          user_id: number | null
        }
        Insert: {
          id?: number
          level_id?: number | null
          matter_id?: number | null
          user_id?: number | null
        }
        Update: {
          id?: number
          level_id?: number | null
          matter_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_79021fdfb2f09fe442ef04cdb8c"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_bd74aac74081f0cede500ad3454"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_fe11b2ba2254ea61d9ef958410b"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      matters: {
        Row: {
          background_color: string
          color: string
          created_at: string
          disabled: boolean
          id: number
          image: string
          name: string
          updated_at: string
          version: number
        }
        Insert: {
          background_color: string
          color: string
          created_at?: string
          disabled?: boolean
          id?: number
          image: string
          name: string
          updated_at?: string
          version: number
        }
        Update: {
          background_color?: string
          color?: string
          created_at?: string
          disabled?: boolean
          id?: number
          image?: string
          name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      matters_old_teachers: {
        Row: {
          matter_id: number
          old_teacher_id: number
        }
        Insert: {
          matter_id: number
          old_teacher_id: number
        }
        Update: {
          matter_id?: number
          old_teacher_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_1c709a18f65dc5ae164669d6e84"
            columns: ["old_teacher_id"]
            isOneToOne: false
            referencedRelation: "old_teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_8301ccbbbb2f9f9dbd6a4cac2ad"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_tokens: {
        Row: {
          created_at: string
          id: number
          token: string
          updated_at: string
          user_id: number | null
          version: number
        }
        Insert: {
          created_at?: string
          id?: number
          token: string
          updated_at?: string
          user_id?: number | null
          version: number
        }
        Update: {
          created_at?: string
          id?: number
          token?: string
          updated_at?: string
          user_id?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_046760648e82c2ae7c5253d1a14"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      old_teachers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: number
          last_name: string
          phone: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: number
          last_name: string
          phone: string
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          phone?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      packs: {
        Row: {
          background_color: string
          created_at: string
          description: string
          id: number
          is_pack: boolean
          name: string
          nbr_credits: number
          partner_id: number | null
          price: string
          title_color: string
          updated_at: string
          version: number
        }
        Insert: {
          background_color: string
          created_at?: string
          description: string
          id?: number
          is_pack?: boolean
          name: string
          nbr_credits: number
          partner_id?: number | null
          price: string
          title_color: string
          updated_at?: string
          version: number
        }
        Update: {
          background_color?: string
          created_at?: string
          description?: string
          id?: number
          is_pack?: boolean
          name?: string
          nbr_credits?: number
          partner_id?: number | null
          price?: string
          title_color?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_9df52afe1500e47e52410796e97"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string
          first_course_discount_credits: number
          first_course_discount_price: string
          has_first_course_discount: boolean
          id: number
          name: string
          photo: string
          referral_code: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          first_course_discount_credits: number
          first_course_discount_price: string
          has_first_course_discount: boolean
          id?: number
          name: string
          photo: string
          referral_code: string
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          first_course_discount_credits?: number
          first_course_discount_price?: string
          has_first_course_discount?: boolean
          id?: number
          name?: string
          photo?: string
          referral_code?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      playlists: {
        Row: {
          created_at: string
          id: number
          image: string
          name: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: number
          image: string
          name: string
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          id?: number
          image?: string
          name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          id: number
          matter_id: number | null
          question: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: number
          matter_id?: number | null
          question: string
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          id?: number
          matter_id?: number | null
          question?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_b363ff9eaec635211cc647b8189"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          created_at: string
          id: number
          partner_id: number | null
          referral_code: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: number
          partner_id?: number | null
          referral_code: string
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          id?: number
          partner_id?: number | null
          referral_code?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_94e45a27d0df5ddbc2997f374a0"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          course_id: number | null
          created_at: string
          id: number
          rating: number
          reviewee_id: number | null
          reviewer_id: number | null
          updated_at: string
          version: number
        }
        Insert: {
          comment?: string | null
          course_id?: number | null
          created_at?: string
          id?: number
          rating: number
          reviewee_id?: number | null
          reviewer_id?: number | null
          updated_at?: string
          version: number
        }
        Update: {
          comment?: string | null
          course_id?: number | null
          created_at?: string
          id?: number
          rating?: number
          reviewee_id?: number | null
          reviewer_id?: number | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_92e950a2513a79bb3fab273c92e"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_a7b3e1afadd6b52f3b6864745e3"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_f99062f36181ab42863facfaea3"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: number
          key: string
          name: string
          updated_at: string
          value: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: number
          key: string
          name: string
          updated_at?: string
          value: string
          version: number
        }
        Update: {
          created_at?: string
          id?: number
          key?: string
          name?: string
          updated_at?: string
          value?: string
          version?: number
        }
        Relationships: []
      }
      tracks: {
        Row: {
          created_at: string
          id: number
          name: string
          path: string
          playlist_id: number | null
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          path: string
          playlist_id?: number | null
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          path?: string
          playlist_id?: number | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_6f6ec80c43f9e400e56d83bff6c"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      typeorm_metadata: {
        Row: {
          database: string | null
          name: string | null
          schema: string | null
          table: string | null
          type: string
          value: string | null
        }
        Insert: {
          database?: string | null
          name?: string | null
          schema?: string | null
          table?: string | null
          type: string
          value?: string | null
        }
        Update: {
          database?: string | null
          name?: string | null
          schema?: string | null
          table?: string | null
          type?: string
          value?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          adress: string | null
          answer: string | null
          authorized: boolean
          available: boolean
          birth_date: string | null
          city: string | null
          created_at: string
          credit_balance: number | null
          email: string
          fcm_token: string | null
          first_name: string
          free_credit_balance: number | null
          had_course: boolean
          had_first_login: boolean
          iban: string | null
          id: number
          is_pre_registered: boolean
          is_teacher: boolean
          last_abandonned_cart: string | null
          last_abandonned_course: string | null
          last_login_android: string | null
          last_login_ios: string | null
          last_login_mac_os: string | null
          last_login_web: string | null
          last_login_windows: string | null
          last_name: string
          level_id: number | null
          money_balance: string | null
          parent_phone: string | null
          password: string
          phone: string | null
          postal_code: string | null
          profile_picture_id: number | null
          question_id: number | null
          referral_code: string
          referrer: string | null
          rejected: boolean
          school: string | null
          socket_id: string | null
          stripe_account_id: string | null
          stripe_bank_account_id: string | null
          stripe_customer_id: string | null
          stripe_person_id: string | null
          type: Database["public"]["Enums"]["users_type_enum"]
          updated_at: string
          verified: boolean
          version: number
          was_authorized: boolean
        }
        Insert: {
          adress?: string | null
          answer?: string | null
          authorized: boolean
          available: boolean
          birth_date?: string | null
          city?: string | null
          created_at?: string
          credit_balance?: number | null
          email: string
          fcm_token?: string | null
          first_name: string
          free_credit_balance?: number | null
          had_course?: boolean
          had_first_login?: boolean
          iban?: string | null
          id?: number
          is_pre_registered?: boolean
          is_teacher?: boolean
          last_abandonned_cart?: string | null
          last_abandonned_course?: string | null
          last_login_android?: string | null
          last_login_ios?: string | null
          last_login_mac_os?: string | null
          last_login_web?: string | null
          last_login_windows?: string | null
          last_name: string
          level_id?: number | null
          money_balance?: string | null
          parent_phone?: string | null
          password: string
          phone?: string | null
          postal_code?: string | null
          profile_picture_id?: number | null
          question_id?: number | null
          referral_code: string
          referrer?: string | null
          rejected?: boolean
          school?: string | null
          socket_id?: string | null
          stripe_account_id?: string | null
          stripe_bank_account_id?: string | null
          stripe_customer_id?: string | null
          stripe_person_id?: string | null
          type: Database["public"]["Enums"]["users_type_enum"]
          updated_at?: string
          verified: boolean
          version: number
          was_authorized?: boolean
        }
        Update: {
          adress?: string | null
          answer?: string | null
          authorized?: boolean
          available?: boolean
          birth_date?: string | null
          city?: string | null
          created_at?: string
          credit_balance?: number | null
          email?: string
          fcm_token?: string | null
          first_name?: string
          free_credit_balance?: number | null
          had_course?: boolean
          had_first_login?: boolean
          iban?: string | null
          id?: number
          is_pre_registered?: boolean
          is_teacher?: boolean
          last_abandonned_cart?: string | null
          last_abandonned_course?: string | null
          last_login_android?: string | null
          last_login_ios?: string | null
          last_login_mac_os?: string | null
          last_login_web?: string | null
          last_login_windows?: string | null
          last_name?: string
          level_id?: number | null
          money_balance?: string | null
          parent_phone?: string | null
          password?: string
          phone?: string | null
          postal_code?: string | null
          profile_picture_id?: number | null
          question_id?: number | null
          referral_code?: string
          referrer?: string | null
          rejected?: boolean
          school?: string | null
          socket_id?: string | null
          stripe_account_id?: string | null
          stripe_bank_account_id?: string | null
          stripe_customer_id?: string | null
          stripe_person_id?: string | null
          type?: Database["public"]["Enums"]["users_type_enum"]
          updated_at?: string
          verified?: boolean
          version?: number
          was_authorized?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "FK_02ec15de199e79a0c46869895f4"
            columns: ["profile_picture_id"]
            isOneToOne: true
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_08f642b752f63f945086eccbc8d"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_ff44c7b0e9836bcbce79ebf7a7b"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_progresses: {
        Row: {
          created_at: string
          day: string
          id: number
          seconds: number
          sessions: number
          updated_at: string
          user_id: number | null
          version: number
        }
        Insert: {
          created_at?: string
          day: string
          id?: number
          seconds: number
          sessions: number
          updated_at?: string
          user_id?: number | null
          version: number
        }
        Update: {
          created_at?: string
          day?: string
          id?: number
          seconds?: number
          sessions?: number
          updated_at?: string
          user_id?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_fbd86dcc317ec5aebfec6e8c676"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Courses_status_enum:
        | "PENDING"
        | "ACCEPTED"
        | "REJECTED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
      discounts_discount_type_enum: "pack" | "course"
      users_type_enum:
        | "teacher"
        | "professional"
        | "student"
        | "admin"
        | "super_admin"
      Users_type_enum: "STUDENT" | "TEACHER" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Courses_status_enum: [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      discounts_discount_type_enum: ["pack", "course"],
      users_type_enum: [
        "teacher",
        "professional",
        "student",
        "admin",
        "super_admin",
      ],
      Users_type_enum: ["STUDENT", "TEACHER", "ADMIN"],
    },
  },
} as const
