/** USD per mile (or per unit distance) for quote calculation */
export const QUOTE_RATE_PER_UNIT = Number(process.env.QUOTE_RATE_PER_UNIT) || 2.5;

export const DRIVER_STATUSES = ['available', 'busy'];
export const LOAD_STATUSES = ['pending', 'assigned', 'delivered'];
export const ASSIGNMENT_STATUSES = ['active', 'completed', 'cancelled'];
