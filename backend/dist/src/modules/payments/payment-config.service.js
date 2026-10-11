"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const SSL_SANDBOX = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
const SSL_LIVE = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
const SSL_VERIFY_SANDBOX = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
const SSL_VERIFY_LIVE = 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';
let PaymentConfigService = PaymentConfigService_1 = class PaymentConfigService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(PaymentConfigService_1.name);
        this._config = null;
    }
    onModuleInit() {
        this._config = this.buildConfig();
        if (this._config.enabled) {
            this.logger.log(`SSLCommerz ready: mode=${this._config.isLive ? 'LIVE' : 'SANDBOX'} ` +
                `ipnUrl=${this._config.ipnUrl}`);
        }
        else {
            this.logger.warn(`SSLCommerz DISABLED: ${this._config.disabledReason}. ` +
                `COD payments will still work. Set required env vars to enable online payments.`);
        }
    }
    get() {
        if (!this._config) {
            this._config = this.buildConfig();
        }
        return this._config;
    }
    buildConfig() {
        const nodeEnv = this.config.get('NODE_ENV', 'development');
        const isProduction = nodeEnv === 'production';
        const frontendUrl = this.stripSlash(this.config.get('FRONTEND_URL', 'http://localhost:3000'));
        const storeId = this.config.get('SSLCOMMERZ_STORE_ID', '');
        const storePass = this.config.get('SSLCOMMERZ_STORE_PASSWORD', '');
        const isLive = this.config.get('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
        const effectiveId = storeId || 'testbox';
        const effectivePass = storePass || 'qwerty';
        let backendUrl = this.config.get('BACKEND_URL', '');
        if (!backendUrl) {
            const port = this.config.get('PORT', '5000');
            backendUrl = `http://localhost:${port}`;
            if (isProduction) {
                this.logger.warn('BACKEND_URL not set. SSLCommerz IPN callbacks will not work correctly.');
            }
        }
        backendUrl = this.stripSlash(backendUrl);
        const apiPrefix = this.stripSlash(this.config.get('API_PREFIX', 'api/v1'));
        const successUrl = this.config.get('SSLCOMMERZ_SUCCESS_URL', `${frontendUrl}/payment/success`);
        const failUrl = this.config.get('SSLCOMMERZ_FAIL_URL', `${frontendUrl}/payment/failed`);
        const cancelUrl = this.config.get('SSLCOMMERZ_CANCEL_URL', `${frontendUrl}/payment/cancel`);
        const ipnUrl = this.config.get('SSLCOMMERZ_WEBHOOK_URL', `${backendUrl}/${apiPrefix}/payments/webhook/sslcommerz`);
        let enabled = true;
        let disabledReason = null;
        if (isLive && effectiveId === 'testbox') {
            enabled = false;
            disabledReason = 'SSLCOMMERZ_IS_LIVE=true but store ID is still "testbox"';
        }
        else if (isProduction && (effectiveId === 'testbox' || effectivePass === 'qwerty')) {
            this.logger.warn('Using SSLCommerz sandbox credentials in production environment.');
        }
        return {
            storeId: effectiveId,
            storePass: effectivePass,
            isLive,
            backendUrl,
            frontendUrl,
            successUrl,
            failUrl,
            cancelUrl,
            ipnUrl,
            endpoint: isLive ? SSL_LIVE : SSL_SANDBOX,
            verifyEndpoint: isLive ? SSL_VERIFY_LIVE : SSL_VERIFY_SANDBOX,
            enabled,
            disabledReason,
        };
    }
    stripSlash(url) {
        return (url || '').replace(/\/+$/, '');
    }
};
exports.PaymentConfigService = PaymentConfigService;
exports.PaymentConfigService = PaymentConfigService = PaymentConfigService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentConfigService);
//# sourceMappingURL=payment-config.service.js.map