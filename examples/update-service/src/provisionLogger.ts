import * as loglevel from 'loglevel';

export function provisionLogger(prefix: string, defaultLevel: loglevel.LogLevelDesc = 'INFO') {
  const logger = loglevel.getLogger(prefix);
  logger.setDefaultLevel(defaultLevel);

  const loggerHandler: ProxyHandler<loglevel.Logger> = {
    // The hunter lays a trap for his prey...
    get: (target, prop, receiver) => {
      if (prop == 'trace' || prop == 'debug' || prop == 'info' || prop == 'warn' || prop == 'error' || prop == 'silent') {
        return (message: string) => target[prop](`[${prop.toUpperCase()}][${(new Date()).toISOString()}][${prefix}]: ${message}`)
      }
      return Reflect.get(target, prop, receiver);
    }
  }

  /* Le proxied version of the logger */
  return new Proxy(logger, loggerHandler);
}
