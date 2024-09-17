import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return ctx.storage.generateUploadUrl();
});