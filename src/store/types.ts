/**
 * This type is intended for the async operation of a "flow". A flow can have
 * several yield statements, but are NOT for the intention of returning values
 * to the caller, but rather for the intent of performing a mobx action that has
 * asynchronous properties.
 */
export type FlowType = Generator<unknown, unknown, unknown> | undefined;
