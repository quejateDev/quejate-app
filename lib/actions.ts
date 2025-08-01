import { executeAction } from "./executeAction";
import prisma from "./prisma";
import { schema } from "./schema";

const signUp = async (formData: FormData) => {

    return executeAction({
        actionFn: async () => {
            const email = formData.get("email");
            const password = formData.get("password");
            const validatedCredentials = schema.parse({ email, password });

            await prisma.user.create({
                data: {
                    email: validatedCredentials.email,
                    password: validatedCredentials.password,
                    firstName: formData.get("firstName") as string,
                    lastName: formData.get("lastName") as string,
                },
            });
        }
    })
}

export { signUp }
