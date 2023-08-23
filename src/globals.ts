export const globalSheets: Record<string, Sheet<CharData>> = {}

export const signals: Record<"B" | "BF" | "BE" | "enc_max" | Stat, Computed<number>> & Record<"B_actuel", Signal<number>> = {} as any