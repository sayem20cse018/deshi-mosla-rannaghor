import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SSLCommerzConfig {
  storeId:        string;
  storePass:      string;
  isLive:         boolean;
  backendUrl:     string;
  frontendUrl:    string;
  successUrl:     string;
  failUrl:        string;
  cancelUrl:      string;
  ipnUrl:         string;
  endpoint:       string;
  verifyEndpoint: string;
  /** false = online payment initiation is disabled (missing config) */
  enabled:        boolean;
  disabledReason: string | null;
}

const SSL_SANDBOX        = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
const SSL_LIVE           = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
const SSL_VERIFY_SANDBOX = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
const SSL_VERIFY_LIVE    = 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

@Injectable()
export class PaymentConfigService implements OnModuleInit {
  private readonly logger = new Logger(PaymentConfigService.name);
  private _config: SSLCommerzConfig | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    // Resolve config on startup — NEVER throw, always degrade gracefully
    this._config = this.buildConfig();

    if (this._config.enabled) {
      this.logger.log(
        `SSLCommerz ready: mode=${this._config.isLive ? 'LIVE' : 'SANDBOX'} ` +
        `ipnUrl=${this._config.ipnUrl}`,
      );
    } else {
      this.logger.warn(
        `SSLCommerz DISABLED: ${this._config.disabledReason}. ` +
        `COD payments will still work. Set required env vars to enable online payments.`,
      );
    }
  }

  /**
   * Get current payment config.
   * Always returns a valid object — check `config.enabled` before initiating payment.
   */
  get(): SSLCommerzConfig {
    if (!this._config) {
      this._config = this.buildConfig();
    }
    return this._config;
  }

  /**
   * Build config from environment. Never throws — returns disabled config on any problem.
   */
  private buildConfig(): SSLCommerzConfig {
    const nodeEnv     = this.config.get<string>('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';
    const frontendUrl  = this.stripSlash(
      this.config.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    );

    const storeId   = this.config.get<string>('SSLCOMMERZ_STORE_ID',      '');
    const storePass = this.config.get<string>('SSLCOMMERZ_STORE_PASSWORD', '');
    const isLive    = this.config.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';

    // Determine effective credentials
    const effectiveId   = storeId   || 'testbox';
    const effectivePass = storePass || 'qwerty';

    // Determine backend URL — warn if missing, use safe fallback
    let backendUrl = this.config.get<string>('BACKEND_URL', '');
    if (!backendUrl) {
      const port = this.config.get<string>('PORT', '5000');
      backendUrl = `http://localhost:${port}`;
      if (isProduction) {
        this.logger.warn('BACKEND_URL not set. SSLCommerz IPN callbacks will not work correctly.');
      }
    }
    backendUrl = this.stripSlash(backendUrl);

    const apiPrefix  = this.stripSlash(this.config.get<string>('API_PREFIX', 'api/v1'));
    const successUrl = this.config.get<string>('SSLCOMMERZ_SUCCESS_URL', `${frontendUrl}/payment/success`);
    const failUrl    = this.config.get<string>('SSLCOMMERZ_FAIL_URL',    `${frontendUrl}/payment/failed`);
    const cancelUrl  = this.config.get<string>('SSLCOMMERZ_CANCEL_URL',  `${frontendUrl}/payment/cancel`);
    const ipnUrl     = this.config.get<string>('SSLCOMMERZ_WEBHOOK_URL', `${backendUrl}/${apiPrefix}/payments/webhook/sslcommerz`);

    // Determine if online payment is usable
    let enabled = true;
    let disabledReason: string | null = null;

    if (isLive && effectiveId === 'testbox') {
      enabled = false;
      disabledReason = 'SSLCOMMERZ_IS_LIVE=true but store ID is still "testbox"';
    } else if (isProduction && (effectiveId === 'testbox' || effectivePass === 'qwerty')) {
      // Allow sandbox/testbox in production — just warn, payments will use sandbox mode
      this.logger.warn('Using SSLCommerz sandbox credentials in production environment.');
    }

    return {
      storeId:        effectiveId,
      storePass:      effectivePass,
      isLive,
      backendUrl,
      frontendUrl,
      successUrl,
      failUrl,
      cancelUrl,
      ipnUrl,
      endpoint:       isLive ? SSL_LIVE       : SSL_SANDBOX,
      verifyEndpoint: isLive ? SSL_VERIFY_LIVE : SSL_VERIFY_SANDBOX,
      enabled,
      disabledReason,
    };
  }

  private stripSlash(url: string): string {
    return (url || '').replace(/\/+$/, '');
  }
}
