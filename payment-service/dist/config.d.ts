export type PaymentConfig = {
    port: number;
    postgresUrl: string;
    rabbitmqUrl: string;
    confirmationDelayMs: number;
};
export declare function loadConfig(env?: NodeJS.ProcessEnv): PaymentConfig;
