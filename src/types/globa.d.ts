export {};

declare namespace global {
  type Role = {
    id?: string;
    name: string;
  };
  type Category = {
    id?: string;
    name: string;
  };
  type Tag = {
    id?: string;
    name: string;
  };
  type User = {
    id?: string;
    email: string;
    name: string;
    password: string;
    emailVerified?: boolean;
    provider?: string | null;
    providerId?: string | null;
    avatar?: string | null;
    created_at: Date;
    updated_at: Date;
    posts?: Post[];
    role: Role;
  };
  type Post = {
    id?: string;
    title: string;
    subtitle: string;
    cover: string;
    content?: string | null;
    slug: string;
    published?: boolean;
    created_at?: Date;
    updated_at?: Date;
    categories?: Category[];
    tags?: Tag[];
    author?: User;
  };
}
