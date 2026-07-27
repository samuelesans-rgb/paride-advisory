import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Inserisci nome e cognome.").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Inserisci un indirizzo email valido.").max(160),
  phone: z.string().trim().min(6, "Inserisci un numero di telefono valido.").max(30),
  service: z.string().trim().min(1, "Seleziona un servizio."),
  message: z.string().trim().min(20, "Il messaggio deve contenere almeno 20 caratteri.").max(2000),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
