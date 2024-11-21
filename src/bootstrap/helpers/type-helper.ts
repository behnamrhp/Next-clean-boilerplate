declare const _: unique symbol;

type Forbidden = { [_]: typeof _ };

/**
 * You can use this type to make your parent class method forbidden to overwrite
 */
export type NoOverride<T = void> = T & Forbidden;
