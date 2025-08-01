import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "La contraseña debe tener al menos 1 carácter"),
});

export { schema }