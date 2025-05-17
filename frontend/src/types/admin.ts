// src/types/admin.ts
import {UUID} from "node:crypto";

export interface Admin {
  id: UUID;
  name: string;
  email: string;
}