import { Injectable, Logger, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SSLCommerzConfig {
  storeId:     string;
  storePass:   string;
  isLive:      boolean;
  backendUrl:  string;
  frontendUrl: string;
  successUrl:  string;
  failUrl:     string;
  cancelUrl:   string;
  ipnUrl:      string;
  endpoint:    string;
  verifyEndpoint: string;
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
    // Validate on startup so misconfiguration is caught immediately
    try {
      this.resolveConfig();
      this.logger.log(
        `SSLCommerz config loaded: mode=${this._config!.isLive ? 'LIVE' : 'SANDBOX'}, ` +
        `ipnUrl=${this._config!.ipnUrl}`,
      );
    } catch (err: any) {
      this.logger.error('Payment configuration error: ' + err.message);
      // Do not crash the server on startup — payment will throw at initiation time
    }
  }

  /** Get validated SSLCommerz config. Throws InternalServerErrorException on misconfiguration. */
  get(): SSLCommerzConfig {
    if (!this._config) {
      this.resolveConfig();
    }
    return this._config!;
  }

  private resolveConfig(): void {
    const nodeEnv    = this.config.get<string>('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';
    const isLive     = this.config.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';

    const storeId   = this.config.get<string>('SSLCOMMERZ_STORE_ID',      '');
    const storePass = this.config.get<string>('SSLCOMMERZ_STORE_PASSWORD', '');

    // In production, store credentials must be set and must not be the sandbox defaults
    if (isProduction) {
      if (!storeId || storeId === 'testbox') {
        throw new InternalServerErrorException(
          'SSLCOMMERZ_STORE_ID must be set to a real store ID in production (not "testbox").',
        );
      }
      if (!storePass || storePass === 'qwerty') {
        throw new InternalServerErrorException(
          'SSLCOMMERZ_STORE_PASSWORD must be set to a real password in production (not "qwerty").',
        );
      }
    } else {
      // Development/test — allow sandbox defaults
      const effectiveId   = storeId   || 'testbox';
      const effectivePass = storePass || 'qwerty';
      if (!storeId || !storePass) {
        this.logger.warn(
          'SSLCOMMERZ_STORE_ID / SSLCOMMERZ_STORE_PASSWORD not set — using sandbox defaults. ' +
          'Set these in .env for test payments to work.',
        );
      }
      // Fall through with sandbox defaults for non-production
    }

    const effectiveId   = storeId   || 'testbox';
    const effectivePass = storePass || 'qwerty';

    const apiPrefix  = this.stripSlash(this.config.get<string>('API_PREFIX', 'api/v1'));
    const frontendUrl = this.stripSlash(
      this.config.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    );

    let backendUrl = this.config.get<string>('BACKEND_URL', '');
    if (!backendUrl) {
      if (isProduction) {
        throw new InternalServerErrorException(
          'BACKEND_URL environment variable is required in production for SSLCommerz IPN/webhook URL.',
        );
      }
      const port = this.config.get<string>('PORT', '5000');
      backendUrl = `http://localhost:${port}`;
      this.logger.warn(`BACKEND_URL not set — using ${backendUrl} (development only).`);
    }
    backendUrl = this.stripSlash(backendUrl);

    const successUrl = this.config.get<string>('SSLCOMMERZ_SUCCESS_URL',
      `${frontendUrl}/payment/success`);
    const failUrl    = this.config.get<string>('SSLCOMMERZ_FAIL_URL',
      `${frontendUrl}/payment/failed`);
    const cancelUrl  = this.config.get<string>('SSLCOMMERZ_CANCEL_URL',
      `${frontendUrl}/payment/cancel`);
    const ipnUrl     = this.config.get<string>('SSLCOMMERZ_WEBHOOK_URL',
      `${backendUrl}/${apiPrefix}/payments/webhook/sslcommerz`);

    // Validate live mode not using sandbox credentials
    if (isLive && effectiveId === 'testbox') {
      throw new InternalServerErrorException(
        'SSLCOMMERZ_IS_LIVE=true but SSLCOMMERZ_STORE_ID is still "testbox". ' +
        'Set real live credentials or set SSLCOMMERZ_IS_LIVE=false for sandbox.',
      );
    }

    this._config = {
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
    };
  }

  private stripSlash(url: string): string {
    return url.replace(/\/+$/, '');
  }
}