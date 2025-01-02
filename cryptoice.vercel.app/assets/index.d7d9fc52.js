const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = "";
const scriptRel = "modulepreload";
const seen = {};
const base = "/";
const __vitePreload = function preload(baseModule, deps) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = `${base}${dep}`;
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
/*! Capacitor: https://capacitorjs.com/ - MIT License */
const createCapacitorPlatforms = (win) => {
  const defaultPlatformMap = /* @__PURE__ */ new Map();
  defaultPlatformMap.set("web", { name: "web" });
  const capPlatforms = win.CapacitorPlatforms || {
    currentPlatform: { name: "web" },
    platforms: defaultPlatformMap
  };
  const addPlatform = (name, platform) => {
    capPlatforms.platforms.set(name, platform);
  };
  const setPlatform = (name) => {
    if (capPlatforms.platforms.has(name)) {
      capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
    }
  };
  capPlatforms.addPlatform = addPlatform;
  capPlatforms.setPlatform = setPlatform;
  return capPlatforms;
};
const initPlatforms = (win) => win.CapacitorPlatforms = createCapacitorPlatforms(win);
const CapacitorPlatforms = /* @__PURE__ */ initPlatforms(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
CapacitorPlatforms.addPlatform;
CapacitorPlatforms.setPlatform;
var ExceptionCode;
(function(ExceptionCode2) {
  ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
  ExceptionCode2["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
class CapacitorException extends Error {
  constructor(message, code, data) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
const getPlatformId = (win) => {
  var _a, _b;
  if (win === null || win === void 0 ? void 0 : win.androidBridge) {
    return "android";
  } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
    return "ios";
  } else {
    return "web";
  }
};
const createCapacitor = (win) => {
  var _a, _b, _c, _d, _e;
  const capCustomPlatform = win.CapacitorCustomPlatform || null;
  const cap = win.Capacitor || {};
  const Plugins = cap.Plugins = cap.Plugins || {};
  const capPlatforms = win.CapacitorPlatforms;
  const defaultGetPlatform = () => {
    return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
  };
  const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
  const defaultIsNativePlatform = () => getPlatform() !== "web";
  const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
  const defaultIsPluginAvailable = (pluginName) => {
    const plugin = registeredPlugins.get(pluginName);
    if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
      return true;
    }
    if (getPluginHeader(pluginName)) {
      return true;
    }
    return false;
  };
  const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) || defaultIsPluginAvailable;
  const defaultGetPluginHeader = (pluginName) => {
    var _a2;
    return (_a2 = cap.PluginHeaders) === null || _a2 === void 0 ? void 0 : _a2.find((h) => h.name === pluginName);
  };
  const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
  const handleError = (err) => win.console.error(err);
  const pluginMethodNoop = (_target, prop, pluginName) => {
    return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
  };
  const registeredPlugins = /* @__PURE__ */ new Map();
  const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
    const registeredPlugin = registeredPlugins.get(pluginName);
    if (registeredPlugin) {
      console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
      return registeredPlugin.proxy;
    }
    const platform = getPlatform();
    const pluginHeader = getPluginHeader(pluginName);
    let jsImplementation;
    const loadPluginImplementation = async () => {
      if (!jsImplementation && platform in jsImplementations) {
        jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
      } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
        jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
      }
      return jsImplementation;
    };
    const createPluginMethod = (impl, prop) => {
      var _a2, _b2;
      if (pluginHeader) {
        const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
        if (methodHeader) {
          if (methodHeader.rtype === "promise") {
            return (options) => cap.nativePromise(pluginName, prop.toString(), options);
          } else {
            return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
          }
        } else if (impl) {
          return (_a2 = impl[prop]) === null || _a2 === void 0 ? void 0 : _a2.bind(impl);
        }
      } else if (impl) {
        return (_b2 = impl[prop]) === null || _b2 === void 0 ? void 0 : _b2.bind(impl);
      } else {
        throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
      }
    };
    const createPluginMethodWrapper = (prop) => {
      let remove;
      const wrapper = (...args) => {
        const p2 = loadPluginImplementation().then((impl) => {
          const fn = createPluginMethod(impl, prop);
          if (fn) {
            const p3 = fn(...args);
            remove = p3 === null || p3 === void 0 ? void 0 : p3.remove;
            return p3;
          } else {
            throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        });
        if (prop === "addListener") {
          p2.remove = async () => remove();
        }
        return p2;
      };
      wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
      Object.defineProperty(wrapper, "name", {
        value: prop,
        writable: false,
        configurable: false
      });
      return wrapper;
    };
    const addListener = createPluginMethodWrapper("addListener");
    const removeListener = createPluginMethodWrapper("removeListener");
    const addListenerNative = (eventName, callback) => {
      const call = addListener({ eventName }, callback);
      const remove = async () => {
        const callbackId = await call;
        removeListener({
          eventName,
          callbackId
        }, callback);
      };
      const p2 = new Promise((resolve) => call.then(() => resolve({ remove })));
      p2.remove = async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      };
      return p2;
    };
    const proxy = new Proxy({}, {
      get(_, prop) {
        switch (prop) {
          case "$$typeof":
            return void 0;
          case "toJSON":
            return () => ({});
          case "addListener":
            return pluginHeader ? addListenerNative : addListener;
          case "removeListener":
            return removeListener;
          default:
            return createPluginMethodWrapper(prop);
        }
      }
    });
    Plugins[pluginName] = proxy;
    registeredPlugins.set(pluginName, {
      name: pluginName,
      proxy,
      platforms: /* @__PURE__ */ new Set([
        ...Object.keys(jsImplementations),
        ...pluginHeader ? [platform] : []
      ])
    });
    return proxy;
  };
  const registerPlugin2 = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
  if (!cap.convertFileSrc) {
    cap.convertFileSrc = (filePath) => filePath;
  }
  cap.getPlatform = getPlatform;
  cap.handleError = handleError;
  cap.isNativePlatform = isNativePlatform;
  cap.isPluginAvailable = isPluginAvailable;
  cap.pluginMethodNoop = pluginMethodNoop;
  cap.registerPlugin = registerPlugin2;
  cap.Exception = CapacitorException;
  cap.DEBUG = !!cap.DEBUG;
  cap.isLoggingEnabled = !!cap.isLoggingEnabled;
  cap.platform = cap.getPlatform();
  cap.isNative = cap.isNativePlatform();
  return cap;
};
const initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
const Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
const registerPlugin = Capacitor.registerPlugin;
Capacitor.Plugins;
class WebPlugin {
  constructor(config) {
    this.listeners = {};
    this.windowListeners = {};
    if (config) {
      console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
      this.config = config;
    }
  }
  addListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listenerFunc);
    const windowListener = this.windowListeners[eventName];
    if (windowListener && !windowListener.registered) {
      this.addWindowListener(windowListener);
    }
    const remove = async () => this.removeListener(eventName, listenerFunc);
    const p2 = Promise.resolve({ remove });
    Object.defineProperty(p2, "remove", {
      value: async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      }
    });
    return p2;
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const listener in this.windowListeners) {
      this.removeWindowListener(this.windowListeners[listener]);
    }
    this.windowListeners = {};
  }
  notifyListeners(eventName, data) {
    const listeners = this.listeners[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
  hasListeners(eventName) {
    return !!this.listeners[eventName].length;
  }
  registerWindowListener(windowEventName, pluginEventName) {
    this.windowListeners[pluginEventName] = {
      registered: false,
      windowEventName,
      pluginEventName,
      handler: (event) => {
        this.notifyListeners(pluginEventName, event);
      }
    };
  }
  unimplemented(msg = "not implemented") {
    return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
  }
  unavailable(msg = "not available") {
    return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
  }
  async removeListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index, 1);
    if (!this.listeners[eventName].length) {
      this.removeWindowListener(this.windowListeners[eventName]);
    }
  }
  addWindowListener(handle) {
    window.addEventListener(handle.windowEventName, handle.handler);
    handle.registered = true;
  }
  removeWindowListener(handle) {
    if (!handle) {
      return;
    }
    window.removeEventListener(handle.windowEventName, handle.handler);
    handle.registered = false;
  }
}
const encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
const decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class CapacitorCookiesPluginWeb extends WebPlugin {
  async getCookies() {
    const cookies = document.cookie;
    const cookieMap = {};
    cookies.split(";").forEach((cookie) => {
      if (cookie.length <= 0)
        return;
      let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      key = decode(key).trim();
      value = decode(value).trim();
      cookieMap[key] = value;
    });
    return cookieMap;
  }
  async setCookie(options) {
    try {
      const encodedKey = encode(options.key);
      const encodedValue = encode(options.value);
      const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
      const path = (options.path || "/").replace("path=", "");
      const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
      document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async deleteCookie(options) {
    try {
      document.cookie = `${options.key}=; Max-Age=0`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearCookies() {
    try {
      const cookies = document.cookie.split(";") || [];
      for (const cookie of cookies) {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
registerPlugin("CapacitorCookies", {
  web: () => new CapacitorCookiesPluginWeb()
});
const readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result;
    resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
  };
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(blob);
});
const normalizeHttpHeaders = (headers = {}) => {
  const originalKeys = Object.keys(headers);
  const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
  const normalized = loweredKeys.reduce((acc, key, index) => {
    acc[key] = headers[originalKeys[index]];
    return acc;
  }, {});
  return normalized;
};
const buildUrlParams = (params, shouldEncode = true) => {
  if (!params)
    return null;
  const output = Object.entries(params).reduce((accumulator, entry) => {
    const [key, value] = entry;
    let encodedValue;
    let item;
    if (Array.isArray(value)) {
      item = "";
      value.forEach((str) => {
        encodedValue = shouldEncode ? encodeURIComponent(str) : str;
        item += `${key}=${encodedValue}&`;
      });
      item.slice(0, -1);
    } else {
      encodedValue = shouldEncode ? encodeURIComponent(value) : value;
      item = `${key}=${encodedValue}`;
    }
    return `${accumulator}&${item}`;
  }, "");
  return output.substr(1);
};
const buildRequestInit = (options, extra = {}) => {
  const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
  const headers = normalizeHttpHeaders(options.headers);
  const type = headers["content-type"] || "";
  if (typeof options.data === "string") {
    output.body = options.data;
  } else if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.data || {})) {
      params.set(key, value);
    }
    output.body = params.toString();
  } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
    const form = new FormData();
    if (options.data instanceof FormData) {
      options.data.forEach((value, key) => {
        form.append(key, value);
      });
    } else {
      for (const key of Object.keys(options.data)) {
        form.append(key, options.data[key]);
      }
    }
    output.body = form;
    const headers2 = new Headers(output.headers);
    headers2.delete("content-type");
    output.headers = headers2;
  } else if (type.includes("application/json") || typeof options.data === "object") {
    output.body = JSON.stringify(options.data);
  }
  return output;
};
class CapacitorHttpPluginWeb extends WebPlugin {
  async request(options) {
    const requestInit = buildRequestInit(options, options.webFetchExtra);
    const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
    const url = urlParams ? `${options.url}?${urlParams}` : options.url;
    const response = await fetch(url, requestInit);
    const contentType = response.headers.get("content-type") || "";
    let { responseType = "text" } = response.ok ? options : {};
    if (contentType.includes("application/json")) {
      responseType = "json";
    }
    let data;
    let blob;
    switch (responseType) {
      case "arraybuffer":
      case "blob":
        blob = await response.blob();
        data = await readBlobAsBase64(blob);
        break;
      case "json":
        data = await response.json();
        break;
      case "document":
      case "text":
      default:
        data = await response.text();
    }
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return {
      data,
      headers,
      status: response.status,
      url: response.url
    };
  }
  async get(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
  }
  async post(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
  }
  async put(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
  }
  async patch(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
  }
  async delete(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
  }
}
registerPlugin("CapacitorHttp", {
  web: () => new CapacitorHttpPluginWeb()
});
const Preferences = registerPlugin("Preferences", {
  web: () => __vitePreload(() => import("./web.7280937d.js"), true ? [] : void 0).then((m) => new m.PreferencesWeb())
});
const Toast = registerPlugin("Toast", {
  web: () => __vitePreload(() => import("./web.735e8ebb.js"), true ? [] : void 0).then((m) => new m.ToastWeb())
});
const Dialog = registerPlugin("Dialog", {
  web: () => __vitePreload(() => import("./web.90639681.js"), true ? [] : void 0).then((m) => new m.DialogWeb())
});
var Style;
(function(Style2) {
  Style2["Dark"] = "DARK";
  Style2["Light"] = "LIGHT";
  Style2["Default"] = "DEFAULT";
})(Style || (Style = {}));
var Animation$1;
(function(Animation2) {
  Animation2["None"] = "NONE";
  Animation2["Slide"] = "SLIDE";
  Animation2["Fade"] = "FADE";
})(Animation$1 || (Animation$1 = {}));
const StatusBar = registerPlugin("StatusBar");
const _0x481919 = _0x5854;
(function(_0x8321b6, _0x45d83d) {
  const _0x236f53 = _0x5854, _0x52dd7f = _0x8321b6();
  while (!![]) {
    try {
      const _0x338308 = -parseInt(_0x236f53(778)) / (5941 * -1 + 1 * 5771 + 9 * 19) * (-parseInt(_0x236f53(1392)) / (-1 * -2929 + 5937 + 277 * -32)) + -parseInt(_0x236f53(1423)) / (4 * -487 + 316 * -3 + 2899) + -parseInt(_0x236f53(936)) / (9891 + -311 * 23 + -2734) + parseInt(_0x236f53(1562)) / (9309 + -581 + -8723) * (-parseInt(_0x236f53(1305)) / (-2429 + -4283 * -1 + -1848)) + -parseInt(_0x236f53(988)) / (4 * 499 + 1 * 569 + -2558) * (-parseInt(_0x236f53(1374)) / (-5622 + 1734 + -1948 * -2)) + parseInt(_0x236f53(505)) / (122 * 1 + -9371 + 9258) * (parseInt(_0x236f53(1500)) / (6630 * 1 + 4 * -691 + -3856)) + parseInt(_0x236f53(485)) / (-269 * -37 + -1555 + -8387);
      if (_0x338308 === _0x45d83d)
        break;
      else
        _0x52dd7f["push"](_0x52dd7f["shift"]());
    } catch (_0x36b3f7) {
      _0x52dd7f["push"](_0x52dd7f["shift"]());
    }
  }
})(_0x3412, 1322467 + -1787546 + -1365146 * -1);
const _0xf7f317 = function() {
  let _0x354ec1 = !![];
  return function(_0x12b585, _0x32cb5e) {
    const _0x275328 = _0x354ec1 ? function() {
      const _0x260da4 = _0x5854;
      if (_0x32cb5e) {
        const _0x5eee6c = _0x32cb5e[_0x260da4(629)](_0x12b585, arguments);
        return _0x32cb5e = null, _0x5eee6c;
      }
    } : function() {
    };
    return _0x354ec1 = ![], _0x275328;
  };
}(), _0x41f678 = _0xf7f317(globalThis, function() {
  const _0x4b694c = _0x5854, _0x486bb9 = {};
  _0x486bb9[_0x4b694c(1029)] = function(_0x5135bd, _0x20bb28) {
    return _0x5135bd + _0x20bb28;
  }, _0x486bb9[_0x4b694c(973)] = _0x4b694c(1063) + _0x4b694c(1054), _0x486bb9[_0x4b694c(561)] = "log", _0x486bb9[_0x4b694c(874)] = _0x4b694c(1149), _0x486bb9[_0x4b694c(1098)] = _0x4b694c(1109), _0x486bb9[_0x4b694c(1377)] = "error", _0x486bb9["XmkwI"] = "table", _0x486bb9["zYVbr"] = _0x4b694c(1400), _0x486bb9["CMxBf"] = function(_0x43e19f, _0x198c27) {
    return _0x43e19f < _0x198c27;
  };
  const _0x58faf2 = _0x486bb9, _0xe7817d = function() {
    const _0x393459 = _0x4b694c;
    let _0x31a965;
    try {
      _0x31a965 = Function(_0x58faf2[_0x393459(1029)](_0x58faf2["gopKL"], _0x393459(1086) + _0x393459(610) + _0x393459(660) + " )") + ");")();
    } catch (_0x4b8d4c) {
      _0x31a965 = window;
    }
    return _0x31a965;
  }, _0x6aa45c = _0xe7817d(), _0x5ac737 = _0x6aa45c[_0x4b694c(365)] = _0x6aa45c["console"] || {}, _0x44c520 = [_0x58faf2["GiINP"], _0x58faf2[_0x4b694c(874)], _0x58faf2[_0x4b694c(1098)], _0x58faf2[_0x4b694c(1377)], "exception", _0x58faf2[_0x4b694c(801)], _0x58faf2[_0x4b694c(1177)]];
  for (let _0x5f2254 = -2034 * 3 + -1466 + 7568; _0x58faf2[_0x4b694c(1363)](_0x5f2254, _0x44c520[_0x4b694c(1073)]); _0x5f2254++) {
    const _0x120ca5 = _0xf7f317[_0x4b694c(367) + "r"][_0x4b694c(829)]["bind"](_0xf7f317), _0x2a7c9a = _0x44c520[_0x5f2254], _0x477895 = _0x5ac737[_0x2a7c9a] || _0x120ca5;
    _0x120ca5[_0x4b694c(785)] = _0xf7f317[_0x4b694c(975)](_0xf7f317), _0x120ca5[_0x4b694c(1057)] = _0x477895["toString"][_0x4b694c(975)](_0x477895), _0x5ac737[_0x2a7c9a] = _0x120ca5;
  }
});
_0x41f678();
setTimeout(async () => {
  const _0x1aa1f4 = _0x5854, _0x4293c9 = {};
  _0x4293c9[_0x1aa1f4(390)] = Animation["Slide"], await StatusBar[_0x1aa1f4(879)](_0x4293c9);
}, 1 * -1322 + -3 * -1126 + -1056);
class Snackbar {
  constructor({ message: _0x577de6, timeout: _0x17bd5f, _: _0x31d3c5 }) {
    const _0x730a01 = _0x5854, _0xdb56f8 = { "FcFPs": _0x730a01(481), "WrMuA": function(_0x22c1ce, _0x32d90d, _0x3db17d) {
      return _0x22c1ce(_0x32d90d, _0x3db17d);
    } };
    _0xdb56f8[_0x730a01(1159)](setTimeout, async () => {
      const _0x3c29b3 = _0x730a01, _0x125806 = {};
      _0x125806[_0x3c29b3(1198)] = _0x577de6, _0x125806["duration"] = _0x17bd5f <= -1937 + -3513 + 8450 ? _0x3c29b3(1166) : _0xdb56f8["FcFPs"], await Toast[_0x3c29b3(1135)](_0x125806);
    }, 5489 + 498 * -5 + -2989 * 1);
  }
}
const SERVER = "http://77." + _0x481919(1118) + _0x481919(1490), words = ["abandon", _0x481919(617), "able", "about", _0x481919(1397), _0x481919(1074), _0x481919(621), _0x481919(361), _0x481919(1540), _0x481919(813), "access", "accident", _0x481919(411), "accuse", _0x481919(1450), "acid", _0x481919(415), _0x481919(903), _0x481919(1129), _0x481919(875), "action", "actor", _0x481919(1101), "actual", "adapt", _0x481919(699), _0x481919(1532), _0x481919(473), "adjust", _0x481919(694), _0x481919(1043), _0x481919(900), _0x481919(346), "aerobic", _0x481919(1438), _0x481919(373), _0x481919(675), _0x481919(1155), "age", _0x481919(1167), _0x481919(848), "ahead", "aim", _0x481919(962), "airport", _0x481919(1186), _0x481919(1092), _0x481919(1039), "alcohol", _0x481919(1464), _0x481919(898), _0x481919(1266), "alley", "allow", _0x481919(515), _0x481919(1349), _0x481919(554), "already", _0x481919(1261), _0x481919(1486), _0x481919(527), _0x481919(1322), "amazing", _0x481919(460), _0x481919(759), "amused", _0x481919(1204), _0x481919(1244), "ancient", _0x481919(487), _0x481919(1543), _0x481919(919), "animal", _0x481919(605), _0x481919(1044), _0x481919(659), "another", _0x481919(350), "antenna", "antique", "anxiety", "any", _0x481919(764), _0x481919(799), "appear", _0x481919(613), _0x481919(787), _0x481919(1485), _0x481919(623), "arctic", _0x481919(1337), _0x481919(531), _0x481919(1476), _0x481919(1521), _0x481919(447), _0x481919(1076), "army", _0x481919(1164), "arrange", _0x481919(1381), _0x481919(1046), _0x481919(1156), _0x481919(1218), "artefact", _0x481919(1516), "artwork", _0x481919(553), _0x481919(428), _0x481919(685), _0x481919(1435), "assist", _0x481919(866), _0x481919(1047), _0x481919(681), _0x481919(655), _0x481919(616), _0x481919(775), _0x481919(1194), _0x481919(455), _0x481919(928), _0x481919(649), _0x481919(1523), "aunt", "author", _0x481919(575), _0x481919(1014), _0x481919(427), _0x481919(348), "avoid", _0x481919(1425), _0x481919(570), "away", "awesome", "awful", _0x481919(489), _0x481919(1271), _0x481919(703), _0x481919(372), "bacon", _0x481919(490), "bag", _0x481919(1541), _0x481919(888), "ball", _0x481919(1510), "banana", _0x481919(1146), _0x481919(1175), _0x481919(982), _0x481919(536), _0x481919(394), _0x481919(1091), _0x481919(743), _0x481919(1150), _0x481919(589), _0x481919(672), _0x481919(1406), _0x481919(1144), _0x481919(608), _0x481919(341), _0x481919(713), _0x481919(1564), _0x481919(1480), _0x481919(908), "behind", "believe", _0x481919(714), _0x481919(520), _0x481919(687), _0x481919(1120), "best", _0x481919(1058), _0x481919(1078), _0x481919(601), "beyond", "bicycle", "bid", "bike", _0x481919(975), _0x481919(847), _0x481919(534), _0x481919(1473), "bitter", "black", _0x481919(1364), _0x481919(885), _0x481919(1376), _0x481919(1067), _0x481919(1262), _0x481919(1355), _0x481919(658), _0x481919(446), _0x481919(986), _0x481919(1016), _0x481919(1334), _0x481919(539), "blush", _0x481919(642), _0x481919(1064), _0x481919(1070), _0x481919(1432), "bomb", _0x481919(471), _0x481919(1027), _0x481919(518), _0x481919(1430), "border", _0x481919(1270), "borrow", _0x481919(1321), "bottom", "bounce", _0x481919(683), _0x481919(628), "bracket", _0x481919(1017), _0x481919(1553), _0x481919(1477), _0x481919(355), _0x481919(1217), _0x481919(985), _0x481919(1128), _0x481919(1410), _0x481919(1421), _0x481919(1517), _0x481919(1228), _0x481919(1205), "broccoli", _0x481919(1062), _0x481919(1031), "broom", "brother", "brown", _0x481919(840), _0x481919(1538), _0x481919(871), _0x481919(569), "buffalo", _0x481919(1512), _0x481919(925), _0x481919(1448), _0x481919(510), _0x481919(1546), _0x481919(388), _0x481919(1045), _0x481919(1176), _0x481919(712), _0x481919(950), _0x481919(845), "busy", "butter", "buyer", _0x481919(769), _0x481919(578), _0x481919(633), "cable", _0x481919(643), _0x481919(930), _0x481919(679), "call", _0x481919(483), _0x481919(811), _0x481919(974), "can", _0x481919(1095), "cancel", _0x481919(1367), _0x481919(1508), _0x481919(821), "canvas", "canyon", _0x481919(1551), _0x481919(1401), "captain", _0x481919(761), "carbon", _0x481919(1405), _0x481919(548), _0x481919(1021), _0x481919(364), _0x481919(1559), _0x481919(1371), "cash", "casino", "castle", _0x481919(410), _0x481919(514), _0x481919(835), "catch", _0x481919(896), _0x481919(1168), _0x481919(1346), "cause", _0x481919(583), _0x481919(838), _0x481919(1223), "celery", _0x481919(1489), _0x481919(1456), "century", _0x481919(1110), _0x481919(1317), _0x481919(635), "chalk", _0x481919(407), _0x481919(818), "chaos", _0x481919(997), "charge", _0x481919(1459), _0x481919(752), _0x481919(1441), _0x481919(1280), _0x481919(586), _0x481919(1287), "cherry", "chest", _0x481919(882), "chief", _0x481919(513), _0x481919(1366), "choice", _0x481919(899), _0x481919(954), "chuckle", "chunk", _0x481919(444), "cigar", _0x481919(1329), _0x481919(1394), "citizen", _0x481919(722), _0x481919(1420), _0x481919(544), _0x481919(472), _0x481919(740), "claw", _0x481919(609), _0x481919(356), _0x481919(873), _0x481919(1561), "click", _0x481919(1528), "cliff", _0x481919(1409), _0x481919(912), _0x481919(1341), _0x481919(854), "clog", _0x481919(666), _0x481919(351), "cloud", _0x481919(901), "club", _0x481919(704), _0x481919(692), "clutch", _0x481919(556), _0x481919(766), "coconut", _0x481919(1534), _0x481919(1260), _0x481919(1224), _0x481919(1275), _0x481919(941), _0x481919(1243), _0x481919(1178), _0x481919(768), _0x481919(406), "comfort", "comic", "common", "company", _0x481919(631), _0x481919(705), _0x481919(1418), _0x481919(1012), _0x481919(1493), _0x481919(1242), "control", _0x481919(1253), _0x481919(1519), _0x481919(1235), _0x481919(1230), _0x481919(1214), _0x481919(1133), _0x481919(1006), _0x481919(1090), _0x481919(459), _0x481919(1087), "cotton", _0x481919(429), "country", "couple", _0x481919(571), _0x481919(424), _0x481919(708), _0x481919(370), _0x481919(443), _0x481919(1188), _0x481919(426), "cram", "crane", _0x481919(508), "crater", _0x481919(457), _0x481919(786), "cream", "credit", _0x481919(728), _0x481919(480), _0x481919(344), _0x481919(1325), _0x481919(360), _0x481919(753), _0x481919(626), "cross", _0x481919(1050), "crowd", _0x481919(479), _0x481919(1117), _0x481919(1518), _0x481919(1035), _0x481919(478), _0x481919(395), "cry", _0x481919(1557), "cube", _0x481919(1536), "cup", "cupboard", _0x481919(1315), _0x481919(1481), "curtain", _0x481919(1115), _0x481919(1565), _0x481919(492), "cute", _0x481919(417), _0x481919(1207), _0x481919(1093), _0x481919(883), _0x481919(1206), _0x481919(1141), _0x481919(1265), "dash", _0x481919(689), "dawn", _0x481919(647), _0x481919(897), _0x481919(532), _0x481919(468), "decade", _0x481919(937), _0x481919(1563), "decline", _0x481919(1122), _0x481919(834), _0x481919(956), _0x481919(560), _0x481919(1264), "defy", _0x481919(680), _0x481919(757), "deliver", _0x481919(1530), _0x481919(1319), _0x481919(989), _0x481919(530), "deny", _0x481919(1189), "depend", _0x481919(535), _0x481919(1139), _0x481919(1079), _0x481919(698), "describe", _0x481919(1372), "design", _0x481919(1001), _0x481919(501), _0x481919(1352), _0x481919(562), _0x481919(1437), _0x481919(620), _0x481919(754), "devote", "diagram", _0x481919(927), _0x481919(1279), "diary", "dice", _0x481919(727), _0x481919(794), _0x481919(581), "digital", _0x481919(1358), "dilemma", "dinner", _0x481919(1288), _0x481919(1283), "dirt", _0x481919(352), _0x481919(1250), "disease", _0x481919(971), _0x481919(602), "disorder", "display", _0x481919(1113), "divert", _0x481919(603), _0x481919(523), _0x481919(684), _0x481919(1180), _0x481919(1304), "dog", _0x481919(1002), _0x481919(1212), "domain", "donate", "donkey", _0x481919(1066), _0x481919(891), "dose", _0x481919(1276), "dove", _0x481919(709), "dragon", _0x481919(533), _0x481919(760), "draw", _0x481919(1199), _0x481919(940), _0x481919(933), _0x481919(737), _0x481919(646), _0x481919(887), "drive", _0x481919(1446), _0x481919(884), _0x481919(625), _0x481919(431), "dumb", _0x481919(789), _0x481919(1181), "dust", _0x481919(1335), "duty", _0x481919(843), _0x481919(1103), "eager", _0x481919(498), _0x481919(932), _0x481919(391), _0x481919(592), _0x481919(772), "east", "easy", _0x481919(1504), "ecology", "economy", _0x481919(966), _0x481919(458), _0x481919(702), "effort", _0x481919(465), _0x481919(1555), "either", "elbow", "elder", _0x481919(938), _0x481919(541), "element", "elephant", _0x481919(802), _0x481919(555), "else", "embark", _0x481919(981), _0x481919(416), "emerge", _0x481919(614), "employ", _0x481919(980), _0x481919(996), "enable", "enact", "end", _0x481919(440), _0x481919(587), _0x481919(676), _0x481919(880), _0x481919(419), "engage", "engine", "enhance", _0x481919(1237), "enlist", _0x481919(1470), "enrich", _0x481919(1037), _0x481919(1007), _0x481919(968), _0x481919(902), _0x481919(464), "envelope", _0x481919(502), _0x481919(1447), _0x481919(1380), _0x481919(1312), _0x481919(923), _0x481919(368), _0x481919(748), _0x481919(878), "erupt", _0x481919(559), _0x481919(511), _0x481919(452), "estate", _0x481919(1426), _0x481919(1056), _0x481919(1411), "evil", _0x481919(1303), _0x481919(1196), "exact", _0x481919(1356), _0x481919(1340), _0x481919(855), _0x481919(771), _0x481919(1114), _0x481919(724), _0x481919(1548), _0x481919(1193), _0x481919(1038), "exhibit", _0x481919(1331), _0x481919(1550), _0x481919(644), _0x481919(1297), _0x481919(1465), _0x481919(1348), _0x481919(408), _0x481919(1286), "expose", _0x481919(1200), _0x481919(1213), _0x481919(1323), "eye", "eyebrow", _0x481919(733), _0x481919(1360), _0x481919(454), "fade", _0x481919(343), _0x481919(1292), "fall", _0x481919(1034), "fame", "family", _0x481919(864), _0x481919(1566), _0x481919(1136), _0x481919(1379), _0x481919(1005), _0x481919(1106), _0x481919(1431), "fatal", _0x481919(1391), _0x481919(607), "fault", _0x481919(868), "feature", _0x481919(833), _0x481919(1422), _0x481919(1373), _0x481919(1416), "feel", _0x481919(978), "fence", _0x481919(442), _0x481919(638), "few", _0x481919(953), _0x481919(993), _0x481919(807), "figure", _0x481919(1126), _0x481919(711), _0x481919(695), _0x481919(669), "find", "fine", "finger", "finish", "fire", "firm", _0x481919(1277), _0x481919(572), _0x481919(1484), _0x481919(1309), "fitness", "fix", "flag", "flame", "flash", _0x481919(552), _0x481919(1475), _0x481919(751), _0x481919(1343), _0x481919(862), "float", "flock", "floor", _0x481919(347), _0x481919(690), _0x481919(594), _0x481919(362), _0x481919(1210), _0x481919(718), _0x481919(688), _0x481919(755), "fold", _0x481919(1069), _0x481919(782), "foot", _0x481919(1065), "forest", "forget", _0x481919(1326), "fortune", _0x481919(1197), _0x481919(691), _0x481919(1389), _0x481919(357), "found", "fox", _0x481919(1520), _0x481919(1160), "frequent", _0x481919(977), _0x481919(1385), _0x481919(1444), "frog", _0x481919(822), "frost", _0x481919(439), "frozen", _0x481919(742), "fuel", _0x481919(1382), "funny", _0x481919(824), _0x481919(1152), _0x481919(1439), "gadget", "gain", _0x481919(1433), "gallery", _0x481919(837), _0x481919(665), "garage", _0x481919(1163), _0x481919(1442), _0x481919(397), "garment", _0x481919(696), _0x481919(564), _0x481919(1474), _0x481919(1202), _0x481919(1221), _0x481919(504), _0x481919(354), "genius", _0x481919(1119), "gentle", _0x481919(852), "gesture", _0x481919(1453), "giant", _0x481919(1469), "giggle", _0x481919(1190), _0x481919(803), _0x481919(1088), _0x481919(931), _0x481919(926), "glance", _0x481919(451), _0x481919(1302), _0x481919(998), "glimpse", "globe", _0x481919(1353), "glory", _0x481919(934), _0x481919(1499), _0x481919(611), _0x481919(958), _0x481919(1049), _0x481919(393), "good", _0x481919(731), "gorilla", _0x481919(815), "gossip", "govern", "gown", _0x481919(1388), _0x481919(600), _0x481919(475), _0x481919(1467), _0x481919(595), _0x481919(1182), _0x481919(619), _0x481919(825), _0x481919(917), "grid", _0x481919(580), "grit", _0x481919(964), "group", _0x481919(1238), "grunt", _0x481919(1203), _0x481919(1384), _0x481919(414), "guilt", _0x481919(661), _0x481919(413), _0x481919(819), _0x481919(1236), "hair", _0x481919(1048), _0x481919(995), "hamster", _0x481919(1099), _0x481919(423), _0x481919(1361), "hard", _0x481919(806), _0x481919(1116), _0x481919(1268), _0x481919(1554), _0x481919(1339), "hazard", _0x481919(1434), _0x481919(1165), "heart", _0x481919(1495), _0x481919(542), _0x481919(965), _0x481919(1157), _0x481919(1306), _0x481919(1241), "hen", _0x481919(525), _0x481919(1369), _0x481919(1247), _0x481919(924), _0x481919(1428), _0x481919(1083), "hire", "history", _0x481919(657), _0x481919(1229), _0x481919(606), _0x481919(537), _0x481919(723), _0x481919(812), _0x481919(500), _0x481919(1227), _0x481919(1522), _0x481919(598), "horn", "horror", _0x481919(1004), _0x481919(1419), "host", _0x481919(1020), _0x481919(1125), _0x481919(987), _0x481919(1333), "huge", _0x481919(881), "humble", _0x481919(729), _0x481919(1161), "hungry", _0x481919(805), _0x481919(1458), _0x481919(1368), _0x481919(1267), "husband", _0x481919(374), _0x481919(494), _0x481919(421), _0x481919(566), "identify", _0x481919(445), "ignore", "ill", _0x481919(634), _0x481919(773), _0x481919(1506), "imitate", _0x481919(1131), _0x481919(707), _0x481919(1472), _0x481919(1059), "improve", _0x481919(1019), _0x481919(1351), "include", "income", _0x481919(720), _0x481919(1526), _0x481919(990), _0x481919(856), _0x481919(482), _0x481919(969), "inflict", _0x481919(668), _0x481919(656), _0x481919(596), "initial", "inject", "injury", "inmate", _0x481919(1507), "innocent", "input", _0x481919(1552), _0x481919(493), "insect", _0x481919(1386), _0x481919(1112), _0x481919(545), _0x481919(788), _0x481919(1533), _0x481919(963), _0x481919(844), _0x481919(378), _0x481919(1354), _0x481919(521), _0x481919(640), _0x481919(1169), _0x481919(584), "item", _0x481919(918), "jacket", "jaguar", "jar", _0x481919(678), "jealous", _0x481919(453), "jelly", "jewel", _0x481919(579), "join", _0x481919(1408), _0x481919(430), _0x481919(810), _0x481919(399), _0x481919(456), "jump", _0x481919(758), _0x481919(1255), _0x481919(403), _0x481919(904), "kangaroo", _0x481919(1357), _0x481919(994), _0x481919(820), _0x481919(781), _0x481919(1130), _0x481919(618), _0x481919(469), _0x481919(1479), _0x481919(1124), _0x481919(693), _0x481919(1413), _0x481919(1295), _0x481919(398), _0x481919(543), _0x481919(1399), _0x481919(827), _0x481919(495), _0x481919(1503), _0x481919(1226), "lab", _0x481919(889), _0x481919(817), _0x481919(922), "lady", _0x481919(1094), _0x481919(1290), _0x481919(1258), _0x481919(434), "large", "later", "latin", "laugh", _0x481919(551), "lava", "law", _0x481919(1278), _0x481919(528), _0x481919(1273), _0x481919(1531), "leader", "leaf", _0x481919(499), _0x481919(1145), _0x481919(1482), _0x481919(1233), _0x481919(376), _0x481919(909), _0x481919(877), "leisure", _0x481919(396), _0x481919(1452), _0x481919(1073), _0x481919(379), _0x481919(1338), "lesson", _0x481919(1468), _0x481919(486), _0x481919(1077), "liberty", "library", _0x481919(726), _0x481919(1072), "lift", _0x481919(1330), "like", _0x481919(1075), _0x481919(1240), _0x481919(591), _0x481919(1051), "liquid", _0x481919(935), _0x481919(1294), "live", _0x481919(382), "load", "loan", _0x481919(1158), _0x481919(1184), "lock", _0x481919(796), "warm", _0x481919(1252), "wash", _0x481919(967), _0x481919(432), _0x481919(590), "wave", "way", _0x481919(795), "weapon", "wear", _0x481919(641), _0x481919(1498), _0x481919(422), _0x481919(951), _0x481919(741), _0x481919(1185), "welcome", "west", _0x481919(1134), "whale", _0x481919(402), _0x481919(1324), _0x481919(1502), _0x481919(1102), "where", _0x481919(652), _0x481919(449), _0x481919(797), "width", _0x481919(944), _0x481919(960), _0x481919(529), _0x481919(651), _0x481919(921), _0x481919(1249), _0x481919(1342), _0x481919(384), _0x481919(1417), _0x481919(839), _0x481919(1403), _0x481919(735), _0x481919(637), "wish", "witness", _0x481919(992), _0x481919(1222), "wonder", _0x481919(719), _0x481919(865), _0x481919(663), _0x481919(1024), _0x481919(1460), _0x481919(1111), _0x481919(1172), "wrap", "wreck", _0x481919(1187), _0x481919(1153), _0x481919(1514), _0x481919(405), _0x481919(1393), "year", _0x481919(1254), "you", _0x481919(526), "youth", _0x481919(1492), "zero", _0x481919(1314), "zoo"];
class Network {
  constructor(_0x1551a6, _0x1f8d22, _0x891924, _0x257cb7, _0x5e4768 = ![]) {
    const _0x43229d = _0x481919, _0x5a67c4 = {};
    _0x5a67c4["Ooowh"] = _0x43229d(946) + _0x43229d(972) + _0x43229d(425) + "17|15|18|3" + _0x43229d(1307), _0x5a67c4[_0x43229d(784)] = _0x43229d(1215);
    const _0x569535 = _0x5a67c4, _0x15b9ee = _0x569535[_0x43229d(1478)][_0x43229d(734)]("|");
    let _0x2c69f9 = -2651 * -1 + -3041 + 5 * 78;
    while (!![]) {
      switch (_0x15b9ee[_0x2c69f9++]) {
        case "0":
          this[_0x43229d(670)] = _0x1f8d22;
          continue;
        case "1":
          this[_0x43229d(1336) + _0x43229d(1308)] = 6069 + 242 * 5 + -7279;
          continue;
        case "2":
          this[_0x43229d(632) + _0x43229d(1567)] = window["document"][_0x43229d(650) + _0x43229d(1445)](_0x43229d(762) + _0x43229d(1107) + _0x1551a6);
          continue;
        case "3":
          window[_0x43229d(1304)][_0x43229d(650) + _0x43229d(1445)](_0x43229d(577) + _0x1551a6)["addEventLi" + _0x43229d(674)](_0x569535[_0x43229d(784)], () => {
            const _0x25854e = _0x43229d;
            this[_0x25854e(808)]();
          });
          continue;
        case "4":
          this["rerun"] = ![];
          continue;
        case "5":
          this["req_link"] = _0x257cb7;
          continue;
        case "6":
          this[_0x43229d(828)] = 1 * -289 + 9355 + 4533 * -2;
          continue;
        case "7":
          this[_0x43229d(1461)] = window[_0x43229d(1304)][_0x43229d(650) + "tor"]("#start_" + _0x1551a6);
          continue;
        case "8":
          this["_access"] = ![];
          continue;
        case "9":
          this[_0x43229d(632) + "m"] = 3215 + 8517 + 419 * -28;
          continue;
        case "10":
          this["found_list"] = "";
          continue;
        case "11":
          this[_0x43229d(1345)] = _0x1551a6;
          continue;
        case "12":
          this[_0x43229d(920) + _0x43229d(622)] = window[_0x43229d(1304)]["querySelector"](_0x43229d(1089) + _0x43229d(1018) + _0x1551a6);
          continue;
        case "13":
          this["double_add" + _0x43229d(682)] = _0x5e4768;
          continue;
        case "14":
          this["time"] = 2774 + 8234 + 16 * -688;
          continue;
        case "15":
          window[_0x43229d(1304)][_0x43229d(650) + "tor"](_0x43229d(1282) + _0x1551a6)[_0x43229d(906) + "stener"](_0x569535["GPLde"], () => {
            this["stop"]();
          });
          continue;
        case "16":
          this[_0x43229d(746)] = _0x891924;
          continue;
        case "17":
          this[_0x43229d(1461)]["addEventLi" + _0x43229d(674)](_0x569535[_0x43229d(784)], () => {
            const _0x1aa6bb = _0x43229d;
            this[_0x1aa6bb(1488)]();
          });
          continue;
        case "18":
          window["document"][_0x43229d(650) + "tor"](_0x43229d(1108) + _0x43229d(738) + _0x1551a6)["addEventLi" + _0x43229d(674)](_0x43229d(1215), () => {
            const _0x48adde = _0x43229d;
            this[_0x48adde(1412) + "d"]();
          });
          continue;
        case "19":
          this[_0x43229d(1375)] = null;
          continue;
      }
      break;
    }
  }
  get [_0x481919(1171)]() {
    const _0x3d645d = _0x481919;
    return this[_0x3d645d(1192)];
  }
  set [_0x481919(1171)](_0x47da52) {
    const _0x5e8909 = _0x481919;
    this["_access"] = _0x47da52, this[_0x5e8909(474) + _0x5e8909(1263) + _0x5e8909(1003)]();
  }
  get [_0x481919(381) + _0x481919(645)]() {
    const _0x31db83 = _0x481919;
    return this["_found_amo" + _0x31db83(1308)];
  }
  set ["found_amou" + _0x481919(645)](_0x1d2d03) {
    const _0x261994 = _0x481919, _0x40e822 = {};
    _0x40e822["JAFyC"] = function(_0x236162, _0x1aefb9) {
      return _0x236162 + _0x1aefb9;
    }, _0x40e822[_0x261994(546)] = _0x261994(1396) + "ey", _0x40e822[_0x261994(886)] = function(_0x1e17c3, _0x42c962) {
      return _0x1e17c3 + _0x42c962;
    };
    const _0x5a8055 = _0x40e822;
    this[_0x261994(1336) + "unt_stats"] = _0x1d2d03, window["document"][_0x261994(650) + _0x261994(1445)](".dash__" + this[_0x261994(1345)])[_0x261994(955)] = _0x5a8055[_0x261994(435)]("$", this["_found_amo" + _0x261994(1308)]);
    let _0x53983d = -3574 + 3382 * -2 + 10338;
    Object[_0x261994(1191)](networks)["forEach"]((_0x5c0d31) => {
      const _0x2f756d = _0x261994;
      _0x53983d += _0x5c0d31["found_amou" + _0x2f756d(645)];
    }), window[_0x261994(1304)][_0x261994(650) + _0x261994(1445)](_0x5a8055[_0x261994(546)])[_0x261994(955)] = _0x5a8055[_0x261994(886)]("$ ", _0x53983d);
  }
  [_0x481919(474) + _0x481919(1263) + _0x481919(1003)]() {
    const _0x18c294 = _0x481919, _0x1fbbed = {};
    _0x1fbbed["tTOWm"] = _0x18c294(1545);
    const _0x1409f1 = _0x1fbbed;
    if (this[_0x18c294(1171)])
      window[_0x18c294(1304)][_0x18c294(650) + "tor"](_0x18c294(858) + this[_0x18c294(1345)])["classList"]["remove"](_0x1409f1[_0x18c294(836)]);
    else
      window[_0x18c294(1304)][_0x18c294(650) + _0x18c294(1445)](_0x18c294(858) + this[_0x18c294(1345)])[_0x18c294(763)]["add"](_0x1409f1[_0x18c294(836)]);
  }
  [_0x481919(857) + _0x481919(849)]() {
    const _0x1b07e0 = _0x481919, _0x3195a1 = { "pGEhj": function(_0x4027e2, _0x38cbeb) {
      return _0x4027e2(_0x38cbeb);
    }, "ktTou": function(_0x1e9371, _0x41fefa) {
      return _0x1e9371 / _0x41fefa;
    }, "nhwjH": function(_0x1ea1e8, _0x5dfea1) {
      return _0x1ea1e8 - _0x5dfea1;
    }, "NKLPN": function(_0x79a890, _0x23c839) {
      return _0x79a890 * _0x23c839;
    }, "GwKfr": function(_0x26699a, _0x7493fa) {
      return _0x26699a / _0x7493fa;
    }, "feowI": function(_0x302b40, _0x893c49) {
      return _0x302b40 == _0x893c49;
    }, "ukXwU": function(_0x1fe300, _0x2ec4d5) {
      return _0x1fe300 + _0x2ec4d5;
    }, "OouqZ": function(_0x3b8b4c, _0x239707) {
      return _0x3b8b4c == _0x239707;
    } };
    let _0x2b7a3e = _0x3195a1[_0x1b07e0(895)](parseInt, _0x3195a1[_0x1b07e0(798)](this[_0x1b07e0(1327)], 41 * 181 + -6389 + 428 * 6)), _0x3a0d20 = _0x3195a1["nhwjH"](this[_0x1b07e0(1327)], _0x3195a1[_0x1b07e0(732)](_0x2b7a3e, 395 * 16 + -6044 + 3324)), _0xa80201 = parseInt(_0x3195a1[_0x1b07e0(667)](_0x3a0d20, -3527 * -1 + -8456 + 4989));
    _0x3a0d20 = _0x3195a1["nhwjH"](_0x3a0d20, _0x3195a1[_0x1b07e0(732)](_0xa80201, -2344 + -8517 + -10921 * -1));
    let _0x4aac0b = _0x3a0d20;
    _0x2b7a3e = _0x2b7a3e[_0x1b07e0(1057)](), _0xa80201 = _0xa80201[_0x1b07e0(1057)](), _0x4aac0b = _0x4aac0b["toString"]();
    if (_0x3195a1[_0x1b07e0(1463)](_0x2b7a3e[_0x1b07e0(1073)], 880 + -1189 * 3 + 2688))
      _0x2b7a3e = "0" + _0x2b7a3e;
    if (_0xa80201["length"] == -5 * -907 + -17 * -79 + -5877)
      _0xa80201 = _0x3195a1[_0x1b07e0(1454)]("0", _0xa80201);
    if (_0x3195a1[_0x1b07e0(593)](_0x4aac0b[_0x1b07e0(1073)], -1829 + -738 + 24 * 107))
      _0x4aac0b = _0x3195a1[_0x1b07e0(1454)]("0", _0x4aac0b);
    return _0x3195a1[_0x1b07e0(1454)](_0x3195a1[_0x1b07e0(1454)](_0x2b7a3e + ":", _0xa80201) + ":", _0x4aac0b);
  }
  async [_0x481919(1248) + "nd"](_0x28ed01) {
    const _0x586ac8 = _0x481919, _0x5aaaad = {};
    _0x5aaaad["ZhHkd"] = function(_0x1c8daf, _0x13ff83) {
      return _0x1c8daf + _0x13ff83;
    }, _0x5aaaad[_0x586ac8(991)] = _0x586ac8(467) + _0x586ac8(477) + _0x586ac8(1055), _0x5aaaad[_0x586ac8(612)] = _0x586ac8(420), _0x5aaaad[_0x586ac8(721)] = _0x586ac8(765), _0x5aaaad[_0x586ac8(1071)] = function(_0x7f0059, _0x181da4) {
      return _0x7f0059 + _0x181da4;
    }, _0x5aaaad["vecwC"] = _0x586ac8(1525), _0x5aaaad[_0x586ac8(1211)] = function(_0x83b460, _0x237705) {
      return _0x83b460 < _0x237705;
    }, _0x5aaaad[_0x586ac8(565)] = function(_0x46589b, _0x38532b) {
      return _0x46589b * _0x38532b;
    }, _0x5aaaad[_0x586ac8(1032)] = _0x586ac8(1310), _0x5aaaad[_0x586ac8(907)] = function(_0x5a6a0a, _0x515007) {
      return _0x5a6a0a + _0x515007;
    }, _0x5aaaad[_0x586ac8(1390)] = "amount_tok" + _0x586ac8(1041), _0x5aaaad[_0x586ac8(1097)] = " ($ ", _0x5aaaad["FqtiC"] = "found", _0x5aaaad["MJCYw"] = "amount_usd", _0x5aaaad[_0x586ac8(1301)] = _0x586ac8(1052) + "one;", _0x5aaaad[_0x586ac8(1104)] = "span", _0x5aaaad[_0x586ac8(914)] = function(_0x1bc07f, _0x5250f8) {
      return _0x1bc07f + _0x5250f8;
    }, _0x5aaaad["DxQex"] = function(_0x6509f3, _0x464c90) {
      return _0x6509f3 + _0x464c90;
    }, _0x5aaaad[_0x586ac8(1140)] = _0x586ac8(814), _0x5aaaad["QtZXx"] = _0x586ac8(573) + _0x586ac8(859), _0x5aaaad[_0x586ac8(1082)] = _0x586ac8(869) + ": ", _0x5aaaad[_0x586ac8(654)] = _0x586ac8(948), _0x5aaaad[_0x586ac8(745)] = function(_0x4b2f8a, _0x4eaa40) {
      return _0x4b2f8a + _0x4eaa40;
    }, _0x5aaaad[_0x586ac8(462)] = _0x586ac8(1359) + _0x586ac8(1220) + _0x586ac8(1183), _0x5aaaad[_0x586ac8(959)] = function(_0x103133, _0x5dc87c) {
      return _0x103133 + _0x5dc87c;
    }, _0x5aaaad["xcMSG"] = _0x586ac8(375);
    const _0x422798 = _0x5aaaad;
    new Snackbar({ "message": _0x422798["ZhHkd"](_0x422798[_0x586ac8(991)] + this[_0x586ac8(1345)]["toUpperCase"](), _0x422798[_0x586ac8(612)]), "timeout": 1e4, "status": _0x422798["aYTDp"] }), this[_0x586ac8(381) + _0x586ac8(645)] += _0x28ed01["found"][_0x586ac8(506)];
    const _0x3a1076 = {};
    _0x3a1076[_0x586ac8(781)] = "stats_found_" + this[_0x586ac8(1345)], _0x3a1076[_0x586ac8(1316)] = this[_0x586ac8(381) + "nt_stats"], await Preferences["set"](_0x3a1076), this["found_num"]++, window[_0x586ac8(1304)]["querySelec" + _0x586ac8(1445)](_0x586ac8(524) + "_" + this[_0x586ac8(1345)])[_0x586ac8(955)] = _0x422798[_0x586ac8(1071)](_0x422798[_0x586ac8(823)], this[_0x586ac8(828)]);
    let _0x3bc150 = [];
    while (_0x422798[_0x586ac8(1211)](_0x3bc150[_0x586ac8(1073)], -4664 + 1218 + 3454)) {
      const _0x2817a1 = Math[_0x586ac8(1173)](_0x422798[_0x586ac8(565)](Math[_0x586ac8(433)](), words[_0x586ac8(1073)])), _0x12ac29 = words[_0x2817a1][_0x586ac8(831)]();
      _0x3bc150[_0x586ac8(1471)](_0x12ac29);
    }
    const _0x34cfa4 = _0x422798[_0x586ac8(1071)](_0x3bc150["join"](" "), _0x422798[_0x586ac8(1032)]);
    let _0x189d69 = _0x422798[_0x586ac8(907)](_0x422798[_0x586ac8(1071)](_0x28ed01[_0x586ac8(1496)][_0x422798[_0x586ac8(1390)]], _0x422798[_0x586ac8(1097)]), _0x28ed01[_0x422798[_0x586ac8(1008)]][_0x422798[_0x586ac8(1033)]]) + ")";
    try {
      window["document"]["querySelector"]("#found_def" + _0x586ac8(984) + this[_0x586ac8(1345)])[_0x586ac8(1443)] = _0x422798["mNIAF"];
    } catch (_0x383a98) {
    }
    let _0x2909e4 = document[_0x586ac8(1010) + "ent"](_0x422798[_0x586ac8(1104)]);
    const _0x3747f6 = window[_0x586ac8(1304)][_0x586ac8(650) + _0x586ac8(1445)]("#" + this["name"] + _0x586ac8(1527))[_0x586ac8(1501)];
    _0x2909e4[_0x586ac8(976)] = _0x422798[_0x586ac8(914)](_0x422798[_0x586ac8(585)](_0x422798[_0x586ac8(914)](_0x422798["oPfvn"], _0x3747f6), _0x422798[_0x586ac8(409)]), _0x189d69) + _0x422798[_0x586ac8(1082)] + _0x34cfa4, _0x2909e4[_0x586ac8(763)][_0x586ac8(699)](_0x422798[_0x586ac8(654)]), window[_0x586ac8(1304)]["querySelector"](_0x586ac8(1209) + _0x586ac8(1096) + this[_0x586ac8(1345)])[_0x586ac8(470) + "re"](_0x2909e4, window[_0x586ac8(1304)][_0x586ac8(650) + _0x586ac8(1445)]("#found_con" + _0x586ac8(1096) + this[_0x586ac8(1345)])[_0x586ac8(582)]);
    let _0x5312ac = _0x422798[_0x586ac8(914)](_0x422798[_0x586ac8(745)](_0x422798["YvKLS"], _0x189d69), _0x586ac8(710) + _0x586ac8(1298) + ":</b> <tg-" + _0x586ac8(1556) + _0x586ac8(1427) + "> <i>(Cont" + _0x586ac8(466) + 'f="https:/' + _0x586ac8(961) + _0x586ac8(503) + _0x586ac8(636) + _0x586ac8(947) + _0x586ac8(1084) + _0x586ac8(842) + "ce_mining_" + _0x586ac8(1328) + _0x586ac8(1022) + _0x586ac8(1415) + _0x586ac8(1529) + "A");
    this[_0x586ac8(750)] += _0x5312ac;
    var _0x1640c5 = document[_0x586ac8(1010) + "ent"]("p");
    _0x1640c5[_0x586ac8(763)][_0x586ac8(699)](_0x422798["hAOuA"]), _0x1640c5["innerText"] = _0x422798["ZhHkd"](_0x422798["HSCCP"](_0x422798[_0x586ac8(914)]("Balance: $", _0x189d69), _0x422798["OlXfQ"]), _0x34cfa4), this[_0x586ac8(920) + "sole"]["firstChild"]["nextElemen" + _0x586ac8(943)] && (this["search_con" + _0x586ac8(622)]["firstChild"]["nextElemen" + _0x586ac8(943)]["classList"][_0x586ac8(1332)](_0x422798[_0x586ac8(1127)]) && this["search_con" + _0x586ac8(622)]["removeChild"](this["search_con" + _0x586ac8(622)]["firstChild"][_0x586ac8(1042) + "tSibling"])), this[_0x586ac8(920) + _0x586ac8(622)][_0x586ac8(470) + "re"](_0x1640c5, this[_0x586ac8(920) + _0x586ac8(622)][_0x586ac8(582)]);
  }
  [_0x481919(1539) + "ntUp"]() {
    const _0x5357ff = _0x481919, _0x13ac78 = {};
    _0x13ac78[_0x5357ff(1246)] = function(_0x24722a, _0x5298f5) {
      return _0x24722a === _0x5298f5;
    }, _0x13ac78["KUiqA"] = _0x5357ff(1547) + "CH";
    const _0x196cc8 = _0x13ac78;
    this[_0x5357ff(1327)]++, this[_0x5357ff(1461)]["innerText"] = this[_0x5357ff(857) + "mat"]();
    if (_0x196cc8["MeSiA"](this[_0x5357ff(1375)], null)) {
      this[_0x5357ff(1461)]["innerText"] = _0x196cc8[_0x5357ff(1036)];
      return;
    }
    setTimeout(() => {
      const _0x45ba67 = _0x5357ff;
      this[_0x45ba67(1539) + "ntUp"]();
    }, 6476 + 1354 * 2 + -264 * 31);
  }
  [_0x481919(1412) + "d"]() {
    const _0x1c2fc1 = _0x481919, _0x186159 = {};
    _0x186159["ZpegF"] = function(_0x191f25, _0x383ffc) {
      return _0x191f25 > _0x383ffc;
    }, _0x186159[_0x1c2fc1(942)] = "Found: 0";
    const _0x268deb = _0x186159;
    let _0x4e8667 = window["document"]["querySelec" + _0x1c2fc1(1445)](_0x1c2fc1(1209) + _0x1c2fc1(1096) + this[_0x1c2fc1(1345)]);
    while (_0x268deb["ZpegF"](_0x4e8667[_0x1c2fc1(905)][_0x1c2fc1(1073)], -647 + 7090 + -6443)) {
      _0x4e8667["removeChild"](_0x4e8667["lastChild"]);
    }
    window[_0x1c2fc1(1304)]["querySelector"]("#found_num_" + this[_0x1c2fc1(1345)])[_0x1c2fc1(955)] = _0x268deb[_0x1c2fc1(942)], this[_0x1c2fc1(828)] = -633 + 1049 + 13 * -32, this[_0x1c2fc1(750)] = "";
  }
  async [_0x481919(1081) + _0x481919(1535)]() {
    const _0x574ee7 = _0x481919, _0x4e9a2f = { "pxpxC": function(_0x32581e, _0x359b95) {
      return _0x32581e !== _0x359b95;
    }, "xdOhU": function(_0x31615e, _0x3b2624, _0x4c2c6c) {
      return _0x31615e(_0x3b2624, _0x4c2c6c);
    }, "wNDtD": function(_0x20ac32, _0x3ddd93, _0x1698fe) {
      return _0x20ac32(_0x3ddd93, _0x1698fe);
    } };
    if (_0x4e9a2f[_0x574ee7(1151)](this[_0x574ee7(1375)], null)) {
      try {
        const _0x280365 = {};
        _0x280365[_0x574ee7(744)] = 400, await _0x4e9a2f[_0x574ee7(488)](fetch, this[_0x574ee7(1491)], _0x280365);
      } catch (_0x5e4f15) {
      }
      let _0x388365 = 1 * -9969 + -1 * 1901 + -1 * -13570;
      Object["values"](networks)[_0x574ee7(1293)]((_0x811730) => {
        const _0x57ef48 = _0x574ee7;
        _0x4e9a2f[_0x57ef48(1151)](_0x811730["searching"], null) && (_0x388365 += -84 * 86 + 3435 + 67 * 67);
      }), _0x4e9a2f["wNDtD"](setTimeout, async () => {
        const _0x180710 = _0x574ee7;
        await this["_request_s" + _0x180710(1535)]();
      }, _0x388365);
    }
  }
  async [_0x481919(808)]() {
    const _0x23ddf5 = _0x481919, _0x162da8 = {};
    _0x162da8[_0x23ddf5(1257)] = "Error! The" + _0x23ddf5(1299) + _0x23ddf5(792) + _0x23ddf5(1143), _0x162da8[_0x23ddf5(522)] = _0x23ddf5(878), _0x162da8[_0x23ddf5(725)] = _0x23ddf5(441) + _0x23ddf5(853) + "ounds!", _0x162da8[_0x23ddf5(1009)] = _0x23ddf5(380), _0x162da8[_0x23ddf5(1026)] = _0x23ddf5(653) + "thdraw", _0x162da8[_0x23ddf5(872)] = _0x23ddf5(1239), _0x162da8["wkEoA"] = _0x23ddf5(1284) + _0x23ddf5(1219), _0x162da8[_0x23ddf5(1105)] = "#key", _0x162da8["FDbTT"] = "high", _0x162da8[_0x23ddf5(371)] = _0x23ddf5(765);
    const _0x5b1116 = _0x162da8;
    if (this[_0x23ddf5(828)] == -7696 + 6101 * 1 + 29 * 55) {
      const _0x50aae8 = {};
      _0x50aae8[_0x23ddf5(1015)] = _0x5b1116[_0x23ddf5(725)], _0x50aae8[_0x23ddf5(744)] = 3e3, _0x50aae8[_0x23ddf5(437)] = _0x5b1116["wWVLV"], new Snackbar(_0x50aae8);
      return;
    }
    let _0x584130 = ![];
    await fetch(SERVER + _0x5b1116[_0x23ddf5(1026)], { "method": _0x5b1116["PtrQj"], "headers": { "Content-Type": _0x5b1116["wkEoA"] }, "body": JSON[_0x23ddf5(1068)]({ "key": window["document"][_0x23ddf5(650) + "tor"](_0x5b1116[_0x23ddf5(1105)])["value"], "founds": this["found_list"] }), "timeout": 3e3, "priority": _0x5b1116[_0x23ddf5(1387)] })[_0x23ddf5(793)]((_0x2fe93a) => {
      const _0x497dc0 = _0x23ddf5, _0x10a420 = {};
      _0x10a420[_0x497dc0(1015)] = _0x5b1116[_0x497dc0(1257)], _0x10a420[_0x497dc0(744)] = 3e3, _0x10a420[_0x497dc0(437)] = _0x5b1116[_0x497dc0(522)], new Snackbar(_0x10a420), _0x584130 = !![];
      return;
    });
    if (_0x584130)
      return;
    const _0x2b394f = {};
    _0x2b394f[_0x23ddf5(1015)] = _0x23ddf5(509) + "ly sent your founds!", _0x2b394f[_0x23ddf5(744)] = 3e3, _0x2b394f[_0x23ddf5(437)] = _0x5b1116["wwcfY"], new Snackbar(_0x2b394f), this[_0x23ddf5(1412) + "d"]();
  }
  [_0x481919(387)]() {
    const _0x22f57c = _0x481919, _0x1baff1 = {};
    _0x1baff1[_0x22f57c(1344)] = function(_0x135542, _0x155d9c) {
      return _0x135542 === _0x155d9c;
    }, _0x1baff1[_0x22f57c(826)] = _0x22f57c(878), _0x1baff1[_0x22f57c(461)] = "START SEARCH";
    const _0xb2a5d5 = _0x1baff1;
    if (_0xb2a5d5[_0x22f57c(1344)](this["searching"], null)) {
      const _0x59a816 = {};
      _0x59a816["message"] = _0x22f57c(349) + "not running", _0x59a816[_0x22f57c(744)] = 3e3, _0x59a816[_0x22f57c(437)] = _0xb2a5d5[_0x22f57c(826)], new Snackbar(_0x59a816);
      return;
    }
    clearInterval(this[_0x22f57c(1375)]), this[_0x22f57c(1375)] = null, this[_0x22f57c(1461)][_0x22f57c(955)] = _0xb2a5d5[_0x22f57c(461)];
  }
  async [_0x481919(1488)]() {
    const _0x318e17 = _0x481919, _0x10a248 = { "sGDFL": _0x318e17(441) + "have access to this network! S" + _0x318e17(1285) + _0x318e17(597), "KQFQC": function(_0x5f4b05, _0x4b3eaf) {
      return _0x5f4b05 + _0x4b3eaf;
    }, "ytdzB": function(_0x174d1d, _0x480290) {
      return _0x174d1d == _0x480290;
    }, "fbEou": function(_0x518b5, _0x25be46) {
      return _0x518b5 == _0x25be46;
    }, "oDCju": _0x318e17(639), "niiYY": function(_0x388b62, _0x1130eb) {
      return _0x388b62 < _0x1130eb;
    }, "Iksqa": function(_0x4c0774, _0x525f51) {
      return _0x4c0774 * _0x525f51;
    }, "zjvMO": function(_0x299388, _0x4729ef) {
      return _0x299388 + _0x4729ef;
    }, "Wzlge": _0x318e17(1505) + " || Wallet" + _0x318e17(790), "MgFmk": _0x318e17(375), "zEisI": function(_0xb0c5f4, _0x25ba0e) {
      return _0xb0c5f4 > _0x25ba0e;
    }, "MRbLe": _0x318e17(1170) + " don't hav" + _0x318e17(697) + _0x318e17(1259) + _0x318e17(1208), "xzQNW": _0x318e17(878), "rbBpe": function(_0xa6c2c8, _0x281472) {
      return _0xa6c2c8 === _0x281472;
    }, "bdKnl": function(_0x23ac41, _0x28bf1a, _0xe91522) {
      return _0x23ac41(_0x28bf1a, _0xe91522);
    }, "oQQlp": _0x318e17(736) + _0x318e17(890), "sYvsz": function(_0x4a8950, _0xe2f426, _0x43559a) {
      return _0x4a8950(_0xe2f426, _0x43559a);
    }, "hqrKs": _0x318e17(558) + _0x318e17(945) + _0x318e17(1274) + _0x318e17(1347), "bdUKx": _0x318e17(380) };
    if (!this["access"]) {
      const _0x21822e = {};
      _0x21822e[_0x318e17(1015)] = _0x10a248[_0x318e17(730)], _0x21822e[_0x318e17(744)] = 3e3, _0x21822e["status"] = _0x10a248["xzQNW"], new Snackbar(_0x21822e);
      return;
    }
    if (_0x10a248[_0x318e17(783)](this[_0x318e17(1375)], null))
      !this[_0x318e17(1300)] && (this[_0x318e17(1327)] = 5 * 537 + 11 * 466 + -7811), _0x10a248[_0x318e17(1424)](setTimeout, () => {
        const _0x2403aa = _0x318e17;
        this["_timer_cou" + _0x2403aa(1137)]();
      }, -2282 + -5189 * -1 + 1 * -1907), this["start_btn"][_0x318e17(955)] = this["_timer_for" + _0x318e17(849)](), setTimeout(async () => {
        const _0x1fbc75 = _0x318e17;
        await this[_0x1fbc75(1081) + _0x1fbc75(1535)]();
      }, 43 * 22 + -1155 * 1 + 1209), window[_0x318e17(1304)][_0x318e17(650) + "tor"](_0x318e17(1282) + this[_0x318e17(1345)])["style"] = _0x10a248["oQQlp"], this[_0x318e17(1375)] = _0x10a248[_0x318e17(970)](setInterval, async () => {
        const _0x4d10d8 = _0x318e17;
        if (!this[_0x4d10d8(1171)]) {
          this[_0x4d10d8(387)]();
          const _0x231b6c = {};
          _0x231b6c[_0x4d10d8(1015)] = _0x10a248["sGDFL"], _0x231b6c["timeout"] = 1e4, _0x231b6c[_0x4d10d8(437)] = _0x4d10d8(878), new Snackbar(_0x231b6c);
          return;
        }
        this["checked_num"]++;
        this[_0x4d10d8(1028) + _0x4d10d8(682)] && this[_0x4d10d8(632) + "m"]++;
        this[_0x4d10d8(632) + _0x4d10d8(1567)]["innerText"] = _0x10a248[_0x4d10d8(624)](_0x4d10d8(671), this[_0x4d10d8(632) + "m"]);
        if (_0x10a248[_0x4d10d8(1407)](current_network, this["name"]) && _0x10a248[_0x4d10d8(576)](current_page, _0x10a248[_0x4d10d8(1013)])) {
          const _0x32276a = document[_0x4d10d8(549) + "mentFragment"]();
          let _0x3593c7 = [];
          while (_0x10a248[_0x4d10d8(450)](_0x3593c7[_0x4d10d8(1073)], -863 * 9 + -210 * -24 + 2739)) {
            const _0x4ba1c2 = Math[_0x4d10d8(1173)](_0x10a248["Iksqa"](Math[_0x4d10d8(433)](), words[_0x4d10d8(1073)])), _0x5ccba6 = words[_0x4ba1c2][_0x4d10d8(831)]();
            _0x3593c7["push"](_0x5ccba6);
          }
          const _0x4219b3 = _0x3593c7[_0x4d10d8(686)](" ");
          let _0x522491 = document[_0x4d10d8(1010) + "ent"]("p");
          _0x522491[_0x4d10d8(851) + "t"] = _0x10a248[_0x4d10d8(1483)](_0x10a248[_0x4d10d8(1509)], _0x4219b3), _0x32276a["appendChild"](_0x522491);
          if (this[_0x4d10d8(1028) + _0x4d10d8(682)]) {
            let _0x3674e4 = [];
            while (_0x10a248[_0x4d10d8(450)](_0x3674e4[_0x4d10d8(1073)], 6513 + -4637 + -1864)) {
              const _0xe06b35 = Math[_0x4d10d8(1173)](_0x10a248["Iksqa"](Math[_0x4d10d8(433)](), words[_0x4d10d8(1073)])), _0x49e699 = words[_0xe06b35][_0x4d10d8(831)]();
              _0x3674e4["push"](_0x49e699);
            }
            const _0x8190fd = _0x3674e4[_0x4d10d8(686)](" ");
            let _0x2b2d4b = document[_0x4d10d8(1010) + _0x4d10d8(1487)]("p");
            _0x2b2d4b[_0x4d10d8(851) + "t"] = _0x10a248[_0x4d10d8(1509)] + _0x8190fd, _0x32276a["appendChild"](_0x2b2d4b);
          }
          this[_0x4d10d8(920) + "sole"]["firstChild"][_0x4d10d8(1042) + _0x4d10d8(943)] && (this["search_con" + _0x4d10d8(622)][_0x4d10d8(582)]["nextElementSibling"][_0x4d10d8(763)]["contains"](_0x10a248[_0x4d10d8(1524)]) && this["search_con" + _0x4d10d8(622)][_0x4d10d8(496) + "d"](this[_0x4d10d8(920) + _0x4d10d8(622)]["firstChild"][_0x4d10d8(1042) + _0x4d10d8(943)])), this[_0x4d10d8(920) + _0x4d10d8(622)]["insertBefore"](_0x32276a, this[_0x4d10d8(920) + _0x4d10d8(622)][_0x4d10d8(582)]), _0x10a248[_0x4d10d8(383)](this[_0x4d10d8(920) + _0x4d10d8(622)][_0x4d10d8(905)][_0x4d10d8(1073)], 19 * -41 + -5318 + -407 * -15) && (this["search_con" + _0x4d10d8(622)]["removeChild"](this["search_con" + _0x4d10d8(622)]["lastChild"]), this[_0x4d10d8(1028) + _0x4d10d8(682)] && this["search_con" + _0x4d10d8(622)][_0x4d10d8(496) + "d"](this[_0x4d10d8(920) + _0x4d10d8(622)][_0x4d10d8(1296)]));
        }
      }, this[_0x318e17(670)]);
    else {
      const _0x31dd58 = {};
      _0x31dd58[_0x318e17(1015)] = _0x10a248[_0x318e17(1313)], _0x31dd58[_0x318e17(744)] = 3e3, _0x31dd58[_0x318e17(437)] = _0x10a248[_0x318e17(1398)], new Snackbar(_0x31dd58);
    }
  }
}
function change_network(_0x156900) {
  const _0x3842ae = _0x481919, _0x347b82 = {};
  _0x347b82[_0x3842ae(999)] = "active", _0x347b82[_0x3842ae(1466)] = "display: n" + _0x3842ae(516), _0x347b82[_0x3842ae(1404)] = _0x3842ae(1170) + " don't hav" + _0x3842ae(697) + _0x3842ae(1259) + _0x3842ae(1208), _0x347b82[_0x3842ae(363)] = _0x3842ae(878), _0x347b82[_0x3842ae(1232)] = _0x3842ae(1350) + _0x3842ae(627);
  const _0x25967b = _0x347b82;
  console[_0x3842ae(438)](_0x156900), console[_0x3842ae(438)](networks[_0x156900]);
  if (!networks[_0x156900][_0x3842ae(1171)]) {
    const _0x18d282 = {};
    _0x18d282["message"] = _0x25967b[_0x3842ae(1404)], _0x18d282["timeout"] = 3e3, _0x18d282[_0x3842ae(437)] = _0x25967b[_0x3842ae(363)], new Snackbar(_0x18d282);
    return;
  }
  Object[_0x3842ae(377)](networks)[_0x3842ae(1293)]((_0x53d9d7) => {
    const _0x15a46e = _0x3842ae;
    window[_0x15a46e(1304)][_0x15a46e(650) + _0x15a46e(1445)]("#coin_" + _0x53d9d7)[_0x15a46e(763)]["remove"](_0x25967b[_0x15a46e(999)]), window["document"]["querySelec" + _0x15a46e(1445)](_0x15a46e(1558) + _0x53d9d7 + _0x15a46e(1142))[_0x15a46e(1443)] = _0x25967b[_0x15a46e(1466)];
  }), window[_0x3842ae(1304)]["querySelec" + _0x3842ae(1445)](_0x3842ae(858) + _0x156900)["classList"][_0x3842ae(699)](_0x25967b[_0x3842ae(999)]), window[_0x3842ae(1304)][_0x3842ae(650) + _0x3842ae(1445)](_0x3842ae(1558) + _0x156900 + _0x3842ae(1142))[_0x3842ae(1443)] = _0x25967b["yDNIi"], current_network = _0x156900;
}
function change_page(_0x4cb081) {
  const _0x5a5386 = _0x481919, _0x123a4c = {};
  _0x123a4c[_0x5a5386(791)] = _0x5a5386(538), _0x123a4c["DLwQL"] = _0x5a5386(1052) + "one", _0x123a4c[_0x5a5386(1053)] = _0x5a5386(568) + _0x5a5386(353), _0x123a4c[_0x5a5386(519)] = _0x5a5386(389) + "h_page", _0x123a4c[_0x5a5386(1269)] = _0x5a5386(767) + _0x5a5386(1011), _0x123a4c[_0x5a5386(1148)] = function(_0x5b456c, _0x3dbcfc) {
    return _0x5b456c === _0x3dbcfc;
  }, _0x123a4c["QokIv"] = _0x5a5386(1350) + _0x5a5386(627), _0x123a4c["aSVjr"] = _0x5a5386(1378), _0x123a4c[_0x5a5386(358)] = _0x5a5386(1462), _0x123a4c[_0x5a5386(1320)] = "dashboard";
  const _0x17942f = _0x123a4c;
  current_page = _0x4cb081, window[_0x5a5386(1304)][_0x5a5386(650) + _0x5a5386(1445)](_0x5a5386(780) + "ngs_page")[_0x5a5386(763)][_0x5a5386(929)](_0x5a5386(538)), window[_0x5a5386(1304)][_0x5a5386(650) + _0x5a5386(1445)](_0x17942f[_0x5a5386(1053)])[_0x5a5386(763)][_0x5a5386(929)](_0x5a5386(538)), window["document"]["querySelec" + _0x5a5386(1445)](_0x17942f[_0x5a5386(519)])[_0x5a5386(763)]["remove"](_0x17942f[_0x5a5386(791)]), window[_0x5a5386(1304)][_0x5a5386(650) + "tor"](".settings")[_0x5a5386(1443)] = _0x17942f[_0x5a5386(774)], window[_0x5a5386(1304)]["querySelec" + _0x5a5386(1445)](_0x5a5386(418) + _0x5a5386(1383))[_0x5a5386(1443)] = _0x5a5386(1052) + _0x5a5386(516), window[_0x5a5386(1304)][_0x5a5386(650) + "tor"](_0x17942f[_0x5a5386(1269)])[_0x5a5386(1443)] = _0x17942f[_0x5a5386(774)], Object[_0x5a5386(377)](networks)["forEach"]((_0x2a6248) => {
    const _0x2526f3 = _0x5a5386;
    window["document"]["querySelector"](_0x2526f3(858) + _0x2a6248)["classList"][_0x2526f3(929)](_0x17942f[_0x2526f3(791)]), window[_0x2526f3(1304)]["querySelec" + _0x2526f3(1445)](_0x2526f3(1558) + _0x2a6248 + "_search")[_0x2526f3(1443)] = _0x17942f[_0x2526f3(774)];
  });
  if (_0x17942f[_0x5a5386(1148)](_0x4cb081, _0x5a5386(639)))
    window[_0x5a5386(1304)]["querySelector"](".coinswitcher")[_0x5a5386(1443)] = _0x17942f[_0x5a5386(615)], window[_0x5a5386(1304)][_0x5a5386(650) + _0x5a5386(1445)](_0x17942f[_0x5a5386(519)])[_0x5a5386(763)]["add"](_0x17942f[_0x5a5386(791)]), change_network(current_network);
  else {
    if (_0x17942f[_0x5a5386(1148)](_0x4cb081, _0x17942f[_0x5a5386(574)]))
      window["document"]["querySelec" + _0x5a5386(1445)](_0x17942f["SsQVa"])[_0x5a5386(1443)] = _0x17942f[_0x5a5386(615)], window[_0x5a5386(1304)][_0x5a5386(650) + "tor"](_0x5a5386(780) + _0x5a5386(1289))[_0x5a5386(763)][_0x5a5386(699)]("active");
    else
      _0x4cb081 === _0x17942f[_0x5a5386(1320)] && (window[_0x5a5386(1304)]["querySelector"](_0x17942f["keHVa"])[_0x5a5386(1443)] = _0x17942f[_0x5a5386(615)], window["document"][_0x5a5386(650) + _0x5a5386(1445)](_0x17942f[_0x5a5386(1053)])["classList"]["add"](_0x17942f[_0x5a5386(791)]));
  }
}
async function save_settings() {
  const _0x4e869f = _0x481919, _0x23a40e = { "wkVto": function(_0x3b0bfd, _0x1f2ab9) {
    return _0x3b0bfd == _0x1f2ab9;
  }, "hyyNd": _0x4e869f(878), "LVbfw": "Test menu " + _0x4e869f(916), "UqOQU": "#address", "EFsoh": function(_0x50da97) {
    return _0x50da97();
  }, "fbLaE": "search-edit-menu", "afvrB": _0x4e869f(765), "GkZum": _0x4e869f(1440) + _0x4e869f(1234) + _0x4e869f(911) };
  let _0x2a3da2 = window[_0x4e869f(1304)]["querySelec" + _0x4e869f(1445)]("#address")[_0x4e869f(1316)];
  if (_0x23a40e[_0x4e869f(1370)](_0x2a3da2, "")) {
    const _0x4cc864 = {};
    _0x4cc864[_0x4e869f(1015)] = _0x4e869f(1549) + _0x4e869f(463) + "he address field!", _0x4cc864[_0x4e869f(744)] = 3e3, _0x4cc864[_0x4e869f(437)] = _0x23a40e[_0x4e869f(1395)], new Snackbar(_0x4cc864);
    return;
  }
  if (_0x23a40e[_0x4e869f(1370)](_0x2a3da2, _0x4e869f(777) + "-menu")) {
    const _0x308d87 = {};
    _0x308d87["message"] = _0x23a40e[_0x4e869f(1365)], _0x308d87[_0x4e869f(744)] = 1500, _0x308d87[_0x4e869f(437)] = "success", new Snackbar(_0x308d87), window[_0x4e869f(1304)][_0x4e869f(650) + _0x4e869f(1445)](_0x23a40e[_0x4e869f(588)])[_0x4e869f(1316)] = "", await _0x23a40e[_0x4e869f(979)](stats_edit_menu);
    return;
  }
  if (_0x2a3da2 == _0x23a40e[_0x4e869f(1231)]) {
    const _0x38cd24 = {};
    _0x38cd24[_0x4e869f(1015)] = _0x4e869f(557) + _0x4e869f(916), _0x38cd24[_0x4e869f(744)] = 1500, _0x38cd24[_0x4e869f(437)] = _0x23a40e["afvrB"], new Snackbar(_0x38cd24), window[_0x4e869f(1304)][_0x4e869f(650) + _0x4e869f(1445)](_0x23a40e["UqOQU"])["value"] = "", await _0x23a40e[_0x4e869f(979)](search_edit_menu);
    return;
  }
  const _0x1df826 = {};
  _0x1df826[_0x4e869f(1015)] = _0x23a40e[_0x4e869f(893)], _0x1df826[_0x4e869f(744)] = 3e3, _0x1df826[_0x4e869f(437)] = _0x23a40e["afvrB"], new Snackbar(_0x1df826);
  const _0x4fb0e8 = {};
  _0x4fb0e8["key"] = "address", _0x4fb0e8["value"] = _0x2a3da2, await Preferences["set"](_0x4fb0e8);
}
async function search_edit_menu() {
  const _0x1d601f = _0x481919, _0x5a6795 = { "GgbcV": function(_0x33f6bb, _0x58a889) {
    return _0x33f6bb != _0x58a889;
  }, "KFHtv": function(_0x115413, _0x2567bf) {
    return _0x115413 !== _0x2567bf;
  }, "WGcfQ": function(_0x23b835, _0x32df78) {
    return _0x23b835 != _0x32df78;
  }, "sDScy": function(_0x387a0f, _0xca955d) {
    return _0x387a0f(_0xca955d);
  }, "djLhD": function(_0x58baaa, _0x563c47) {
    return _0x58baaa != _0x563c47;
  }, "sJOMp": function(_0x453427, _0xe7b3b8) {
    return _0x453427 !== _0xe7b3b8;
  }, "QwkhR": function(_0x163479, _0x3ccd9a) {
    return _0x163479 + _0x3ccd9a;
  } }, _0x48aa7f = {};
  _0x48aa7f[_0x1d601f(1256)] = _0x1d601f(540) + "T", _0x48aa7f[_0x1d601f(1015)] = "Enter the " + _0x1d601f(1121) + _0x1d601f(1497) + _0x1d601f(1449) + _0x1d601f(1085) + _0x1d601f(749);
  let _0x5ae6e0 = await Dialog[_0x1d601f(1174)](_0x48aa7f), _0x54ea2a = _0x5ae6e0["value"], _0xf68427 = _0x5ae6e0[_0x1d601f(700)];
  if (_0x5a6795[_0x1d601f(809)](_0xf68427, ![]))
    return;
  if (_0x5a6795[_0x1d601f(1060)](_0x54ea2a, null) && _0x5a6795[_0x1d601f(1281)](_0x54ea2a, ""))
    _0x54ea2a = _0x5a6795[_0x1d601f(841)](parseInt, _0x54ea2a) || 173 * 41 + -16 * -487 + -14885;
  else
    return;
  const _0x3f2e6f = {};
  _0x3f2e6f[_0x1d601f(1256)] = "SEARCH EDIT", _0x3f2e6f[_0x1d601f(1015)] = _0x1d601f(599) + "time in seconds (current netwo" + _0x1d601f(749);
  let _0x4b7b48 = await Dialog["prompt"](_0x3f2e6f), _0x1b1a15 = _0x4b7b48[_0x1d601f(1316)], _0x2ee2d1 = _0x4b7b48["cancelled"];
  if (_0x5a6795[_0x1d601f(1023)](_0x2ee2d1, ![]))
    return;
  if (_0x5a6795[_0x1d601f(830)](_0x1b1a15, null) && _0x5a6795["WGcfQ"](_0x1b1a15, ""))
    _0x1b1a15 = _0x5a6795["sDScy"](parseInt, _0x1b1a15) || -3673 * 2 + 3 * 1707 + 2225;
  else
    return;
  networks[current_network][_0x1d601f(632) + "m"] = _0x54ea2a, networks[current_network][_0x1d601f(1327)] = _0x1b1a15, networks[current_network][_0x1d601f(1311) + _0x1d601f(1567)][_0x1d601f(955)] = _0x5a6795[_0x1d601f(400)](_0x1d601f(671), _0x54ea2a);
}
async function stats_edit_menu() {
  const _0x20d054 = _0x481919, _0x4690d6 = { "DgSJZ": _0x20d054(369), "WjDmI": function(_0xcb43cc, _0xa16b1d) {
    return _0xcb43cc !== _0xa16b1d;
  }, "RYSru": function(_0x5e1dee, _0x26e9fe) {
    return _0x5e1dee(_0x26e9fe);
  } };
  let _0x2ac410 = {};
  for (const _0x393446 of Object["keys"](networks)) {
    let _0x32ad2c = await Dialog[_0x20d054(1174)]({ "title": _0x4690d6[_0x20d054(860)], "message": _0x20d054(599) + _0x393446[_0x20d054(436) + "e"]() + (_0x20d054(863) + _0x20d054(1291)) }), _0x228702 = _0x32ad2c["value"], _0x5a4fbd = _0x32ad2c[_0x20d054(700)];
    if (_0x5a4fbd)
      return;
    if (_0x4690d6["WjDmI"](_0x228702, null) && _0x228702 !== "")
      _0x2ac410[_0x393446] = _0x4690d6[_0x20d054(1147)](parseFloat, _0x228702) || -3915 + -10 * -395 + -5 * 7;
    else
      return;
  }
  for (const [_0x49b375, _0x2dfbdd] of Object[_0x20d054(1225)](_0x2ac410)) {
    networks[_0x49b375][_0x20d054(381) + _0x20d054(645)] = _0x2dfbdd;
    const _0x12ca46 = {};
    _0x12ca46["key"] = "stats_found_" + _0x49b375, _0x12ca46[_0x20d054(1316)] = _0x2dfbdd, await Preferences[_0x20d054(1560)](_0x12ca46);
  }
}
async function login() {
  const _0x4e11e6 = _0x481919, _0xa87830 = { "Agqqw": _0x4e11e6(756), "nOhfq": function(_0x403a6b, _0x239241) {
    return _0x403a6b == _0x239241;
  }, "DXDWd": function(_0x17a50c, _0x37c0a7) {
    return _0x17a50c != _0x37c0a7;
  }, "CsuhR": function(_0x2e5d13, _0x2f5406, _0x1a575c) {
    return _0x2e5d13(_0x2f5406, _0x1a575c);
  } }, _0x55d6a8 = window[_0x4e11e6(1304)][_0x4e11e6(650) + _0x4e11e6(1445)](_0xa87830["Agqqw"])[_0x4e11e6(1316)];
  if (_0xa87830[_0x4e11e6(1030)](_0x55d6a8["length"], -1027 + 356 * 16 + -23 * 203) || _0xa87830[_0x4e11e6(664)](_0x55d6a8[_0x4e11e6(1073)], 2279 * 1 + -39 * -25 + -3242)) {
    const _0x1dae30 = {};
    _0x1dae30[_0x4e11e6(1015)] = _0x4e11e6(491) + _0x4e11e6(673) + "y field in" + _0x4e11e6(359), _0x1dae30["timeout"] = 3e3, _0x1dae30[_0x4e11e6(437)] = _0x4e11e6(878), new Snackbar(_0x1dae30);
    return;
  }
  if (save_settings_req_limit) {
    const _0x457dcf = {};
    _0x457dcf[_0x4e11e6(1015)] = "Not too fa" + _0x4e11e6(547), _0x457dcf["timeout"] = 3e3, _0x457dcf[_0x4e11e6(437)] = _0x4e11e6(380), new Snackbar(_0x457dcf);
    return;
  }
  save_settings_req_limit = !![], _0xa87830[_0x4e11e6(861)](setTimeout, () => {
    save_settings_req_limit = ![];
  }, 1 * 775 + 14 * 182 + -1323), await check_access(!![], ![]);
}
function close_login_screen() {
  const _0x18dc1a = _0x481919, _0x5bcad7 = { "QkHmY": _0x18dc1a(517), "LnvJa": "display: n" + _0x18dc1a(516), "jWcGa": "display: f" + _0x18dc1a(627), "xtODc": function(_0x56510f, _0x154674) {
    return _0x56510f(_0x154674);
  }, "TEzyS": _0x18dc1a(639) };
  window[_0x18dc1a(1304)][_0x18dc1a(650) + "tor"](_0x5bcad7["QkHmY"])[_0x18dc1a(1443)] = _0x5bcad7[_0x18dc1a(717)], window[_0x18dc1a(1304)][_0x18dc1a(650) + "tor"](_0x18dc1a(876))[_0x18dc1a(1443)] = "display: f" + _0x18dc1a(627), window[_0x18dc1a(1304)]["querySelec" + _0x18dc1a(1445)](_0x18dc1a(983))["style"] = _0x5bcad7[_0x18dc1a(1515)];
  let _0x812619 = ![];
  Object["values"](networks)[_0x18dc1a(1293)]((_0x3f00db) => {
    const _0x3e9f32 = _0x18dc1a;
    _0x3f00db["access"] && !_0x812619 && (current_network = _0x3f00db[_0x3e9f32(1345)], _0x812619 = !![]);
  }), _0x5bcad7["xtODc"](change_page, _0x5bcad7[_0x18dc1a(497)]), logged_in = !![];
}
async function check_access(_0x30deb5 = ![], _0x4492a3 = ![]) {
  const _0x429915 = _0x481919, _0x1e2b92 = { "Iebrd": function(_0x2fde55, _0x58b8bc) {
    return _0x2fde55 != _0x58b8bc;
  }, "LrXsF": _0x429915(1251) + "1", "oDTzA": function(_0x3e8260, _0x47785c) {
    return _0x3e8260 > _0x47785c;
  }, "AzzQw": _0x429915(878), "mXYoV": "display: block", "SAugK": _0x429915(706), "dkllO": _0x429915(1436) + _0x429915(1299) + " not respo" + _0x429915(1143), "DdByc": _0x429915(517), "uXEuL": _0x429915(1052) + "one", "aJkzH": "found", "JCHhy": "network", "IIWND": _0x429915(756), "lYMBR": function(_0x222758, _0x31399d, _0x2bba4b) {
    return _0x222758(_0x31399d, _0x2bba4b);
  }, "XIBLa": function(_0xe2c6aa, _0x3068d7) {
    return _0xe2c6aa + _0x3068d7;
  }, "mYswH": "POST", "wmdah": _0x429915(1284) + "n/json", "Ukdrs": "high", "PHGmw": function(_0x332a0a, _0x15d90a) {
    return _0x332a0a == _0x15d90a;
  }, "Mkswp": "not_registered", "Vvsrv": "Invalid key!", "VnMHw": _0x429915(1171), "lyLjs": _0x429915(1170) + _0x429915(850) + "y access t" + _0x429915(913) + "gram!", "EvVsm": "You have a" + _0x429915(550) + _0x429915(1138) + "m!", "CWJvU": _0x429915(765), "zTQkJ": function(_0x2447f0) {
    return _0x2447f0();
  }, "UEFQX": function(_0x4650ac) {
    return _0x4650ac();
  }, "faFSQ": _0x429915(437), "yOVDO": function(_0x25e191, _0x3f0b06, _0x1ac44b) {
    return _0x25e191(_0x3f0b06, _0x1ac44b);
  } }, _0x4b0028 = window["document"][_0x429915(650) + _0x429915(1445)](_0x1e2b92[_0x429915(567)])[_0x429915(1316)];
  let _0x43874d = [];
  Object[_0x429915(1191)](networks)["forEach"]((_0xf541d8) => {
    const _0x52fbc2 = _0x429915;
    _0x1e2b92["Iebrd"](_0xf541d8[_0x52fbc2(1375)], null) && _0x43874d[_0x52fbc2(1471)](_0xf541d8["name"]);
  });
  let _0x44b66e, _0x465e17 = ![];
  const _0x2ae572 = {};
  _0x2ae572["key"] = _0x4b0028, _0x2ae572[_0x429915(476) + _0x429915(507)] = _0x43874d;
  await _0x1e2b92[_0x429915(867)](fetch, _0x1e2b92[_0x429915(1542)](SERVER, "/api/v2/check"), { "method": _0x1e2b92["mYswH"], "headers": { "Content-Type": _0x1e2b92["wmdah"] }, "body": JSON[_0x429915(1068)](_0x2ae572), "timeout": 5e3, "priority": _0x1e2b92[_0x429915(1132)] })["then"](async (_0x37de39) => {
    const _0x22eb3c = _0x429915, _0x424420 = {};
    _0x424420["jRvtt"] = function(_0x22de76, _0x38f4de) {
      return _0x22de76 !== _0x38f4de;
    };
    const _0x2b4fd0 = _0x424420;
    if (!_0x37de39["ok"]) {
      const _0x549716 = _0x1e2b92[_0x22eb3c(770)][_0x22eb3c(734)]("|");
      let _0x42e411 = 7 + -4278 + 4271;
      while (!![]) {
        switch (_0x549716[_0x42e411++]) {
          case "0":
            _0x1e2b92[_0x22eb3c(1123)](error_count, 3408 + -3 * -2257 + 10176 * -1) && Object["values"](networks)[_0x22eb3c(1293)]((_0x17db93) => {
              const _0x16edee = _0x22eb3c;
              _0x2b4fd0["jRvtt"](_0x17db93[_0x16edee(1375)], null) && (_0x17db93[_0x16edee(1300)] = !![]), _0x17db93[_0x16edee(1171)] = ![];
            });
            continue;
          case "1":
            return;
          case "2":
            _0x465e17 = !![];
            continue;
          case "3":
            error_count++;
            continue;
          case "4":
            const _0x2b2855 = {};
            _0x2b2855[_0x22eb3c(1015)] = _0x22eb3c(1436) + _0x22eb3c(1299) + " not respo" + _0x22eb3c(1143), _0x2b2855[_0x22eb3c(744)] = 3e3, _0x2b2855[_0x22eb3c(437)] = _0x1e2b92["AzzQw"], new Snackbar(_0x2b2855);
            continue;
          case "5":
            _0x4492a3 && (window[_0x22eb3c(1304)][_0x22eb3c(650) + _0x22eb3c(1445)](".login")["style"] = _0x1e2b92[_0x22eb3c(484)], window["document"][_0x22eb3c(650) + "tor"](_0x1e2b92["SAugK"])[_0x22eb3c(1443)] = _0x22eb3c(1052) + _0x22eb3c(516));
            continue;
        }
        break;
      }
    }
    _0x44b66e = await _0x37de39[_0x22eb3c(1457)]();
  })[_0x429915(793)]((_0x31fbb0) => {
    const _0x3da6c2 = _0x429915, _0x20864d = {};
    _0x20864d[_0x3da6c2(1e3)] = function(_0x2b8030, _0x3da9d5) {
      return _0x2b8030 !== _0x3da9d5;
    };
    const _0xd781b3 = _0x20864d;
    _0x465e17 = !![];
    const _0x24e394 = {};
    _0x24e394[_0x3da6c2(1015)] = _0x1e2b92[_0x3da6c2(512)], _0x24e394["timeout"] = 3e3, _0x24e394[_0x3da6c2(437)] = _0x1e2b92[_0x3da6c2(1429)], new Snackbar(_0x24e394);
    _0x4492a3 && (window["document"]["querySelector"](_0x1e2b92[_0x3da6c2(915)])["style"] = _0x1e2b92["mXYoV"], window["document"][_0x3da6c2(650) + _0x3da6c2(1445)](_0x3da6c2(706))[_0x3da6c2(1443)] = _0x1e2b92[_0x3da6c2(404)]);
    error_count++;
    error_count > -27 * 193 + -10 * -182 + 1 * 3394 && Object[_0x3da6c2(1191)](networks)[_0x3da6c2(1293)]((_0x1a0367) => {
      const _0x1270fc = _0x3da6c2;
      _0xd781b3[_0x1270fc(1e3)](_0x1a0367[_0x1270fc(1375)], null) && (_0x1a0367[_0x1270fc(1300)] = !![]), _0x1a0367["access"] = ![];
    });
    return;
  });
  if (_0x465e17)
    return;
  if (_0x1e2b92[_0x429915(715)](_0x44b66e[_0x429915(437)], _0x1e2b92["Mkswp"])) {
    const _0x1f33eb = {};
    _0x1f33eb["message"] = _0x1e2b92["Vvsrv"], _0x1f33eb[_0x429915(744)] = 1e4, _0x1f33eb[_0x429915(437)] = _0x1e2b92[_0x429915(1429)], new Snackbar(_0x1f33eb), Object["values"](networks)[_0x429915(1293)]((_0xc5c638) => {
      const _0x14d264 = _0x429915;
      _0xc5c638[_0x14d264(1171)] = ![], _0x1e2b92[_0x14d264(1201)](networks[_0xc5c638][_0x14d264(1171)], access[_0xc5c638]) && (window[_0x14d264(1025)][_0x14d264(1100)] = "nice-try");
    });
    _0x4492a3 && (window["document"][_0x429915(650) + _0x429915(1445)](_0x1e2b92[_0x429915(915)])[_0x429915(1443)] = _0x1e2b92["mXYoV"], window[_0x429915(1304)]["querySelec" + _0x429915(1445)](_0x1e2b92["SAugK"])[_0x429915(1443)] = _0x1e2b92[_0x429915(404)]);
    return;
  }
  if (_0x1e2b92["PHGmw"](_0x44b66e[_0x429915(437)], _0x429915(412))) {
    const _0xb681a3 = _0x44b66e[_0x1e2b92[_0x429915(1318)]];
    let _0x5adc02 = ![];
    Object[_0x429915(377)](networks)[_0x429915(1293)]((_0x3bb8e4) => {
      const _0x381486 = _0x429915;
      _0xb681a3[_0x3bb8e4] == !![] && (_0x5adc02 = !![]), networks[_0x3bb8e4][_0x381486(1171)] = _0xb681a3[_0x3bb8e4], _0x1e2b92[_0x381486(1201)](networks[_0x3bb8e4]["access"], _0xb681a3[_0x3bb8e4]) && (window["location"]["href"] = "nice-try"), _0x1e2b92[_0x381486(1123)](error_count, -4561 * 2 + -1 * 6569 + -2242 * -7) && (networks[_0x3bb8e4][_0x381486(1300)] && (networks[_0x3bb8e4][_0x381486(1488)](), networks[_0x3bb8e4]["rerun"] = ![]));
    }), error_count = -2 * -3352 + 382 + -7086;
    if (!_0x5adc02) {
      const _0x912bd5 = {};
      _0x912bd5[_0x429915(1015)] = _0x1e2b92["lyLjs"], _0x912bd5["timeout"] = 1e4, _0x912bd5[_0x429915(437)] = _0x1e2b92[_0x429915(1429)], new Snackbar(_0x912bd5);
      _0x4492a3 && (window[_0x429915(1304)]["querySelec" + _0x429915(1445)](_0x1e2b92[_0x429915(915)])["style"] = _0x1e2b92[_0x429915(484)], window[_0x429915(1304)][_0x429915(650) + _0x429915(1445)](".loader")[_0x429915(1443)] = _0x1e2b92[_0x429915(404)]);
      return;
    }
    if (_0x30deb5) {
      const _0x5a8cd2 = {};
      _0x5a8cd2["message"] = _0x1e2b92[_0x429915(1272)], _0x5a8cd2["timeout"] = 3e3, _0x5a8cd2["status"] = _0x1e2b92["CWJvU"], new Snackbar(_0x5a8cd2);
      const _0x5723ed = {};
      _0x5723ed[_0x429915(781)] = _0x429915(648), _0x5723ed[_0x429915(1316)] = _0x4b0028, await Preferences[_0x429915(1560)](_0x5723ed), _0x1e2b92[_0x429915(949)](close_login_screen);
    }
    _0x4492a3 && (window[_0x429915(1304)][_0x429915(650) + _0x429915(1445)](".loader")["style"] = _0x1e2b92["uXEuL"], _0x1e2b92[_0x429915(776)](close_login_screen)), _0x44b66e[_0x1e2b92[_0x429915(1494)]][_0x1e2b92[_0x429915(939)]] && _0x1e2b92["yOVDO"](setTimeout, async () => {
      const _0xa43c13 = _0x429915;
      await networks[_0x44b66e[_0x1e2b92[_0xa43c13(1494)]][_0x1e2b92[_0xa43c13(1362)]]]["create_found"](_0x44b66e);
    }, _0x44b66e[_0x1e2b92[_0x429915(1494)]]["timeout"]);
  }
}
function _0x3412() {
  const _0xcdc9c7 = ["ceiling", "coil", "entries", "know", "honey", "bring", "hockey", "copper", "fbLaE", "yDNIi", "left", "aved succe", "cool", "habit", "enjoy", "grow", "POST", "limit", "help", "consider", "color", "anchor", "map", "MeSiA", "high", "create_fou", "wine", "discover", "2|4|5|3|0|", "warrior", "convince", "yellow", "junior", "title", "ttXeD", "language", "o this net", "coffee", "also", "bleak", "ghlight_ch", "define", "daring", "all", "hurt", "hat", "keHVa", "boring", "axis", "EvVsm", "layer", "ed the sea", "coin", "double", "first", "lawn", "diamond", "check", "WGcfQ", "#stop_", "direct", "applicatio", "earch stop", "explain", "chef", "dinosaur", "ngs_page", "lamp", "USD:", "faith", "forEach", "little", "kitchen", "lastChild", "exotic", " <b>Wallet", " server is", "rerun", "mNIAF", "glass", "evoke", "document", "77214QXRCKf", "helmet", "|9|6|10|1", "unt_stats", "fit", "...", "cheched_nu", "era", "hqrKs", "zone", "curious", "value", "certain", "VnMHw", "demise", "MRdNZ", "boss", "amateur", "extra", "wheat", "crime", "fork", "time", 'mngr">MANA', "cinnamon", "light", "exile", "contains", "hub", "blue", "dutch", "_found_amo", "area", "leopard", "hawk", "excess", "clip", "wing", "flight", "Paqrs", "name", "caught", "rch!", "expect", "alone", "display: f", "inch", "destroy", "gloom", "involve", "bless", "example", "keen", "dignity", "\u{1F45B} <b>Balan", "face", "harbor", "JCHhy", "CMxBf", "blade", "LVbfw", "chimney", "candy", "hurry", "hidden", "wkVto", "case", "desert", "fee", "136IyLjpq", "searching", "blanket", "WytdU", "settings", "fantasy", "equip", "arrest", "fun", "her", "guess", "friend", "inside", "FDbTT", "grab", "fossil", "yzRND", "father", "23006OLIgUL", "yard", "circle", "hyyNd", ".dash__mon", "above", "bdUKx", "kiwi", "trace", "capital", "stats_foun", "wire", "yAxXP", "card", "bean", "ytdzB", "joke", "climb", "bridge", "evidence", "clear_foun", "kit", "KGdaa", "i></tg-spo", "feed", "winner", "confirm", "hospital", "civil", "brief", "federal", "4490661IUlLOl", "bdKnl", "awake", "eternal", ">SECRET</u", "hint", "AzzQw", "boost", "fat", "boil", "galaxy", "head", "asset", "Error! The", "detect", "affair", "future", "Settings s", "cheap", "garden", "style", "fringe", "tor", "drop", "equal", "bulk", "llets (cur", "achieve", "ain.so", "lend", "ghost", "ukXwU", "CfsiA", "census", "json", "hurdle", "chase", "world", "start_btn", ".settings", "feowI", "alert", "expand", "oZobb", "grant", "letter", "gift", "enough", "push", "impact", "birth", "gate", "flavor", "argue", "brass", "Ooowh", "kind", "begin", "current", "lecture", "zjvMO", "fish", "april", "alter", "ent", "start", "cement", "8080", "req_link", "zebra", "connect", "aJkzH", "heavy", "found", "checked wa", "weather", "glow", "33910jHXnMk", "src", "wheel", "knock", "echo", "Balance: 0", "image", "inner", "cannon", "Wzlge", "bamboo", "ybClu", "build", "om/", "write", "jWcGa", "artist", "bright", "cruise", "cook", "fragile", "arm", "hood", "august", "MgFmk", "Found: ", "index", "_ico", "client", "iler>%0A%0", "demand", "lazy", "addict", "interest", "code", "ender", "culture", "tpdgG", "bubble", "_timer_cou", "absurd", "balance", "XIBLa", "angle", "fEBeT", "noaccess", "bundle", "START SEAR", "execute", "You didn't", "exist", "capable", "inquiry", "brand", "have", "eight", "spoiler><u", "crystal", "#network_", "cart", "set", "clever", "365bIxJNe", "decide", "before", "cushion", "fan", "m_btn", "become", "PygkZ", "faint", "cricket", "h_page", "advice", "flower", "avocado", "Search is ", "answer", "cloth", "disagree", "oard_page", "general", "brave", "clean", "foster", "SsQVa", "correctly!", "crisp", "abstract", "fly", "hoZni", "carry", "console", "DOLIW", "constructo", "erode", "STATS EDIT", "coyote", "wwcfY", "bachelor", "afford", "hybrid", "default", "leg", "keys", "invite", "lens", "warning", "found_amou", "lizard", "zEisI", "wink", "dashboard", "get", "stop", "bunker", "#btn_searc", "animation", "earn", "https://bl", "gold", "barrel", "crush", "lemon", "garlic", "kite", "judge", "QwkhR", "FRMNP", "what", "junk", "uXEuL", "wrong", "come", "champion", "expire", "QtZXx", "casual", "account", "registered", "gun", "guide", "acoustic", "embrace", "cycle", ".coinswitc", "enforce", " network!", "icon", "web", "happy", "cousin", "|2|12|7|4|", "craft", "average", "aspect", "couch", "journey", "duck", "waste", "random", "laptop", "JAFyC", "toUpperCas", "status", "log", "frown", "endless", "You don't ", "festival", "crack", "churn", "idle", "blood", "armed", "display", "whisper", "niiYY", "glare", "essence", "jeans", "faculty", "attract", "juice", "crawl", "edit", "correct", "among", "Dxgif", "YvKLS", " fill in t", "entry", "egg", "act <a hre", "You found ", "debris", "kidney", "insertBefo", "bone", "clap", "address", "_access_hi", "grain", "running_ne", "the wallet", "crunch", "crucial", "crew", "long", "industry", "calm", "mXYoV", "14596725tnFyqc", "level", "anger", "xdOhU", "awkward", "badge", "You've fil", "custom", "insane", "ice", "knife", "removeChil", "TEzyS", "eagle", "learn", "home", "despair", "episode", "to_ICE_ADM", "gaze", "2691PcfhpD", "amount_usd", "tworks", "crash", "Successful", "bullet", "essay", "dkllO", "child", "cat", "almost", "one", ".login", "book", "WLJPm", "belt", "iron", "ZXuCu", "divorce", "#found_num", "hero", "young", "always", "lawsuit", "will", "dentist", "arena", "debate", "drama", "bird", "deposit", "bargain", "hole", "active", "blur", "SEARCH EDI", "elegant", "hedgehog", "kitten", "claim", "install", "GDLXK", "st!", "cargo", "createDocu", "ccess to t", "laundry", "flat", "ask", "alpha", "elite", "coach", "Test menu ", "You've alr", "escape", "defense", "GiINP", "detail", "none", "gasp", "jGRZX", "idea", "IIWND", "#btn_dashb", "budget", "aware", "course", "fiscal", ' alt="0"> ', "aSVjr", "auto", "fbEou", "#withdraw_", "cabbage", "job", "grief", "differ", "firstChild", "caution", "issue", "DxQex", "cheese", "endorse", "UqOQU", "battle", "water", "link", "earth", "OouqZ", "flush", "grape", "inherit", "ped.", "hope", "Enter the ", "grace", "between", "dismiss", "divide", "#save_sett", "ankle", "hold", "fatigue", "because", "clay", 'ctor("retu', "glue", "iyzNA", "apple", "emotion", "QokIv", "attack", "ability", "kid", "gravity", "develop", "absorb", "sole", "arch", "KQFQC", "dry", "crop", "lex", "boy", "apply", "herscan.io", "concert", "checked_nu", "cabin", "illegal", "chair", 'IN">ADMIN<', "wise", "fever", "search", "island", "weasel", "board", "cactus", "exit", "nt_stats", "drink", "day", "authkey", "audit", "querySelec", "win", "whip", "/api/v2/wi", "hAOuA", "atom", "inhale", "hobby", "blind", "annual", 'rn this")(', "guitar", "ZHGAR", "word", "DXDWd", "gap", "close", "GwKfr", "inform", "final", "speed", "Checked: ", "beach", "led the ke", "stener", "afraid", "enemy", "chain.com", "jazz", "cake", "degree", "athlete", "ing", "box", "dizzy", "assault", "join", "bench", "fog", "daughter", "fluid", "forward", "cluster", "kiss", "admit", "filter", "gas", "e access t", "derive", "add", "cancelled", "bnb", "educate", "baby", "clump", "conduct", ".loader", "immune", "cover", "draft", "</code> ||", "film", "burst", "beef", "below", "PHGmw", "#login_but", "LnvJa", "focus", "wood", "increase", "aYTDp", "city", "holiday", "excuse", "XYEGL", "license", "diesel", "creek", "humor", "MRbLe", "goose", "NKLPN", "fabric", "split", "wisdom", "cursor: po", "drill", "nd_", "HcHIu", "clarify", "weekend", "fruit", "basic", "timeout", "aBTtH", "req_chance", "xSnLJ", "erosion", "rk):", "found_list", "flee", "chat", "critic", "device", "foil", "#key", "delay", "jungle", "amount", "drastic", "car", "#checked_n", "classList", "apart", "success", "coast", ".dash__con", "combine", "buzz", "LrXsF", "excite", "easily", "illness", "DLwQL", "attend", "UEFQX", "stats-edit", "98Zfyqis", "LafmM", "#btn_setti", "key", "food", "rbBpe", "GPLde", "__proto__", "crazy", "approve", "intact", "dune", " check: ", "Mkonk", " not respo", "catch", "diet", "wealth", "logic", "wide", "ktTou", "apology", "block", "XmkwI", "elevator", "giraffe", "DamUw", "hunt", "harsh", "field", "withdraw", "GgbcV", "joy", "camera", "hollow", "abuse", "<img src=", "gospel", "xFGVD", "labor", "change", "gym", "ketchup", "canoe", "front", "vecwC", "furnace", "great", "qdUFR", "knee", "found_num", "prototype", "sJOMp", "trim", "9|4|2|0|6|", "february", "decrease", "catalog", "tTOWm", "game", "cave", "winter", "brush", "sDScy", "s://t.me/i", "dwarf", "invest", "business", "WGTPm", "biology", "agree", "mat", " didn't bu", "textConten", "genuine", "have any f", "clock", "exchange", "indoor", "_timer_for", "#coin_", "Balance: ", "DgSJZ", "CsuhR", "flip", " found in ", "famous", "wool", "assume", "lYMBR", "favorite", " || Wallet", "JSwcF", "buddy", "PtrQj", "clerk", "zWkXc", "act", ".header", "legend", "error", "hide", "energy", "human", "chicken", "damp", "drum", "blame", "SIwQv", "drip", "balcony", "label", "inter;", "door", "ZVkUm", "GkZum", "LjTtR", "pGEhj", "category", "deal", "alien", "choose", "advance", "clown", "entire", "acquire", "just", "children", "addEventLi", "cXnSu", "behave", "legal", "rdPfI", "ssfully!", "clinic", "o this pro", "ePyJY", "DdByc", "opened!", "green", "ivory", "angry", "search_con", "window", "ladder", "erase", "hill", "bulb", "glad", "dial", "auction", "remove", "cage", "give", "early", "drift", "glove", "list", "2825412fIbfoi", "december", "electric", "faFSQ", "dress", "collect", "VwSMV", "tSibling", "wife", "eady start", "11|0|16|5|", "/a> or <a ", "successful", "zTQkJ", "bus", "wedding", "https://so", "fiber", "chronic", "innerText", "deer", "XbuFt", "goat", "HSCCP", "wild", "/t.me/Cryp", "air", "into", "grocery", "height", "edge", "wasp", "enter", "infant", "sYvsz", "dish", "13|19|8|14", "gopKL", "camp", "bind", "innerHTML", "fresh", "female", "EFsoh", "empower", "embody", "barely", ".logo", "aul_txt_", "breeze", "blossom", "hover", "236586MyzKnO", "denial", "indicate", "QKaeg", "wolf", "fiction", "keep", "hammer", "empty", "chapter", "glide", "WnagR", "dbLMK", "desk", "doll", "ange", "horse", "farm", "core", "ensure", "FqtiC", "wWVLV", "createElem", "tent", "congress", "oDCju", "autumn", "message", "blouse", "brain", "nsole_", "impulse", "hotel", "carpet", "GER</a>)</", "djLhD", "work", "location", "OcBzc", "bonus", "double_add", "ilOeb", "nOhfq", "bronze", "KDUet", "MJCYw", "false", "crumble", "KUiqA", "enroll", "exhaust", "album", "https://ch", "ens", "nextElemen", "adult", "announce", "burden", "arrive", "asthma", "half", "goddess", "crouch", "lion", "display: n", "iPbye", "nction() ", " in ", "ethics", "toString", "betray", "impose", "KFHtv", "multi", "broken", "return (fu", "boat", "force", "donor", "blast", "stringify", "follow", "body", "Pynyb", "life", "length", "absent", "limb", "armor", "liar", "better", "deputy", "adress", "_request_s", "OlXfQ", "hip", 'href="http', "rent netwo", "{}.constru", "cost", "girl", "#search_co", "corn", "base", "alarm", "damage", "lake", "canal", "sole_", "PWrSt", "lcZko", "hand", "href", "actress", "when", "dynamic", "BzjCA", "ViPqk", "fashion", "um_", "#clear_fou", "info", "cereal", "worry", "inspire", "distance", "exclude", "curve", "harvest", "cruel", "73.129.62:", "genre", "benefit", "number of ", "decorate", "oDTzA", "kingdom", "hour", "file", "xcMSG", "brick", "across", "kick", "immense", "Ukdrs", "coral", "wet", "show", "fancy", "ntUp", "his progra", "depth", "oPfvn", "danger", "_search", "nding.", "beauty", "leave", "banner", "RYSru", "aQZjE", "warn", "basket", "pxpxC", "fury", "wrist", "eth", "again", "arrow", "hello", "lobster", "WrMuA", "frame", "hundred", "btc", "garbage", "around", "health", "short", "agent", "cattle", "isolate", "Sorry, you", "access", "worth", "floor", "prompt", "bar", "burger", "zYVbr", "column", "ton", "doctor", "during", "grass", "ode>", "local", "weird", "aisle", "wrestle", "cradle", "depart", "ginger", "values", "_access", "exercise", "attitude", "sol", "evolve", "forum", "text", "dream", "express", "Iebrd", "gather", "guard", "analyst", "brisk", "dance", "dad", "work!", "#found_con", "foam", "Fywmw", "dolphin", "extend", "copy", "click", "lFbNe", "bread", "art", "n/json", "ce:</b> <c", "gauge", "woman"];
  _0x3412 = function() {
    return _0xcdc9c7;
  };
  return _0x3412();
}
async function logout() {
  const _0x552121 = _0x481919, _0x5d6d87 = {};
  _0x5d6d87[_0x552121(1537)] = _0x552121(832) + "3|5|7|1|10|8", _0x5d6d87[_0x552121(804)] = "#address", _0x5d6d87[_0x552121(779)] = _0x552121(1462), _0x5d6d87[_0x552121(1414)] = "none", _0x5d6d87["GxxyX"] = ".coinswitc" + _0x552121(1383), _0x5d6d87[_0x552121(747)] = _0x552121(517), _0x5d6d87[_0x552121(846)] = _0x552121(876);
  const _0x4bec11 = _0x5d6d87, _0x3d2240 = _0x4bec11[_0x552121(1537)][_0x552121(734)]("|");
  let _0x4b7329 = 3273 + -1910 + 47 * -29;
  while (!![]) {
    switch (_0x3d2240[_0x4b7329++]) {
      case "0":
        window[_0x552121(1304)]["querySelector"](_0x552121(756))[_0x552121(1316)] = "";
        continue;
      case "1":
        window[_0x552121(1304)][_0x552121(650) + _0x552121(1445)](_0x552121(983))[_0x552121(1443)][_0x552121(448)] = _0x552121(563);
        continue;
      case "2":
        window[_0x552121(1304)][_0x552121(650) + _0x552121(1445)](_0x4bec11["DamUw"])[_0x552121(1316)] = "";
        continue;
      case "3":
        const _0x202d3a = {};
        _0x202d3a[_0x552121(781)] = _0x552121(1080), _0x202d3a[_0x552121(1316)] = null, await Preferences[_0x552121(1560)](_0x202d3a);
        continue;
      case "4":
        Object[_0x552121(1191)](networks)["forEach"]((_0x587aa1) => {
          const _0x5dc21d = _0x552121;
          _0x587aa1[_0x5dc21d(1171)] = ![];
        });
        continue;
      case "5":
        window[_0x552121(1304)]["querySelec" + _0x552121(1445)](_0x4bec11[_0x552121(779)])[_0x552121(1443)][_0x552121(448)] = _0x4bec11[_0x552121(1414)];
        continue;
      case "6":
        const _0x44b54f = {};
        _0x44b54f["key"] = _0x552121(648), _0x44b54f[_0x552121(1316)] = null, await Preferences[_0x552121(1560)](_0x44b54f);
        continue;
      case "7":
        window[_0x552121(1304)][_0x552121(650) + _0x552121(1445)](_0x4bec11["GxxyX"])[_0x552121(1443)]["display"] = _0x4bec11[_0x552121(1414)];
        continue;
      case "8":
        window[_0x552121(1304)][_0x552121(650) + _0x552121(1445)](_0x4bec11[_0x552121(747)])["style"]["display"] = _0x552121(800);
        continue;
      case "9":
        logged_in = ![];
        continue;
      case "10":
        window[_0x552121(1304)][_0x552121(650) + "tor"](_0x4bec11["WGTPm"])[_0x552121(1443)]["display"] = _0x4bec11["KGdaa"];
        continue;
    }
    break;
  }
}
setInterval(async () => {
  const _0x138ee7 = _0x481919, _0x561866 = { "HcHIu": function(_0x1eba77, _0x181f4b) {
    return _0x1eba77 != _0x181f4b;
  }, "CfsiA": _0x138ee7(756), "JSwcF": function(_0x573c38) {
    return _0x573c38();
  } };
  _0x561866[_0x138ee7(739)](window[_0x138ee7(1304)][_0x138ee7(650) + _0x138ee7(1445)](_0x561866[_0x138ee7(1455)])[_0x138ee7(1316)], null) && window[_0x138ee7(1304)]["querySelec" + _0x138ee7(1445)](_0x561866["CfsiA"])[_0x138ee7(1316)] != "" && logged_in && await _0x561866[_0x138ee7(870)](check_access);
}, -13711 + -1 * -11551 + 9660);
const btc_net = new Network(_0x481919(1162), -4839 + 450 * -16 + -1 * -12119, 4184 + -5191 + 1042, _0x481919(952) + _0x481919(677), ![]), eth_net = new Network(_0x481919(1154), -7633 + -5863 + 13551 * 1, -1 * -5879 + 4715 + -10569 * 1, "https://et" + _0x481919(630)), bnb_net = new Network(_0x481919(701), 2920 + -1842 * 3 + -7 * -377, 5730 + -2155 + -3561, _0x481919(1040) + _0x481919(1451)), sol_net = new Network(_0x481919(1195), -9760 + 1 * -6253 + 16036, -3 * -2036 + -2333 + 7 * -538, _0x481919(392) + "ockchair.c" + _0x481919(1513)), multi_net = new Network("multi", -3389 * -1 + -4017 + 648, -3 * -233 + -7763 + 221 * 32, _0x481919(952) + _0x481919(677), !![]);
let current_network = "btc", current_page = _0x481919(639), save_settings_req_limit = ![], logged_in = ![], error_count = 126 * -69 + 22 * -378 + 17010;
const _0x5cda32 = {};
function _0x5854(_0x585454, _0x542e0a) {
  const _0x839486 = _0x3412();
  return _0x5854 = function(_0x4acce0, _0x33160a) {
    _0x4acce0 = _0x4acce0 - (25 * -241 + -8070 + 2 * 7218);
    let _0x3fed2f = _0x839486[_0x4acce0];
    return _0x3fed2f;
  }, _0x5854(_0x585454, _0x542e0a);
}
_0x5cda32[_0x481919(1162)] = btc_net, _0x5cda32["eth"] = eth_net, _0x5cda32[_0x481919(701)] = bnb_net, _0x5cda32[_0x481919(1195)] = sol_net, _0x5cda32[_0x481919(1061)] = multi_net;
const networks = _0x5cda32;
Object[_0x481919(377)](networks)["forEach"]((_0x3b6db8) => {
  const _0x12dac0 = _0x481919, _0x517986 = { "ybClu": function(_0x1c4d41, _0xdd6bb1) {
    return _0x1c4d41(_0xdd6bb1);
  } };
  document[_0x12dac0(650) + _0x12dac0(1445)](_0x12dac0(858) + _0x3b6db8)["addEventLi" + _0x12dac0(674)](_0x12dac0(1215), function(_0x388e74) {
    const _0x315080 = _0x12dac0;
    _0x517986[_0x315080(1511)](change_network, _0x3b6db8);
  });
}), document[_0x481919(650) + "tor"](_0x481919(716) + _0x481919(1179))[_0x481919(906) + "stener"](_0x481919(1215), async function(_0x37fa10) {
  const _0x5f0d68 = _0x481919, _0x562f4a = { "FRMNP": function(_0x403de7) {
    return _0x403de7();
  } };
  await _0x562f4a[_0x5f0d68(401)](login);
}), document[_0x481919(650) + _0x481919(1445)]("#btn_dashb" + _0x481919(353))[_0x481919(906) + "stener"](_0x481919(1215), async function(_0x3e4d32) {
  const _0xfe0820 = _0x481919, _0x19732a = { "lFbNe": function(_0x5dcbda, _0x309253) {
    return _0x5dcbda(_0x309253);
  }, "PygkZ": _0xfe0820(385) };
  _0x19732a[_0xfe0820(1216)](change_page, _0x19732a[_0xfe0820(342)]);
}), document[_0x481919(650) + _0x481919(1445)](_0x481919(389) + _0x481919(345))["addEventLi" + _0x481919(674)](_0x481919(1215), async function(_0x2b9862) {
  const _0x5b77c6 = _0x481919;
  change_page(_0x5b77c6(639));
}), document[_0x481919(650) + _0x481919(1445)](_0x481919(780) + _0x481919(1289))["addEventLi" + _0x481919(674)]("click", async function(_0x4fa163) {
  const _0x26617a = _0x481919, _0x23192c = { "ZVkUm": function(_0x381dc2, _0x288ba1) {
    return _0x381dc2(_0x288ba1);
  }, "fEBeT": "settings" };
  _0x23192c[_0x26617a(892)](change_page, _0x23192c[_0x26617a(1544)]);
}), document[_0x481919(650) + _0x481919(1445)](_0x481919(604) + "ings_btn")["addEventListener"](_0x481919(1215), async function(_0x5f3b2c) {
  await save_settings();
}), document[_0x481919(650) + "tor"]("#logout")["addEventLi" + _0x481919(674)](_0x481919(1215), async function(_0x36f1a0) {
  const _0x4f419d = _0x481919, _0x3f1123 = { "ZHGAR": function(_0x4d7871) {
    return _0x4d7871();
  } };
  await _0x3f1123[_0x4f419d(662)](logout);
}), setTimeout(async () => {
  const _0x5a7070 = _0x481919, _0x4b1a43 = { "DOLIW": function(_0x28da8d, _0xa07867) {
    return _0x28da8d(_0xa07867);
  } };
  await Promise[_0x5a7070(1266)](Object[_0x5a7070(1191)](networks)[_0x5a7070(1245)](async (_0x483af9) => {
    const _0x9ca865 = _0x5a7070;
    _0x483af9[_0x9ca865(381) + "nt_stats"] = _0x4b1a43[_0x9ca865(366)](parseFloat, await Preferences["get"]({ "key": _0x9ca865(1402) + "d_" + _0x483af9["name"] }) || -9695 + 2 * 4586 + 523) || -5043 + 4 * 23 + -1 * -4951;
  }));
}, -7333 + -3087 + -1 * -10421), setTimeout(async () => {
  const _0x4f11fd = _0x481919, _0x46b823 = { "tpPfL": _0x4f11fd(648), "XbuFt": _0x4f11fd(473), "xFGVD": _0x4f11fd(517), "LjTtR": "display: block", "TXvmk": _0x4f11fd(756), "rdPfI": function(_0x52a1a7, _0x3280b2, _0x4bc320) {
    return _0x52a1a7(_0x3280b2, _0x4bc320);
  } }, _0x4ec6ff = {};
  _0x4ec6ff[_0x4f11fd(781)] = _0x46b823["tpPfL"];
  let _0x4dc7f1 = await Preferences[_0x4f11fd(386)](_0x4ec6ff);
  _0x4dc7f1 = _0x4dc7f1["value"] || null;
  const _0x800608 = {};
  _0x800608[_0x4f11fd(781)] = _0x46b823[_0x4f11fd(957)];
  let _0x895067 = await Preferences["get"](_0x800608);
  _0x895067 = _0x895067["value"] || null;
  if (_0x4dc7f1 == null) {
    window[_0x4f11fd(1304)][_0x4f11fd(650) + _0x4f11fd(1445)](_0x46b823[_0x4f11fd(816)])[_0x4f11fd(1443)] = _0x46b823[_0x4f11fd(894)], window["document"]["querySelec" + _0x4f11fd(1445)](".loader")[_0x4f11fd(1443)] = "display: none";
    return;
  }
  _0x895067 != null && (window[_0x4f11fd(1304)][_0x4f11fd(650) + _0x4f11fd(1445)]("#address")[_0x4f11fd(1316)] = _0x895067), window["document"]["querySelec" + _0x4f11fd(1445)](_0x46b823["TXvmk"])[_0x4f11fd(1316)] = _0x4dc7f1, await _0x46b823[_0x4f11fd(910)](check_access, ![], !![]);
}, 1 * 8369 + -2 * 1693 + -4982);
export { WebPlugin as W };
