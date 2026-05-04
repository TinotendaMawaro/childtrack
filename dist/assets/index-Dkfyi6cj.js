(function () {
  const r = document.createElement("link").relList;
  if (r && r.supports && r.supports("modulepreload")) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) a(l);
  new MutationObserver((l) => {
    for (const u of l)
      if (u.type === "childList")
        for (const d of u.addedNodes)
          d.tagName === "LINK" && d.rel === "modulepreload" && a(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(l) {
    const u = {};
    return (
      l.integrity && (u.integrity = l.integrity),
      l.referrerPolicy && (u.referrerPolicy = l.referrerPolicy),
      l.crossOrigin === "use-credentials"
        ? (u.credentials = "include")
        : l.crossOrigin === "anonymous"
          ? (u.credentials = "omit")
          : (u.credentials = "same-origin"),
      u
    );
  }
  function a(l) {
    if (l.ep) return;
    l.ep = !0;
    const u = s(l);
    fetch(l.href, u);
  }
})();
var cl = { exports: {} },
  ms = {},
  dl = { exports: {} },
  ae = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Vd;
function km() {
  if (Vd) return ae;
  Vd = 1;
  var n = Symbol.for("react.element"),
    r = Symbol.for("react.portal"),
    s = Symbol.for("react.fragment"),
    a = Symbol.for("react.strict_mode"),
    l = Symbol.for("react.profiler"),
    u = Symbol.for("react.provider"),
    d = Symbol.for("react.context"),
    f = Symbol.for("react.forward_ref"),
    p = Symbol.for("react.suspense"),
    y = Symbol.for("react.memo"),
    v = Symbol.for("react.lazy"),
    x = Symbol.iterator;
  function _(R) {
    return R === null || typeof R != "object"
      ? null
      : ((R = (x && R[x]) || R["@@iterator"]),
        typeof R == "function" ? R : null);
  }
  var S = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    N = Object.assign,
    j = {};
  function E(R, U, ie) {
    ((this.props = R),
      (this.context = U),
      (this.refs = j),
      (this.updater = ie || S));
  }
  ((E.prototype.isReactComponent = {}),
    (E.prototype.setState = function (R, U) {
      if (typeof R != "object" && typeof R != "function" && R != null)
        throw Error(
          "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, R, U, "setState");
    }),
    (E.prototype.forceUpdate = function (R) {
      this.updater.enqueueForceUpdate(this, R, "forceUpdate");
    }));
  function A() {}
  A.prototype = E.prototype;
  function L(R, U, ie) {
    ((this.props = R),
      (this.context = U),
      (this.refs = j),
      (this.updater = ie || S));
  }
  var I = (L.prototype = new A());
  ((I.constructor = L), N(I, E.prototype), (I.isPureReactComponent = !0));
  var B = Array.isArray,
    re = Object.prototype.hasOwnProperty,
    Y = { current: null },
    se = { key: !0, ref: !0, __self: !0, __source: !0 };
  function me(R, U, ie) {
    var oe,
      ce = {},
      de = null,
      ge = null;
    if (U != null)
      for (oe in (U.ref !== void 0 && (ge = U.ref),
      U.key !== void 0 && (de = "" + U.key),
      U))
        re.call(U, oe) && !se.hasOwnProperty(oe) && (ce[oe] = U[oe]);
    var fe = arguments.length - 2;
    if (fe === 1) ce.children = ie;
    else if (1 < fe) {
      for (var ke = Array(fe), ot = 0; ot < fe; ot++)
        ke[ot] = arguments[ot + 2];
      ce.children = ke;
    }
    if (R && R.defaultProps)
      for (oe in ((fe = R.defaultProps), fe))
        ce[oe] === void 0 && (ce[oe] = fe[oe]);
    return {
      $$typeof: n,
      type: R,
      key: de,
      ref: ge,
      props: ce,
      _owner: Y.current,
    };
  }
  function _e(R, U) {
    return {
      $$typeof: n,
      type: R.type,
      key: U,
      ref: R.ref,
      props: R.props,
      _owner: R._owner,
    };
  }
  function at(R) {
    return typeof R == "object" && R !== null && R.$$typeof === n;
  }
  function Wt(R) {
    var U = { "=": "=0", ":": "=2" };
    return (
      "$" +
      R.replace(/[=:]/g, function (ie) {
        return U[ie];
      })
    );
  }
  var mt = /\/+/g;
  function He(R, U) {
    return typeof R == "object" && R !== null && R.key != null
      ? Wt("" + R.key)
      : U.toString(36);
  }
  function Xe(R, U, ie, oe, ce) {
    var de = typeof R;
    (de === "undefined" || de === "boolean") && (R = null);
    var ge = !1;
    if (R === null) ge = !0;
    else
      switch (de) {
        case "string":
        case "number":
          ge = !0;
          break;
        case "object":
          switch (R.$$typeof) {
            case n:
            case r:
              ge = !0;
          }
      }
    if (ge)
      return (
        (ge = R),
        (ce = ce(ge)),
        (R = oe === "" ? "." + He(ge, 0) : oe),
        B(ce)
          ? ((ie = ""),
            R != null && (ie = R.replace(mt, "$&/") + "/"),
            Xe(ce, U, ie, "", function (ot) {
              return ot;
            }))
          : ce != null &&
            (at(ce) &&
              (ce = _e(
                ce,
                ie +
                  (!ce.key || (ge && ge.key === ce.key)
                    ? ""
                    : ("" + ce.key).replace(mt, "$&/") + "/") +
                  R,
              )),
            U.push(ce)),
        1
      );
    if (((ge = 0), (oe = oe === "" ? "." : oe + ":"), B(R)))
      for (var fe = 0; fe < R.length; fe++) {
        de = R[fe];
        var ke = oe + He(de, fe);
        ge += Xe(de, U, ie, ke, ce);
      }
    else if (((ke = _(R)), typeof ke == "function"))
      for (R = ke.call(R), fe = 0; !(de = R.next()).done; )
        ((de = de.value),
          (ke = oe + He(de, fe++)),
          (ge += Xe(de, U, ie, ke, ce)));
    else if (de === "object")
      throw (
        (U = String(R)),
        Error(
          "Objects are not valid as a React child (found: " +
            (U === "[object Object]"
              ? "object with keys {" + Object.keys(R).join(", ") + "}"
              : U) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    return ge;
  }
  function Ie(R, U, ie) {
    if (R == null) return R;
    var oe = [],
      ce = 0;
    return (
      Xe(R, oe, "", "", function (de) {
        return U.call(ie, de, ce++);
      }),
      oe
    );
  }
  function Ze(R) {
    if (R._status === -1) {
      var U = R._result;
      ((U = U()),
        U.then(
          function (ie) {
            (R._status === 0 || R._status === -1) &&
              ((R._status = 1), (R._result = ie));
          },
          function (ie) {
            (R._status === 0 || R._status === -1) &&
              ((R._status = 2), (R._result = ie));
          },
        ),
        R._status === -1 && ((R._status = 0), (R._result = U)));
    }
    if (R._status === 1) return R._result.default;
    throw R._result;
  }
  var Ce = { current: null },
    F = { transition: null },
    te = {
      ReactCurrentDispatcher: Ce,
      ReactCurrentBatchConfig: F,
      ReactCurrentOwner: Y,
    };
  function H() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return (
    (ae.Children = {
      map: Ie,
      forEach: function (R, U, ie) {
        Ie(
          R,
          function () {
            U.apply(this, arguments);
          },
          ie,
        );
      },
      count: function (R) {
        var U = 0;
        return (
          Ie(R, function () {
            U++;
          }),
          U
        );
      },
      toArray: function (R) {
        return (
          Ie(R, function (U) {
            return U;
          }) || []
        );
      },
      only: function (R) {
        if (!at(R))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return R;
      },
    }),
    (ae.Component = E),
    (ae.Fragment = s),
    (ae.Profiler = l),
    (ae.PureComponent = L),
    (ae.StrictMode = a),
    (ae.Suspense = p),
    (ae.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = te),
    (ae.act = H),
    (ae.cloneElement = function (R, U, ie) {
      if (R == null)
        throw Error(
          "React.cloneElement(...): The argument must be a React element, but you passed " +
            R +
            ".",
        );
      var oe = N({}, R.props),
        ce = R.key,
        de = R.ref,
        ge = R._owner;
      if (U != null) {
        if (
          (U.ref !== void 0 && ((de = U.ref), (ge = Y.current)),
          U.key !== void 0 && (ce = "" + U.key),
          R.type && R.type.defaultProps)
        )
          var fe = R.type.defaultProps;
        for (ke in U)
          re.call(U, ke) &&
            !se.hasOwnProperty(ke) &&
            (oe[ke] = U[ke] === void 0 && fe !== void 0 ? fe[ke] : U[ke]);
      }
      var ke = arguments.length - 2;
      if (ke === 1) oe.children = ie;
      else if (1 < ke) {
        fe = Array(ke);
        for (var ot = 0; ot < ke; ot++) fe[ot] = arguments[ot + 2];
        oe.children = fe;
      }
      return {
        $$typeof: n,
        type: R.type,
        key: ce,
        ref: de,
        props: oe,
        _owner: ge,
      };
    }),
    (ae.createContext = function (R) {
      return (
        (R = {
          $$typeof: d,
          _currentValue: R,
          _currentValue2: R,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null,
        }),
        (R.Provider = { $$typeof: u, _context: R }),
        (R.Consumer = R)
      );
    }),
    (ae.createElement = me),
    (ae.createFactory = function (R) {
      var U = me.bind(null, R);
      return ((U.type = R), U);
    }),
    (ae.createRef = function () {
      return { current: null };
    }),
    (ae.forwardRef = function (R) {
      return { $$typeof: f, render: R };
    }),
    (ae.isValidElement = at),
    (ae.lazy = function (R) {
      return { $$typeof: v, _payload: { _status: -1, _result: R }, _init: Ze };
    }),
    (ae.memo = function (R, U) {
      return { $$typeof: y, type: R, compare: U === void 0 ? null : U };
    }),
    (ae.startTransition = function (R) {
      var U = F.transition;
      F.transition = {};
      try {
        R();
      } finally {
        F.transition = U;
      }
    }),
    (ae.unstable_act = H),
    (ae.useCallback = function (R, U) {
      return Ce.current.useCallback(R, U);
    }),
    (ae.useContext = function (R) {
      return Ce.current.useContext(R);
    }),
    (ae.useDebugValue = function () {}),
    (ae.useDeferredValue = function (R) {
      return Ce.current.useDeferredValue(R);
    }),
    (ae.useEffect = function (R, U) {
      return Ce.current.useEffect(R, U);
    }),
    (ae.useId = function () {
      return Ce.current.useId();
    }),
    (ae.useImperativeHandle = function (R, U, ie) {
      return Ce.current.useImperativeHandle(R, U, ie);
    }),
    (ae.useInsertionEffect = function (R, U) {
      return Ce.current.useInsertionEffect(R, U);
    }),
    (ae.useLayoutEffect = function (R, U) {
      return Ce.current.useLayoutEffect(R, U);
    }),
    (ae.useMemo = function (R, U) {
      return Ce.current.useMemo(R, U);
    }),
    (ae.useReducer = function (R, U, ie) {
      return Ce.current.useReducer(R, U, ie);
    }),
    (ae.useRef = function (R) {
      return Ce.current.useRef(R);
    }),
    (ae.useState = function (R) {
      return Ce.current.useState(R);
    }),
    (ae.useSyncExternalStore = function (R, U, ie) {
      return Ce.current.useSyncExternalStore(R, U, ie);
    }),
    (ae.useTransition = function () {
      return Ce.current.useTransition();
    }),
    (ae.version = "18.3.1"),
    ae
  );
}
var Hd;
function Bl() {
  return (Hd || ((Hd = 1), (dl.exports = km())), dl.exports);
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var qd;
function bm() {
  if (qd) return ms;
  qd = 1;
  var n = Bl(),
    r = Symbol.for("react.element"),
    s = Symbol.for("react.fragment"),
    a = Object.prototype.hasOwnProperty,
    l = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    u = { key: !0, ref: !0, __self: !0, __source: !0 };
  function d(f, p, y) {
    var v,
      x = {},
      _ = null,
      S = null;
    (y !== void 0 && (_ = "" + y),
      p.key !== void 0 && (_ = "" + p.key),
      p.ref !== void 0 && (S = p.ref));
    for (v in p) a.call(p, v) && !u.hasOwnProperty(v) && (x[v] = p[v]);
    if (f && f.defaultProps)
      for (v in ((p = f.defaultProps), p)) x[v] === void 0 && (x[v] = p[v]);
    return {
      $$typeof: r,
      type: f,
      key: _,
      ref: S,
      props: x,
      _owner: l.current,
    };
  }
  return ((ms.Fragment = s), (ms.jsx = d), (ms.jsxs = d), ms);
}
var Kd;
function Sm() {
  return (Kd || ((Kd = 1), (cl.exports = bm())), cl.exports);
}
var m = Sm(),
  C = Bl(),
  Vi = {},
  hl = { exports: {} },
  it = {},
  fl = { exports: {} },
  pl = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Gd;
function Em() {
  return (
    Gd ||
      ((Gd = 1),
      (function (n) {
        function r(F, te) {
          var H = F.length;
          F.push(te);
          e: for (; 0 < H; ) {
            var R = (H - 1) >>> 1,
              U = F[R];
            if (0 < l(U, te)) ((F[R] = te), (F[H] = U), (H = R));
            else break e;
          }
        }
        function s(F) {
          return F.length === 0 ? null : F[0];
        }
        function a(F) {
          if (F.length === 0) return null;
          var te = F[0],
            H = F.pop();
          if (H !== te) {
            F[0] = H;
            e: for (var R = 0, U = F.length, ie = U >>> 1; R < ie; ) {
              var oe = 2 * (R + 1) - 1,
                ce = F[oe],
                de = oe + 1,
                ge = F[de];
              if (0 > l(ce, H))
                de < U && 0 > l(ge, ce)
                  ? ((F[R] = ge), (F[de] = H), (R = de))
                  : ((F[R] = ce), (F[oe] = H), (R = oe));
              else if (de < U && 0 > l(ge, H))
                ((F[R] = ge), (F[de] = H), (R = de));
              else break e;
            }
          }
          return te;
        }
        function l(F, te) {
          var H = F.sortIndex - te.sortIndex;
          return H !== 0 ? H : F.id - te.id;
        }
        if (
          typeof performance == "object" &&
          typeof performance.now == "function"
        ) {
          var u = performance;
          n.unstable_now = function () {
            return u.now();
          };
        } else {
          var d = Date,
            f = d.now();
          n.unstable_now = function () {
            return d.now() - f;
          };
        }
        var p = [],
          y = [],
          v = 1,
          x = null,
          _ = 3,
          S = !1,
          N = !1,
          j = !1,
          E = typeof setTimeout == "function" ? setTimeout : null,
          A = typeof clearTimeout == "function" ? clearTimeout : null,
          L = typeof setImmediate < "u" ? setImmediate : null;
        typeof navigator < "u" &&
          navigator.scheduling !== void 0 &&
          navigator.scheduling.isInputPending !== void 0 &&
          navigator.scheduling.isInputPending.bind(navigator.scheduling);
        function I(F) {
          for (var te = s(y); te !== null; ) {
            if (te.callback === null) a(y);
            else if (te.startTime <= F)
              (a(y), (te.sortIndex = te.expirationTime), r(p, te));
            else break;
            te = s(y);
          }
        }
        function B(F) {
          if (((j = !1), I(F), !N))
            if (s(p) !== null) ((N = !0), Ze(re));
            else {
              var te = s(y);
              te !== null && Ce(B, te.startTime - F);
            }
        }
        function re(F, te) {
          ((N = !1), j && ((j = !1), A(me), (me = -1)), (S = !0));
          var H = _;
          try {
            for (
              I(te), x = s(p);
              x !== null && (!(x.expirationTime > te) || (F && !Wt()));
            ) {
              var R = x.callback;
              if (typeof R == "function") {
                ((x.callback = null), (_ = x.priorityLevel));
                var U = R(x.expirationTime <= te);
                ((te = n.unstable_now()),
                  typeof U == "function"
                    ? (x.callback = U)
                    : x === s(p) && a(p),
                  I(te));
              } else a(p);
              x = s(p);
            }
            if (x !== null) var ie = !0;
            else {
              var oe = s(y);
              (oe !== null && Ce(B, oe.startTime - te), (ie = !1));
            }
            return ie;
          } finally {
            ((x = null), (_ = H), (S = !1));
          }
        }
        var Y = !1,
          se = null,
          me = -1,
          _e = 5,
          at = -1;
        function Wt() {
          return !(n.unstable_now() - at < _e);
        }
        function mt() {
          if (se !== null) {
            var F = n.unstable_now();
            at = F;
            var te = !0;
            try {
              te = se(!0, F);
            } finally {
              te ? He() : ((Y = !1), (se = null));
            }
          } else Y = !1;
        }
        var He;
        if (typeof L == "function")
          He = function () {
            L(mt);
          };
        else if (typeof MessageChannel < "u") {
          var Xe = new MessageChannel(),
            Ie = Xe.port2;
          ((Xe.port1.onmessage = mt),
            (He = function () {
              Ie.postMessage(null);
            }));
        } else
          He = function () {
            E(mt, 0);
          };
        function Ze(F) {
          ((se = F), Y || ((Y = !0), He()));
        }
        function Ce(F, te) {
          me = E(function () {
            F(n.unstable_now());
          }, te);
        }
        ((n.unstable_IdlePriority = 5),
          (n.unstable_ImmediatePriority = 1),
          (n.unstable_LowPriority = 4),
          (n.unstable_NormalPriority = 3),
          (n.unstable_Profiling = null),
          (n.unstable_UserBlockingPriority = 2),
          (n.unstable_cancelCallback = function (F) {
            F.callback = null;
          }),
          (n.unstable_continueExecution = function () {
            N || S || ((N = !0), Ze(re));
          }),
          (n.unstable_forceFrameRate = function (F) {
            0 > F || 125 < F
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (_e = 0 < F ? Math.floor(1e3 / F) : 5);
          }),
          (n.unstable_getCurrentPriorityLevel = function () {
            return _;
          }),
          (n.unstable_getFirstCallbackNode = function () {
            return s(p);
          }),
          (n.unstable_next = function (F) {
            switch (_) {
              case 1:
              case 2:
              case 3:
                var te = 3;
                break;
              default:
                te = _;
            }
            var H = _;
            _ = te;
            try {
              return F();
            } finally {
              _ = H;
            }
          }),
          (n.unstable_pauseExecution = function () {}),
          (n.unstable_requestPaint = function () {}),
          (n.unstable_runWithPriority = function (F, te) {
            switch (F) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                F = 3;
            }
            var H = _;
            _ = F;
            try {
              return te();
            } finally {
              _ = H;
            }
          }),
          (n.unstable_scheduleCallback = function (F, te, H) {
            var R = n.unstable_now();
            switch (
              (typeof H == "object" && H !== null
                ? ((H = H.delay),
                  (H = typeof H == "number" && 0 < H ? R + H : R))
                : (H = R),
              F)
            ) {
              case 1:
                var U = -1;
                break;
              case 2:
                U = 250;
                break;
              case 5:
                U = 1073741823;
                break;
              case 4:
                U = 1e4;
                break;
              default:
                U = 5e3;
            }
            return (
              (U = H + U),
              (F = {
                id: v++,
                callback: te,
                priorityLevel: F,
                startTime: H,
                expirationTime: U,
                sortIndex: -1,
              }),
              H > R
                ? ((F.sortIndex = H),
                  r(y, F),
                  s(p) === null &&
                    F === s(y) &&
                    (j ? (A(me), (me = -1)) : (j = !0), Ce(B, H - R)))
                : ((F.sortIndex = U), r(p, F), N || S || ((N = !0), Ze(re))),
              F
            );
          }),
          (n.unstable_shouldYield = Wt),
          (n.unstable_wrapCallback = function (F) {
            var te = _;
            return function () {
              var H = _;
              _ = te;
              try {
                return F.apply(this, arguments);
              } finally {
                _ = H;
              }
            };
          }));
      })(pl)),
    pl
  );
}
var Jd;
function jm() {
  return (Jd || ((Jd = 1), (fl.exports = Em())), fl.exports);
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Qd;
function Cm() {
  if (Qd) return it;
  Qd = 1;
  var n = Bl(),
    r = jm();
  function s(e) {
    for (
      var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e,
        i = 1;
      i < arguments.length;
      i++
    )
      t += "&args[]=" + encodeURIComponent(arguments[i]);
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  var a = new Set(),
    l = {};
  function u(e, t) {
    (d(e, t), d(e + "Capture", t));
  }
  function d(e, t) {
    for (l[e] = t, e = 0; e < t.length; e++) a.add(t[e]);
  }
  var f = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    p = Object.prototype.hasOwnProperty,
    y =
      /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    v = {},
    x = {};
  function _(e) {
    return p.call(x, e)
      ? !0
      : p.call(v, e)
        ? !1
        : y.test(e)
          ? (x[e] = !0)
          : ((v[e] = !0), !1);
  }
  function S(e, t, i, o) {
    if (i !== null && i.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o
          ? !1
          : i !== null
            ? !i.acceptsBooleans
            : ((e = e.toLowerCase().slice(0, 5)),
              e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function N(e, t, i, o) {
    if (t === null || typeof t > "u" || S(e, t, i, o)) return !0;
    if (o) return !1;
    if (i !== null)
      switch (i.type) {
        case 3:
          return !t;
        case 4:
          return t === !1;
        case 5:
          return isNaN(t);
        case 6:
          return isNaN(t) || 1 > t;
      }
    return !1;
  }
  function j(e, t, i, o, c, h, g) {
    ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
      (this.attributeName = o),
      (this.attributeNamespace = c),
      (this.mustUseProperty = i),
      (this.propertyName = e),
      (this.type = t),
      (this.sanitizeURL = h),
      (this.removeEmptyString = g));
  }
  var E = {};
  ("children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
    .split(" ")
    .forEach(function (e) {
      E[e] = new j(e, 0, !1, e, null, !1, !1);
    }),
    [
      ["acceptCharset", "accept-charset"],
      ["className", "class"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
    ].forEach(function (e) {
      var t = e[0];
      E[t] = new j(t, 1, !1, e[1], null, !1, !1);
    }),
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(
      function (e) {
        E[e] = new j(e, 2, !1, e.toLowerCase(), null, !1, !1);
      },
    ),
    [
      "autoReverse",
      "externalResourcesRequired",
      "focusable",
      "preserveAlpha",
    ].forEach(function (e) {
      E[e] = new j(e, 2, !1, e, null, !1, !1);
    }),
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
      .split(" ")
      .forEach(function (e) {
        E[e] = new j(e, 3, !1, e.toLowerCase(), null, !1, !1);
      }),
    ["checked", "multiple", "muted", "selected"].forEach(function (e) {
      E[e] = new j(e, 3, !0, e, null, !1, !1);
    }),
    ["capture", "download"].forEach(function (e) {
      E[e] = new j(e, 4, !1, e, null, !1, !1);
    }),
    ["cols", "rows", "size", "span"].forEach(function (e) {
      E[e] = new j(e, 6, !1, e, null, !1, !1);
    }),
    ["rowSpan", "start"].forEach(function (e) {
      E[e] = new j(e, 5, !1, e.toLowerCase(), null, !1, !1);
    }));
  var A = /[\-:]([a-z])/g;
  function L(e) {
    return e[1].toUpperCase();
  }
  ("accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (e) {
      var t = e.replace(A, L);
      E[t] = new j(t, 1, !1, e, null, !1, !1);
    }),
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
      .split(" ")
      .forEach(function (e) {
        var t = e.replace(A, L);
        E[t] = new j(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
      }),
    ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
      var t = e.replace(A, L);
      E[t] = new j(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
    }),
    ["tabIndex", "crossOrigin"].forEach(function (e) {
      E[e] = new j(e, 1, !1, e.toLowerCase(), null, !1, !1);
    }),
    (E.xlinkHref = new j(
      "xlinkHref",
      1,
      !1,
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      !1,
    )),
    ["src", "href", "action", "formAction"].forEach(function (e) {
      E[e] = new j(e, 1, !1, e.toLowerCase(), null, !0, !0);
    }));
  function I(e, t, i, o) {
    var c = E.hasOwnProperty(t) ? E[t] : null;
    (c !== null
      ? c.type !== 0
      : o ||
        !(2 < t.length) ||
        (t[0] !== "o" && t[0] !== "O") ||
        (t[1] !== "n" && t[1] !== "N")) &&
      (N(t, i, c, o) && (i = null),
      o || c === null
        ? _(t) &&
          (i === null ? e.removeAttribute(t) : e.setAttribute(t, "" + i))
        : c.mustUseProperty
          ? (e[c.propertyName] = i === null ? (c.type === 3 ? !1 : "") : i)
          : ((t = c.attributeName),
            (o = c.attributeNamespace),
            i === null
              ? e.removeAttribute(t)
              : ((c = c.type),
                (i = c === 3 || (c === 4 && i === !0) ? "" : "" + i),
                o ? e.setAttributeNS(o, t, i) : e.setAttribute(t, i))));
  }
  var B = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    re = Symbol.for("react.element"),
    Y = Symbol.for("react.portal"),
    se = Symbol.for("react.fragment"),
    me = Symbol.for("react.strict_mode"),
    _e = Symbol.for("react.profiler"),
    at = Symbol.for("react.provider"),
    Wt = Symbol.for("react.context"),
    mt = Symbol.for("react.forward_ref"),
    He = Symbol.for("react.suspense"),
    Xe = Symbol.for("react.suspense_list"),
    Ie = Symbol.for("react.memo"),
    Ze = Symbol.for("react.lazy"),
    Ce = Symbol.for("react.offscreen"),
    F = Symbol.iterator;
  function te(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (F && e[F]) || e["@@iterator"]),
        typeof e == "function" ? e : null);
  }
  var H = Object.assign,
    R;
  function U(e) {
    if (R === void 0)
      try {
        throw Error();
      } catch (i) {
        var t = i.stack.trim().match(/\n( *(at )?)/);
        R = (t && t[1]) || "";
      }
    return (
      `
` +
      R +
      e
    );
  }
  var ie = !1;
  function oe(e, t) {
    if (!e || ie) return "";
    ie = !0;
    var i = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t)
        if (
          ((t = function () {
            throw Error();
          }),
          Object.defineProperty(t.prototype, "props", {
            set: function () {
              throw Error();
            },
          }),
          typeof Reflect == "object" && Reflect.construct)
        ) {
          try {
            Reflect.construct(t, []);
          } catch (O) {
            var o = O;
          }
          Reflect.construct(e, [], t);
        } else {
          try {
            t.call();
          } catch (O) {
            o = O;
          }
          e.call(t.prototype);
        }
      else {
        try {
          throw Error();
        } catch (O) {
          o = O;
        }
        e();
      }
    } catch (O) {
      if (O && o && typeof O.stack == "string") {
        for (
          var c = O.stack.split(`
`),
            h = o.stack.split(`
`),
            g = c.length - 1,
            w = h.length - 1;
          1 <= g && 0 <= w && c[g] !== h[w];
        )
          w--;
        for (; 1 <= g && 0 <= w; g--, w--)
          if (c[g] !== h[w]) {
            if (g !== 1 || w !== 1)
              do
                if ((g--, w--, 0 > w || c[g] !== h[w])) {
                  var k =
                    `
` + c[g].replace(" at new ", " at ");
                  return (
                    e.displayName &&
                      k.includes("<anonymous>") &&
                      (k = k.replace("<anonymous>", e.displayName)),
                    k
                  );
                }
              while (1 <= g && 0 <= w);
            break;
          }
      }
    } finally {
      ((ie = !1), (Error.prepareStackTrace = i));
    }
    return (e = e ? e.displayName || e.name : "") ? U(e) : "";
  }
  function ce(e) {
    switch (e.tag) {
      case 5:
        return U(e.type);
      case 16:
        return U("Lazy");
      case 13:
        return U("Suspense");
      case 19:
        return U("SuspenseList");
      case 0:
      case 2:
      case 15:
        return ((e = oe(e.type, !1)), e);
      case 11:
        return ((e = oe(e.type.render, !1)), e);
      case 1:
        return ((e = oe(e.type, !0)), e);
      default:
        return "";
    }
  }
  function de(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case se:
        return "Fragment";
      case Y:
        return "Portal";
      case _e:
        return "Profiler";
      case me:
        return "StrictMode";
      case He:
        return "Suspense";
      case Xe:
        return "SuspenseList";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case Wt:
          return (e.displayName || "Context") + ".Consumer";
        case at:
          return (e._context.displayName || "Context") + ".Provider";
        case mt:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ""),
              (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          );
        case Ie:
          return (
            (t = e.displayName || null),
            t !== null ? t : de(e.type) || "Memo"
          );
        case Ze:
          ((t = e._payload), (e = e._init));
          try {
            return de(e(t));
          } catch {}
      }
    return null;
  }
  function ge(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return (
          (e = t.render),
          (e = e.displayName || e.name || ""),
          t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
        );
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return de(t);
      case 8:
        return t === me ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function fe(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function ke(e) {
    var t = e.type;
    return (
      (e = e.nodeName) &&
      e.toLowerCase() === "input" &&
      (t === "checkbox" || t === "radio")
    );
  }
  function ot(e) {
    var t = ke(e) ? "checked" : "value",
      i = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
      o = "" + e[t];
    if (
      !e.hasOwnProperty(t) &&
      typeof i < "u" &&
      typeof i.get == "function" &&
      typeof i.set == "function"
    ) {
      var c = i.get,
        h = i.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return c.call(this);
          },
          set: function (g) {
            ((o = "" + g), h.call(this, g));
          },
        }),
        Object.defineProperty(e, t, { enumerable: i.enumerable }),
        {
          getValue: function () {
            return o;
          },
          setValue: function (g) {
            o = "" + g;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function Is(e) {
    e._valueTracker || (e._valueTracker = ot(e));
  }
  function Ql(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var i = t.getValue(),
      o = "";
    return (
      e && (o = ke(e) ? (e.checked ? "true" : "false") : e.value),
      (e = o),
      e !== i ? (t.setValue(e), !0) : !1
    );
  }
  function Ls(e) {
    if (
      ((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")
    )
      return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function ga(e, t) {
    var i = t.checked;
    return H({}, t, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: i ?? e._wrapperState.initialChecked,
    });
  }
  function Yl(e, t) {
    var i = t.defaultValue == null ? "" : t.defaultValue,
      o = t.checked != null ? t.checked : t.defaultChecked;
    ((i = fe(t.value != null ? t.value : i)),
      (e._wrapperState = {
        initialChecked: o,
        initialValue: i,
        controlled:
          t.type === "checkbox" || t.type === "radio"
            ? t.checked != null
            : t.value != null,
      }));
  }
  function Xl(e, t) {
    ((t = t.checked), t != null && I(e, "checked", t, !1));
  }
  function ya(e, t) {
    Xl(e, t);
    var i = fe(t.value),
      o = t.type;
    if (i != null)
      o === "number"
        ? ((i === 0 && e.value === "") || e.value != i) && (e.value = "" + i)
        : e.value !== "" + i && (e.value = "" + i);
    else if (o === "submit" || o === "reset") {
      e.removeAttribute("value");
      return;
    }
    (t.hasOwnProperty("value")
      ? va(e, t.type, i)
      : t.hasOwnProperty("defaultValue") && va(e, t.type, fe(t.defaultValue)),
      t.checked == null &&
        t.defaultChecked != null &&
        (e.defaultChecked = !!t.defaultChecked));
  }
  function Zl(e, t, i) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var o = t.type;
      if (
        !(
          (o !== "submit" && o !== "reset") ||
          (t.value !== void 0 && t.value !== null)
        )
      )
        return;
      ((t = "" + e._wrapperState.initialValue),
        i || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((i = e.name),
      i !== "" && (e.name = ""),
      (e.defaultChecked = !!e._wrapperState.initialChecked),
      i !== "" && (e.name = i));
  }
  function va(e, t, i) {
    (t !== "number" || Ls(e.ownerDocument) !== e) &&
      (i == null
        ? (e.defaultValue = "" + e._wrapperState.initialValue)
        : e.defaultValue !== "" + i && (e.defaultValue = "" + i));
  }
  var Nn = Array.isArray;
  function Fr(e, t, i, o) {
    if (((e = e.options), t)) {
      t = {};
      for (var c = 0; c < i.length; c++) t["$" + i[c]] = !0;
      for (i = 0; i < e.length; i++)
        ((c = t.hasOwnProperty("$" + e[i].value)),
          e[i].selected !== c && (e[i].selected = c),
          c && o && (e[i].defaultSelected = !0));
    } else {
      for (i = "" + fe(i), t = null, c = 0; c < e.length; c++) {
        if (e[c].value === i) {
          ((e[c].selected = !0), o && (e[c].defaultSelected = !0));
          return;
        }
        t !== null || e[c].disabled || (t = e[c]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function wa(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91));
    return H({}, t, {
      value: void 0,
      defaultValue: void 0,
      children: "" + e._wrapperState.initialValue,
    });
  }
  function eu(e, t) {
    var i = t.value;
    if (i == null) {
      if (((i = t.children), (t = t.defaultValue), i != null)) {
        if (t != null) throw Error(s(92));
        if (Nn(i)) {
          if (1 < i.length) throw Error(s(93));
          i = i[0];
        }
        t = i;
      }
      (t == null && (t = ""), (i = t));
    }
    e._wrapperState = { initialValue: fe(i) };
  }
  function tu(e, t) {
    var i = fe(t.value),
      o = fe(t.defaultValue);
    (i != null &&
      ((i = "" + i),
      i !== e.value && (e.value = i),
      t.defaultValue == null && e.defaultValue !== i && (e.defaultValue = i)),
      o != null && (e.defaultValue = "" + o));
  }
  function ru(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue &&
      t !== "" &&
      t !== null &&
      (e.value = t);
  }
  function nu(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function xa(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml"
      ? nu(t)
      : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
        ? "http://www.w3.org/1999/xhtml"
        : e;
  }
  var $s,
    su = (function (e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
        ? function (t, i, o, c) {
            MSApp.execUnsafeLocalFunction(function () {
              return e(t, i, o, c);
            });
          }
        : e;
    })(function (e, t) {
      if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
        e.innerHTML = t;
      else {
        for (
          $s = $s || document.createElement("div"),
            $s.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
            t = $s.firstChild;
          e.firstChild;
        )
          e.removeChild(e.firstChild);
        for (; t.firstChild; ) e.appendChild(t.firstChild);
      }
    });
  function Pn(e, t) {
    if (t) {
      var i = e.firstChild;
      if (i && i === e.lastChild && i.nodeType === 3) {
        i.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var On = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0,
    },
    jf = ["Webkit", "ms", "Moz", "O"];
  Object.keys(On).forEach(function (e) {
    jf.forEach(function (t) {
      ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (On[t] = On[e]));
    });
  });
  function iu(e, t, i) {
    return t == null || typeof t == "boolean" || t === ""
      ? ""
      : i || typeof t != "number" || t === 0 || (On.hasOwnProperty(e) && On[e])
        ? ("" + t).trim()
        : t + "px";
  }
  function au(e, t) {
    e = e.style;
    for (var i in t)
      if (t.hasOwnProperty(i)) {
        var o = i.indexOf("--") === 0,
          c = iu(i, t[i], o);
        (i === "float" && (i = "cssFloat"),
          o ? e.setProperty(i, c) : (e[i] = c));
      }
  }
  var Cf = H(
    { menuitem: !0 },
    {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0,
    },
  );
  function _a(e, t) {
    if (t) {
      if (Cf[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
        throw Error(s(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60));
        if (
          typeof t.dangerouslySetInnerHTML != "object" ||
          !("__html" in t.dangerouslySetInnerHTML)
        )
          throw Error(s(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62));
    }
  }
  function ka(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var ba = null;
  function Sa(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var Ea = null,
    Wr = null,
    Vr = null;
  function ou(e) {
    if ((e = es(e))) {
      if (typeof Ea != "function") throw Error(s(280));
      var t = e.stateNode;
      t && ((t = ii(t)), Ea(e.stateNode, e.type, t));
    }
  }
  function lu(e) {
    Wr ? (Vr ? Vr.push(e) : (Vr = [e])) : (Wr = e);
  }
  function uu() {
    if (Wr) {
      var e = Wr,
        t = Vr;
      if (((Vr = Wr = null), ou(e), t)) for (e = 0; e < t.length; e++) ou(t[e]);
    }
  }
  function cu(e, t) {
    return e(t);
  }
  function du() {}
  var ja = !1;
  function hu(e, t, i) {
    if (ja) return e(t, i);
    ja = !0;
    try {
      return cu(e, t, i);
    } finally {
      ((ja = !1), (Wr !== null || Vr !== null) && (du(), uu()));
    }
  }
  function An(e, t) {
    var i = e.stateNode;
    if (i === null) return null;
    var o = ii(i);
    if (o === null) return null;
    i = o[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((o = !o.disabled) ||
          ((e = e.type),
          (o = !(
            e === "button" ||
            e === "input" ||
            e === "select" ||
            e === "textarea"
          ))),
          (e = !o));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (i && typeof i != "function") throw Error(s(231, t, typeof i));
    return i;
  }
  var Ca = !1;
  if (f)
    try {
      var In = {};
      (Object.defineProperty(In, "passive", {
        get: function () {
          Ca = !0;
        },
      }),
        window.addEventListener("test", In, In),
        window.removeEventListener("test", In, In));
    } catch {
      Ca = !1;
    }
  function Rf(e, t, i, o, c, h, g, w, k) {
    var O = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(i, O);
    } catch (D) {
      this.onError(D);
    }
  }
  var Ln = !1,
    Us = null,
    Ds = !1,
    Ra = null,
    Tf = {
      onError: function (e) {
        ((Ln = !0), (Us = e));
      },
    };
  function Nf(e, t, i, o, c, h, g, w, k) {
    ((Ln = !1), (Us = null), Rf.apply(Tf, arguments));
  }
  function Pf(e, t, i, o, c, h, g, w, k) {
    if ((Nf.apply(this, arguments), Ln)) {
      if (Ln) {
        var O = Us;
        ((Ln = !1), (Us = null));
      } else throw Error(s(198));
      Ds || ((Ds = !0), (Ra = O));
    }
  }
  function br(e) {
    var t = e,
      i = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (i = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? i : null;
  }
  function fu(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (
        (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
        t !== null)
      )
        return t.dehydrated;
    }
    return null;
  }
  function pu(e) {
    if (br(e) !== e) throw Error(s(188));
  }
  function Of(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = br(e)), t === null)) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var i = e, o = t; ; ) {
      var c = i.return;
      if (c === null) break;
      var h = c.alternate;
      if (h === null) {
        if (((o = c.return), o !== null)) {
          i = o;
          continue;
        }
        break;
      }
      if (c.child === h.child) {
        for (h = c.child; h; ) {
          if (h === i) return (pu(c), e);
          if (h === o) return (pu(c), t);
          h = h.sibling;
        }
        throw Error(s(188));
      }
      if (i.return !== o.return) ((i = c), (o = h));
      else {
        for (var g = !1, w = c.child; w; ) {
          if (w === i) {
            ((g = !0), (i = c), (o = h));
            break;
          }
          if (w === o) {
            ((g = !0), (o = c), (i = h));
            break;
          }
          w = w.sibling;
        }
        if (!g) {
          for (w = h.child; w; ) {
            if (w === i) {
              ((g = !0), (i = h), (o = c));
              break;
            }
            if (w === o) {
              ((g = !0), (o = h), (i = c));
              break;
            }
            w = w.sibling;
          }
          if (!g) throw Error(s(189));
        }
      }
      if (i.alternate !== o) throw Error(s(190));
    }
    if (i.tag !== 3) throw Error(s(188));
    return i.stateNode.current === i ? e : t;
  }
  function mu(e) {
    return ((e = Of(e)), e !== null ? gu(e) : null);
  }
  function gu(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = gu(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var yu = r.unstable_scheduleCallback,
    vu = r.unstable_cancelCallback,
    Af = r.unstable_shouldYield,
    If = r.unstable_requestPaint,
    Ne = r.unstable_now,
    Lf = r.unstable_getCurrentPriorityLevel,
    Ta = r.unstable_ImmediatePriority,
    wu = r.unstable_UserBlockingPriority,
    Ms = r.unstable_NormalPriority,
    $f = r.unstable_LowPriority,
    xu = r.unstable_IdlePriority,
    zs = null,
    It = null;
  function Uf(e) {
    if (It && typeof It.onCommitFiberRoot == "function")
      try {
        It.onCommitFiberRoot(zs, e, void 0, (e.current.flags & 128) === 128);
      } catch {}
  }
  var kt = Math.clz32 ? Math.clz32 : zf,
    Df = Math.log,
    Mf = Math.LN2;
  function zf(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((Df(e) / Mf) | 0)) | 0);
  }
  var Bs = 64,
    Fs = 4194304;
  function $n(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function Ws(e, t) {
    var i = e.pendingLanes;
    if (i === 0) return 0;
    var o = 0,
      c = e.suspendedLanes,
      h = e.pingedLanes,
      g = i & 268435455;
    if (g !== 0) {
      var w = g & ~c;
      w !== 0 ? (o = $n(w)) : ((h &= g), h !== 0 && (o = $n(h)));
    } else ((g = i & ~c), g !== 0 ? (o = $n(g)) : h !== 0 && (o = $n(h)));
    if (o === 0) return 0;
    if (
      t !== 0 &&
      t !== o &&
      (t & c) === 0 &&
      ((c = o & -o), (h = t & -t), c >= h || (c === 16 && (h & 4194240) !== 0))
    )
      return t;
    if (((o & 4) !== 0 && (o |= i & 16), (t = e.entangledLanes), t !== 0))
      for (e = e.entanglements, t &= o; 0 < t; )
        ((i = 31 - kt(t)), (c = 1 << i), (o |= e[i]), (t &= ~c));
    return o;
  }
  function Bf(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Ff(e, t) {
    for (
      var i = e.suspendedLanes,
        o = e.pingedLanes,
        c = e.expirationTimes,
        h = e.pendingLanes;
      0 < h;
    ) {
      var g = 31 - kt(h),
        w = 1 << g,
        k = c[g];
      (k === -1
        ? ((w & i) === 0 || (w & o) !== 0) && (c[g] = Bf(w, t))
        : k <= t && (e.expiredLanes |= w),
        (h &= ~w));
    }
  }
  function Na(e) {
    return (
      (e = e.pendingLanes & -1073741825),
      e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
    );
  }
  function _u() {
    var e = Bs;
    return ((Bs <<= 1), (Bs & 4194240) === 0 && (Bs = 64), e);
  }
  function Pa(e) {
    for (var t = [], i = 0; 31 > i; i++) t.push(e);
    return t;
  }
  function Un(e, t, i) {
    ((e.pendingLanes |= t),
      t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
      (e = e.eventTimes),
      (t = 31 - kt(t)),
      (e[t] = i));
  }
  function Wf(e, t) {
    var i = e.pendingLanes & ~t;
    ((e.pendingLanes = t),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.expiredLanes &= t),
      (e.mutableReadLanes &= t),
      (e.entangledLanes &= t),
      (t = e.entanglements));
    var o = e.eventTimes;
    for (e = e.expirationTimes; 0 < i; ) {
      var c = 31 - kt(i),
        h = 1 << c;
      ((t[c] = 0), (o[c] = -1), (e[c] = -1), (i &= ~h));
    }
  }
  function Oa(e, t) {
    var i = (e.entangledLanes |= t);
    for (e = e.entanglements; i; ) {
      var o = 31 - kt(i),
        c = 1 << o;
      ((c & t) | (e[o] & t) && (e[o] |= t), (i &= ~c));
    }
  }
  var pe = 0;
  function ku(e) {
    return (
      (e &= -e),
      1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1
    );
  }
  var bu,
    Aa,
    Su,
    Eu,
    ju,
    Ia = !1,
    Vs = [],
    rr = null,
    nr = null,
    sr = null,
    Dn = new Map(),
    Mn = new Map(),
    ir = [],
    Vf =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
        " ",
      );
  function Cu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        rr = null;
        break;
      case "dragenter":
      case "dragleave":
        nr = null;
        break;
      case "mouseover":
      case "mouseout":
        sr = null;
        break;
      case "pointerover":
      case "pointerout":
        Dn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Mn.delete(t.pointerId);
    }
  }
  function zn(e, t, i, o, c, h) {
    return e === null || e.nativeEvent !== h
      ? ((e = {
          blockedOn: t,
          domEventName: i,
          eventSystemFlags: o,
          nativeEvent: h,
          targetContainers: [c],
        }),
        t !== null && ((t = es(t)), t !== null && Aa(t)),
        e)
      : ((e.eventSystemFlags |= o),
        (t = e.targetContainers),
        c !== null && t.indexOf(c) === -1 && t.push(c),
        e);
  }
  function Hf(e, t, i, o, c) {
    switch (t) {
      case "focusin":
        return ((rr = zn(rr, e, t, i, o, c)), !0);
      case "dragenter":
        return ((nr = zn(nr, e, t, i, o, c)), !0);
      case "mouseover":
        return ((sr = zn(sr, e, t, i, o, c)), !0);
      case "pointerover":
        var h = c.pointerId;
        return (Dn.set(h, zn(Dn.get(h) || null, e, t, i, o, c)), !0);
      case "gotpointercapture":
        return (
          (h = c.pointerId),
          Mn.set(h, zn(Mn.get(h) || null, e, t, i, o, c)),
          !0
        );
    }
    return !1;
  }
  function Ru(e) {
    var t = Sr(e.target);
    if (t !== null) {
      var i = br(t);
      if (i !== null) {
        if (((t = i.tag), t === 13)) {
          if (((t = fu(i)), t !== null)) {
            ((e.blockedOn = t),
              ju(e.priority, function () {
                Su(i);
              }));
            return;
          }
        } else if (t === 3 && i.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = i.tag === 3 ? i.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Hs(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var i = $a(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (i === null) {
        i = e.nativeEvent;
        var o = new i.constructor(i.type, i);
        ((ba = o), i.target.dispatchEvent(o), (ba = null));
      } else return ((t = es(i)), t !== null && Aa(t), (e.blockedOn = i), !1);
      t.shift();
    }
    return !0;
  }
  function Tu(e, t, i) {
    Hs(e) && i.delete(t);
  }
  function qf() {
    ((Ia = !1),
      rr !== null && Hs(rr) && (rr = null),
      nr !== null && Hs(nr) && (nr = null),
      sr !== null && Hs(sr) && (sr = null),
      Dn.forEach(Tu),
      Mn.forEach(Tu));
  }
  function Bn(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      Ia ||
        ((Ia = !0),
        r.unstable_scheduleCallback(r.unstable_NormalPriority, qf)));
  }
  function Fn(e) {
    function t(c) {
      return Bn(c, e);
    }
    if (0 < Vs.length) {
      Bn(Vs[0], e);
      for (var i = 1; i < Vs.length; i++) {
        var o = Vs[i];
        o.blockedOn === e && (o.blockedOn = null);
      }
    }
    for (
      rr !== null && Bn(rr, e),
        nr !== null && Bn(nr, e),
        sr !== null && Bn(sr, e),
        Dn.forEach(t),
        Mn.forEach(t),
        i = 0;
      i < ir.length;
      i++
    )
      ((o = ir[i]), o.blockedOn === e && (o.blockedOn = null));
    for (; 0 < ir.length && ((i = ir[0]), i.blockedOn === null); )
      (Ru(i), i.blockedOn === null && ir.shift());
  }
  var Hr = B.ReactCurrentBatchConfig,
    qs = !0;
  function Kf(e, t, i, o) {
    var c = pe,
      h = Hr.transition;
    Hr.transition = null;
    try {
      ((pe = 1), La(e, t, i, o));
    } finally {
      ((pe = c), (Hr.transition = h));
    }
  }
  function Gf(e, t, i, o) {
    var c = pe,
      h = Hr.transition;
    Hr.transition = null;
    try {
      ((pe = 4), La(e, t, i, o));
    } finally {
      ((pe = c), (Hr.transition = h));
    }
  }
  function La(e, t, i, o) {
    if (qs) {
      var c = $a(e, t, i, o);
      if (c === null) (Za(e, t, o, Ks, i), Cu(e, o));
      else if (Hf(c, e, t, i, o)) o.stopPropagation();
      else if ((Cu(e, o), t & 4 && -1 < Vf.indexOf(e))) {
        for (; c !== null; ) {
          var h = es(c);
          if (
            (h !== null && bu(h),
            (h = $a(e, t, i, o)),
            h === null && Za(e, t, o, Ks, i),
            h === c)
          )
            break;
          c = h;
        }
        c !== null && o.stopPropagation();
      } else Za(e, t, o, null, i);
    }
  }
  var Ks = null;
  function $a(e, t, i, o) {
    if (((Ks = null), (e = Sa(o)), (e = Sr(e)), e !== null))
      if (((t = br(e)), t === null)) e = null;
      else if (((i = t.tag), i === 13)) {
        if (((e = fu(t)), e !== null)) return e;
        e = null;
      } else if (i === 3) {
        if (t.stateNode.current.memoizedState.isDehydrated)
          return t.tag === 3 ? t.stateNode.containerInfo : null;
        e = null;
      } else t !== e && (e = null);
    return ((Ks = e), null);
  }
  function Nu(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Lf()) {
          case Ta:
            return 1;
          case wu:
            return 4;
          case Ms:
          case $f:
            return 16;
          case xu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ar = null,
    Ua = null,
    Gs = null;
  function Pu() {
    if (Gs) return Gs;
    var e,
      t = Ua,
      i = t.length,
      o,
      c = "value" in ar ? ar.value : ar.textContent,
      h = c.length;
    for (e = 0; e < i && t[e] === c[e]; e++);
    var g = i - e;
    for (o = 1; o <= g && t[i - o] === c[h - o]; o++);
    return (Gs = c.slice(e, 1 < o ? 1 - o : void 0));
  }
  function Js(e) {
    var t = e.keyCode;
    return (
      "charCode" in e
        ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
        : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function Qs() {
    return !0;
  }
  function Ou() {
    return !1;
  }
  function lt(e) {
    function t(i, o, c, h, g) {
      ((this._reactName = i),
        (this._targetInst = c),
        (this.type = o),
        (this.nativeEvent = h),
        (this.target = g),
        (this.currentTarget = null));
      for (var w in e)
        e.hasOwnProperty(w) && ((i = e[w]), (this[w] = i ? i(h) : h[w]));
      return (
        (this.isDefaultPrevented = (
          h.defaultPrevented != null ? h.defaultPrevented : h.returnValue === !1
        )
          ? Qs
          : Ou),
        (this.isPropagationStopped = Ou),
        this
      );
    }
    return (
      H(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var i = this.nativeEvent;
          i &&
            (i.preventDefault
              ? i.preventDefault()
              : typeof i.returnValue != "unknown" && (i.returnValue = !1),
            (this.isDefaultPrevented = Qs));
        },
        stopPropagation: function () {
          var i = this.nativeEvent;
          i &&
            (i.stopPropagation
              ? i.stopPropagation()
              : typeof i.cancelBubble != "unknown" && (i.cancelBubble = !0),
            (this.isPropagationStopped = Qs));
        },
        persist: function () {},
        isPersistent: Qs,
      }),
      t
    );
  }
  var qr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Da = lt(qr),
    Wn = H({}, qr, { view: 0, detail: 0 }),
    Jf = lt(Wn),
    Ma,
    za,
    Vn,
    Ys = H({}, Wn, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Fa,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== Vn &&
              (Vn && e.type === "mousemove"
                ? ((Ma = e.screenX - Vn.screenX), (za = e.screenY - Vn.screenY))
                : (za = Ma = 0),
              (Vn = e)),
            Ma);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : za;
      },
    }),
    Au = lt(Ys),
    Qf = H({}, Ys, { dataTransfer: 0 }),
    Yf = lt(Qf),
    Xf = H({}, Wn, { relatedTarget: 0 }),
    Ba = lt(Xf),
    Zf = H({}, qr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    ep = lt(Zf),
    tp = H({}, qr, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    rp = lt(tp),
    np = H({}, qr, { data: 0 }),
    Iu = lt(np),
    sp = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    ip = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    ap = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function op(e) {
    var t = this.nativeEvent;
    return t.getModifierState
      ? t.getModifierState(e)
      : (e = ap[e])
        ? !!t[e]
        : !1;
  }
  function Fa() {
    return op;
  }
  var lp = H({}, Wn, {
      key: function (e) {
        if (e.key) {
          var t = sp[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress"
          ? ((e = Js(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? ip[e.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Fa,
      charCode: function (e) {
        return e.type === "keypress" ? Js(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress"
          ? Js(e)
          : e.type === "keydown" || e.type === "keyup"
            ? e.keyCode
            : 0;
      },
    }),
    up = lt(lp),
    cp = H({}, Ys, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Lu = lt(cp),
    dp = H({}, Wn, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Fa,
    }),
    hp = lt(dp),
    fp = H({}, qr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    pp = lt(fp),
    mp = H({}, Ys, {
      deltaX: function (e) {
        return "deltaX" in e
          ? e.deltaX
          : "wheelDeltaX" in e
            ? -e.wheelDeltaX
            : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e
          ? e.deltaY
          : "wheelDeltaY" in e
            ? -e.wheelDeltaY
            : "wheelDelta" in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    gp = lt(mp),
    yp = [9, 13, 27, 32],
    Wa = f && "CompositionEvent" in window,
    Hn = null;
  f && "documentMode" in document && (Hn = document.documentMode);
  var vp = f && "TextEvent" in window && !Hn,
    $u = f && (!Wa || (Hn && 8 < Hn && 11 >= Hn)),
    Uu = " ",
    Du = !1;
  function Mu(e, t) {
    switch (e) {
      case "keyup":
        return yp.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function zu(e) {
    return (
      (e = e.detail),
      typeof e == "object" && "data" in e ? e.data : null
    );
  }
  var Kr = !1;
  function wp(e, t) {
    switch (e) {
      case "compositionend":
        return zu(t);
      case "keypress":
        return t.which !== 32 ? null : ((Du = !0), Uu);
      case "textInput":
        return ((e = t.data), e === Uu && Du ? null : e);
      default:
        return null;
    }
  }
  function xp(e, t) {
    if (Kr)
      return e === "compositionend" || (!Wa && Mu(e, t))
        ? ((e = Pu()), (Gs = Ua = ar = null), (Kr = !1), e)
        : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return $u && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var _p = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Bu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!_p[e.type] : t === "textarea";
  }
  function Fu(e, t, i, o) {
    (lu(o),
      (t = ri(t, "onChange")),
      0 < t.length &&
        ((i = new Da("onChange", "change", null, i, o)),
        e.push({ event: i, listeners: t })));
  }
  var qn = null,
    Kn = null;
  function kp(e) {
    ac(e, 0);
  }
  function Xs(e) {
    var t = Xr(e);
    if (Ql(t)) return e;
  }
  function bp(e, t) {
    if (e === "change") return t;
  }
  var Wu = !1;
  if (f) {
    var Va;
    if (f) {
      var Ha = "oninput" in document;
      if (!Ha) {
        var Vu = document.createElement("div");
        (Vu.setAttribute("oninput", "return;"),
          (Ha = typeof Vu.oninput == "function"));
      }
      Va = Ha;
    } else Va = !1;
    Wu = Va && (!document.documentMode || 9 < document.documentMode);
  }
  function Hu() {
    qn && (qn.detachEvent("onpropertychange", qu), (Kn = qn = null));
  }
  function qu(e) {
    if (e.propertyName === "value" && Xs(Kn)) {
      var t = [];
      (Fu(t, Kn, e, Sa(e)), hu(kp, t));
    }
  }
  function Sp(e, t, i) {
    e === "focusin"
      ? (Hu(), (qn = t), (Kn = i), qn.attachEvent("onpropertychange", qu))
      : e === "focusout" && Hu();
  }
  function Ep(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Xs(Kn);
  }
  function jp(e, t) {
    if (e === "click") return Xs(t);
  }
  function Cp(e, t) {
    if (e === "input" || e === "change") return Xs(t);
  }
  function Rp(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var bt = typeof Object.is == "function" ? Object.is : Rp;
  function Gn(e, t) {
    if (bt(e, t)) return !0;
    if (
      typeof e != "object" ||
      e === null ||
      typeof t != "object" ||
      t === null
    )
      return !1;
    var i = Object.keys(e),
      o = Object.keys(t);
    if (i.length !== o.length) return !1;
    for (o = 0; o < i.length; o++) {
      var c = i[o];
      if (!p.call(t, c) || !bt(e[c], t[c])) return !1;
    }
    return !0;
  }
  function Ku(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Gu(e, t) {
    var i = Ku(e);
    e = 0;
    for (var o; i; ) {
      if (i.nodeType === 3) {
        if (((o = e + i.textContent.length), e <= t && o >= t))
          return { node: i, offset: t - e };
        e = o;
      }
      e: {
        for (; i; ) {
          if (i.nextSibling) {
            i = i.nextSibling;
            break e;
          }
          i = i.parentNode;
        }
        i = void 0;
      }
      i = Ku(i);
    }
  }
  function Ju(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? Ju(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function Qu() {
    for (var e = window, t = Ls(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var i = typeof t.contentWindow.location.href == "string";
      } catch {
        i = !1;
      }
      if (i) e = t.contentWindow;
      else break;
      t = Ls(e.document);
    }
    return t;
  }
  function qa(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" &&
        (e.type === "text" ||
          e.type === "search" ||
          e.type === "tel" ||
          e.type === "url" ||
          e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    );
  }
  function Tp(e) {
    var t = Qu(),
      i = e.focusedElem,
      o = e.selectionRange;
    if (
      t !== i &&
      i &&
      i.ownerDocument &&
      Ju(i.ownerDocument.documentElement, i)
    ) {
      if (o !== null && qa(i)) {
        if (
          ((t = o.start),
          (e = o.end),
          e === void 0 && (e = t),
          "selectionStart" in i)
        )
          ((i.selectionStart = t),
            (i.selectionEnd = Math.min(e, i.value.length)));
        else if (
          ((e = ((t = i.ownerDocument || document) && t.defaultView) || window),
          e.getSelection)
        ) {
          e = e.getSelection();
          var c = i.textContent.length,
            h = Math.min(o.start, c);
          ((o = o.end === void 0 ? h : Math.min(o.end, c)),
            !e.extend && h > o && ((c = o), (o = h), (h = c)),
            (c = Gu(i, h)));
          var g = Gu(i, o);
          c &&
            g &&
            (e.rangeCount !== 1 ||
              e.anchorNode !== c.node ||
              e.anchorOffset !== c.offset ||
              e.focusNode !== g.node ||
              e.focusOffset !== g.offset) &&
            ((t = t.createRange()),
            t.setStart(c.node, c.offset),
            e.removeAllRanges(),
            h > o
              ? (e.addRange(t), e.extend(g.node, g.offset))
              : (t.setEnd(g.node, g.offset), e.addRange(t)));
        }
      }
      for (t = [], e = i; (e = e.parentNode); )
        e.nodeType === 1 &&
          t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof i.focus == "function" && i.focus(), i = 0; i < t.length; i++)
        ((e = t[i]),
          (e.element.scrollLeft = e.left),
          (e.element.scrollTop = e.top));
    }
  }
  var Np = f && "documentMode" in document && 11 >= document.documentMode,
    Gr = null,
    Ka = null,
    Jn = null,
    Ga = !1;
  function Yu(e, t, i) {
    var o =
      i.window === i ? i.document : i.nodeType === 9 ? i : i.ownerDocument;
    Ga ||
      Gr == null ||
      Gr !== Ls(o) ||
      ((o = Gr),
      "selectionStart" in o && qa(o)
        ? (o = { start: o.selectionStart, end: o.selectionEnd })
        : ((o = (
            (o.ownerDocument && o.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (o = {
            anchorNode: o.anchorNode,
            anchorOffset: o.anchorOffset,
            focusNode: o.focusNode,
            focusOffset: o.focusOffset,
          })),
      (Jn && Gn(Jn, o)) ||
        ((Jn = o),
        (o = ri(Ka, "onSelect")),
        0 < o.length &&
          ((t = new Da("onSelect", "select", null, t, i)),
          e.push({ event: t, listeners: o }),
          (t.target = Gr))));
  }
  function Zs(e, t) {
    var i = {};
    return (
      (i[e.toLowerCase()] = t.toLowerCase()),
      (i["Webkit" + e] = "webkit" + t),
      (i["Moz" + e] = "moz" + t),
      i
    );
  }
  var Jr = {
      animationend: Zs("Animation", "AnimationEnd"),
      animationiteration: Zs("Animation", "AnimationIteration"),
      animationstart: Zs("Animation", "AnimationStart"),
      transitionend: Zs("Transition", "TransitionEnd"),
    },
    Ja = {},
    Xu = {};
  f &&
    ((Xu = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete Jr.animationend.animation,
      delete Jr.animationiteration.animation,
      delete Jr.animationstart.animation),
    "TransitionEvent" in window || delete Jr.transitionend.transition);
  function ei(e) {
    if (Ja[e]) return Ja[e];
    if (!Jr[e]) return e;
    var t = Jr[e],
      i;
    for (i in t) if (t.hasOwnProperty(i) && i in Xu) return (Ja[e] = t[i]);
    return e;
  }
  var Zu = ei("animationend"),
    ec = ei("animationiteration"),
    tc = ei("animationstart"),
    rc = ei("transitionend"),
    nc = new Map(),
    sc =
      "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  function or(e, t) {
    (nc.set(e, t), u(t, [e]));
  }
  for (var Qa = 0; Qa < sc.length; Qa++) {
    var Ya = sc[Qa],
      Pp = Ya.toLowerCase(),
      Op = Ya[0].toUpperCase() + Ya.slice(1);
    or(Pp, "on" + Op);
  }
  (or(Zu, "onAnimationEnd"),
    or(ec, "onAnimationIteration"),
    or(tc, "onAnimationStart"),
    or("dblclick", "onDoubleClick"),
    or("focusin", "onFocus"),
    or("focusout", "onBlur"),
    or(rc, "onTransitionEnd"),
    d("onMouseEnter", ["mouseout", "mouseover"]),
    d("onMouseLeave", ["mouseout", "mouseover"]),
    d("onPointerEnter", ["pointerout", "pointerover"]),
    d("onPointerLeave", ["pointerout", "pointerover"]),
    u(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    u(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    u("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    u(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    u(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    u(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var Qn =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    Ap = new Set(
      "cancel close invalid load scroll toggle".split(" ").concat(Qn),
    );
  function ic(e, t, i) {
    var o = e.type || "unknown-event";
    ((e.currentTarget = i), Pf(o, t, void 0, e), (e.currentTarget = null));
  }
  function ac(e, t) {
    t = (t & 4) !== 0;
    for (var i = 0; i < e.length; i++) {
      var o = e[i],
        c = o.event;
      o = o.listeners;
      e: {
        var h = void 0;
        if (t)
          for (var g = o.length - 1; 0 <= g; g--) {
            var w = o[g],
              k = w.instance,
              O = w.currentTarget;
            if (((w = w.listener), k !== h && c.isPropagationStopped()))
              break e;
            (ic(c, w, O), (h = k));
          }
        else
          for (g = 0; g < o.length; g++) {
            if (
              ((w = o[g]),
              (k = w.instance),
              (O = w.currentTarget),
              (w = w.listener),
              k !== h && c.isPropagationStopped())
            )
              break e;
            (ic(c, w, O), (h = k));
          }
      }
    }
    if (Ds) throw ((e = Ra), (Ds = !1), (Ra = null), e);
  }
  function we(e, t) {
    var i = t[io];
    i === void 0 && (i = t[io] = new Set());
    var o = e + "__bubble";
    i.has(o) || (oc(t, e, 2, !1), i.add(o));
  }
  function Xa(e, t, i) {
    var o = 0;
    (t && (o |= 4), oc(i, e, o, t));
  }
  var ti = "_reactListening" + Math.random().toString(36).slice(2);
  function Yn(e) {
    if (!e[ti]) {
      ((e[ti] = !0),
        a.forEach(function (i) {
          i !== "selectionchange" && (Ap.has(i) || Xa(i, !1, e), Xa(i, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ti] || ((t[ti] = !0), Xa("selectionchange", !1, t));
    }
  }
  function oc(e, t, i, o) {
    switch (Nu(t)) {
      case 1:
        var c = Kf;
        break;
      case 4:
        c = Gf;
        break;
      default:
        c = La;
    }
    ((i = c.bind(null, t, i, e)),
      (c = void 0),
      !Ca ||
        (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
        (c = !0),
      o
        ? c !== void 0
          ? e.addEventListener(t, i, { capture: !0, passive: c })
          : e.addEventListener(t, i, !0)
        : c !== void 0
          ? e.addEventListener(t, i, { passive: c })
          : e.addEventListener(t, i, !1));
  }
  function Za(e, t, i, o, c) {
    var h = o;
    if ((t & 1) === 0 && (t & 2) === 0 && o !== null)
      e: for (;;) {
        if (o === null) return;
        var g = o.tag;
        if (g === 3 || g === 4) {
          var w = o.stateNode.containerInfo;
          if (w === c || (w.nodeType === 8 && w.parentNode === c)) break;
          if (g === 4)
            for (g = o.return; g !== null; ) {
              var k = g.tag;
              if (
                (k === 3 || k === 4) &&
                ((k = g.stateNode.containerInfo),
                k === c || (k.nodeType === 8 && k.parentNode === c))
              )
                return;
              g = g.return;
            }
          for (; w !== null; ) {
            if (((g = Sr(w)), g === null)) return;
            if (((k = g.tag), k === 5 || k === 6)) {
              o = h = g;
              continue e;
            }
            w = w.parentNode;
          }
        }
        o = o.return;
      }
    hu(function () {
      var O = h,
        D = Sa(i),
        M = [];
      e: {
        var $ = nc.get(e);
        if ($ !== void 0) {
          var W = Da,
            q = e;
          switch (e) {
            case "keypress":
              if (Js(i) === 0) break e;
            case "keydown":
            case "keyup":
              W = up;
              break;
            case "focusin":
              ((q = "focus"), (W = Ba));
              break;
            case "focusout":
              ((q = "blur"), (W = Ba));
              break;
            case "beforeblur":
            case "afterblur":
              W = Ba;
              break;
            case "click":
              if (i.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              W = Au;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              W = Yf;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              W = hp;
              break;
            case Zu:
            case ec:
            case tc:
              W = ep;
              break;
            case rc:
              W = pp;
              break;
            case "scroll":
              W = Jf;
              break;
            case "wheel":
              W = gp;
              break;
            case "copy":
            case "cut":
            case "paste":
              W = rp;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              W = Lu;
          }
          var G = (t & 4) !== 0,
            Pe = !G && e === "scroll",
            T = G ? ($ !== null ? $ + "Capture" : null) : $;
          G = [];
          for (var b = O, P; b !== null; ) {
            P = b;
            var z = P.stateNode;
            if (
              (P.tag === 5 &&
                z !== null &&
                ((P = z),
                T !== null &&
                  ((z = An(b, T)), z != null && G.push(Xn(b, z, P)))),
              Pe)
            )
              break;
            b = b.return;
          }
          0 < G.length &&
            (($ = new W($, q, null, i, D)), M.push({ event: $, listeners: G }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            (($ = e === "mouseover" || e === "pointerover"),
            (W = e === "mouseout" || e === "pointerout"),
            $ &&
              i !== ba &&
              (q = i.relatedTarget || i.fromElement) &&
              (Sr(q) || q[Vt]))
          )
            break e;
          if (
            (W || $) &&
            (($ =
              D.window === D
                ? D
                : ($ = D.ownerDocument)
                  ? $.defaultView || $.parentWindow
                  : window),
            W
              ? ((q = i.relatedTarget || i.toElement),
                (W = O),
                (q = q ? Sr(q) : null),
                q !== null &&
                  ((Pe = br(q)), q !== Pe || (q.tag !== 5 && q.tag !== 6)) &&
                  (q = null))
              : ((W = null), (q = O)),
            W !== q)
          ) {
            if (
              ((G = Au),
              (z = "onMouseLeave"),
              (T = "onMouseEnter"),
              (b = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((G = Lu),
                (z = "onPointerLeave"),
                (T = "onPointerEnter"),
                (b = "pointer")),
              (Pe = W == null ? $ : Xr(W)),
              (P = q == null ? $ : Xr(q)),
              ($ = new G(z, b + "leave", W, i, D)),
              ($.target = Pe),
              ($.relatedTarget = P),
              (z = null),
              Sr(D) === O &&
                ((G = new G(T, b + "enter", q, i, D)),
                (G.target = P),
                (G.relatedTarget = Pe),
                (z = G)),
              (Pe = z),
              W && q)
            )
              t: {
                for (G = W, T = q, b = 0, P = G; P; P = Qr(P)) b++;
                for (P = 0, z = T; z; z = Qr(z)) P++;
                for (; 0 < b - P; ) ((G = Qr(G)), b--);
                for (; 0 < P - b; ) ((T = Qr(T)), P--);
                for (; b--; ) {
                  if (G === T || (T !== null && G === T.alternate)) break t;
                  ((G = Qr(G)), (T = Qr(T)));
                }
                G = null;
              }
            else G = null;
            (W !== null && lc(M, $, W, G, !1),
              q !== null && Pe !== null && lc(M, Pe, q, G, !0));
          }
        }
        e: {
          if (
            (($ = O ? Xr(O) : window),
            (W = $.nodeName && $.nodeName.toLowerCase()),
            W === "select" || (W === "input" && $.type === "file"))
          )
            var J = bp;
          else if (Bu($))
            if (Wu) J = Cp;
            else {
              J = Ep;
              var X = Sp;
            }
          else
            (W = $.nodeName) &&
              W.toLowerCase() === "input" &&
              ($.type === "checkbox" || $.type === "radio") &&
              (J = jp);
          if (J && (J = J(e, O))) {
            Fu(M, J, i, D);
            break e;
          }
          (X && X(e, $, O),
            e === "focusout" &&
              (X = $._wrapperState) &&
              X.controlled &&
              $.type === "number" &&
              va($, "number", $.value));
        }
        switch (((X = O ? Xr(O) : window), e)) {
          case "focusin":
            (Bu(X) || X.contentEditable === "true") &&
              ((Gr = X), (Ka = O), (Jn = null));
            break;
          case "focusout":
            Jn = Ka = Gr = null;
            break;
          case "mousedown":
            Ga = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((Ga = !1), Yu(M, i, D));
            break;
          case "selectionchange":
            if (Np) break;
          case "keydown":
          case "keyup":
            Yu(M, i, D);
        }
        var Z;
        if (Wa)
          e: {
            switch (e) {
              case "compositionstart":
                var ne = "onCompositionStart";
                break e;
              case "compositionend":
                ne = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ne = "onCompositionUpdate";
                break e;
            }
            ne = void 0;
          }
        else
          Kr
            ? Mu(e, i) && (ne = "onCompositionEnd")
            : e === "keydown" &&
              i.keyCode === 229 &&
              (ne = "onCompositionStart");
        (ne &&
          ($u &&
            i.locale !== "ko" &&
            (Kr || ne !== "onCompositionStart"
              ? ne === "onCompositionEnd" && Kr && (Z = Pu())
              : ((ar = D),
                (Ua = "value" in ar ? ar.value : ar.textContent),
                (Kr = !0))),
          (X = ri(O, ne)),
          0 < X.length &&
            ((ne = new Iu(ne, e, null, i, D)),
            M.push({ event: ne, listeners: X }),
            Z ? (ne.data = Z) : ((Z = zu(i)), Z !== null && (ne.data = Z)))),
          (Z = vp ? wp(e, i) : xp(e, i)) &&
            ((O = ri(O, "onBeforeInput")),
            0 < O.length &&
              ((D = new Iu("onBeforeInput", "beforeinput", null, i, D)),
              M.push({ event: D, listeners: O }),
              (D.data = Z))));
      }
      ac(M, t);
    });
  }
  function Xn(e, t, i) {
    return { instance: e, listener: t, currentTarget: i };
  }
  function ri(e, t) {
    for (var i = t + "Capture", o = []; e !== null; ) {
      var c = e,
        h = c.stateNode;
      (c.tag === 5 &&
        h !== null &&
        ((c = h),
        (h = An(e, i)),
        h != null && o.unshift(Xn(e, h, c)),
        (h = An(e, t)),
        h != null && o.push(Xn(e, h, c))),
        (e = e.return));
    }
    return o;
  }
  function Qr(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function lc(e, t, i, o, c) {
    for (var h = t._reactName, g = []; i !== null && i !== o; ) {
      var w = i,
        k = w.alternate,
        O = w.stateNode;
      if (k !== null && k === o) break;
      (w.tag === 5 &&
        O !== null &&
        ((w = O),
        c
          ? ((k = An(i, h)), k != null && g.unshift(Xn(i, k, w)))
          : c || ((k = An(i, h)), k != null && g.push(Xn(i, k, w)))),
        (i = i.return));
    }
    g.length !== 0 && e.push({ event: t, listeners: g });
  }
  var Ip = /\r\n?/g,
    Lp = /\u0000|\uFFFD/g;
  function uc(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        Ip,
        `
`,
      )
      .replace(Lp, "");
  }
  function ni(e, t, i) {
    if (((t = uc(t)), uc(e) !== t && i)) throw Error(s(425));
  }
  function si() {}
  var eo = null,
    to = null;
  function ro(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var no = typeof setTimeout == "function" ? setTimeout : void 0,
    $p = typeof clearTimeout == "function" ? clearTimeout : void 0,
    cc = typeof Promise == "function" ? Promise : void 0,
    Up =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof cc < "u"
          ? function (e) {
              return cc.resolve(null).then(e).catch(Dp);
            }
          : no;
  function Dp(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function so(e, t) {
    var i = t,
      o = 0;
    do {
      var c = i.nextSibling;
      if ((e.removeChild(i), c && c.nodeType === 8))
        if (((i = c.data), i === "/$")) {
          if (o === 0) {
            (e.removeChild(c), Fn(t));
            return;
          }
          o--;
        } else (i !== "$" && i !== "$?" && i !== "$!") || o++;
      i = c;
    } while (i);
    Fn(t);
  }
  function lr(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function dc(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var i = e.data;
        if (i === "$" || i === "$!" || i === "$?") {
          if (t === 0) return e;
          t--;
        } else i === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Yr = Math.random().toString(36).slice(2),
    Lt = "__reactFiber$" + Yr,
    Zn = "__reactProps$" + Yr,
    Vt = "__reactContainer$" + Yr,
    io = "__reactEvents$" + Yr,
    Mp = "__reactListeners$" + Yr,
    zp = "__reactHandles$" + Yr;
  function Sr(e) {
    var t = e[Lt];
    if (t) return t;
    for (var i = e.parentNode; i; ) {
      if ((t = i[Vt] || i[Lt])) {
        if (
          ((i = t.alternate),
          t.child !== null || (i !== null && i.child !== null))
        )
          for (e = dc(e); e !== null; ) {
            if ((i = e[Lt])) return i;
            e = dc(e);
          }
        return t;
      }
      ((e = i), (i = e.parentNode));
    }
    return null;
  }
  function es(e) {
    return (
      (e = e[Lt] || e[Vt]),
      !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3)
        ? null
        : e
    );
  }
  function Xr(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function ii(e) {
    return e[Zn] || null;
  }
  var ao = [],
    Zr = -1;
  function ur(e) {
    return { current: e };
  }
  function xe(e) {
    0 > Zr || ((e.current = ao[Zr]), (ao[Zr] = null), Zr--);
  }
  function ye(e, t) {
    (Zr++, (ao[Zr] = e.current), (e.current = t));
  }
  var cr = {},
    qe = ur(cr),
    et = ur(!1),
    Er = cr;
  function en(e, t) {
    var i = e.type.contextTypes;
    if (!i) return cr;
    var o = e.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === t)
      return o.__reactInternalMemoizedMaskedChildContext;
    var c = {},
      h;
    for (h in i) c[h] = t[h];
    return (
      o &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = t),
        (e.__reactInternalMemoizedMaskedChildContext = c)),
      c
    );
  }
  function tt(e) {
    return ((e = e.childContextTypes), e != null);
  }
  function ai() {
    (xe(et), xe(qe));
  }
  function hc(e, t, i) {
    if (qe.current !== cr) throw Error(s(168));
    (ye(qe, t), ye(et, i));
  }
  function fc(e, t, i) {
    var o = e.stateNode;
    if (((t = t.childContextTypes), typeof o.getChildContext != "function"))
      return i;
    o = o.getChildContext();
    for (var c in o) if (!(c in t)) throw Error(s(108, ge(e) || "Unknown", c));
    return H({}, i, o);
  }
  function oi(e) {
    return (
      (e =
        ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) ||
        cr),
      (Er = qe.current),
      ye(qe, e),
      ye(et, et.current),
      !0
    );
  }
  function pc(e, t, i) {
    var o = e.stateNode;
    if (!o) throw Error(s(169));
    (i
      ? ((e = fc(e, t, Er)),
        (o.__reactInternalMemoizedMergedChildContext = e),
        xe(et),
        xe(qe),
        ye(qe, e))
      : xe(et),
      ye(et, i));
  }
  var Ht = null,
    li = !1,
    oo = !1;
  function mc(e) {
    Ht === null ? (Ht = [e]) : Ht.push(e);
  }
  function Bp(e) {
    ((li = !0), mc(e));
  }
  function dr() {
    if (!oo && Ht !== null) {
      oo = !0;
      var e = 0,
        t = pe;
      try {
        var i = Ht;
        for (pe = 1; e < i.length; e++) {
          var o = i[e];
          do o = o(!0);
          while (o !== null);
        }
        ((Ht = null), (li = !1));
      } catch (c) {
        throw (Ht !== null && (Ht = Ht.slice(e + 1)), yu(Ta, dr), c);
      } finally {
        ((pe = t), (oo = !1));
      }
    }
    return null;
  }
  var tn = [],
    rn = 0,
    ui = null,
    ci = 0,
    gt = [],
    yt = 0,
    jr = null,
    qt = 1,
    Kt = "";
  function Cr(e, t) {
    ((tn[rn++] = ci), (tn[rn++] = ui), (ui = e), (ci = t));
  }
  function gc(e, t, i) {
    ((gt[yt++] = qt), (gt[yt++] = Kt), (gt[yt++] = jr), (jr = e));
    var o = qt;
    e = Kt;
    var c = 32 - kt(o) - 1;
    ((o &= ~(1 << c)), (i += 1));
    var h = 32 - kt(t) + c;
    if (30 < h) {
      var g = c - (c % 5);
      ((h = (o & ((1 << g) - 1)).toString(32)),
        (o >>= g),
        (c -= g),
        (qt = (1 << (32 - kt(t) + c)) | (i << c) | o),
        (Kt = h + e));
    } else ((qt = (1 << h) | (i << c) | o), (Kt = e));
  }
  function lo(e) {
    e.return !== null && (Cr(e, 1), gc(e, 1, 0));
  }
  function uo(e) {
    for (; e === ui; )
      ((ui = tn[--rn]), (tn[rn] = null), (ci = tn[--rn]), (tn[rn] = null));
    for (; e === jr; )
      ((jr = gt[--yt]),
        (gt[yt] = null),
        (Kt = gt[--yt]),
        (gt[yt] = null),
        (qt = gt[--yt]),
        (gt[yt] = null));
  }
  var ut = null,
    ct = null,
    be = !1,
    St = null;
  function yc(e, t) {
    var i = _t(5, null, null, 0);
    ((i.elementType = "DELETED"),
      (i.stateNode = t),
      (i.return = e),
      (t = e.deletions),
      t === null ? ((e.deletions = [i]), (e.flags |= 16)) : t.push(i));
  }
  function vc(e, t) {
    switch (e.tag) {
      case 5:
        var i = e.type;
        return (
          (t =
            t.nodeType !== 1 || i.toLowerCase() !== t.nodeName.toLowerCase()
              ? null
              : t),
          t !== null
            ? ((e.stateNode = t), (ut = e), (ct = lr(t.firstChild)), !0)
            : !1
        );
      case 6:
        return (
          (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
          t !== null ? ((e.stateNode = t), (ut = e), (ct = null), !0) : !1
        );
      case 13:
        return (
          (t = t.nodeType !== 8 ? null : t),
          t !== null
            ? ((i = jr !== null ? { id: qt, overflow: Kt } : null),
              (e.memoizedState = {
                dehydrated: t,
                treeContext: i,
                retryLane: 1073741824,
              }),
              (i = _t(18, null, null, 0)),
              (i.stateNode = t),
              (i.return = e),
              (e.child = i),
              (ut = e),
              (ct = null),
              !0)
            : !1
        );
      default:
        return !1;
    }
  }
  function co(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function ho(e) {
    if (be) {
      var t = ct;
      if (t) {
        var i = t;
        if (!vc(e, t)) {
          if (co(e)) throw Error(s(418));
          t = lr(i.nextSibling);
          var o = ut;
          t && vc(e, t)
            ? yc(o, i)
            : ((e.flags = (e.flags & -4097) | 2), (be = !1), (ut = e));
        }
      } else {
        if (co(e)) throw Error(s(418));
        ((e.flags = (e.flags & -4097) | 2), (be = !1), (ut = e));
      }
    }
  }
  function wc(e) {
    for (
      e = e.return;
      e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;
    )
      e = e.return;
    ut = e;
  }
  function di(e) {
    if (e !== ut) return !1;
    if (!be) return (wc(e), (be = !0), !1);
    var t;
    if (
      ((t = e.tag !== 3) &&
        !(t = e.tag !== 5) &&
        ((t = e.type),
        (t = t !== "head" && t !== "body" && !ro(e.type, e.memoizedProps))),
      t && (t = ct))
    ) {
      if (co(e)) throw (xc(), Error(s(418)));
      for (; t; ) (yc(e, t), (t = lr(t.nextSibling)));
    }
    if ((wc(e), e.tag === 13)) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
        throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var i = e.data;
            if (i === "/$") {
              if (t === 0) {
                ct = lr(e.nextSibling);
                break e;
              }
              t--;
            } else (i !== "$" && i !== "$!" && i !== "$?") || t++;
          }
          e = e.nextSibling;
        }
        ct = null;
      }
    } else ct = ut ? lr(e.stateNode.nextSibling) : null;
    return !0;
  }
  function xc() {
    for (var e = ct; e; ) e = lr(e.nextSibling);
  }
  function nn() {
    ((ct = ut = null), (be = !1));
  }
  function fo(e) {
    St === null ? (St = [e]) : St.push(e);
  }
  var Fp = B.ReactCurrentBatchConfig;
  function ts(e, t, i) {
    if (
      ((e = i.ref),
      e !== null && typeof e != "function" && typeof e != "object")
    ) {
      if (i._owner) {
        if (((i = i._owner), i)) {
          if (i.tag !== 1) throw Error(s(309));
          var o = i.stateNode;
        }
        if (!o) throw Error(s(147, e));
        var c = o,
          h = "" + e;
        return t !== null &&
          t.ref !== null &&
          typeof t.ref == "function" &&
          t.ref._stringRef === h
          ? t.ref
          : ((t = function (g) {
              var w = c.refs;
              g === null ? delete w[h] : (w[h] = g);
            }),
            (t._stringRef = h),
            t);
      }
      if (typeof e != "string") throw Error(s(284));
      if (!i._owner) throw Error(s(290, e));
    }
    return e;
  }
  function hi(e, t) {
    throw (
      (e = Object.prototype.toString.call(t)),
      Error(
        s(
          31,
          e === "[object Object]"
            ? "object with keys {" + Object.keys(t).join(", ") + "}"
            : e,
        ),
      )
    );
  }
  function _c(e) {
    var t = e._init;
    return t(e._payload);
  }
  function kc(e) {
    function t(T, b) {
      if (e) {
        var P = T.deletions;
        P === null ? ((T.deletions = [b]), (T.flags |= 16)) : P.push(b);
      }
    }
    function i(T, b) {
      if (!e) return null;
      for (; b !== null; ) (t(T, b), (b = b.sibling));
      return null;
    }
    function o(T, b) {
      for (T = new Map(); b !== null; )
        (b.key !== null ? T.set(b.key, b) : T.set(b.index, b), (b = b.sibling));
      return T;
    }
    function c(T, b) {
      return ((T = wr(T, b)), (T.index = 0), (T.sibling = null), T);
    }
    function h(T, b, P) {
      return (
        (T.index = P),
        e
          ? ((P = T.alternate),
            P !== null
              ? ((P = P.index), P < b ? ((T.flags |= 2), b) : P)
              : ((T.flags |= 2), b))
          : ((T.flags |= 1048576), b)
      );
    }
    function g(T) {
      return (e && T.alternate === null && (T.flags |= 2), T);
    }
    function w(T, b, P, z) {
      return b === null || b.tag !== 6
        ? ((b = sl(P, T.mode, z)), (b.return = T), b)
        : ((b = c(b, P)), (b.return = T), b);
    }
    function k(T, b, P, z) {
      var J = P.type;
      return J === se
        ? D(T, b, P.props.children, z, P.key)
        : b !== null &&
            (b.elementType === J ||
              (typeof J == "object" &&
                J !== null &&
                J.$$typeof === Ze &&
                _c(J) === b.type))
          ? ((z = c(b, P.props)), (z.ref = ts(T, b, P)), (z.return = T), z)
          : ((z = $i(P.type, P.key, P.props, null, T.mode, z)),
            (z.ref = ts(T, b, P)),
            (z.return = T),
            z);
    }
    function O(T, b, P, z) {
      return b === null ||
        b.tag !== 4 ||
        b.stateNode.containerInfo !== P.containerInfo ||
        b.stateNode.implementation !== P.implementation
        ? ((b = il(P, T.mode, z)), (b.return = T), b)
        : ((b = c(b, P.children || [])), (b.return = T), b);
    }
    function D(T, b, P, z, J) {
      return b === null || b.tag !== 7
        ? ((b = Lr(P, T.mode, z, J)), (b.return = T), b)
        : ((b = c(b, P)), (b.return = T), b);
    }
    function M(T, b, P) {
      if ((typeof b == "string" && b !== "") || typeof b == "number")
        return ((b = sl("" + b, T.mode, P)), (b.return = T), b);
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case re:
            return (
              (P = $i(b.type, b.key, b.props, null, T.mode, P)),
              (P.ref = ts(T, null, b)),
              (P.return = T),
              P
            );
          case Y:
            return ((b = il(b, T.mode, P)), (b.return = T), b);
          case Ze:
            var z = b._init;
            return M(T, z(b._payload), P);
        }
        if (Nn(b) || te(b))
          return ((b = Lr(b, T.mode, P, null)), (b.return = T), b);
        hi(T, b);
      }
      return null;
    }
    function $(T, b, P, z) {
      var J = b !== null ? b.key : null;
      if ((typeof P == "string" && P !== "") || typeof P == "number")
        return J !== null ? null : w(T, b, "" + P, z);
      if (typeof P == "object" && P !== null) {
        switch (P.$$typeof) {
          case re:
            return P.key === J ? k(T, b, P, z) : null;
          case Y:
            return P.key === J ? O(T, b, P, z) : null;
          case Ze:
            return ((J = P._init), $(T, b, J(P._payload), z));
        }
        if (Nn(P) || te(P)) return J !== null ? null : D(T, b, P, z, null);
        hi(T, P);
      }
      return null;
    }
    function W(T, b, P, z, J) {
      if ((typeof z == "string" && z !== "") || typeof z == "number")
        return ((T = T.get(P) || null), w(b, T, "" + z, J));
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case re:
            return (
              (T = T.get(z.key === null ? P : z.key) || null),
              k(b, T, z, J)
            );
          case Y:
            return (
              (T = T.get(z.key === null ? P : z.key) || null),
              O(b, T, z, J)
            );
          case Ze:
            var X = z._init;
            return W(T, b, P, X(z._payload), J);
        }
        if (Nn(z) || te(z))
          return ((T = T.get(P) || null), D(b, T, z, J, null));
        hi(b, z);
      }
      return null;
    }
    function q(T, b, P, z) {
      for (
        var J = null, X = null, Z = b, ne = (b = 0), ze = null;
        Z !== null && ne < P.length;
        ne++
      ) {
        Z.index > ne ? ((ze = Z), (Z = null)) : (ze = Z.sibling);
        var he = $(T, Z, P[ne], z);
        if (he === null) {
          Z === null && (Z = ze);
          break;
        }
        (e && Z && he.alternate === null && t(T, Z),
          (b = h(he, b, ne)),
          X === null ? (J = he) : (X.sibling = he),
          (X = he),
          (Z = ze));
      }
      if (ne === P.length) return (i(T, Z), be && Cr(T, ne), J);
      if (Z === null) {
        for (; ne < P.length; ne++)
          ((Z = M(T, P[ne], z)),
            Z !== null &&
              ((b = h(Z, b, ne)),
              X === null ? (J = Z) : (X.sibling = Z),
              (X = Z)));
        return (be && Cr(T, ne), J);
      }
      for (Z = o(T, Z); ne < P.length; ne++)
        ((ze = W(Z, T, ne, P[ne], z)),
          ze !== null &&
            (e &&
              ze.alternate !== null &&
              Z.delete(ze.key === null ? ne : ze.key),
            (b = h(ze, b, ne)),
            X === null ? (J = ze) : (X.sibling = ze),
            (X = ze)));
      return (
        e &&
          Z.forEach(function (xr) {
            return t(T, xr);
          }),
        be && Cr(T, ne),
        J
      );
    }
    function G(T, b, P, z) {
      var J = te(P);
      if (typeof J != "function") throw Error(s(150));
      if (((P = J.call(P)), P == null)) throw Error(s(151));
      for (
        var X = (J = null), Z = b, ne = (b = 0), ze = null, he = P.next();
        Z !== null && !he.done;
        ne++, he = P.next()
      ) {
        Z.index > ne ? ((ze = Z), (Z = null)) : (ze = Z.sibling);
        var xr = $(T, Z, he.value, z);
        if (xr === null) {
          Z === null && (Z = ze);
          break;
        }
        (e && Z && xr.alternate === null && t(T, Z),
          (b = h(xr, b, ne)),
          X === null ? (J = xr) : (X.sibling = xr),
          (X = xr),
          (Z = ze));
      }
      if (he.done) return (i(T, Z), be && Cr(T, ne), J);
      if (Z === null) {
        for (; !he.done; ne++, he = P.next())
          ((he = M(T, he.value, z)),
            he !== null &&
              ((b = h(he, b, ne)),
              X === null ? (J = he) : (X.sibling = he),
              (X = he)));
        return (be && Cr(T, ne), J);
      }
      for (Z = o(T, Z); !he.done; ne++, he = P.next())
        ((he = W(Z, T, ne, he.value, z)),
          he !== null &&
            (e &&
              he.alternate !== null &&
              Z.delete(he.key === null ? ne : he.key),
            (b = h(he, b, ne)),
            X === null ? (J = he) : (X.sibling = he),
            (X = he)));
      return (
        e &&
          Z.forEach(function (_m) {
            return t(T, _m);
          }),
        be && Cr(T, ne),
        J
      );
    }
    function Pe(T, b, P, z) {
      if (
        (typeof P == "object" &&
          P !== null &&
          P.type === se &&
          P.key === null &&
          (P = P.props.children),
        typeof P == "object" && P !== null)
      ) {
        switch (P.$$typeof) {
          case re:
            e: {
              for (var J = P.key, X = b; X !== null; ) {
                if (X.key === J) {
                  if (((J = P.type), J === se)) {
                    if (X.tag === 7) {
                      (i(T, X.sibling),
                        (b = c(X, P.props.children)),
                        (b.return = T),
                        (T = b));
                      break e;
                    }
                  } else if (
                    X.elementType === J ||
                    (typeof J == "object" &&
                      J !== null &&
                      J.$$typeof === Ze &&
                      _c(J) === X.type)
                  ) {
                    (i(T, X.sibling),
                      (b = c(X, P.props)),
                      (b.ref = ts(T, X, P)),
                      (b.return = T),
                      (T = b));
                    break e;
                  }
                  i(T, X);
                  break;
                } else t(T, X);
                X = X.sibling;
              }
              P.type === se
                ? ((b = Lr(P.props.children, T.mode, z, P.key)),
                  (b.return = T),
                  (T = b))
                : ((z = $i(P.type, P.key, P.props, null, T.mode, z)),
                  (z.ref = ts(T, b, P)),
                  (z.return = T),
                  (T = z));
            }
            return g(T);
          case Y:
            e: {
              for (X = P.key; b !== null; ) {
                if (b.key === X)
                  if (
                    b.tag === 4 &&
                    b.stateNode.containerInfo === P.containerInfo &&
                    b.stateNode.implementation === P.implementation
                  ) {
                    (i(T, b.sibling),
                      (b = c(b, P.children || [])),
                      (b.return = T),
                      (T = b));
                    break e;
                  } else {
                    i(T, b);
                    break;
                  }
                else t(T, b);
                b = b.sibling;
              }
              ((b = il(P, T.mode, z)), (b.return = T), (T = b));
            }
            return g(T);
          case Ze:
            return ((X = P._init), Pe(T, b, X(P._payload), z));
        }
        if (Nn(P)) return q(T, b, P, z);
        if (te(P)) return G(T, b, P, z);
        hi(T, P);
      }
      return (typeof P == "string" && P !== "") || typeof P == "number"
        ? ((P = "" + P),
          b !== null && b.tag === 6
            ? (i(T, b.sibling), (b = c(b, P)), (b.return = T), (T = b))
            : (i(T, b), (b = sl(P, T.mode, z)), (b.return = T), (T = b)),
          g(T))
        : i(T, b);
    }
    return Pe;
  }
  var sn = kc(!0),
    bc = kc(!1),
    fi = ur(null),
    pi = null,
    an = null,
    po = null;
  function mo() {
    po = an = pi = null;
  }
  function go(e) {
    var t = fi.current;
    (xe(fi), (e._currentValue = t));
  }
  function yo(e, t, i) {
    for (; e !== null; ) {
      var o = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), o !== null && (o.childLanes |= t))
          : o !== null && (o.childLanes & t) !== t && (o.childLanes |= t),
        e === i)
      )
        break;
      e = e.return;
    }
  }
  function on(e, t) {
    ((pi = e),
      (po = an = null),
      (e = e.dependencies),
      e !== null &&
        e.firstContext !== null &&
        ((e.lanes & t) !== 0 && (rt = !0), (e.firstContext = null)));
  }
  function vt(e) {
    var t = e._currentValue;
    if (po !== e)
      if (((e = { context: e, memoizedValue: t, next: null }), an === null)) {
        if (pi === null) throw Error(s(308));
        ((an = e), (pi.dependencies = { lanes: 0, firstContext: e }));
      } else an = an.next = e;
    return t;
  }
  var Rr = null;
  function vo(e) {
    Rr === null ? (Rr = [e]) : Rr.push(e);
  }
  function Sc(e, t, i, o) {
    var c = t.interleaved;
    return (
      c === null ? ((i.next = i), vo(t)) : ((i.next = c.next), (c.next = i)),
      (t.interleaved = i),
      Gt(e, o)
    );
  }
  function Gt(e, t) {
    e.lanes |= t;
    var i = e.alternate;
    for (i !== null && (i.lanes |= t), i = e, e = e.return; e !== null; )
      ((e.childLanes |= t),
        (i = e.alternate),
        i !== null && (i.childLanes |= t),
        (i = e),
        (e = e.return));
    return i.tag === 3 ? i.stateNode : null;
  }
  var hr = !1;
  function wo(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, interleaved: null, lanes: 0 },
      effects: null,
    };
  }
  function Ec(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          effects: e.effects,
        }));
  }
  function Jt(e, t) {
    return {
      eventTime: e,
      lane: t,
      tag: 0,
      payload: null,
      callback: null,
      next: null,
    };
  }
  function fr(e, t, i) {
    var o = e.updateQueue;
    if (o === null) return null;
    if (((o = o.shared), (ue & 2) !== 0)) {
      var c = o.pending;
      return (
        c === null ? (t.next = t) : ((t.next = c.next), (c.next = t)),
        (o.pending = t),
        Gt(e, i)
      );
    }
    return (
      (c = o.interleaved),
      c === null ? ((t.next = t), vo(o)) : ((t.next = c.next), (c.next = t)),
      (o.interleaved = t),
      Gt(e, i)
    );
  }
  function mi(e, t, i) {
    if (
      ((t = t.updateQueue), t !== null && ((t = t.shared), (i & 4194240) !== 0))
    ) {
      var o = t.lanes;
      ((o &= e.pendingLanes), (i |= o), (t.lanes = i), Oa(e, i));
    }
  }
  function jc(e, t) {
    var i = e.updateQueue,
      o = e.alternate;
    if (o !== null && ((o = o.updateQueue), i === o)) {
      var c = null,
        h = null;
      if (((i = i.firstBaseUpdate), i !== null)) {
        do {
          var g = {
            eventTime: i.eventTime,
            lane: i.lane,
            tag: i.tag,
            payload: i.payload,
            callback: i.callback,
            next: null,
          };
          (h === null ? (c = h = g) : (h = h.next = g), (i = i.next));
        } while (i !== null);
        h === null ? (c = h = t) : (h = h.next = t);
      } else c = h = t;
      ((i = {
        baseState: o.baseState,
        firstBaseUpdate: c,
        lastBaseUpdate: h,
        shared: o.shared,
        effects: o.effects,
      }),
        (e.updateQueue = i));
      return;
    }
    ((e = i.lastBaseUpdate),
      e === null ? (i.firstBaseUpdate = t) : (e.next = t),
      (i.lastBaseUpdate = t));
  }
  function gi(e, t, i, o) {
    var c = e.updateQueue;
    hr = !1;
    var h = c.firstBaseUpdate,
      g = c.lastBaseUpdate,
      w = c.shared.pending;
    if (w !== null) {
      c.shared.pending = null;
      var k = w,
        O = k.next;
      ((k.next = null), g === null ? (h = O) : (g.next = O), (g = k));
      var D = e.alternate;
      D !== null &&
        ((D = D.updateQueue),
        (w = D.lastBaseUpdate),
        w !== g &&
          (w === null ? (D.firstBaseUpdate = O) : (w.next = O),
          (D.lastBaseUpdate = k)));
    }
    if (h !== null) {
      var M = c.baseState;
      ((g = 0), (D = O = k = null), (w = h));
      do {
        var $ = w.lane,
          W = w.eventTime;
        if ((o & $) === $) {
          D !== null &&
            (D = D.next =
              {
                eventTime: W,
                lane: 0,
                tag: w.tag,
                payload: w.payload,
                callback: w.callback,
                next: null,
              });
          e: {
            var q = e,
              G = w;
            switch ((($ = t), (W = i), G.tag)) {
              case 1:
                if (((q = G.payload), typeof q == "function")) {
                  M = q.call(W, M, $);
                  break e;
                }
                M = q;
                break e;
              case 3:
                q.flags = (q.flags & -65537) | 128;
              case 0:
                if (
                  ((q = G.payload),
                  ($ = typeof q == "function" ? q.call(W, M, $) : q),
                  $ == null)
                )
                  break e;
                M = H({}, M, $);
                break e;
              case 2:
                hr = !0;
            }
          }
          w.callback !== null &&
            w.lane !== 0 &&
            ((e.flags |= 64),
            ($ = c.effects),
            $ === null ? (c.effects = [w]) : $.push(w));
        } else
          ((W = {
            eventTime: W,
            lane: $,
            tag: w.tag,
            payload: w.payload,
            callback: w.callback,
            next: null,
          }),
            D === null ? ((O = D = W), (k = M)) : (D = D.next = W),
            (g |= $));
        if (((w = w.next), w === null)) {
          if (((w = c.shared.pending), w === null)) break;
          (($ = w),
            (w = $.next),
            ($.next = null),
            (c.lastBaseUpdate = $),
            (c.shared.pending = null));
        }
      } while (!0);
      if (
        (D === null && (k = M),
        (c.baseState = k),
        (c.firstBaseUpdate = O),
        (c.lastBaseUpdate = D),
        (t = c.shared.interleaved),
        t !== null)
      ) {
        c = t;
        do ((g |= c.lane), (c = c.next));
        while (c !== t);
      } else h === null && (c.shared.lanes = 0);
      ((Pr |= g), (e.lanes = g), (e.memoizedState = M));
    }
  }
  function Cc(e, t, i) {
    if (((e = t.effects), (t.effects = null), e !== null))
      for (t = 0; t < e.length; t++) {
        var o = e[t],
          c = o.callback;
        if (c !== null) {
          if (((o.callback = null), (o = i), typeof c != "function"))
            throw Error(s(191, c));
          c.call(o);
        }
      }
  }
  var rs = {},
    $t = ur(rs),
    ns = ur(rs),
    ss = ur(rs);
  function Tr(e) {
    if (e === rs) throw Error(s(174));
    return e;
  }
  function xo(e, t) {
    switch ((ye(ss, t), ye(ns, e), ye($t, rs), (e = t.nodeType), e)) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : xa(null, "");
        break;
      default:
        ((e = e === 8 ? t.parentNode : t),
          (t = e.namespaceURI || null),
          (e = e.tagName),
          (t = xa(t, e)));
    }
    (xe($t), ye($t, t));
  }
  function ln() {
    (xe($t), xe(ns), xe(ss));
  }
  function Rc(e) {
    Tr(ss.current);
    var t = Tr($t.current),
      i = xa(t, e.type);
    t !== i && (ye(ns, e), ye($t, i));
  }
  function _o(e) {
    ns.current === e && (xe($t), xe(ns));
  }
  var Ee = ur(0);
  function yi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var i = t.memoizedState;
        if (
          i !== null &&
          ((i = i.dehydrated), i === null || i.data === "$?" || i.data === "$!")
        )
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var ko = [];
  function bo() {
    for (var e = 0; e < ko.length; e++)
      ko[e]._workInProgressVersionPrimary = null;
    ko.length = 0;
  }
  var vi = B.ReactCurrentDispatcher,
    So = B.ReactCurrentBatchConfig,
    Nr = 0,
    je = null,
    Le = null,
    De = null,
    wi = !1,
    is = !1,
    as = 0,
    Wp = 0;
  function Ke() {
    throw Error(s(321));
  }
  function Eo(e, t) {
    if (t === null) return !1;
    for (var i = 0; i < t.length && i < e.length; i++)
      if (!bt(e[i], t[i])) return !1;
    return !0;
  }
  function jo(e, t, i, o, c, h) {
    if (
      ((Nr = h),
      (je = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (vi.current = e === null || e.memoizedState === null ? Kp : Gp),
      (e = i(o, c)),
      is)
    ) {
      h = 0;
      do {
        if (((is = !1), (as = 0), 25 <= h)) throw Error(s(301));
        ((h += 1),
          (De = Le = null),
          (t.updateQueue = null),
          (vi.current = Jp),
          (e = i(o, c)));
      } while (is);
    }
    if (
      ((vi.current = ki),
      (t = Le !== null && Le.next !== null),
      (Nr = 0),
      (De = Le = je = null),
      (wi = !1),
      t)
    )
      throw Error(s(300));
    return e;
  }
  function Co() {
    var e = as !== 0;
    return ((as = 0), e);
  }
  function Ut() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (De === null ? (je.memoizedState = De = e) : (De = De.next = e), De);
  }
  function wt() {
    if (Le === null) {
      var e = je.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Le.next;
    var t = De === null ? je.memoizedState : De.next;
    if (t !== null) ((De = t), (Le = e));
    else {
      if (e === null) throw Error(s(310));
      ((Le = e),
        (e = {
          memoizedState: Le.memoizedState,
          baseState: Le.baseState,
          baseQueue: Le.baseQueue,
          queue: Le.queue,
          next: null,
        }),
        De === null ? (je.memoizedState = De = e) : (De = De.next = e));
    }
    return De;
  }
  function os(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ro(e) {
    var t = wt(),
      i = t.queue;
    if (i === null) throw Error(s(311));
    i.lastRenderedReducer = e;
    var o = Le,
      c = o.baseQueue,
      h = i.pending;
    if (h !== null) {
      if (c !== null) {
        var g = c.next;
        ((c.next = h.next), (h.next = g));
      }
      ((o.baseQueue = c = h), (i.pending = null));
    }
    if (c !== null) {
      ((h = c.next), (o = o.baseState));
      var w = (g = null),
        k = null,
        O = h;
      do {
        var D = O.lane;
        if ((Nr & D) === D)
          (k !== null &&
            (k = k.next =
              {
                lane: 0,
                action: O.action,
                hasEagerState: O.hasEagerState,
                eagerState: O.eagerState,
                next: null,
              }),
            (o = O.hasEagerState ? O.eagerState : e(o, O.action)));
        else {
          var M = {
            lane: D,
            action: O.action,
            hasEagerState: O.hasEagerState,
            eagerState: O.eagerState,
            next: null,
          };
          (k === null ? ((w = k = M), (g = o)) : (k = k.next = M),
            (je.lanes |= D),
            (Pr |= D));
        }
        O = O.next;
      } while (O !== null && O !== h);
      (k === null ? (g = o) : (k.next = w),
        bt(o, t.memoizedState) || (rt = !0),
        (t.memoizedState = o),
        (t.baseState = g),
        (t.baseQueue = k),
        (i.lastRenderedState = o));
    }
    if (((e = i.interleaved), e !== null)) {
      c = e;
      do ((h = c.lane), (je.lanes |= h), (Pr |= h), (c = c.next));
      while (c !== e);
    } else c === null && (i.lanes = 0);
    return [t.memoizedState, i.dispatch];
  }
  function To(e) {
    var t = wt(),
      i = t.queue;
    if (i === null) throw Error(s(311));
    i.lastRenderedReducer = e;
    var o = i.dispatch,
      c = i.pending,
      h = t.memoizedState;
    if (c !== null) {
      i.pending = null;
      var g = (c = c.next);
      do ((h = e(h, g.action)), (g = g.next));
      while (g !== c);
      (bt(h, t.memoizedState) || (rt = !0),
        (t.memoizedState = h),
        t.baseQueue === null && (t.baseState = h),
        (i.lastRenderedState = h));
    }
    return [h, o];
  }
  function Tc() {}
  function Nc(e, t) {
    var i = je,
      o = wt(),
      c = t(),
      h = !bt(o.memoizedState, c);
    if (
      (h && ((o.memoizedState = c), (rt = !0)),
      (o = o.queue),
      No(Ac.bind(null, i, o, e), [e]),
      o.getSnapshot !== t || h || (De !== null && De.memoizedState.tag & 1))
    ) {
      if (
        ((i.flags |= 2048),
        ls(9, Oc.bind(null, i, o, c, t), void 0, null),
        Me === null)
      )
        throw Error(s(349));
      (Nr & 30) !== 0 || Pc(i, t, c);
    }
    return c;
  }
  function Pc(e, t, i) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: i }),
      (t = je.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }),
          (je.updateQueue = t),
          (t.stores = [e]))
        : ((i = t.stores), i === null ? (t.stores = [e]) : i.push(e)));
  }
  function Oc(e, t, i, o) {
    ((t.value = i), (t.getSnapshot = o), Ic(t) && Lc(e));
  }
  function Ac(e, t, i) {
    return i(function () {
      Ic(t) && Lc(e);
    });
  }
  function Ic(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var i = t();
      return !bt(e, i);
    } catch {
      return !0;
    }
  }
  function Lc(e) {
    var t = Gt(e, 1);
    t !== null && Rt(t, e, 1, -1);
  }
  function $c(e) {
    var t = Ut();
    return (
      typeof e == "function" && (e = e()),
      (t.memoizedState = t.baseState = e),
      (e = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: os,
        lastRenderedState: e,
      }),
      (t.queue = e),
      (e = e.dispatch = qp.bind(null, je, e)),
      [t.memoizedState, e]
    );
  }
  function ls(e, t, i, o) {
    return (
      (e = { tag: e, create: t, destroy: i, deps: o, next: null }),
      (t = je.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }),
          (je.updateQueue = t),
          (t.lastEffect = e.next = e))
        : ((i = t.lastEffect),
          i === null
            ? (t.lastEffect = e.next = e)
            : ((o = i.next), (i.next = e), (e.next = o), (t.lastEffect = e))),
      e
    );
  }
  function Uc() {
    return wt().memoizedState;
  }
  function xi(e, t, i, o) {
    var c = Ut();
    ((je.flags |= e),
      (c.memoizedState = ls(1 | t, i, void 0, o === void 0 ? null : o)));
  }
  function _i(e, t, i, o) {
    var c = wt();
    o = o === void 0 ? null : o;
    var h = void 0;
    if (Le !== null) {
      var g = Le.memoizedState;
      if (((h = g.destroy), o !== null && Eo(o, g.deps))) {
        c.memoizedState = ls(t, i, h, o);
        return;
      }
    }
    ((je.flags |= e), (c.memoizedState = ls(1 | t, i, h, o)));
  }
  function Dc(e, t) {
    return xi(8390656, 8, e, t);
  }
  function No(e, t) {
    return _i(2048, 8, e, t);
  }
  function Mc(e, t) {
    return _i(4, 2, e, t);
  }
  function zc(e, t) {
    return _i(4, 4, e, t);
  }
  function Bc(e, t) {
    if (typeof t == "function")
      return (
        (e = e()),
        t(e),
        function () {
          t(null);
        }
      );
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function Fc(e, t, i) {
    return (
      (i = i != null ? i.concat([e]) : null),
      _i(4, 4, Bc.bind(null, t, e), i)
    );
  }
  function Po() {}
  function Wc(e, t) {
    var i = wt();
    t = t === void 0 ? null : t;
    var o = i.memoizedState;
    return o !== null && t !== null && Eo(t, o[1])
      ? o[0]
      : ((i.memoizedState = [e, t]), e);
  }
  function Vc(e, t) {
    var i = wt();
    t = t === void 0 ? null : t;
    var o = i.memoizedState;
    return o !== null && t !== null && Eo(t, o[1])
      ? o[0]
      : ((e = e()), (i.memoizedState = [e, t]), e);
  }
  function Hc(e, t, i) {
    return (Nr & 21) === 0
      ? (e.baseState && ((e.baseState = !1), (rt = !0)), (e.memoizedState = i))
      : (bt(i, t) ||
          ((i = _u()), (je.lanes |= i), (Pr |= i), (e.baseState = !0)),
        t);
  }
  function Vp(e, t) {
    var i = pe;
    ((pe = i !== 0 && 4 > i ? i : 4), e(!0));
    var o = So.transition;
    So.transition = {};
    try {
      (e(!1), t());
    } finally {
      ((pe = i), (So.transition = o));
    }
  }
  function qc() {
    return wt().memoizedState;
  }
  function Hp(e, t, i) {
    var o = yr(e);
    if (
      ((i = {
        lane: o,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Kc(e))
    )
      Gc(t, i);
    else if (((i = Sc(e, t, i, o)), i !== null)) {
      var c = Ye();
      (Rt(i, e, o, c), Jc(i, t, o));
    }
  }
  function qp(e, t, i) {
    var o = yr(e),
      c = {
        lane: o,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
    if (Kc(e)) Gc(t, c);
    else {
      var h = e.alternate;
      if (
        e.lanes === 0 &&
        (h === null || h.lanes === 0) &&
        ((h = t.lastRenderedReducer), h !== null)
      )
        try {
          var g = t.lastRenderedState,
            w = h(g, i);
          if (((c.hasEagerState = !0), (c.eagerState = w), bt(w, g))) {
            var k = t.interleaved;
            (k === null
              ? ((c.next = c), vo(t))
              : ((c.next = k.next), (k.next = c)),
              (t.interleaved = c));
            return;
          }
        } catch {
        } finally {
        }
      ((i = Sc(e, t, c, o)),
        i !== null && ((c = Ye()), Rt(i, e, o, c), Jc(i, t, o)));
    }
  }
  function Kc(e) {
    var t = e.alternate;
    return e === je || (t !== null && t === je);
  }
  function Gc(e, t) {
    is = wi = !0;
    var i = e.pending;
    (i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
      (e.pending = t));
  }
  function Jc(e, t, i) {
    if ((i & 4194240) !== 0) {
      var o = t.lanes;
      ((o &= e.pendingLanes), (i |= o), (t.lanes = i), Oa(e, i));
    }
  }
  var ki = {
      readContext: vt,
      useCallback: Ke,
      useContext: Ke,
      useEffect: Ke,
      useImperativeHandle: Ke,
      useInsertionEffect: Ke,
      useLayoutEffect: Ke,
      useMemo: Ke,
      useReducer: Ke,
      useRef: Ke,
      useState: Ke,
      useDebugValue: Ke,
      useDeferredValue: Ke,
      useTransition: Ke,
      useMutableSource: Ke,
      useSyncExternalStore: Ke,
      useId: Ke,
      unstable_isNewReconciler: !1,
    },
    Kp = {
      readContext: vt,
      useCallback: function (e, t) {
        return ((Ut().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: vt,
      useEffect: Dc,
      useImperativeHandle: function (e, t, i) {
        return (
          (i = i != null ? i.concat([e]) : null),
          xi(4194308, 4, Bc.bind(null, t, e), i)
        );
      },
      useLayoutEffect: function (e, t) {
        return xi(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        return xi(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var i = Ut();
        return (
          (t = t === void 0 ? null : t),
          (e = e()),
          (i.memoizedState = [e, t]),
          e
        );
      },
      useReducer: function (e, t, i) {
        var o = Ut();
        return (
          (t = i !== void 0 ? i(t) : t),
          (o.memoizedState = o.baseState = t),
          (e = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: t,
          }),
          (o.queue = e),
          (e = e.dispatch = Hp.bind(null, je, e)),
          [o.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = Ut();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: $c,
      useDebugValue: Po,
      useDeferredValue: function (e) {
        return (Ut().memoizedState = e);
      },
      useTransition: function () {
        var e = $c(!1),
          t = e[0];
        return ((e = Vp.bind(null, e[1])), (Ut().memoizedState = e), [t, e]);
      },
      useMutableSource: function () {},
      useSyncExternalStore: function (e, t, i) {
        var o = je,
          c = Ut();
        if (be) {
          if (i === void 0) throw Error(s(407));
          i = i();
        } else {
          if (((i = t()), Me === null)) throw Error(s(349));
          (Nr & 30) !== 0 || Pc(o, t, i);
        }
        c.memoizedState = i;
        var h = { value: i, getSnapshot: t };
        return (
          (c.queue = h),
          Dc(Ac.bind(null, o, h, e), [e]),
          (o.flags |= 2048),
          ls(9, Oc.bind(null, o, h, i, t), void 0, null),
          i
        );
      },
      useId: function () {
        var e = Ut(),
          t = Me.identifierPrefix;
        if (be) {
          var i = Kt,
            o = qt;
          ((i = (o & ~(1 << (32 - kt(o) - 1))).toString(32) + i),
            (t = ":" + t + "R" + i),
            (i = as++),
            0 < i && (t += "H" + i.toString(32)),
            (t += ":"));
        } else ((i = Wp++), (t = ":" + t + "r" + i.toString(32) + ":"));
        return (e.memoizedState = t);
      },
      unstable_isNewReconciler: !1,
    },
    Gp = {
      readContext: vt,
      useCallback: Wc,
      useContext: vt,
      useEffect: No,
      useImperativeHandle: Fc,
      useInsertionEffect: Mc,
      useLayoutEffect: zc,
      useMemo: Vc,
      useReducer: Ro,
      useRef: Uc,
      useState: function () {
        return Ro(os);
      },
      useDebugValue: Po,
      useDeferredValue: function (e) {
        var t = wt();
        return Hc(t, Le.memoizedState, e);
      },
      useTransition: function () {
        var e = Ro(os)[0],
          t = wt().memoizedState;
        return [e, t];
      },
      useMutableSource: Tc,
      useSyncExternalStore: Nc,
      useId: qc,
      unstable_isNewReconciler: !1,
    },
    Jp = {
      readContext: vt,
      useCallback: Wc,
      useContext: vt,
      useEffect: No,
      useImperativeHandle: Fc,
      useInsertionEffect: Mc,
      useLayoutEffect: zc,
      useMemo: Vc,
      useReducer: To,
      useRef: Uc,
      useState: function () {
        return To(os);
      },
      useDebugValue: Po,
      useDeferredValue: function (e) {
        var t = wt();
        return Le === null ? (t.memoizedState = e) : Hc(t, Le.memoizedState, e);
      },
      useTransition: function () {
        var e = To(os)[0],
          t = wt().memoizedState;
        return [e, t];
      },
      useMutableSource: Tc,
      useSyncExternalStore: Nc,
      useId: qc,
      unstable_isNewReconciler: !1,
    };
  function Et(e, t) {
    if (e && e.defaultProps) {
      ((t = H({}, t)), (e = e.defaultProps));
      for (var i in e) t[i] === void 0 && (t[i] = e[i]);
      return t;
    }
    return t;
  }
  function Oo(e, t, i, o) {
    ((t = e.memoizedState),
      (i = i(o, t)),
      (i = i == null ? t : H({}, t, i)),
      (e.memoizedState = i),
      e.lanes === 0 && (e.updateQueue.baseState = i));
  }
  var bi = {
    isMounted: function (e) {
      return (e = e._reactInternals) ? br(e) === e : !1;
    },
    enqueueSetState: function (e, t, i) {
      e = e._reactInternals;
      var o = Ye(),
        c = yr(e),
        h = Jt(o, c);
      ((h.payload = t),
        i != null && (h.callback = i),
        (t = fr(e, h, c)),
        t !== null && (Rt(t, e, c, o), mi(t, e, c)));
    },
    enqueueReplaceState: function (e, t, i) {
      e = e._reactInternals;
      var o = Ye(),
        c = yr(e),
        h = Jt(o, c);
      ((h.tag = 1),
        (h.payload = t),
        i != null && (h.callback = i),
        (t = fr(e, h, c)),
        t !== null && (Rt(t, e, c, o), mi(t, e, c)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var i = Ye(),
        o = yr(e),
        c = Jt(i, o);
      ((c.tag = 2),
        t != null && (c.callback = t),
        (t = fr(e, c, o)),
        t !== null && (Rt(t, e, o, i), mi(t, e, o)));
    },
  };
  function Qc(e, t, i, o, c, h, g) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(o, h, g)
        : t.prototype && t.prototype.isPureReactComponent
          ? !Gn(i, o) || !Gn(c, h)
          : !0
    );
  }
  function Yc(e, t, i) {
    var o = !1,
      c = cr,
      h = t.contextType;
    return (
      typeof h == "object" && h !== null
        ? (h = vt(h))
        : ((c = tt(t) ? Er : qe.current),
          (o = t.contextTypes),
          (h = (o = o != null) ? en(e, c) : cr)),
      (t = new t(i, h)),
      (e.memoizedState =
        t.state !== null && t.state !== void 0 ? t.state : null),
      (t.updater = bi),
      (e.stateNode = t),
      (t._reactInternals = e),
      o &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = c),
        (e.__reactInternalMemoizedMaskedChildContext = h)),
      t
    );
  }
  function Xc(e, t, i, o) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == "function" &&
        t.componentWillReceiveProps(i, o),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(i, o),
      t.state !== e && bi.enqueueReplaceState(t, t.state, null));
  }
  function Ao(e, t, i, o) {
    var c = e.stateNode;
    ((c.props = i), (c.state = e.memoizedState), (c.refs = {}), wo(e));
    var h = t.contextType;
    (typeof h == "object" && h !== null
      ? (c.context = vt(h))
      : ((h = tt(t) ? Er : qe.current), (c.context = en(e, h))),
      (c.state = e.memoizedState),
      (h = t.getDerivedStateFromProps),
      typeof h == "function" && (Oo(e, t, h, i), (c.state = e.memoizedState)),
      typeof t.getDerivedStateFromProps == "function" ||
        typeof c.getSnapshotBeforeUpdate == "function" ||
        (typeof c.UNSAFE_componentWillMount != "function" &&
          typeof c.componentWillMount != "function") ||
        ((t = c.state),
        typeof c.componentWillMount == "function" && c.componentWillMount(),
        typeof c.UNSAFE_componentWillMount == "function" &&
          c.UNSAFE_componentWillMount(),
        t !== c.state && bi.enqueueReplaceState(c, c.state, null),
        gi(e, i, c, o),
        (c.state = e.memoizedState)),
      typeof c.componentDidMount == "function" && (e.flags |= 4194308));
  }
  function un(e, t) {
    try {
      var i = "",
        o = t;
      do ((i += ce(o)), (o = o.return));
      while (o);
      var c = i;
    } catch (h) {
      c =
        `
Error generating stack: ` +
        h.message +
        `
` +
        h.stack;
    }
    return { value: e, source: t, stack: c, digest: null };
  }
  function Io(e, t, i) {
    return { value: e, source: null, stack: i ?? null, digest: t ?? null };
  }
  function Lo(e, t) {
    try {
      console.error(t.value);
    } catch (i) {
      setTimeout(function () {
        throw i;
      });
    }
  }
  var Qp = typeof WeakMap == "function" ? WeakMap : Map;
  function Zc(e, t, i) {
    ((i = Jt(-1, i)), (i.tag = 3), (i.payload = { element: null }));
    var o = t.value;
    return (
      (i.callback = function () {
        (Ni || ((Ni = !0), (Qo = o)), Lo(e, t));
      }),
      i
    );
  }
  function ed(e, t, i) {
    ((i = Jt(-1, i)), (i.tag = 3));
    var o = e.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = t.value;
      ((i.payload = function () {
        return o(c);
      }),
        (i.callback = function () {
          Lo(e, t);
        }));
    }
    var h = e.stateNode;
    return (
      h !== null &&
        typeof h.componentDidCatch == "function" &&
        (i.callback = function () {
          (Lo(e, t),
            typeof o != "function" &&
              (mr === null ? (mr = new Set([this])) : mr.add(this)));
          var g = t.stack;
          this.componentDidCatch(t.value, {
            componentStack: g !== null ? g : "",
          });
        }),
      i
    );
  }
  function td(e, t, i) {
    var o = e.pingCache;
    if (o === null) {
      o = e.pingCache = new Qp();
      var c = new Set();
      o.set(t, c);
    } else ((c = o.get(t)), c === void 0 && ((c = new Set()), o.set(t, c)));
    c.has(i) || (c.add(i), (e = cm.bind(null, e, t, i)), t.then(e, e));
  }
  function rd(e) {
    do {
      var t;
      if (
        ((t = e.tag === 13) &&
          ((t = e.memoizedState),
          (t = t !== null ? t.dehydrated !== null : !0)),
        t)
      )
        return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function nd(e, t, i, o, c) {
    return (e.mode & 1) === 0
      ? (e === t
          ? (e.flags |= 65536)
          : ((e.flags |= 128),
            (i.flags |= 131072),
            (i.flags &= -52805),
            i.tag === 1 &&
              (i.alternate === null
                ? (i.tag = 17)
                : ((t = Jt(-1, 1)), (t.tag = 2), fr(i, t, 1))),
            (i.lanes |= 1)),
        e)
      : ((e.flags |= 65536), (e.lanes = c), e);
  }
  var Yp = B.ReactCurrentOwner,
    rt = !1;
  function Qe(e, t, i, o) {
    t.child = e === null ? bc(t, null, i, o) : sn(t, e.child, i, o);
  }
  function sd(e, t, i, o, c) {
    i = i.render;
    var h = t.ref;
    return (
      on(t, c),
      (o = jo(e, t, i, o, h, c)),
      (i = Co()),
      e !== null && !rt
        ? ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~c),
          Qt(e, t, c))
        : (be && i && lo(t), (t.flags |= 1), Qe(e, t, o, c), t.child)
    );
  }
  function id(e, t, i, o, c) {
    if (e === null) {
      var h = i.type;
      return typeof h == "function" &&
        !nl(h) &&
        h.defaultProps === void 0 &&
        i.compare === null &&
        i.defaultProps === void 0
        ? ((t.tag = 15), (t.type = h), ad(e, t, h, o, c))
        : ((e = $i(i.type, null, o, t, t.mode, c)),
          (e.ref = t.ref),
          (e.return = t),
          (t.child = e));
    }
    if (((h = e.child), (e.lanes & c) === 0)) {
      var g = h.memoizedProps;
      if (
        ((i = i.compare), (i = i !== null ? i : Gn), i(g, o) && e.ref === t.ref)
      )
        return Qt(e, t, c);
    }
    return (
      (t.flags |= 1),
      (e = wr(h, o)),
      (e.ref = t.ref),
      (e.return = t),
      (t.child = e)
    );
  }
  function ad(e, t, i, o, c) {
    if (e !== null) {
      var h = e.memoizedProps;
      if (Gn(h, o) && e.ref === t.ref)
        if (((rt = !1), (t.pendingProps = o = h), (e.lanes & c) !== 0))
          (e.flags & 131072) !== 0 && (rt = !0);
        else return ((t.lanes = e.lanes), Qt(e, t, c));
    }
    return $o(e, t, i, o, c);
  }
  function od(e, t, i) {
    var o = t.pendingProps,
      c = o.children,
      h = e !== null ? e.memoizedState : null;
    if (o.mode === "hidden")
      if ((t.mode & 1) === 0)
        ((t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          ye(dn, dt),
          (dt |= i));
      else {
        if ((i & 1073741824) === 0)
          return (
            (e = h !== null ? h.baseLanes | i : i),
            (t.lanes = t.childLanes = 1073741824),
            (t.memoizedState = {
              baseLanes: e,
              cachePool: null,
              transitions: null,
            }),
            (t.updateQueue = null),
            ye(dn, dt),
            (dt |= e),
            null
          );
        ((t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          (o = h !== null ? h.baseLanes : i),
          ye(dn, dt),
          (dt |= o));
      }
    else
      (h !== null ? ((o = h.baseLanes | i), (t.memoizedState = null)) : (o = i),
        ye(dn, dt),
        (dt |= o));
    return (Qe(e, t, c, i), t.child);
  }
  function ld(e, t) {
    var i = t.ref;
    ((e === null && i !== null) || (e !== null && e.ref !== i)) &&
      ((t.flags |= 512), (t.flags |= 2097152));
  }
  function $o(e, t, i, o, c) {
    var h = tt(i) ? Er : qe.current;
    return (
      (h = en(t, h)),
      on(t, c),
      (i = jo(e, t, i, o, h, c)),
      (o = Co()),
      e !== null && !rt
        ? ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~c),
          Qt(e, t, c))
        : (be && o && lo(t), (t.flags |= 1), Qe(e, t, i, c), t.child)
    );
  }
  function ud(e, t, i, o, c) {
    if (tt(i)) {
      var h = !0;
      oi(t);
    } else h = !1;
    if ((on(t, c), t.stateNode === null))
      (Ei(e, t), Yc(t, i, o), Ao(t, i, o, c), (o = !0));
    else if (e === null) {
      var g = t.stateNode,
        w = t.memoizedProps;
      g.props = w;
      var k = g.context,
        O = i.contextType;
      typeof O == "object" && O !== null
        ? (O = vt(O))
        : ((O = tt(i) ? Er : qe.current), (O = en(t, O)));
      var D = i.getDerivedStateFromProps,
        M =
          typeof D == "function" ||
          typeof g.getSnapshotBeforeUpdate == "function";
      (M ||
        (typeof g.UNSAFE_componentWillReceiveProps != "function" &&
          typeof g.componentWillReceiveProps != "function") ||
        ((w !== o || k !== O) && Xc(t, g, o, O)),
        (hr = !1));
      var $ = t.memoizedState;
      ((g.state = $),
        gi(t, o, g, c),
        (k = t.memoizedState),
        w !== o || $ !== k || et.current || hr
          ? (typeof D == "function" && (Oo(t, i, D, o), (k = t.memoizedState)),
            (w = hr || Qc(t, i, w, o, $, k, O))
              ? (M ||
                  (typeof g.UNSAFE_componentWillMount != "function" &&
                    typeof g.componentWillMount != "function") ||
                  (typeof g.componentWillMount == "function" &&
                    g.componentWillMount(),
                  typeof g.UNSAFE_componentWillMount == "function" &&
                    g.UNSAFE_componentWillMount()),
                typeof g.componentDidMount == "function" &&
                  (t.flags |= 4194308))
              : (typeof g.componentDidMount == "function" &&
                  (t.flags |= 4194308),
                (t.memoizedProps = o),
                (t.memoizedState = k)),
            (g.props = o),
            (g.state = k),
            (g.context = O),
            (o = w))
          : (typeof g.componentDidMount == "function" && (t.flags |= 4194308),
            (o = !1)));
    } else {
      ((g = t.stateNode),
        Ec(e, t),
        (w = t.memoizedProps),
        (O = t.type === t.elementType ? w : Et(t.type, w)),
        (g.props = O),
        (M = t.pendingProps),
        ($ = g.context),
        (k = i.contextType),
        typeof k == "object" && k !== null
          ? (k = vt(k))
          : ((k = tt(i) ? Er : qe.current), (k = en(t, k))));
      var W = i.getDerivedStateFromProps;
      ((D =
        typeof W == "function" ||
        typeof g.getSnapshotBeforeUpdate == "function") ||
        (typeof g.UNSAFE_componentWillReceiveProps != "function" &&
          typeof g.componentWillReceiveProps != "function") ||
        ((w !== M || $ !== k) && Xc(t, g, o, k)),
        (hr = !1),
        ($ = t.memoizedState),
        (g.state = $),
        gi(t, o, g, c));
      var q = t.memoizedState;
      w !== M || $ !== q || et.current || hr
        ? (typeof W == "function" && (Oo(t, i, W, o), (q = t.memoizedState)),
          (O = hr || Qc(t, i, O, o, $, q, k) || !1)
            ? (D ||
                (typeof g.UNSAFE_componentWillUpdate != "function" &&
                  typeof g.componentWillUpdate != "function") ||
                (typeof g.componentWillUpdate == "function" &&
                  g.componentWillUpdate(o, q, k),
                typeof g.UNSAFE_componentWillUpdate == "function" &&
                  g.UNSAFE_componentWillUpdate(o, q, k)),
              typeof g.componentDidUpdate == "function" && (t.flags |= 4),
              typeof g.getSnapshotBeforeUpdate == "function" &&
                (t.flags |= 1024))
            : (typeof g.componentDidUpdate != "function" ||
                (w === e.memoizedProps && $ === e.memoizedState) ||
                (t.flags |= 4),
              typeof g.getSnapshotBeforeUpdate != "function" ||
                (w === e.memoizedProps && $ === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = o),
              (t.memoizedState = q)),
          (g.props = o),
          (g.state = q),
          (g.context = k),
          (o = O))
        : (typeof g.componentDidUpdate != "function" ||
            (w === e.memoizedProps && $ === e.memoizedState) ||
            (t.flags |= 4),
          typeof g.getSnapshotBeforeUpdate != "function" ||
            (w === e.memoizedProps && $ === e.memoizedState) ||
            (t.flags |= 1024),
          (o = !1));
    }
    return Uo(e, t, i, o, h, c);
  }
  function Uo(e, t, i, o, c, h) {
    ld(e, t);
    var g = (t.flags & 128) !== 0;
    if (!o && !g) return (c && pc(t, i, !1), Qt(e, t, h));
    ((o = t.stateNode), (Yp.current = t));
    var w =
      g && typeof i.getDerivedStateFromError != "function" ? null : o.render();
    return (
      (t.flags |= 1),
      e !== null && g
        ? ((t.child = sn(t, e.child, null, h)), (t.child = sn(t, null, w, h)))
        : Qe(e, t, w, h),
      (t.memoizedState = o.state),
      c && pc(t, i, !0),
      t.child
    );
  }
  function cd(e) {
    var t = e.stateNode;
    (t.pendingContext
      ? hc(e, t.pendingContext, t.pendingContext !== t.context)
      : t.context && hc(e, t.context, !1),
      xo(e, t.containerInfo));
  }
  function dd(e, t, i, o, c) {
    return (nn(), fo(c), (t.flags |= 256), Qe(e, t, i, o), t.child);
  }
  var Do = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Mo(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function hd(e, t, i) {
    var o = t.pendingProps,
      c = Ee.current,
      h = !1,
      g = (t.flags & 128) !== 0,
      w;
    if (
      ((w = g) ||
        (w = e !== null && e.memoizedState === null ? !1 : (c & 2) !== 0),
      w
        ? ((h = !0), (t.flags &= -129))
        : (e === null || e.memoizedState !== null) && (c |= 1),
      ye(Ee, c & 1),
      e === null)
    )
      return (
        ho(t),
        (e = t.memoizedState),
        e !== null && ((e = e.dehydrated), e !== null)
          ? ((t.mode & 1) === 0
              ? (t.lanes = 1)
              : e.data === "$!"
                ? (t.lanes = 8)
                : (t.lanes = 1073741824),
            null)
          : ((g = o.children),
            (e = o.fallback),
            h
              ? ((o = t.mode),
                (h = t.child),
                (g = { mode: "hidden", children: g }),
                (o & 1) === 0 && h !== null
                  ? ((h.childLanes = 0), (h.pendingProps = g))
                  : (h = Ui(g, o, 0, null)),
                (e = Lr(e, o, i, null)),
                (h.return = t),
                (e.return = t),
                (h.sibling = e),
                (t.child = h),
                (t.child.memoizedState = Mo(i)),
                (t.memoizedState = Do),
                e)
              : zo(t, g))
      );
    if (((c = e.memoizedState), c !== null && ((w = c.dehydrated), w !== null)))
      return Xp(e, t, g, o, w, c, i);
    if (h) {
      ((h = o.fallback), (g = t.mode), (c = e.child), (w = c.sibling));
      var k = { mode: "hidden", children: o.children };
      return (
        (g & 1) === 0 && t.child !== c
          ? ((o = t.child),
            (o.childLanes = 0),
            (o.pendingProps = k),
            (t.deletions = null))
          : ((o = wr(c, k)), (o.subtreeFlags = c.subtreeFlags & 14680064)),
        w !== null ? (h = wr(w, h)) : ((h = Lr(h, g, i, null)), (h.flags |= 2)),
        (h.return = t),
        (o.return = t),
        (o.sibling = h),
        (t.child = o),
        (o = h),
        (h = t.child),
        (g = e.child.memoizedState),
        (g =
          g === null
            ? Mo(i)
            : {
                baseLanes: g.baseLanes | i,
                cachePool: null,
                transitions: g.transitions,
              }),
        (h.memoizedState = g),
        (h.childLanes = e.childLanes & ~i),
        (t.memoizedState = Do),
        o
      );
    }
    return (
      (h = e.child),
      (e = h.sibling),
      (o = wr(h, { mode: "visible", children: o.children })),
      (t.mode & 1) === 0 && (o.lanes = i),
      (o.return = t),
      (o.sibling = null),
      e !== null &&
        ((i = t.deletions),
        i === null ? ((t.deletions = [e]), (t.flags |= 16)) : i.push(e)),
      (t.child = o),
      (t.memoizedState = null),
      o
    );
  }
  function zo(e, t) {
    return (
      (t = Ui({ mode: "visible", children: t }, e.mode, 0, null)),
      (t.return = e),
      (e.child = t)
    );
  }
  function Si(e, t, i, o) {
    return (
      o !== null && fo(o),
      sn(t, e.child, null, i),
      (e = zo(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function Xp(e, t, i, o, c, h, g) {
    if (i)
      return t.flags & 256
        ? ((t.flags &= -257), (o = Io(Error(s(422)))), Si(e, t, g, o))
        : t.memoizedState !== null
          ? ((t.child = e.child), (t.flags |= 128), null)
          : ((h = o.fallback),
            (c = t.mode),
            (o = Ui({ mode: "visible", children: o.children }, c, 0, null)),
            (h = Lr(h, c, g, null)),
            (h.flags |= 2),
            (o.return = t),
            (h.return = t),
            (o.sibling = h),
            (t.child = o),
            (t.mode & 1) !== 0 && sn(t, e.child, null, g),
            (t.child.memoizedState = Mo(g)),
            (t.memoizedState = Do),
            h);
    if ((t.mode & 1) === 0) return Si(e, t, g, null);
    if (c.data === "$!") {
      if (((o = c.nextSibling && c.nextSibling.dataset), o)) var w = o.dgst;
      return (
        (o = w),
        (h = Error(s(419))),
        (o = Io(h, o, void 0)),
        Si(e, t, g, o)
      );
    }
    if (((w = (g & e.childLanes) !== 0), rt || w)) {
      if (((o = Me), o !== null)) {
        switch (g & -g) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        ((c = (c & (o.suspendedLanes | g)) !== 0 ? 0 : c),
          c !== 0 &&
            c !== h.retryLane &&
            ((h.retryLane = c), Gt(e, c), Rt(o, e, c, -1)));
      }
      return (rl(), (o = Io(Error(s(421)))), Si(e, t, g, o));
    }
    return c.data === "$?"
      ? ((t.flags |= 128),
        (t.child = e.child),
        (t = dm.bind(null, e)),
        (c._reactRetry = t),
        null)
      : ((e = h.treeContext),
        (ct = lr(c.nextSibling)),
        (ut = t),
        (be = !0),
        (St = null),
        e !== null &&
          ((gt[yt++] = qt),
          (gt[yt++] = Kt),
          (gt[yt++] = jr),
          (qt = e.id),
          (Kt = e.overflow),
          (jr = t)),
        (t = zo(t, o.children)),
        (t.flags |= 4096),
        t);
  }
  function fd(e, t, i) {
    e.lanes |= t;
    var o = e.alternate;
    (o !== null && (o.lanes |= t), yo(e.return, t, i));
  }
  function Bo(e, t, i, o, c) {
    var h = e.memoizedState;
    h === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: o,
          tail: i,
          tailMode: c,
        })
      : ((h.isBackwards = t),
        (h.rendering = null),
        (h.renderingStartTime = 0),
        (h.last = o),
        (h.tail = i),
        (h.tailMode = c));
  }
  function pd(e, t, i) {
    var o = t.pendingProps,
      c = o.revealOrder,
      h = o.tail;
    if ((Qe(e, t, o.children, i), (o = Ee.current), (o & 2) !== 0))
      ((o = (o & 1) | 2), (t.flags |= 128));
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && fd(e, i, t);
          else if (e.tag === 19) fd(e, i, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break e;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      o &= 1;
    }
    if ((ye(Ee, o), (t.mode & 1) === 0)) t.memoizedState = null;
    else
      switch (c) {
        case "forwards":
          for (i = t.child, c = null; i !== null; )
            ((e = i.alternate),
              e !== null && yi(e) === null && (c = i),
              (i = i.sibling));
          ((i = c),
            i === null
              ? ((c = t.child), (t.child = null))
              : ((c = i.sibling), (i.sibling = null)),
            Bo(t, !1, c, i, h));
          break;
        case "backwards":
          for (i = null, c = t.child, t.child = null; c !== null; ) {
            if (((e = c.alternate), e !== null && yi(e) === null)) {
              t.child = c;
              break;
            }
            ((e = c.sibling), (c.sibling = i), (i = c), (c = e));
          }
          Bo(t, !0, i, null, h);
          break;
        case "together":
          Bo(t, !1, null, null, void 0);
          break;
        default:
          t.memoizedState = null;
      }
    return t.child;
  }
  function Ei(e, t) {
    (t.mode & 1) === 0 &&
      e !== null &&
      ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
  }
  function Qt(e, t, i) {
    if (
      (e !== null && (t.dependencies = e.dependencies),
      (Pr |= t.lanes),
      (i & t.childLanes) === 0)
    )
      return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (
        e = t.child, i = wr(e, e.pendingProps), t.child = i, i.return = t;
        e.sibling !== null;
      )
        ((e = e.sibling),
          (i = i.sibling = wr(e, e.pendingProps)),
          (i.return = t));
      i.sibling = null;
    }
    return t.child;
  }
  function Zp(e, t, i) {
    switch (t.tag) {
      case 3:
        (cd(t), nn());
        break;
      case 5:
        Rc(t);
        break;
      case 1:
        tt(t.type) && oi(t);
        break;
      case 4:
        xo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var o = t.type._context,
          c = t.memoizedProps.value;
        (ye(fi, o._currentValue), (o._currentValue = c));
        break;
      case 13:
        if (((o = t.memoizedState), o !== null))
          return o.dehydrated !== null
            ? (ye(Ee, Ee.current & 1), (t.flags |= 128), null)
            : (i & t.child.childLanes) !== 0
              ? hd(e, t, i)
              : (ye(Ee, Ee.current & 1),
                (e = Qt(e, t, i)),
                e !== null ? e.sibling : null);
        ye(Ee, Ee.current & 1);
        break;
      case 19:
        if (((o = (i & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
          if (o) return pd(e, t, i);
          t.flags |= 128;
        }
        if (
          ((c = t.memoizedState),
          c !== null &&
            ((c.rendering = null), (c.tail = null), (c.lastEffect = null)),
          ye(Ee, Ee.current),
          o)
        )
          break;
        return null;
      case 22:
      case 23:
        return ((t.lanes = 0), od(e, t, i));
    }
    return Qt(e, t, i);
  }
  var md, Fo, gd, yd;
  ((md = function (e, t) {
    for (var i = t.child; i !== null; ) {
      if (i.tag === 5 || i.tag === 6) e.appendChild(i.stateNode);
      else if (i.tag !== 4 && i.child !== null) {
        ((i.child.return = i), (i = i.child));
        continue;
      }
      if (i === t) break;
      for (; i.sibling === null; ) {
        if (i.return === null || i.return === t) return;
        i = i.return;
      }
      ((i.sibling.return = i.return), (i = i.sibling));
    }
  }),
    (Fo = function () {}),
    (gd = function (e, t, i, o) {
      var c = e.memoizedProps;
      if (c !== o) {
        ((e = t.stateNode), Tr($t.current));
        var h = null;
        switch (i) {
          case "input":
            ((c = ga(e, c)), (o = ga(e, o)), (h = []));
            break;
          case "select":
            ((c = H({}, c, { value: void 0 })),
              (o = H({}, o, { value: void 0 })),
              (h = []));
            break;
          case "textarea":
            ((c = wa(e, c)), (o = wa(e, o)), (h = []));
            break;
          default:
            typeof c.onClick != "function" &&
              typeof o.onClick == "function" &&
              (e.onclick = si);
        }
        _a(i, o);
        var g;
        i = null;
        for (O in c)
          if (!o.hasOwnProperty(O) && c.hasOwnProperty(O) && c[O] != null)
            if (O === "style") {
              var w = c[O];
              for (g in w) w.hasOwnProperty(g) && (i || (i = {}), (i[g] = ""));
            } else
              O !== "dangerouslySetInnerHTML" &&
                O !== "children" &&
                O !== "suppressContentEditableWarning" &&
                O !== "suppressHydrationWarning" &&
                O !== "autoFocus" &&
                (l.hasOwnProperty(O)
                  ? h || (h = [])
                  : (h = h || []).push(O, null));
        for (O in o) {
          var k = o[O];
          if (
            ((w = c != null ? c[O] : void 0),
            o.hasOwnProperty(O) && k !== w && (k != null || w != null))
          )
            if (O === "style")
              if (w) {
                for (g in w)
                  !w.hasOwnProperty(g) ||
                    (k && k.hasOwnProperty(g)) ||
                    (i || (i = {}), (i[g] = ""));
                for (g in k)
                  k.hasOwnProperty(g) &&
                    w[g] !== k[g] &&
                    (i || (i = {}), (i[g] = k[g]));
              } else (i || (h || (h = []), h.push(O, i)), (i = k));
            else
              O === "dangerouslySetInnerHTML"
                ? ((k = k ? k.__html : void 0),
                  (w = w ? w.__html : void 0),
                  k != null && w !== k && (h = h || []).push(O, k))
                : O === "children"
                  ? (typeof k != "string" && typeof k != "number") ||
                    (h = h || []).push(O, "" + k)
                  : O !== "suppressContentEditableWarning" &&
                    O !== "suppressHydrationWarning" &&
                    (l.hasOwnProperty(O)
                      ? (k != null && O === "onScroll" && we("scroll", e),
                        h || w === k || (h = []))
                      : (h = h || []).push(O, k));
        }
        i && (h = h || []).push("style", i);
        var O = h;
        (t.updateQueue = O) && (t.flags |= 4);
      }
    }),
    (yd = function (e, t, i, o) {
      i !== o && (t.flags |= 4);
    }));
  function us(e, t) {
    if (!be)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var i = null; t !== null; )
            (t.alternate !== null && (i = t), (t = t.sibling));
          i === null ? (e.tail = null) : (i.sibling = null);
          break;
        case "collapsed":
          i = e.tail;
          for (var o = null; i !== null; )
            (i.alternate !== null && (o = i), (i = i.sibling));
          o === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (o.sibling = null);
      }
  }
  function Ge(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      i = 0,
      o = 0;
    if (t)
      for (var c = e.child; c !== null; )
        ((i |= c.lanes | c.childLanes),
          (o |= c.subtreeFlags & 14680064),
          (o |= c.flags & 14680064),
          (c.return = e),
          (c = c.sibling));
    else
      for (c = e.child; c !== null; )
        ((i |= c.lanes | c.childLanes),
          (o |= c.subtreeFlags),
          (o |= c.flags),
          (c.return = e),
          (c = c.sibling));
    return ((e.subtreeFlags |= o), (e.childLanes = i), t);
  }
  function em(e, t, i) {
    var o = t.pendingProps;
    switch ((uo(t), t.tag)) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (Ge(t), null);
      case 1:
        return (tt(t.type) && ai(), Ge(t), null);
      case 3:
        return (
          (o = t.stateNode),
          ln(),
          xe(et),
          xe(qe),
          bo(),
          o.pendingContext &&
            ((o.context = o.pendingContext), (o.pendingContext = null)),
          (e === null || e.child === null) &&
            (di(t)
              ? (t.flags |= 4)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), St !== null && (Zo(St), (St = null)))),
          Fo(e, t),
          Ge(t),
          null
        );
      case 5:
        _o(t);
        var c = Tr(ss.current);
        if (((i = t.type), e !== null && t.stateNode != null))
          (gd(e, t, i, o, c),
            e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
        else {
          if (!o) {
            if (t.stateNode === null) throw Error(s(166));
            return (Ge(t), null);
          }
          if (((e = Tr($t.current)), di(t))) {
            ((o = t.stateNode), (i = t.type));
            var h = t.memoizedProps;
            switch (((o[Lt] = t), (o[Zn] = h), (e = (t.mode & 1) !== 0), i)) {
              case "dialog":
                (we("cancel", o), we("close", o));
                break;
              case "iframe":
              case "object":
              case "embed":
                we("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < Qn.length; c++) we(Qn[c], o);
                break;
              case "source":
                we("error", o);
                break;
              case "img":
              case "image":
              case "link":
                (we("error", o), we("load", o));
                break;
              case "details":
                we("toggle", o);
                break;
              case "input":
                (Yl(o, h), we("invalid", o));
                break;
              case "select":
                ((o._wrapperState = { wasMultiple: !!h.multiple }),
                  we("invalid", o));
                break;
              case "textarea":
                (eu(o, h), we("invalid", o));
            }
            (_a(i, h), (c = null));
            for (var g in h)
              if (h.hasOwnProperty(g)) {
                var w = h[g];
                g === "children"
                  ? typeof w == "string"
                    ? o.textContent !== w &&
                      (h.suppressHydrationWarning !== !0 &&
                        ni(o.textContent, w, e),
                      (c = ["children", w]))
                    : typeof w == "number" &&
                      o.textContent !== "" + w &&
                      (h.suppressHydrationWarning !== !0 &&
                        ni(o.textContent, w, e),
                      (c = ["children", "" + w]))
                  : l.hasOwnProperty(g) &&
                    w != null &&
                    g === "onScroll" &&
                    we("scroll", o);
              }
            switch (i) {
              case "input":
                (Is(o), Zl(o, h, !0));
                break;
              case "textarea":
                (Is(o), ru(o));
                break;
              case "select":
              case "option":
                break;
              default:
                typeof h.onClick == "function" && (o.onclick = si);
            }
            ((o = c), (t.updateQueue = o), o !== null && (t.flags |= 4));
          } else {
            ((g = c.nodeType === 9 ? c : c.ownerDocument),
              e === "http://www.w3.org/1999/xhtml" && (e = nu(i)),
              e === "http://www.w3.org/1999/xhtml"
                ? i === "script"
                  ? ((e = g.createElement("div")),
                    (e.innerHTML = "<script><\/script>"),
                    (e = e.removeChild(e.firstChild)))
                  : typeof o.is == "string"
                    ? (e = g.createElement(i, { is: o.is }))
                    : ((e = g.createElement(i)),
                      i === "select" &&
                        ((g = e),
                        o.multiple
                          ? (g.multiple = !0)
                          : o.size && (g.size = o.size)))
                : (e = g.createElementNS(e, i)),
              (e[Lt] = t),
              (e[Zn] = o),
              md(e, t, !1, !1),
              (t.stateNode = e));
            e: {
              switch (((g = ka(i, o)), i)) {
                case "dialog":
                  (we("cancel", e), we("close", e), (c = o));
                  break;
                case "iframe":
                case "object":
                case "embed":
                  (we("load", e), (c = o));
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < Qn.length; c++) we(Qn[c], e);
                  c = o;
                  break;
                case "source":
                  (we("error", e), (c = o));
                  break;
                case "img":
                case "image":
                case "link":
                  (we("error", e), we("load", e), (c = o));
                  break;
                case "details":
                  (we("toggle", e), (c = o));
                  break;
                case "input":
                  (Yl(e, o), (c = ga(e, o)), we("invalid", e));
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  ((e._wrapperState = { wasMultiple: !!o.multiple }),
                    (c = H({}, o, { value: void 0 })),
                    we("invalid", e));
                  break;
                case "textarea":
                  (eu(e, o), (c = wa(e, o)), we("invalid", e));
                  break;
                default:
                  c = o;
              }
              (_a(i, c), (w = c));
              for (h in w)
                if (w.hasOwnProperty(h)) {
                  var k = w[h];
                  h === "style"
                    ? au(e, k)
                    : h === "dangerouslySetInnerHTML"
                      ? ((k = k ? k.__html : void 0), k != null && su(e, k))
                      : h === "children"
                        ? typeof k == "string"
                          ? (i !== "textarea" || k !== "") && Pn(e, k)
                          : typeof k == "number" && Pn(e, "" + k)
                        : h !== "suppressContentEditableWarning" &&
                          h !== "suppressHydrationWarning" &&
                          h !== "autoFocus" &&
                          (l.hasOwnProperty(h)
                            ? k != null && h === "onScroll" && we("scroll", e)
                            : k != null && I(e, h, k, g));
                }
              switch (i) {
                case "input":
                  (Is(e), Zl(e, o, !1));
                  break;
                case "textarea":
                  (Is(e), ru(e));
                  break;
                case "option":
                  o.value != null && e.setAttribute("value", "" + fe(o.value));
                  break;
                case "select":
                  ((e.multiple = !!o.multiple),
                    (h = o.value),
                    h != null
                      ? Fr(e, !!o.multiple, h, !1)
                      : o.defaultValue != null &&
                        Fr(e, !!o.multiple, o.defaultValue, !0));
                  break;
                default:
                  typeof c.onClick == "function" && (e.onclick = si);
              }
              switch (i) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (t.flags |= 4);
          }
          t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
        }
        return (Ge(t), null);
      case 6:
        if (e && t.stateNode != null) yd(e, t, e.memoizedProps, o);
        else {
          if (typeof o != "string" && t.stateNode === null) throw Error(s(166));
          if (((i = Tr(ss.current)), Tr($t.current), di(t))) {
            if (
              ((o = t.stateNode),
              (i = t.memoizedProps),
              (o[Lt] = t),
              (h = o.nodeValue !== i) && ((e = ut), e !== null))
            )
              switch (e.tag) {
                case 3:
                  ni(o.nodeValue, i, (e.mode & 1) !== 0);
                  break;
                case 5:
                  e.memoizedProps.suppressHydrationWarning !== !0 &&
                    ni(o.nodeValue, i, (e.mode & 1) !== 0);
              }
            h && (t.flags |= 4);
          } else
            ((o = (i.nodeType === 9 ? i : i.ownerDocument).createTextNode(o)),
              (o[Lt] = t),
              (t.stateNode = o));
        }
        return (Ge(t), null);
      case 13:
        if (
          (xe(Ee),
          (o = t.memoizedState),
          e === null ||
            (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (be && ct !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
            (xc(), nn(), (t.flags |= 98560), (h = !1));
          else if (((h = di(t)), o !== null && o.dehydrated !== null)) {
            if (e === null) {
              if (!h) throw Error(s(318));
              if (
                ((h = t.memoizedState),
                (h = h !== null ? h.dehydrated : null),
                !h)
              )
                throw Error(s(317));
              h[Lt] = t;
            } else
              (nn(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (Ge(t), (h = !1));
          } else (St !== null && (Zo(St), (St = null)), (h = !0));
          if (!h) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0
          ? ((t.lanes = i), t)
          : ((o = o !== null),
            o !== (e !== null && e.memoizedState !== null) &&
              o &&
              ((t.child.flags |= 8192),
              (t.mode & 1) !== 0 &&
                (e === null || (Ee.current & 1) !== 0
                  ? $e === 0 && ($e = 3)
                  : rl())),
            t.updateQueue !== null && (t.flags |= 4),
            Ge(t),
            null);
      case 4:
        return (
          ln(),
          Fo(e, t),
          e === null && Yn(t.stateNode.containerInfo),
          Ge(t),
          null
        );
      case 10:
        return (go(t.type._context), Ge(t), null);
      case 17:
        return (tt(t.type) && ai(), Ge(t), null);
      case 19:
        if ((xe(Ee), (h = t.memoizedState), h === null)) return (Ge(t), null);
        if (((o = (t.flags & 128) !== 0), (g = h.rendering), g === null))
          if (o) us(h, !1);
          else {
            if ($e !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null; ) {
                if (((g = yi(e)), g !== null)) {
                  for (
                    t.flags |= 128,
                      us(h, !1),
                      o = g.updateQueue,
                      o !== null && ((t.updateQueue = o), (t.flags |= 4)),
                      t.subtreeFlags = 0,
                      o = i,
                      i = t.child;
                    i !== null;
                  )
                    ((h = i),
                      (e = o),
                      (h.flags &= 14680066),
                      (g = h.alternate),
                      g === null
                        ? ((h.childLanes = 0),
                          (h.lanes = e),
                          (h.child = null),
                          (h.subtreeFlags = 0),
                          (h.memoizedProps = null),
                          (h.memoizedState = null),
                          (h.updateQueue = null),
                          (h.dependencies = null),
                          (h.stateNode = null))
                        : ((h.childLanes = g.childLanes),
                          (h.lanes = g.lanes),
                          (h.child = g.child),
                          (h.subtreeFlags = 0),
                          (h.deletions = null),
                          (h.memoizedProps = g.memoizedProps),
                          (h.memoizedState = g.memoizedState),
                          (h.updateQueue = g.updateQueue),
                          (h.type = g.type),
                          (e = g.dependencies),
                          (h.dependencies =
                            e === null
                              ? null
                              : {
                                  lanes: e.lanes,
                                  firstContext: e.firstContext,
                                })),
                      (i = i.sibling));
                  return (ye(Ee, (Ee.current & 1) | 2), t.child);
                }
                e = e.sibling;
              }
            h.tail !== null &&
              Ne() > hn &&
              ((t.flags |= 128), (o = !0), us(h, !1), (t.lanes = 4194304));
          }
        else {
          if (!o)
            if (((e = yi(g)), e !== null)) {
              if (
                ((t.flags |= 128),
                (o = !0),
                (i = e.updateQueue),
                i !== null && ((t.updateQueue = i), (t.flags |= 4)),
                us(h, !0),
                h.tail === null &&
                  h.tailMode === "hidden" &&
                  !g.alternate &&
                  !be)
              )
                return (Ge(t), null);
            } else
              2 * Ne() - h.renderingStartTime > hn &&
                i !== 1073741824 &&
                ((t.flags |= 128), (o = !0), us(h, !1), (t.lanes = 4194304));
          h.isBackwards
            ? ((g.sibling = t.child), (t.child = g))
            : ((i = h.last),
              i !== null ? (i.sibling = g) : (t.child = g),
              (h.last = g));
        }
        return h.tail !== null
          ? ((t = h.tail),
            (h.rendering = t),
            (h.tail = t.sibling),
            (h.renderingStartTime = Ne()),
            (t.sibling = null),
            (i = Ee.current),
            ye(Ee, o ? (i & 1) | 2 : i & 1),
            t)
          : (Ge(t), null);
      case 22:
      case 23:
        return (
          tl(),
          (o = t.memoizedState !== null),
          e !== null && (e.memoizedState !== null) !== o && (t.flags |= 8192),
          o && (t.mode & 1) !== 0
            ? (dt & 1073741824) !== 0 &&
              (Ge(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : Ge(t),
          null
        );
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function tm(e, t) {
    switch ((uo(t), t.tag)) {
      case 1:
        return (
          tt(t.type) && ai(),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 3:
        return (
          ln(),
          xe(et),
          xe(qe),
          bo(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0
            ? ((t.flags = (e & -65537) | 128), t)
            : null
        );
      case 5:
        return (_o(t), null);
      case 13:
        if (
          (xe(Ee), (e = t.memoizedState), e !== null && e.dehydrated !== null)
        ) {
          if (t.alternate === null) throw Error(s(340));
          nn();
        }
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 19:
        return (xe(Ee), null);
      case 4:
        return (ln(), null);
      case 10:
        return (go(t.type._context), null);
      case 22:
      case 23:
        return (tl(), null);
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ji = !1,
    Je = !1,
    rm = typeof WeakSet == "function" ? WeakSet : Set,
    V = null;
  function cn(e, t) {
    var i = e.ref;
    if (i !== null)
      if (typeof i == "function")
        try {
          i(null);
        } catch (o) {
          Re(e, t, o);
        }
      else i.current = null;
  }
  function Wo(e, t, i) {
    try {
      i();
    } catch (o) {
      Re(e, t, o);
    }
  }
  var vd = !1;
  function nm(e, t) {
    if (((eo = qs), (e = Qu()), qa(e))) {
      if ("selectionStart" in e)
        var i = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          i = ((i = e.ownerDocument) && i.defaultView) || window;
          var o = i.getSelection && i.getSelection();
          if (o && o.rangeCount !== 0) {
            i = o.anchorNode;
            var c = o.anchorOffset,
              h = o.focusNode;
            o = o.focusOffset;
            try {
              (i.nodeType, h.nodeType);
            } catch {
              i = null;
              break e;
            }
            var g = 0,
              w = -1,
              k = -1,
              O = 0,
              D = 0,
              M = e,
              $ = null;
            t: for (;;) {
              for (
                var W;
                M !== i || (c !== 0 && M.nodeType !== 3) || (w = g + c),
                  M !== h || (o !== 0 && M.nodeType !== 3) || (k = g + o),
                  M.nodeType === 3 && (g += M.nodeValue.length),
                  (W = M.firstChild) !== null;
              )
                (($ = M), (M = W));
              for (;;) {
                if (M === e) break t;
                if (
                  ($ === i && ++O === c && (w = g),
                  $ === h && ++D === o && (k = g),
                  (W = M.nextSibling) !== null)
                )
                  break;
                ((M = $), ($ = M.parentNode));
              }
              M = W;
            }
            i = w === -1 || k === -1 ? null : { start: w, end: k };
          } else i = null;
        }
      i = i || { start: 0, end: 0 };
    } else i = null;
    for (
      to = { focusedElem: e, selectionRange: i }, qs = !1, V = t;
      V !== null;
    )
      if (((t = V), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
        ((e.return = t), (V = e));
      else
        for (; V !== null; ) {
          t = V;
          try {
            var q = t.alternate;
            if ((t.flags & 1024) !== 0)
              switch (t.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (q !== null) {
                    var G = q.memoizedProps,
                      Pe = q.memoizedState,
                      T = t.stateNode,
                      b = T.getSnapshotBeforeUpdate(
                        t.elementType === t.type ? G : Et(t.type, G),
                        Pe,
                      );
                    T.__reactInternalSnapshotBeforeUpdate = b;
                  }
                  break;
                case 3:
                  var P = t.stateNode.containerInfo;
                  P.nodeType === 1
                    ? (P.textContent = "")
                    : P.nodeType === 9 &&
                      P.documentElement &&
                      P.removeChild(P.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(s(163));
              }
          } catch (z) {
            Re(t, t.return, z);
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (V = e));
            break;
          }
          V = t.return;
        }
    return ((q = vd), (vd = !1), q);
  }
  function cs(e, t, i) {
    var o = t.updateQueue;
    if (((o = o !== null ? o.lastEffect : null), o !== null)) {
      var c = (o = o.next);
      do {
        if ((c.tag & e) === e) {
          var h = c.destroy;
          ((c.destroy = void 0), h !== void 0 && Wo(t, i, h));
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Ci(e, t) {
    if (
      ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
    ) {
      var i = (t = t.next);
      do {
        if ((i.tag & e) === e) {
          var o = i.create;
          i.destroy = o();
        }
        i = i.next;
      } while (i !== t);
    }
  }
  function Vo(e) {
    var t = e.ref;
    if (t !== null) {
      var i = e.stateNode;
      switch (e.tag) {
        case 5:
          e = i;
          break;
        default:
          e = i;
      }
      typeof t == "function" ? t(e) : (t.current = e);
    }
  }
  function wd(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), wd(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 &&
        ((t = e.stateNode),
        t !== null &&
          (delete t[Lt],
          delete t[Zn],
          delete t[io],
          delete t[Mp],
          delete t[zp])),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  function xd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function _d(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || xd(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Ho(e, t, i) {
    var o = e.tag;
    if (o === 5 || o === 6)
      ((e = e.stateNode),
        t
          ? i.nodeType === 8
            ? i.parentNode.insertBefore(e, t)
            : i.insertBefore(e, t)
          : (i.nodeType === 8
              ? ((t = i.parentNode), t.insertBefore(e, i))
              : ((t = i), t.appendChild(e)),
            (i = i._reactRootContainer),
            i != null || t.onclick !== null || (t.onclick = si)));
    else if (o !== 4 && ((e = e.child), e !== null))
      for (Ho(e, t, i), e = e.sibling; e !== null; )
        (Ho(e, t, i), (e = e.sibling));
  }
  function qo(e, t, i) {
    var o = e.tag;
    if (o === 5 || o === 6)
      ((e = e.stateNode), t ? i.insertBefore(e, t) : i.appendChild(e));
    else if (o !== 4 && ((e = e.child), e !== null))
      for (qo(e, t, i), e = e.sibling; e !== null; )
        (qo(e, t, i), (e = e.sibling));
  }
  var Be = null,
    jt = !1;
  function pr(e, t, i) {
    for (i = i.child; i !== null; ) (kd(e, t, i), (i = i.sibling));
  }
  function kd(e, t, i) {
    if (It && typeof It.onCommitFiberUnmount == "function")
      try {
        It.onCommitFiberUnmount(zs, i);
      } catch {}
    switch (i.tag) {
      case 5:
        Je || cn(i, t);
      case 6:
        var o = Be,
          c = jt;
        ((Be = null),
          pr(e, t, i),
          (Be = o),
          (jt = c),
          Be !== null &&
            (jt
              ? ((e = Be),
                (i = i.stateNode),
                e.nodeType === 8
                  ? e.parentNode.removeChild(i)
                  : e.removeChild(i))
              : Be.removeChild(i.stateNode)));
        break;
      case 18:
        Be !== null &&
          (jt
            ? ((e = Be),
              (i = i.stateNode),
              e.nodeType === 8
                ? so(e.parentNode, i)
                : e.nodeType === 1 && so(e, i),
              Fn(e))
            : so(Be, i.stateNode));
        break;
      case 4:
        ((o = Be),
          (c = jt),
          (Be = i.stateNode.containerInfo),
          (jt = !0),
          pr(e, t, i),
          (Be = o),
          (jt = c));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (
          !Je &&
          ((o = i.updateQueue), o !== null && ((o = o.lastEffect), o !== null))
        ) {
          c = o = o.next;
          do {
            var h = c,
              g = h.destroy;
            ((h = h.tag),
              g !== void 0 && ((h & 2) !== 0 || (h & 4) !== 0) && Wo(i, t, g),
              (c = c.next));
          } while (c !== o);
        }
        pr(e, t, i);
        break;
      case 1:
        if (
          !Je &&
          (cn(i, t),
          (o = i.stateNode),
          typeof o.componentWillUnmount == "function")
        )
          try {
            ((o.props = i.memoizedProps),
              (o.state = i.memoizedState),
              o.componentWillUnmount());
          } catch (w) {
            Re(i, t, w);
          }
        pr(e, t, i);
        break;
      case 21:
        pr(e, t, i);
        break;
      case 22:
        i.mode & 1
          ? ((Je = (o = Je) || i.memoizedState !== null), pr(e, t, i), (Je = o))
          : pr(e, t, i);
        break;
      default:
        pr(e, t, i);
    }
  }
  function bd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var i = e.stateNode;
      (i === null && (i = e.stateNode = new rm()),
        t.forEach(function (o) {
          var c = hm.bind(null, e, o);
          i.has(o) || (i.add(o), o.then(c, c));
        }));
    }
  }
  function Ct(e, t) {
    var i = t.deletions;
    if (i !== null)
      for (var o = 0; o < i.length; o++) {
        var c = i[o];
        try {
          var h = e,
            g = t,
            w = g;
          e: for (; w !== null; ) {
            switch (w.tag) {
              case 5:
                ((Be = w.stateNode), (jt = !1));
                break e;
              case 3:
                ((Be = w.stateNode.containerInfo), (jt = !0));
                break e;
              case 4:
                ((Be = w.stateNode.containerInfo), (jt = !0));
                break e;
            }
            w = w.return;
          }
          if (Be === null) throw Error(s(160));
          (kd(h, g, c), (Be = null), (jt = !1));
          var k = c.alternate;
          (k !== null && (k.return = null), (c.return = null));
        } catch (O) {
          Re(c, t, O);
        }
      }
    if (t.subtreeFlags & 12854)
      for (t = t.child; t !== null; ) (Sd(t, e), (t = t.sibling));
  }
  function Sd(e, t) {
    var i = e.alternate,
      o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if ((Ct(t, e), Dt(e), o & 4)) {
          try {
            (cs(3, e, e.return), Ci(3, e));
          } catch (G) {
            Re(e, e.return, G);
          }
          try {
            cs(5, e, e.return);
          } catch (G) {
            Re(e, e.return, G);
          }
        }
        break;
      case 1:
        (Ct(t, e), Dt(e), o & 512 && i !== null && cn(i, i.return));
        break;
      case 5:
        if (
          (Ct(t, e),
          Dt(e),
          o & 512 && i !== null && cn(i, i.return),
          e.flags & 32)
        ) {
          var c = e.stateNode;
          try {
            Pn(c, "");
          } catch (G) {
            Re(e, e.return, G);
          }
        }
        if (o & 4 && ((c = e.stateNode), c != null)) {
          var h = e.memoizedProps,
            g = i !== null ? i.memoizedProps : h,
            w = e.type,
            k = e.updateQueue;
          if (((e.updateQueue = null), k !== null))
            try {
              (w === "input" &&
                h.type === "radio" &&
                h.name != null &&
                Xl(c, h),
                ka(w, g));
              var O = ka(w, h);
              for (g = 0; g < k.length; g += 2) {
                var D = k[g],
                  M = k[g + 1];
                D === "style"
                  ? au(c, M)
                  : D === "dangerouslySetInnerHTML"
                    ? su(c, M)
                    : D === "children"
                      ? Pn(c, M)
                      : I(c, D, M, O);
              }
              switch (w) {
                case "input":
                  ya(c, h);
                  break;
                case "textarea":
                  tu(c, h);
                  break;
                case "select":
                  var $ = c._wrapperState.wasMultiple;
                  c._wrapperState.wasMultiple = !!h.multiple;
                  var W = h.value;
                  W != null
                    ? Fr(c, !!h.multiple, W, !1)
                    : $ !== !!h.multiple &&
                      (h.defaultValue != null
                        ? Fr(c, !!h.multiple, h.defaultValue, !0)
                        : Fr(c, !!h.multiple, h.multiple ? [] : "", !1));
              }
              c[Zn] = h;
            } catch (G) {
              Re(e, e.return, G);
            }
        }
        break;
      case 6:
        if ((Ct(t, e), Dt(e), o & 4)) {
          if (e.stateNode === null) throw Error(s(162));
          ((c = e.stateNode), (h = e.memoizedProps));
          try {
            c.nodeValue = h;
          } catch (G) {
            Re(e, e.return, G);
          }
        }
        break;
      case 3:
        if (
          (Ct(t, e), Dt(e), o & 4 && i !== null && i.memoizedState.isDehydrated)
        )
          try {
            Fn(t.containerInfo);
          } catch (G) {
            Re(e, e.return, G);
          }
        break;
      case 4:
        (Ct(t, e), Dt(e));
        break;
      case 13:
        (Ct(t, e),
          Dt(e),
          (c = e.child),
          c.flags & 8192 &&
            ((h = c.memoizedState !== null),
            (c.stateNode.isHidden = h),
            !h ||
              (c.alternate !== null && c.alternate.memoizedState !== null) ||
              (Jo = Ne())),
          o & 4 && bd(e));
        break;
      case 22:
        if (
          ((D = i !== null && i.memoizedState !== null),
          e.mode & 1 ? ((Je = (O = Je) || D), Ct(t, e), (Je = O)) : Ct(t, e),
          Dt(e),
          o & 8192)
        ) {
          if (
            ((O = e.memoizedState !== null),
            (e.stateNode.isHidden = O) && !D && (e.mode & 1) !== 0)
          )
            for (V = e, D = e.child; D !== null; ) {
              for (M = V = D; V !== null; ) {
                switch ((($ = V), (W = $.child), $.tag)) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    cs(4, $, $.return);
                    break;
                  case 1:
                    cn($, $.return);
                    var q = $.stateNode;
                    if (typeof q.componentWillUnmount == "function") {
                      ((o = $), (i = $.return));
                      try {
                        ((t = o),
                          (q.props = t.memoizedProps),
                          (q.state = t.memoizedState),
                          q.componentWillUnmount());
                      } catch (G) {
                        Re(o, i, G);
                      }
                    }
                    break;
                  case 5:
                    cn($, $.return);
                    break;
                  case 22:
                    if ($.memoizedState !== null) {
                      Cd(M);
                      continue;
                    }
                }
                W !== null ? ((W.return = $), (V = W)) : Cd(M);
              }
              D = D.sibling;
            }
          e: for (D = null, M = e; ; ) {
            if (M.tag === 5) {
              if (D === null) {
                D = M;
                try {
                  ((c = M.stateNode),
                    O
                      ? ((h = c.style),
                        typeof h.setProperty == "function"
                          ? h.setProperty("display", "none", "important")
                          : (h.display = "none"))
                      : ((w = M.stateNode),
                        (k = M.memoizedProps.style),
                        (g =
                          k != null && k.hasOwnProperty("display")
                            ? k.display
                            : null),
                        (w.style.display = iu("display", g))));
                } catch (G) {
                  Re(e, e.return, G);
                }
              }
            } else if (M.tag === 6) {
              if (D === null)
                try {
                  M.stateNode.nodeValue = O ? "" : M.memoizedProps;
                } catch (G) {
                  Re(e, e.return, G);
                }
            } else if (
              ((M.tag !== 22 && M.tag !== 23) ||
                M.memoizedState === null ||
                M === e) &&
              M.child !== null
            ) {
              ((M.child.return = M), (M = M.child));
              continue;
            }
            if (M === e) break e;
            for (; M.sibling === null; ) {
              if (M.return === null || M.return === e) break e;
              (D === M && (D = null), (M = M.return));
            }
            (D === M && (D = null),
              (M.sibling.return = M.return),
              (M = M.sibling));
          }
        }
        break;
      case 19:
        (Ct(t, e), Dt(e), o & 4 && bd(e));
        break;
      case 21:
        break;
      default:
        (Ct(t, e), Dt(e));
    }
  }
  function Dt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var i = e.return; i !== null; ) {
            if (xd(i)) {
              var o = i;
              break e;
            }
            i = i.return;
          }
          throw Error(s(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (Pn(c, ""), (o.flags &= -33));
            var h = _d(e);
            qo(e, h, c);
            break;
          case 3:
          case 4:
            var g = o.stateNode.containerInfo,
              w = _d(e);
            Ho(e, w, g);
            break;
          default:
            throw Error(s(161));
        }
      } catch (k) {
        Re(e, e.return, k);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function sm(e, t, i) {
    ((V = e), Ed(e));
  }
  function Ed(e, t, i) {
    for (var o = (e.mode & 1) !== 0; V !== null; ) {
      var c = V,
        h = c.child;
      if (c.tag === 22 && o) {
        var g = c.memoizedState !== null || ji;
        if (!g) {
          var w = c.alternate,
            k = (w !== null && w.memoizedState !== null) || Je;
          w = ji;
          var O = Je;
          if (((ji = g), (Je = k) && !O))
            for (V = c; V !== null; )
              ((g = V),
                (k = g.child),
                g.tag === 22 && g.memoizedState !== null
                  ? Rd(c)
                  : k !== null
                    ? ((k.return = g), (V = k))
                    : Rd(c));
          for (; h !== null; ) ((V = h), Ed(h), (h = h.sibling));
          ((V = c), (ji = w), (Je = O));
        }
        jd(e);
      } else
        (c.subtreeFlags & 8772) !== 0 && h !== null
          ? ((h.return = c), (V = h))
          : jd(e);
    }
  }
  function jd(e) {
    for (; V !== null; ) {
      var t = V;
      if ((t.flags & 8772) !== 0) {
        var i = t.alternate;
        try {
          if ((t.flags & 8772) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                Je || Ci(5, t);
                break;
              case 1:
                var o = t.stateNode;
                if (t.flags & 4 && !Je)
                  if (i === null) o.componentDidMount();
                  else {
                    var c =
                      t.elementType === t.type
                        ? i.memoizedProps
                        : Et(t.type, i.memoizedProps);
                    o.componentDidUpdate(
                      c,
                      i.memoizedState,
                      o.__reactInternalSnapshotBeforeUpdate,
                    );
                  }
                var h = t.updateQueue;
                h !== null && Cc(t, h, o);
                break;
              case 3:
                var g = t.updateQueue;
                if (g !== null) {
                  if (((i = null), t.child !== null))
                    switch (t.child.tag) {
                      case 5:
                        i = t.child.stateNode;
                        break;
                      case 1:
                        i = t.child.stateNode;
                    }
                  Cc(t, g, i);
                }
                break;
              case 5:
                var w = t.stateNode;
                if (i === null && t.flags & 4) {
                  i = w;
                  var k = t.memoizedProps;
                  switch (t.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      k.autoFocus && i.focus();
                      break;
                    case "img":
                      k.src && (i.src = k.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (t.memoizedState === null) {
                  var O = t.alternate;
                  if (O !== null) {
                    var D = O.memoizedState;
                    if (D !== null) {
                      var M = D.dehydrated;
                      M !== null && Fn(M);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(s(163));
            }
          Je || (t.flags & 512 && Vo(t));
        } catch ($) {
          Re(t, t.return, $);
        }
      }
      if (t === e) {
        V = null;
        break;
      }
      if (((i = t.sibling), i !== null)) {
        ((i.return = t.return), (V = i));
        break;
      }
      V = t.return;
    }
  }
  function Cd(e) {
    for (; V !== null; ) {
      var t = V;
      if (t === e) {
        V = null;
        break;
      }
      var i = t.sibling;
      if (i !== null) {
        ((i.return = t.return), (V = i));
        break;
      }
      V = t.return;
    }
  }
  function Rd(e) {
    for (; V !== null; ) {
      var t = V;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var i = t.return;
            try {
              Ci(4, t);
            } catch (k) {
              Re(t, i, k);
            }
            break;
          case 1:
            var o = t.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = t.return;
              try {
                o.componentDidMount();
              } catch (k) {
                Re(t, c, k);
              }
            }
            var h = t.return;
            try {
              Vo(t);
            } catch (k) {
              Re(t, h, k);
            }
            break;
          case 5:
            var g = t.return;
            try {
              Vo(t);
            } catch (k) {
              Re(t, g, k);
            }
        }
      } catch (k) {
        Re(t, t.return, k);
      }
      if (t === e) {
        V = null;
        break;
      }
      var w = t.sibling;
      if (w !== null) {
        ((w.return = t.return), (V = w));
        break;
      }
      V = t.return;
    }
  }
  var im = Math.ceil,
    Ri = B.ReactCurrentDispatcher,
    Ko = B.ReactCurrentOwner,
    xt = B.ReactCurrentBatchConfig,
    ue = 0,
    Me = null,
    Oe = null,
    Fe = 0,
    dt = 0,
    dn = ur(0),
    $e = 0,
    ds = null,
    Pr = 0,
    Ti = 0,
    Go = 0,
    hs = null,
    nt = null,
    Jo = 0,
    hn = 1 / 0,
    Yt = null,
    Ni = !1,
    Qo = null,
    mr = null,
    Pi = !1,
    gr = null,
    Oi = 0,
    fs = 0,
    Yo = null,
    Ai = -1,
    Ii = 0;
  function Ye() {
    return (ue & 6) !== 0 ? Ne() : Ai !== -1 ? Ai : (Ai = Ne());
  }
  function yr(e) {
    return (e.mode & 1) === 0
      ? 1
      : (ue & 2) !== 0 && Fe !== 0
        ? Fe & -Fe
        : Fp.transition !== null
          ? (Ii === 0 && (Ii = _u()), Ii)
          : ((e = pe),
            e !== 0 ||
              ((e = window.event), (e = e === void 0 ? 16 : Nu(e.type))),
            e);
  }
  function Rt(e, t, i, o) {
    if (50 < fs) throw ((fs = 0), (Yo = null), Error(s(185)));
    (Un(e, i, o),
      ((ue & 2) === 0 || e !== Me) &&
        (e === Me && ((ue & 2) === 0 && (Ti |= i), $e === 4 && vr(e, Fe)),
        st(e, o),
        i === 1 &&
          ue === 0 &&
          (t.mode & 1) === 0 &&
          ((hn = Ne() + 500), li && dr())));
  }
  function st(e, t) {
    var i = e.callbackNode;
    Ff(e, t);
    var o = Ws(e, e === Me ? Fe : 0);
    if (o === 0)
      (i !== null && vu(i), (e.callbackNode = null), (e.callbackPriority = 0));
    else if (((t = o & -o), e.callbackPriority !== t)) {
      if ((i != null && vu(i), t === 1))
        (e.tag === 0 ? Bp(Nd.bind(null, e)) : mc(Nd.bind(null, e)),
          Up(function () {
            (ue & 6) === 0 && dr();
          }),
          (i = null));
      else {
        switch (ku(o)) {
          case 1:
            i = Ta;
            break;
          case 4:
            i = wu;
            break;
          case 16:
            i = Ms;
            break;
          case 536870912:
            i = xu;
            break;
          default:
            i = Ms;
        }
        i = Dd(i, Td.bind(null, e));
      }
      ((e.callbackPriority = t), (e.callbackNode = i));
    }
  }
  function Td(e, t) {
    if (((Ai = -1), (Ii = 0), (ue & 6) !== 0)) throw Error(s(327));
    var i = e.callbackNode;
    if (fn() && e.callbackNode !== i) return null;
    var o = Ws(e, e === Me ? Fe : 0);
    if (o === 0) return null;
    if ((o & 30) !== 0 || (o & e.expiredLanes) !== 0 || t) t = Li(e, o);
    else {
      t = o;
      var c = ue;
      ue |= 2;
      var h = Od();
      (Me !== e || Fe !== t) && ((Yt = null), (hn = Ne() + 500), Ar(e, t));
      do
        try {
          lm();
          break;
        } catch (w) {
          Pd(e, w);
        }
      while (!0);
      (mo(),
        (Ri.current = h),
        (ue = c),
        Oe !== null ? (t = 0) : ((Me = null), (Fe = 0), (t = $e)));
    }
    if (t !== 0) {
      if (
        (t === 2 && ((c = Na(e)), c !== 0 && ((o = c), (t = Xo(e, c)))),
        t === 1)
      )
        throw ((i = ds), Ar(e, 0), vr(e, o), st(e, Ne()), i);
      if (t === 6) vr(e, o);
      else {
        if (
          ((c = e.current.alternate),
          (o & 30) === 0 &&
            !am(c) &&
            ((t = Li(e, o)),
            t === 2 && ((h = Na(e)), h !== 0 && ((o = h), (t = Xo(e, h)))),
            t === 1))
        )
          throw ((i = ds), Ar(e, 0), vr(e, o), st(e, Ne()), i);
        switch (((e.finishedWork = c), (e.finishedLanes = o), t)) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            Ir(e, nt, Yt);
            break;
          case 3:
            if (
              (vr(e, o),
              (o & 130023424) === o && ((t = Jo + 500 - Ne()), 10 < t))
            ) {
              if (Ws(e, 0) !== 0) break;
              if (((c = e.suspendedLanes), (c & o) !== o)) {
                (Ye(), (e.pingedLanes |= e.suspendedLanes & c));
                break;
              }
              e.timeoutHandle = no(Ir.bind(null, e, nt, Yt), t);
              break;
            }
            Ir(e, nt, Yt);
            break;
          case 4:
            if ((vr(e, o), (o & 4194240) === o)) break;
            for (t = e.eventTimes, c = -1; 0 < o; ) {
              var g = 31 - kt(o);
              ((h = 1 << g), (g = t[g]), g > c && (c = g), (o &= ~h));
            }
            if (
              ((o = c),
              (o = Ne() - o),
              (o =
                (120 > o
                  ? 120
                  : 480 > o
                    ? 480
                    : 1080 > o
                      ? 1080
                      : 1920 > o
                        ? 1920
                        : 3e3 > o
                          ? 3e3
                          : 4320 > o
                            ? 4320
                            : 1960 * im(o / 1960)) - o),
              10 < o)
            ) {
              e.timeoutHandle = no(Ir.bind(null, e, nt, Yt), o);
              break;
            }
            Ir(e, nt, Yt);
            break;
          case 5:
            Ir(e, nt, Yt);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return (st(e, Ne()), e.callbackNode === i ? Td.bind(null, e) : null);
  }
  function Xo(e, t) {
    var i = hs;
    return (
      e.current.memoizedState.isDehydrated && (Ar(e, t).flags |= 256),
      (e = Li(e, t)),
      e !== 2 && ((t = nt), (nt = i), t !== null && Zo(t)),
      e
    );
  }
  function Zo(e) {
    nt === null ? (nt = e) : nt.push.apply(nt, e);
  }
  function am(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var i = t.updateQueue;
        if (i !== null && ((i = i.stores), i !== null))
          for (var o = 0; o < i.length; o++) {
            var c = i[o],
              h = c.getSnapshot;
            c = c.value;
            try {
              if (!bt(h(), c)) return !1;
            } catch {
              return !1;
            }
          }
      }
      if (((i = t.child), t.subtreeFlags & 16384 && i !== null))
        ((i.return = t), (t = i));
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function vr(e, t) {
    for (
      t &= ~Go,
        t &= ~Ti,
        e.suspendedLanes |= t,
        e.pingedLanes &= ~t,
        e = e.expirationTimes;
      0 < t;
    ) {
      var i = 31 - kt(t),
        o = 1 << i;
      ((e[i] = -1), (t &= ~o));
    }
  }
  function Nd(e) {
    if ((ue & 6) !== 0) throw Error(s(327));
    fn();
    var t = Ws(e, 0);
    if ((t & 1) === 0) return (st(e, Ne()), null);
    var i = Li(e, t);
    if (e.tag !== 0 && i === 2) {
      var o = Na(e);
      o !== 0 && ((t = o), (i = Xo(e, o)));
    }
    if (i === 1) throw ((i = ds), Ar(e, 0), vr(e, t), st(e, Ne()), i);
    if (i === 6) throw Error(s(345));
    return (
      (e.finishedWork = e.current.alternate),
      (e.finishedLanes = t),
      Ir(e, nt, Yt),
      st(e, Ne()),
      null
    );
  }
  function el(e, t) {
    var i = ue;
    ue |= 1;
    try {
      return e(t);
    } finally {
      ((ue = i), ue === 0 && ((hn = Ne() + 500), li && dr()));
    }
  }
  function Or(e) {
    gr !== null && gr.tag === 0 && (ue & 6) === 0 && fn();
    var t = ue;
    ue |= 1;
    var i = xt.transition,
      o = pe;
    try {
      if (((xt.transition = null), (pe = 1), e)) return e();
    } finally {
      ((pe = o), (xt.transition = i), (ue = t), (ue & 6) === 0 && dr());
    }
  }
  function tl() {
    ((dt = dn.current), xe(dn));
  }
  function Ar(e, t) {
    ((e.finishedWork = null), (e.finishedLanes = 0));
    var i = e.timeoutHandle;
    if ((i !== -1 && ((e.timeoutHandle = -1), $p(i)), Oe !== null))
      for (i = Oe.return; i !== null; ) {
        var o = i;
        switch ((uo(o), o.tag)) {
          case 1:
            ((o = o.type.childContextTypes), o != null && ai());
            break;
          case 3:
            (ln(), xe(et), xe(qe), bo());
            break;
          case 5:
            _o(o);
            break;
          case 4:
            ln();
            break;
          case 13:
            xe(Ee);
            break;
          case 19:
            xe(Ee);
            break;
          case 10:
            go(o.type._context);
            break;
          case 22:
          case 23:
            tl();
        }
        i = i.return;
      }
    if (
      ((Me = e),
      (Oe = e = wr(e.current, null)),
      (Fe = dt = t),
      ($e = 0),
      (ds = null),
      (Go = Ti = Pr = 0),
      (nt = hs = null),
      Rr !== null)
    ) {
      for (t = 0; t < Rr.length; t++)
        if (((i = Rr[t]), (o = i.interleaved), o !== null)) {
          i.interleaved = null;
          var c = o.next,
            h = i.pending;
          if (h !== null) {
            var g = h.next;
            ((h.next = c), (o.next = g));
          }
          i.pending = o;
        }
      Rr = null;
    }
    return e;
  }
  function Pd(e, t) {
    do {
      var i = Oe;
      try {
        if ((mo(), (vi.current = ki), wi)) {
          for (var o = je.memoizedState; o !== null; ) {
            var c = o.queue;
            (c !== null && (c.pending = null), (o = o.next));
          }
          wi = !1;
        }
        if (
          ((Nr = 0),
          (De = Le = je = null),
          (is = !1),
          (as = 0),
          (Ko.current = null),
          i === null || i.return === null)
        ) {
          (($e = 1), (ds = t), (Oe = null));
          break;
        }
        e: {
          var h = e,
            g = i.return,
            w = i,
            k = t;
          if (
            ((t = Fe),
            (w.flags |= 32768),
            k !== null && typeof k == "object" && typeof k.then == "function")
          ) {
            var O = k,
              D = w,
              M = D.tag;
            if ((D.mode & 1) === 0 && (M === 0 || M === 11 || M === 15)) {
              var $ = D.alternate;
              $
                ? ((D.updateQueue = $.updateQueue),
                  (D.memoizedState = $.memoizedState),
                  (D.lanes = $.lanes))
                : ((D.updateQueue = null), (D.memoizedState = null));
            }
            var W = rd(g);
            if (W !== null) {
              ((W.flags &= -257),
                nd(W, g, w, h, t),
                W.mode & 1 && td(h, O, t),
                (t = W),
                (k = O));
              var q = t.updateQueue;
              if (q === null) {
                var G = new Set();
                (G.add(k), (t.updateQueue = G));
              } else q.add(k);
              break e;
            } else {
              if ((t & 1) === 0) {
                (td(h, O, t), rl());
                break e;
              }
              k = Error(s(426));
            }
          } else if (be && w.mode & 1) {
            var Pe = rd(g);
            if (Pe !== null) {
              ((Pe.flags & 65536) === 0 && (Pe.flags |= 256),
                nd(Pe, g, w, h, t),
                fo(un(k, w)));
              break e;
            }
          }
          ((h = k = un(k, w)),
            $e !== 4 && ($e = 2),
            hs === null ? (hs = [h]) : hs.push(h),
            (h = g));
          do {
            switch (h.tag) {
              case 3:
                ((h.flags |= 65536), (t &= -t), (h.lanes |= t));
                var T = Zc(h, k, t);
                jc(h, T);
                break e;
              case 1:
                w = k;
                var b = h.type,
                  P = h.stateNode;
                if (
                  (h.flags & 128) === 0 &&
                  (typeof b.getDerivedStateFromError == "function" ||
                    (P !== null &&
                      typeof P.componentDidCatch == "function" &&
                      (mr === null || !mr.has(P))))
                ) {
                  ((h.flags |= 65536), (t &= -t), (h.lanes |= t));
                  var z = ed(h, w, t);
                  jc(h, z);
                  break e;
                }
            }
            h = h.return;
          } while (h !== null);
        }
        Id(i);
      } catch (J) {
        ((t = J), Oe === i && i !== null && (Oe = i = i.return));
        continue;
      }
      break;
    } while (!0);
  }
  function Od() {
    var e = Ri.current;
    return ((Ri.current = ki), e === null ? ki : e);
  }
  function rl() {
    (($e === 0 || $e === 3 || $e === 2) && ($e = 4),
      Me === null ||
        ((Pr & 268435455) === 0 && (Ti & 268435455) === 0) ||
        vr(Me, Fe));
  }
  function Li(e, t) {
    var i = ue;
    ue |= 2;
    var o = Od();
    (Me !== e || Fe !== t) && ((Yt = null), Ar(e, t));
    do
      try {
        om();
        break;
      } catch (c) {
        Pd(e, c);
      }
    while (!0);
    if ((mo(), (ue = i), (Ri.current = o), Oe !== null)) throw Error(s(261));
    return ((Me = null), (Fe = 0), $e);
  }
  function om() {
    for (; Oe !== null; ) Ad(Oe);
  }
  function lm() {
    for (; Oe !== null && !Af(); ) Ad(Oe);
  }
  function Ad(e) {
    var t = Ud(e.alternate, e, dt);
    ((e.memoizedProps = e.pendingProps),
      t === null ? Id(e) : (Oe = t),
      (Ko.current = null));
  }
  function Id(e) {
    var t = e;
    do {
      var i = t.alternate;
      if (((e = t.return), (t.flags & 32768) === 0)) {
        if (((i = em(i, t, dt)), i !== null)) {
          Oe = i;
          return;
        }
      } else {
        if (((i = tm(i, t)), i !== null)) {
          ((i.flags &= 32767), (Oe = i));
          return;
        }
        if (e !== null)
          ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
        else {
          (($e = 6), (Oe = null));
          return;
        }
      }
      if (((t = t.sibling), t !== null)) {
        Oe = t;
        return;
      }
      Oe = t = e;
    } while (t !== null);
    $e === 0 && ($e = 5);
  }
  function Ir(e, t, i) {
    var o = pe,
      c = xt.transition;
    try {
      ((xt.transition = null), (pe = 1), um(e, t, i, o));
    } finally {
      ((xt.transition = c), (pe = o));
    }
    return null;
  }
  function um(e, t, i, o) {
    do fn();
    while (gr !== null);
    if ((ue & 6) !== 0) throw Error(s(327));
    i = e.finishedWork;
    var c = e.finishedLanes;
    if (i === null) return null;
    if (((e.finishedWork = null), (e.finishedLanes = 0), i === e.current))
      throw Error(s(177));
    ((e.callbackNode = null), (e.callbackPriority = 0));
    var h = i.lanes | i.childLanes;
    if (
      (Wf(e, h),
      e === Me && ((Oe = Me = null), (Fe = 0)),
      ((i.subtreeFlags & 2064) === 0 && (i.flags & 2064) === 0) ||
        Pi ||
        ((Pi = !0),
        Dd(Ms, function () {
          return (fn(), null);
        })),
      (h = (i.flags & 15990) !== 0),
      (i.subtreeFlags & 15990) !== 0 || h)
    ) {
      ((h = xt.transition), (xt.transition = null));
      var g = pe;
      pe = 1;
      var w = ue;
      ((ue |= 4),
        (Ko.current = null),
        nm(e, i),
        Sd(i, e),
        Tp(to),
        (qs = !!eo),
        (to = eo = null),
        (e.current = i),
        sm(i),
        If(),
        (ue = w),
        (pe = g),
        (xt.transition = h));
    } else e.current = i;
    if (
      (Pi && ((Pi = !1), (gr = e), (Oi = c)),
      (h = e.pendingLanes),
      h === 0 && (mr = null),
      Uf(i.stateNode),
      st(e, Ne()),
      t !== null)
    )
      for (o = e.onRecoverableError, i = 0; i < t.length; i++)
        ((c = t[i]), o(c.value, { componentStack: c.stack, digest: c.digest }));
    if (Ni) throw ((Ni = !1), (e = Qo), (Qo = null), e);
    return (
      (Oi & 1) !== 0 && e.tag !== 0 && fn(),
      (h = e.pendingLanes),
      (h & 1) !== 0 ? (e === Yo ? fs++ : ((fs = 0), (Yo = e))) : (fs = 0),
      dr(),
      null
    );
  }
  function fn() {
    if (gr !== null) {
      var e = ku(Oi),
        t = xt.transition,
        i = pe;
      try {
        if (((xt.transition = null), (pe = 16 > e ? 16 : e), gr === null))
          var o = !1;
        else {
          if (((e = gr), (gr = null), (Oi = 0), (ue & 6) !== 0))
            throw Error(s(331));
          var c = ue;
          for (ue |= 4, V = e.current; V !== null; ) {
            var h = V,
              g = h.child;
            if ((V.flags & 16) !== 0) {
              var w = h.deletions;
              if (w !== null) {
                for (var k = 0; k < w.length; k++) {
                  var O = w[k];
                  for (V = O; V !== null; ) {
                    var D = V;
                    switch (D.tag) {
                      case 0:
                      case 11:
                      case 15:
                        cs(8, D, h);
                    }
                    var M = D.child;
                    if (M !== null) ((M.return = D), (V = M));
                    else
                      for (; V !== null; ) {
                        D = V;
                        var $ = D.sibling,
                          W = D.return;
                        if ((wd(D), D === O)) {
                          V = null;
                          break;
                        }
                        if ($ !== null) {
                          (($.return = W), (V = $));
                          break;
                        }
                        V = W;
                      }
                  }
                }
                var q = h.alternate;
                if (q !== null) {
                  var G = q.child;
                  if (G !== null) {
                    q.child = null;
                    do {
                      var Pe = G.sibling;
                      ((G.sibling = null), (G = Pe));
                    } while (G !== null);
                  }
                }
                V = h;
              }
            }
            if ((h.subtreeFlags & 2064) !== 0 && g !== null)
              ((g.return = h), (V = g));
            else
              e: for (; V !== null; ) {
                if (((h = V), (h.flags & 2048) !== 0))
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      cs(9, h, h.return);
                  }
                var T = h.sibling;
                if (T !== null) {
                  ((T.return = h.return), (V = T));
                  break e;
                }
                V = h.return;
              }
          }
          var b = e.current;
          for (V = b; V !== null; ) {
            g = V;
            var P = g.child;
            if ((g.subtreeFlags & 2064) !== 0 && P !== null)
              ((P.return = g), (V = P));
            else
              e: for (g = b; V !== null; ) {
                if (((w = V), (w.flags & 2048) !== 0))
                  try {
                    switch (w.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ci(9, w);
                    }
                  } catch (J) {
                    Re(w, w.return, J);
                  }
                if (w === g) {
                  V = null;
                  break e;
                }
                var z = w.sibling;
                if (z !== null) {
                  ((z.return = w.return), (V = z));
                  break e;
                }
                V = w.return;
              }
          }
          if (
            ((ue = c),
            dr(),
            It && typeof It.onPostCommitFiberRoot == "function")
          )
            try {
              It.onPostCommitFiberRoot(zs, e);
            } catch {}
          o = !0;
        }
        return o;
      } finally {
        ((pe = i), (xt.transition = t));
      }
    }
    return !1;
  }
  function Ld(e, t, i) {
    ((t = un(i, t)),
      (t = Zc(e, t, 1)),
      (e = fr(e, t, 1)),
      (t = Ye()),
      e !== null && (Un(e, 1, t), st(e, t)));
  }
  function Re(e, t, i) {
    if (e.tag === 3) Ld(e, e, i);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Ld(t, e, i);
          break;
        } else if (t.tag === 1) {
          var o = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof o.componentDidCatch == "function" &&
              (mr === null || !mr.has(o)))
          ) {
            ((e = un(i, e)),
              (e = ed(t, e, 1)),
              (t = fr(t, e, 1)),
              (e = Ye()),
              t !== null && (Un(t, 1, e), st(t, e)));
            break;
          }
        }
        t = t.return;
      }
  }
  function cm(e, t, i) {
    var o = e.pingCache;
    (o !== null && o.delete(t),
      (t = Ye()),
      (e.pingedLanes |= e.suspendedLanes & i),
      Me === e &&
        (Fe & i) === i &&
        ($e === 4 || ($e === 3 && (Fe & 130023424) === Fe && 500 > Ne() - Jo)
          ? Ar(e, 0)
          : (Go |= i)),
      st(e, t));
  }
  function $d(e, t) {
    t === 0 &&
      ((e.mode & 1) === 0
        ? (t = 1)
        : ((t = Fs), (Fs <<= 1), (Fs & 130023424) === 0 && (Fs = 4194304)));
    var i = Ye();
    ((e = Gt(e, t)), e !== null && (Un(e, t, i), st(e, i)));
  }
  function dm(e) {
    var t = e.memoizedState,
      i = 0;
    (t !== null && (i = t.retryLane), $d(e, i));
  }
  function hm(e, t) {
    var i = 0;
    switch (e.tag) {
      case 13:
        var o = e.stateNode,
          c = e.memoizedState;
        c !== null && (i = c.retryLane);
        break;
      case 19:
        o = e.stateNode;
        break;
      default:
        throw Error(s(314));
    }
    (o !== null && o.delete(t), $d(e, i));
  }
  var Ud;
  Ud = function (e, t, i) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps || et.current) rt = !0;
      else {
        if ((e.lanes & i) === 0 && (t.flags & 128) === 0)
          return ((rt = !1), Zp(e, t, i));
        rt = (e.flags & 131072) !== 0;
      }
    else ((rt = !1), be && (t.flags & 1048576) !== 0 && gc(t, ci, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 2:
        var o = t.type;
        (Ei(e, t), (e = t.pendingProps));
        var c = en(t, qe.current);
        (on(t, i), (c = jo(null, t, o, e, c, i)));
        var h = Co();
        return (
          (t.flags |= 1),
          typeof c == "object" &&
          c !== null &&
          typeof c.render == "function" &&
          c.$$typeof === void 0
            ? ((t.tag = 1),
              (t.memoizedState = null),
              (t.updateQueue = null),
              tt(o) ? ((h = !0), oi(t)) : (h = !1),
              (t.memoizedState =
                c.state !== null && c.state !== void 0 ? c.state : null),
              wo(t),
              (c.updater = bi),
              (t.stateNode = c),
              (c._reactInternals = t),
              Ao(t, o, e, i),
              (t = Uo(null, t, o, !0, h, i)))
            : ((t.tag = 0), be && h && lo(t), Qe(null, t, c, i), (t = t.child)),
          t
        );
      case 16:
        o = t.elementType;
        e: {
          switch (
            (Ei(e, t),
            (e = t.pendingProps),
            (c = o._init),
            (o = c(o._payload)),
            (t.type = o),
            (c = t.tag = pm(o)),
            (e = Et(o, e)),
            c)
          ) {
            case 0:
              t = $o(null, t, o, e, i);
              break e;
            case 1:
              t = ud(null, t, o, e, i);
              break e;
            case 11:
              t = sd(null, t, o, e, i);
              break e;
            case 14:
              t = id(null, t, o, Et(o.type, e), i);
              break e;
          }
          throw Error(s(306, o, ""));
        }
        return t;
      case 0:
        return (
          (o = t.type),
          (c = t.pendingProps),
          (c = t.elementType === o ? c : Et(o, c)),
          $o(e, t, o, c, i)
        );
      case 1:
        return (
          (o = t.type),
          (c = t.pendingProps),
          (c = t.elementType === o ? c : Et(o, c)),
          ud(e, t, o, c, i)
        );
      case 3:
        e: {
          if ((cd(t), e === null)) throw Error(s(387));
          ((o = t.pendingProps),
            (h = t.memoizedState),
            (c = h.element),
            Ec(e, t),
            gi(t, o, null, i));
          var g = t.memoizedState;
          if (((o = g.element), h.isDehydrated))
            if (
              ((h = {
                element: o,
                isDehydrated: !1,
                cache: g.cache,
                pendingSuspenseBoundaries: g.pendingSuspenseBoundaries,
                transitions: g.transitions,
              }),
              (t.updateQueue.baseState = h),
              (t.memoizedState = h),
              t.flags & 256)
            ) {
              ((c = un(Error(s(423)), t)), (t = dd(e, t, o, i, c)));
              break e;
            } else if (o !== c) {
              ((c = un(Error(s(424)), t)), (t = dd(e, t, o, i, c)));
              break e;
            } else
              for (
                ct = lr(t.stateNode.containerInfo.firstChild),
                  ut = t,
                  be = !0,
                  St = null,
                  i = bc(t, null, o, i),
                  t.child = i;
                i;
              )
                ((i.flags = (i.flags & -3) | 4096), (i = i.sibling));
          else {
            if ((nn(), o === c)) {
              t = Qt(e, t, i);
              break e;
            }
            Qe(e, t, o, i);
          }
          t = t.child;
        }
        return t;
      case 5:
        return (
          Rc(t),
          e === null && ho(t),
          (o = t.type),
          (c = t.pendingProps),
          (h = e !== null ? e.memoizedProps : null),
          (g = c.children),
          ro(o, c) ? (g = null) : h !== null && ro(o, h) && (t.flags |= 32),
          ld(e, t),
          Qe(e, t, g, i),
          t.child
        );
      case 6:
        return (e === null && ho(t), null);
      case 13:
        return hd(e, t, i);
      case 4:
        return (
          xo(t, t.stateNode.containerInfo),
          (o = t.pendingProps),
          e === null ? (t.child = sn(t, null, o, i)) : Qe(e, t, o, i),
          t.child
        );
      case 11:
        return (
          (o = t.type),
          (c = t.pendingProps),
          (c = t.elementType === o ? c : Et(o, c)),
          sd(e, t, o, c, i)
        );
      case 7:
        return (Qe(e, t, t.pendingProps, i), t.child);
      case 8:
        return (Qe(e, t, t.pendingProps.children, i), t.child);
      case 12:
        return (Qe(e, t, t.pendingProps.children, i), t.child);
      case 10:
        e: {
          if (
            ((o = t.type._context),
            (c = t.pendingProps),
            (h = t.memoizedProps),
            (g = c.value),
            ye(fi, o._currentValue),
            (o._currentValue = g),
            h !== null)
          )
            if (bt(h.value, g)) {
              if (h.children === c.children && !et.current) {
                t = Qt(e, t, i);
                break e;
              }
            } else
              for (h = t.child, h !== null && (h.return = t); h !== null; ) {
                var w = h.dependencies;
                if (w !== null) {
                  g = h.child;
                  for (var k = w.firstContext; k !== null; ) {
                    if (k.context === o) {
                      if (h.tag === 1) {
                        ((k = Jt(-1, i & -i)), (k.tag = 2));
                        var O = h.updateQueue;
                        if (O !== null) {
                          O = O.shared;
                          var D = O.pending;
                          (D === null
                            ? (k.next = k)
                            : ((k.next = D.next), (D.next = k)),
                            (O.pending = k));
                        }
                      }
                      ((h.lanes |= i),
                        (k = h.alternate),
                        k !== null && (k.lanes |= i),
                        yo(h.return, i, t),
                        (w.lanes |= i));
                      break;
                    }
                    k = k.next;
                  }
                } else if (h.tag === 10) g = h.type === t.type ? null : h.child;
                else if (h.tag === 18) {
                  if (((g = h.return), g === null)) throw Error(s(341));
                  ((g.lanes |= i),
                    (w = g.alternate),
                    w !== null && (w.lanes |= i),
                    yo(g, i, t),
                    (g = h.sibling));
                } else g = h.child;
                if (g !== null) g.return = h;
                else
                  for (g = h; g !== null; ) {
                    if (g === t) {
                      g = null;
                      break;
                    }
                    if (((h = g.sibling), h !== null)) {
                      ((h.return = g.return), (g = h));
                      break;
                    }
                    g = g.return;
                  }
                h = g;
              }
          (Qe(e, t, c.children, i), (t = t.child));
        }
        return t;
      case 9:
        return (
          (c = t.type),
          (o = t.pendingProps.children),
          on(t, i),
          (c = vt(c)),
          (o = o(c)),
          (t.flags |= 1),
          Qe(e, t, o, i),
          t.child
        );
      case 14:
        return (
          (o = t.type),
          (c = Et(o, t.pendingProps)),
          (c = Et(o.type, c)),
          id(e, t, o, c, i)
        );
      case 15:
        return ad(e, t, t.type, t.pendingProps, i);
      case 17:
        return (
          (o = t.type),
          (c = t.pendingProps),
          (c = t.elementType === o ? c : Et(o, c)),
          Ei(e, t),
          (t.tag = 1),
          tt(o) ? ((e = !0), oi(t)) : (e = !1),
          on(t, i),
          Yc(t, o, c),
          Ao(t, o, c, i),
          Uo(null, t, o, !0, e, i)
        );
      case 19:
        return pd(e, t, i);
      case 22:
        return od(e, t, i);
    }
    throw Error(s(156, t.tag));
  };
  function Dd(e, t) {
    return yu(e, t);
  }
  function fm(e, t, i, o) {
    ((this.tag = e),
      (this.key = i),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.ref = null),
      (this.pendingProps = t),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = o),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function _t(e, t, i, o) {
    return new fm(e, t, i, o);
  }
  function nl(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function pm(e) {
    if (typeof e == "function") return nl(e) ? 1 : 0;
    if (e != null) {
      if (((e = e.$$typeof), e === mt)) return 11;
      if (e === Ie) return 14;
    }
    return 2;
  }
  function wr(e, t) {
    var i = e.alternate;
    return (
      i === null
        ? ((i = _t(e.tag, t, e.key, e.mode)),
          (i.elementType = e.elementType),
          (i.type = e.type),
          (i.stateNode = e.stateNode),
          (i.alternate = e),
          (e.alternate = i))
        : ((i.pendingProps = t),
          (i.type = e.type),
          (i.flags = 0),
          (i.subtreeFlags = 0),
          (i.deletions = null)),
      (i.flags = e.flags & 14680064),
      (i.childLanes = e.childLanes),
      (i.lanes = e.lanes),
      (i.child = e.child),
      (i.memoizedProps = e.memoizedProps),
      (i.memoizedState = e.memoizedState),
      (i.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (i.dependencies =
        t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (i.sibling = e.sibling),
      (i.index = e.index),
      (i.ref = e.ref),
      i
    );
  }
  function $i(e, t, i, o, c, h) {
    var g = 2;
    if (((o = e), typeof e == "function")) nl(e) && (g = 1);
    else if (typeof e == "string") g = 5;
    else
      e: switch (e) {
        case se:
          return Lr(i.children, c, h, t);
        case me:
          ((g = 8), (c |= 8));
          break;
        case _e:
          return (
            (e = _t(12, i, t, c | 2)),
            (e.elementType = _e),
            (e.lanes = h),
            e
          );
        case He:
          return (
            (e = _t(13, i, t, c)),
            (e.elementType = He),
            (e.lanes = h),
            e
          );
        case Xe:
          return (
            (e = _t(19, i, t, c)),
            (e.elementType = Xe),
            (e.lanes = h),
            e
          );
        case Ce:
          return Ui(i, c, h, t);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case at:
                g = 10;
                break e;
              case Wt:
                g = 9;
                break e;
              case mt:
                g = 11;
                break e;
              case Ie:
                g = 14;
                break e;
              case Ze:
                ((g = 16), (o = null));
                break e;
            }
          throw Error(s(130, e == null ? e : typeof e, ""));
      }
    return (
      (t = _t(g, i, t, c)),
      (t.elementType = e),
      (t.type = o),
      (t.lanes = h),
      t
    );
  }
  function Lr(e, t, i, o) {
    return ((e = _t(7, e, o, t)), (e.lanes = i), e);
  }
  function Ui(e, t, i, o) {
    return (
      (e = _t(22, e, o, t)),
      (e.elementType = Ce),
      (e.lanes = i),
      (e.stateNode = { isHidden: !1 }),
      e
    );
  }
  function sl(e, t, i) {
    return ((e = _t(6, e, null, t)), (e.lanes = i), e);
  }
  function il(e, t, i) {
    return (
      (t = _t(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = i),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  function mm(e, t, i, o, c) {
    ((this.tag = t),
      (this.containerInfo = e),
      (this.finishedWork =
        this.pingCache =
        this.current =
        this.pendingChildren =
          null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.pendingContext = this.context = null),
      (this.callbackPriority = 0),
      (this.eventTimes = Pa(0)),
      (this.expirationTimes = Pa(-1)),
      (this.entangledLanes =
        this.finishedLanes =
        this.mutableReadLanes =
        this.expiredLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Pa(0)),
      (this.identifierPrefix = o),
      (this.onRecoverableError = c),
      (this.mutableSourceEagerHydrationData = null));
  }
  function al(e, t, i, o, c, h, g, w, k) {
    return (
      (e = new mm(e, t, i, w, k)),
      t === 1 ? ((t = 1), h === !0 && (t |= 8)) : (t = 0),
      (h = _t(3, null, null, t)),
      (e.current = h),
      (h.stateNode = e),
      (h.memoizedState = {
        element: o,
        isDehydrated: i,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null,
      }),
      wo(h),
      e
    );
  }
  function gm(e, t, i) {
    var o =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: Y,
      key: o == null ? null : "" + o,
      children: e,
      containerInfo: t,
      implementation: i,
    };
  }
  function Md(e) {
    if (!e) return cr;
    e = e._reactInternals;
    e: {
      if (br(e) !== e || e.tag !== 1) throw Error(s(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (tt(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(s(171));
    }
    if (e.tag === 1) {
      var i = e.type;
      if (tt(i)) return fc(e, i, t);
    }
    return t;
  }
  function zd(e, t, i, o, c, h, g, w, k) {
    return (
      (e = al(i, o, !0, e, c, h, g, w, k)),
      (e.context = Md(null)),
      (i = e.current),
      (o = Ye()),
      (c = yr(i)),
      (h = Jt(o, c)),
      (h.callback = t ?? null),
      fr(i, h, c),
      (e.current.lanes = c),
      Un(e, c, o),
      st(e, o),
      e
    );
  }
  function Di(e, t, i, o) {
    var c = t.current,
      h = Ye(),
      g = yr(c);
    return (
      (i = Md(i)),
      t.context === null ? (t.context = i) : (t.pendingContext = i),
      (t = Jt(h, g)),
      (t.payload = { element: e }),
      (o = o === void 0 ? null : o),
      o !== null && (t.callback = o),
      (e = fr(c, t, g)),
      e !== null && (Rt(e, c, g, h), mi(e, c, g)),
      g
    );
  }
  function Mi(e) {
    if (((e = e.current), !e.child)) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Bd(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var i = e.retryLane;
      e.retryLane = i !== 0 && i < t ? i : t;
    }
  }
  function ol(e, t) {
    (Bd(e, t), (e = e.alternate) && Bd(e, t));
  }
  function ym() {
    return null;
  }
  var Fd =
    typeof reportError == "function"
      ? reportError
      : function (e) {
          console.error(e);
        };
  function ll(e) {
    this._internalRoot = e;
  }
  ((zi.prototype.render = ll.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(s(409));
      Di(e, t, null, null);
    }),
    (zi.prototype.unmount = ll.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (Or(function () {
            Di(null, e, null, null);
          }),
            (t[Vt] = null));
        }
      }));
  function zi(e) {
    this._internalRoot = e;
  }
  zi.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = Eu();
      e = { blockedOn: null, target: e, priority: t };
      for (var i = 0; i < ir.length && t !== 0 && t < ir[i].priority; i++);
      (ir.splice(i, 0, e), i === 0 && Ru(e));
    }
  };
  function ul(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function Bi(e) {
    return !(
      !e ||
      (e.nodeType !== 1 &&
        e.nodeType !== 9 &&
        e.nodeType !== 11 &&
        (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
    );
  }
  function Wd() {}
  function vm(e, t, i, o, c) {
    if (c) {
      if (typeof o == "function") {
        var h = o;
        o = function () {
          var O = Mi(g);
          h.call(O);
        };
      }
      var g = zd(t, o, e, 0, null, !1, !1, "", Wd);
      return (
        (e._reactRootContainer = g),
        (e[Vt] = g.current),
        Yn(e.nodeType === 8 ? e.parentNode : e),
        Or(),
        g
      );
    }
    for (; (c = e.lastChild); ) e.removeChild(c);
    if (typeof o == "function") {
      var w = o;
      o = function () {
        var O = Mi(k);
        w.call(O);
      };
    }
    var k = al(e, 0, !1, null, null, !1, !1, "", Wd);
    return (
      (e._reactRootContainer = k),
      (e[Vt] = k.current),
      Yn(e.nodeType === 8 ? e.parentNode : e),
      Or(function () {
        Di(t, k, i, o);
      }),
      k
    );
  }
  function Fi(e, t, i, o, c) {
    var h = i._reactRootContainer;
    if (h) {
      var g = h;
      if (typeof c == "function") {
        var w = c;
        c = function () {
          var k = Mi(g);
          w.call(k);
        };
      }
      Di(t, g, e, c);
    } else g = vm(i, t, e, c, o);
    return Mi(g);
  }
  ((bu = function (e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var i = $n(t.pendingLanes);
          i !== 0 &&
            (Oa(t, i | 1),
            st(t, Ne()),
            (ue & 6) === 0 && ((hn = Ne() + 500), dr()));
        }
        break;
      case 13:
        (Or(function () {
          var o = Gt(e, 1);
          if (o !== null) {
            var c = Ye();
            Rt(o, e, 1, c);
          }
        }),
          ol(e, 1));
    }
  }),
    (Aa = function (e) {
      if (e.tag === 13) {
        var t = Gt(e, 134217728);
        if (t !== null) {
          var i = Ye();
          Rt(t, e, 134217728, i);
        }
        ol(e, 134217728);
      }
    }),
    (Su = function (e) {
      if (e.tag === 13) {
        var t = yr(e),
          i = Gt(e, t);
        if (i !== null) {
          var o = Ye();
          Rt(i, e, t, o);
        }
        ol(e, t);
      }
    }),
    (Eu = function () {
      return pe;
    }),
    (ju = function (e, t) {
      var i = pe;
      try {
        return ((pe = e), t());
      } finally {
        pe = i;
      }
    }),
    (Ea = function (e, t, i) {
      switch (t) {
        case "input":
          if ((ya(e, i), (t = i.name), i.type === "radio" && t != null)) {
            for (i = e; i.parentNode; ) i = i.parentNode;
            for (
              i = i.querySelectorAll(
                "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
              ),
                t = 0;
              t < i.length;
              t++
            ) {
              var o = i[t];
              if (o !== e && o.form === e.form) {
                var c = ii(o);
                if (!c) throw Error(s(90));
                (Ql(o), ya(o, c));
              }
            }
          }
          break;
        case "textarea":
          tu(e, i);
          break;
        case "select":
          ((t = i.value), t != null && Fr(e, !!i.multiple, t, !1));
      }
    }),
    (cu = el),
    (du = Or));
  var wm = { usingClientEntryPoint: !1, Events: [es, Xr, ii, lu, uu, el] },
    ps = {
      findFiberByHostInstance: Sr,
      bundleType: 0,
      version: "18.3.1",
      rendererPackageName: "react-dom",
    },
    xm = {
      bundleType: ps.bundleType,
      version: ps.version,
      rendererPackageName: ps.rendererPackageName,
      rendererConfig: ps.rendererConfig,
      overrideHookState: null,
      overrideHookStateDeletePath: null,
      overrideHookStateRenamePath: null,
      overrideProps: null,
      overridePropsDeletePath: null,
      overridePropsRenamePath: null,
      setErrorHandler: null,
      setSuspenseHandler: null,
      scheduleUpdate: null,
      currentDispatcherRef: B.ReactCurrentDispatcher,
      findHostInstanceByFiber: function (e) {
        return ((e = mu(e)), e === null ? null : e.stateNode);
      },
      findFiberByHostInstance: ps.findFiberByHostInstance || ym,
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      getCurrentFiber: null,
      reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
    };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Wi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Wi.isDisabled && Wi.supportsFiber)
      try {
        ((zs = Wi.inject(xm)), (It = Wi));
      } catch {}
  }
  return (
    (it.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = wm),
    (it.createPortal = function (e, t) {
      var i =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!ul(t)) throw Error(s(200));
      return gm(e, t, null, i);
    }),
    (it.createRoot = function (e, t) {
      if (!ul(e)) throw Error(s(299));
      var i = !1,
        o = "",
        c = Fd;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (i = !0),
          t.identifierPrefix !== void 0 && (o = t.identifierPrefix),
          t.onRecoverableError !== void 0 && (c = t.onRecoverableError)),
        (t = al(e, 1, !1, null, null, i, !1, o, c)),
        (e[Vt] = t.current),
        Yn(e.nodeType === 8 ? e.parentNode : e),
        new ll(t)
      );
    }),
    (it.findDOMNode = function (e) {
      if (e == null) return null;
      if (e.nodeType === 1) return e;
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == "function"
          ? Error(s(188))
          : ((e = Object.keys(e).join(",")), Error(s(268, e)));
      return ((e = mu(t)), (e = e === null ? null : e.stateNode), e);
    }),
    (it.flushSync = function (e) {
      return Or(e);
    }),
    (it.hydrate = function (e, t, i) {
      if (!Bi(t)) throw Error(s(200));
      return Fi(null, e, t, !0, i);
    }),
    (it.hydrateRoot = function (e, t, i) {
      if (!ul(e)) throw Error(s(405));
      var o = (i != null && i.hydratedSources) || null,
        c = !1,
        h = "",
        g = Fd;
      if (
        (i != null &&
          (i.unstable_strictMode === !0 && (c = !0),
          i.identifierPrefix !== void 0 && (h = i.identifierPrefix),
          i.onRecoverableError !== void 0 && (g = i.onRecoverableError)),
        (t = zd(t, null, e, 1, i ?? null, c, !1, h, g)),
        (e[Vt] = t.current),
        Yn(e),
        o)
      )
        for (e = 0; e < o.length; e++)
          ((i = o[e]),
            (c = i._getVersion),
            (c = c(i._source)),
            t.mutableSourceEagerHydrationData == null
              ? (t.mutableSourceEagerHydrationData = [i, c])
              : t.mutableSourceEagerHydrationData.push(i, c));
      return new zi(t);
    }),
    (it.render = function (e, t, i) {
      if (!Bi(t)) throw Error(s(200));
      return Fi(null, e, t, !1, i);
    }),
    (it.unmountComponentAtNode = function (e) {
      if (!Bi(e)) throw Error(s(40));
      return e._reactRootContainer
        ? (Or(function () {
            Fi(null, null, e, !1, function () {
              ((e._reactRootContainer = null), (e[Vt] = null));
            });
          }),
          !0)
        : !1;
    }),
    (it.unstable_batchedUpdates = el),
    (it.unstable_renderSubtreeIntoContainer = function (e, t, i, o) {
      if (!Bi(i)) throw Error(s(200));
      if (e == null || e._reactInternals === void 0) throw Error(s(38));
      return Fi(e, t, i, !1, o);
    }),
    (it.version = "18.3.1-next-f1338f8080-20240426"),
    it
  );
}
var Yd;
function Uh() {
  if (Yd) return hl.exports;
  Yd = 1;
  function n() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (r) {
        console.error(r);
      }
  }
  return (n(), (hl.exports = Cm()), hl.exports);
}
var Xd;
function Rm() {
  if (Xd) return Vi;
  Xd = 1;
  var n = Uh();
  return ((Vi.createRoot = n.createRoot), (Vi.hydrateRoot = n.hydrateRoot), Vi);
}
var Tm = Rm();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Nm = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Dh = (...n) =>
    n
      .filter((r, s, a) => !!r && r.trim() !== "" && a.indexOf(r) === s)
      .join(" ")
      .trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var Pm = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Om = C.forwardRef(
  (
    {
      color: n = "currentColor",
      size: r = 24,
      strokeWidth: s = 2,
      absoluteStrokeWidth: a,
      className: l = "",
      children: u,
      iconNode: d,
      ...f
    },
    p,
  ) =>
    C.createElement(
      "svg",
      {
        ref: p,
        ...Pm,
        width: r,
        height: r,
        stroke: n,
        strokeWidth: a ? (Number(s) * 24) / Number(r) : s,
        className: Dh("lucide", l),
        ...f,
      },
      [
        ...d.map(([y, v]) => C.createElement(y, v)),
        ...(Array.isArray(u) ? u : [u]),
      ],
    ),
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const le = (n, r) => {
  const s = C.forwardRef(({ className: a, ...l }, u) =>
    C.createElement(Om, {
      ref: u,
      iconNode: r,
      className: Dh(`lucide-${Nm(n)}`, a),
      ...l,
    }),
  );
  return ((s.displayName = `${n}`), s);
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Am = le("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const _s = le("Baby", [
  ["path", { d: "M9 12h.01", key: "157uk2" }],
  ["path", { d: "M15 12h.01", key: "1k8ypt" }],
  ["path", { d: "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5", key: "1u7htd" }],
  [
    "path",
    {
      d: "M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1",
      key: "5yv0yz",
    },
  ],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Im = le("Bell", [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi",
    },
  ],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Mh = le("Bus", [
  ["path", { d: "M8 6v6", key: "18i7km" }],
  ["path", { d: "M15 6v6", key: "1sg6z9" }],
  ["path", { d: "M2 12h19.6", key: "de5uta" }],
  [
    "path",
    {
      d: "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",
      key: "1wwztk",
    },
  ],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }],
  ["path", { d: "M9 18h5", key: "lrx6i" }],
  ["circle", { cx: "16", cy: "18", r: "2", key: "1v4tcr" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const El = le("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const zh = le("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Lm = le("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $m = le("CircleCheckBig", [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Um = le("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bh = le("DollarSign", [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  [
    "path",
    { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" },
  ],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zd = le("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Dm = le("EyeOff", [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f",
    },
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a",
    },
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Mm = le("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0",
    },
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const zm = le("FileText", [
  [
    "path",
    {
      d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      key: "1rqfz7",
    },
  ],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zi = le("GraduationCap", [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0",
    },
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bm = le("LayoutDashboard", [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  [
    "rect",
    { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" },
  ],
  [
    "rect",
    { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" },
  ],
  [
    "rect",
    { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" },
  ],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Fh = le("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Fm = le("Loader", [
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "m16.2 7.8 2.9-2.9", key: "r700ao" }],
  ["path", { d: "M18 12h4", key: "wj9ykh" }],
  ["path", { d: "m16.2 16.2 2.9 2.9", key: "1bxg5t" }],
  ["path", { d: "M12 18v4", key: "jadmvz" }],
  ["path", { d: "m4.9 19.1 2.9-2.9", key: "bwix9q" }],
  ["path", { d: "M2 12h4", key: "j09sii" }],
  ["path", { d: "m4.9 4.9 2.9 2.9", key: "giyufr" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wm = le("Lock", [
  [
    "rect",
    {
      width: "18",
      height: "11",
      x: "3",
      y: "11",
      rx: "2",
      ry: "2",
      key: "1w4ew1",
    },
  ],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Vm = le("Mail", [
  [
    "rect",
    { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" },
  ],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Hm = le("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z",
    },
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qm = le("Menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Km = le("Phone", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5",
    },
  ],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Gm = le("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Jm = le("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f",
    },
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const jl = le("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y",
    },
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Qm = le("SkipForward", [
  ["polygon", { points: "5 4 15 12 5 20 5 4", key: "16p6eg" }],
  ["line", { x1: "19", x2: "19", y1: "5", y2: "19", key: "futhcm" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ym = le("Smartphone", [
  [
    "rect",
    {
      width: "14",
      height: "20",
      x: "5",
      y: "2",
      rx: "2",
      ry: "2",
      key: "1yt0o3",
    },
  ],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xm = le("TrendingUp", [
  ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
  ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zm = le("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq",
    },
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const eg = le("UserCheck", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["polyline", { points: "16 11 18 13 22 9", key: "1pwet4" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Cl = le("UserPlus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const oa = le("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const eh = le("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
]);
/**
 * react-router v7.13.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ var th = "popstate";
function rh(n) {
  return (
    typeof n == "object" &&
    n != null &&
    "pathname" in n &&
    "search" in n &&
    "hash" in n &&
    "state" in n &&
    "key" in n
  );
}
function tg(n = {}) {
  function r(a, l) {
    var y;
    let u = (y = l.state) == null ? void 0 : y.masked,
      { pathname: d, search: f, hash: p } = u || a.location;
    return Rl(
      "",
      { pathname: d, search: f, hash: p },
      (l.state && l.state.usr) || null,
      (l.state && l.state.key) || "default",
      u
        ? {
            pathname: a.location.pathname,
            search: a.location.search,
            hash: a.location.hash,
          }
        : void 0,
    );
  }
  function s(a, l) {
    return typeof l == "string" ? l : ks(l);
  }
  return ng(r, s, null, n);
}
function Se(n, r) {
  if (n === !1 || n === null || typeof n > "u") throw new Error(r);
}
function At(n, r) {
  if (!n) {
    typeof console < "u" && console.warn(r);
    try {
      throw new Error(r);
    } catch {}
  }
}
function rg() {
  return Math.random().toString(36).substring(2, 10);
}
function nh(n, r) {
  return {
    usr: n.state,
    key: n.key,
    idx: r,
    masked: n.unstable_mask
      ? { pathname: n.pathname, search: n.search, hash: n.hash }
      : void 0,
  };
}
function Rl(n, r, s = null, a, l) {
  return {
    pathname: typeof n == "string" ? n : n.pathname,
    search: "",
    hash: "",
    ...(typeof r == "string" ? En(r) : r),
    state: s,
    key: (r && r.key) || a || rg(),
    unstable_mask: l,
  };
}
function ks({ pathname: n = "/", search: r = "", hash: s = "" }) {
  return (
    r && r !== "?" && (n += r.charAt(0) === "?" ? r : "?" + r),
    s && s !== "#" && (n += s.charAt(0) === "#" ? s : "#" + s),
    n
  );
}
function En(n) {
  let r = {};
  if (n) {
    let s = n.indexOf("#");
    s >= 0 && ((r.hash = n.substring(s)), (n = n.substring(0, s)));
    let a = n.indexOf("?");
    (a >= 0 && ((r.search = n.substring(a)), (n = n.substring(0, a))),
      n && (r.pathname = n));
  }
  return r;
}
function ng(n, r, s, a = {}) {
  let { window: l = document.defaultView, v5Compat: u = !1 } = a,
    d = l.history,
    f = "POP",
    p = null,
    y = v();
  y == null && ((y = 0), d.replaceState({ ...d.state, idx: y }, ""));
  function v() {
    return (d.state || { idx: null }).idx;
  }
  function x() {
    f = "POP";
    let E = v(),
      A = E == null ? null : E - y;
    ((y = E), p && p({ action: f, location: j.location, delta: A }));
  }
  function _(E, A) {
    f = "PUSH";
    let L = rh(E) ? E : Rl(j.location, E, A);
    y = v() + 1;
    let I = nh(L, y),
      B = j.createHref(L.unstable_mask || L);
    try {
      d.pushState(I, "", B);
    } catch (re) {
      if (re instanceof DOMException && re.name === "DataCloneError") throw re;
      l.location.assign(B);
    }
    u && p && p({ action: f, location: j.location, delta: 1 });
  }
  function S(E, A) {
    f = "REPLACE";
    let L = rh(E) ? E : Rl(j.location, E, A);
    y = v();
    let I = nh(L, y),
      B = j.createHref(L.unstable_mask || L);
    (d.replaceState(I, "", B),
      u && p && p({ action: f, location: j.location, delta: 0 }));
  }
  function N(E) {
    return sg(E);
  }
  let j = {
    get action() {
      return f;
    },
    get location() {
      return n(l, d);
    },
    listen(E) {
      if (p) throw new Error("A history only accepts one active listener");
      return (
        l.addEventListener(th, x),
        (p = E),
        () => {
          (l.removeEventListener(th, x), (p = null));
        }
      );
    },
    createHref(E) {
      return r(l, E);
    },
    createURL: N,
    encodeLocation(E) {
      let A = N(E);
      return { pathname: A.pathname, search: A.search, hash: A.hash };
    },
    push: _,
    replace: S,
    go(E) {
      return d.go(E);
    },
  };
  return j;
}
function sg(n, r = !1) {
  let s = "http://localhost";
  (typeof window < "u" &&
    (s =
      window.location.origin !== "null"
        ? window.location.origin
        : window.location.href),
    Se(s, "No window.location.(origin|href) available to create URL"));
  let a = typeof n == "string" ? n : ks(n);
  return (
    (a = a.replace(/ $/, "%20")),
    !r && a.startsWith("//") && (a = s + a),
    new URL(a, s)
  );
}
function Wh(n, r, s = "/") {
  return ig(n, r, s, !1);
}
function ig(n, r, s, a) {
  let l = typeof r == "string" ? En(r) : r,
    u = er(l.pathname || "/", s);
  if (u == null) return null;
  let d = Vh(n);
  ag(d);
  let f = null;
  for (let p = 0; f == null && p < d.length; ++p) {
    let y = yg(u);
    f = mg(d[p], y, a);
  }
  return f;
}
function Vh(n, r = [], s = [], a = "", l = !1) {
  let u = (d, f, p = l, y) => {
    let v = {
      relativePath: y === void 0 ? d.path || "" : y,
      caseSensitive: d.caseSensitive === !0,
      childrenIndex: f,
      route: d,
    };
    if (v.relativePath.startsWith("/")) {
      if (!v.relativePath.startsWith(a) && p) return;
      (Se(
        v.relativePath.startsWith(a),
        `Absolute route path "${v.relativePath}" nested under path "${a}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`,
      ),
        (v.relativePath = v.relativePath.slice(a.length)));
    }
    let x = zt([a, v.relativePath]),
      _ = s.concat(v);
    (d.children &&
      d.children.length > 0 &&
      (Se(
        d.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${x}".`,
      ),
      Vh(d.children, r, _, x, p)),
      !(d.path == null && !d.index) &&
        r.push({ path: x, score: fg(x, d.index), routesMeta: _ }));
  };
  return (
    n.forEach((d, f) => {
      var p;
      if (d.path === "" || !((p = d.path) != null && p.includes("?"))) u(d, f);
      else for (let y of Hh(d.path)) u(d, f, !0, y);
    }),
    r
  );
}
function Hh(n) {
  let r = n.split("/");
  if (r.length === 0) return [];
  let [s, ...a] = r,
    l = s.endsWith("?"),
    u = s.replace(/\?$/, "");
  if (a.length === 0) return l ? [u, ""] : [u];
  let d = Hh(a.join("/")),
    f = [];
  return (
    f.push(...d.map((p) => (p === "" ? u : [u, p].join("/")))),
    l && f.push(...d),
    f.map((p) => (n.startsWith("/") && p === "" ? "/" : p))
  );
}
function ag(n) {
  n.sort((r, s) =>
    r.score !== s.score
      ? s.score - r.score
      : pg(
          r.routesMeta.map((a) => a.childrenIndex),
          s.routesMeta.map((a) => a.childrenIndex),
        ),
  );
}
var og = /^:[\w-]+$/,
  lg = 3,
  ug = 2,
  cg = 1,
  dg = 10,
  hg = -2,
  sh = (n) => n === "*";
function fg(n, r) {
  let s = n.split("/"),
    a = s.length;
  return (
    s.some(sh) && (a += hg),
    r && (a += ug),
    s
      .filter((l) => !sh(l))
      .reduce((l, u) => l + (og.test(u) ? lg : u === "" ? cg : dg), a)
  );
}
function pg(n, r) {
  return n.length === r.length && n.slice(0, -1).every((a, l) => a === r[l])
    ? n[n.length - 1] - r[r.length - 1]
    : 0;
}
function mg(n, r, s = !1) {
  let { routesMeta: a } = n,
    l = {},
    u = "/",
    d = [];
  for (let f = 0; f < a.length; ++f) {
    let p = a[f],
      y = f === a.length - 1,
      v = u === "/" ? r : r.slice(u.length) || "/",
      x = na(
        { path: p.relativePath, caseSensitive: p.caseSensitive, end: y },
        v,
      ),
      _ = p.route;
    if (
      (!x &&
        y &&
        s &&
        !a[a.length - 1].route.index &&
        (x = na(
          { path: p.relativePath, caseSensitive: p.caseSensitive, end: !1 },
          v,
        )),
      !x)
    )
      return null;
    (Object.assign(l, x.params),
      d.push({
        params: l,
        pathname: zt([u, x.pathname]),
        pathnameBase: _g(zt([u, x.pathnameBase])),
        route: _,
      }),
      x.pathnameBase !== "/" && (u = zt([u, x.pathnameBase])));
  }
  return d;
}
function na(n, r) {
  typeof n == "string" && (n = { path: n, caseSensitive: !1, end: !0 });
  let [s, a] = gg(n.path, n.caseSensitive, n.end),
    l = r.match(s);
  if (!l) return null;
  let u = l[0],
    d = u.replace(/(.)\/+$/, "$1"),
    f = l.slice(1);
  return {
    params: a.reduce((y, { paramName: v, isOptional: x }, _) => {
      if (v === "*") {
        let N = f[_] || "";
        d = u.slice(0, u.length - N.length).replace(/(.)\/+$/, "$1");
      }
      const S = f[_];
      return (
        x && !S ? (y[v] = void 0) : (y[v] = (S || "").replace(/%2F/g, "/")),
        y
      );
    }, {}),
    pathname: u,
    pathnameBase: d,
    pattern: n,
  };
}
function gg(n, r = !1, s = !0) {
  At(
    n === "*" || !n.endsWith("*") || n.endsWith("/*"),
    `Route path "${n}" will be treated as if it were "${n.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${n.replace(/\*$/, "/*")}".`,
  );
  let a = [],
    l =
      "^" +
      n
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(/\/:([\w-]+)(\?)?/g, (d, f, p, y, v) => {
          if ((a.push({ paramName: f, isOptional: p != null }), p)) {
            let x = v.charAt(y + d.length);
            return x && x !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
          }
          return "/([^\\/]+)";
        })
        .replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return (
    n.endsWith("*")
      ? (a.push({ paramName: "*" }),
        (l += n === "*" || n === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : s
        ? (l += "\\/*$")
        : n !== "" && n !== "/" && (l += "(?:(?=\\/|$))"),
    [new RegExp(l, r ? void 0 : "i"), a]
  );
}
function yg(n) {
  try {
    return n
      .split("/")
      .map((r) => decodeURIComponent(r).replace(/\//g, "%2F"))
      .join("/");
  } catch (r) {
    return (
      At(
        !1,
        `The URL path "${n}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${r}).`,
      ),
      n
    );
  }
}
function er(n, r) {
  if (r === "/") return n;
  if (!n.toLowerCase().startsWith(r.toLowerCase())) return null;
  let s = r.endsWith("/") ? r.length - 1 : r.length,
    a = n.charAt(s);
  return a && a !== "/" ? null : n.slice(s) || "/";
}
var vg = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function wg(n, r = "/") {
  let {
      pathname: s,
      search: a = "",
      hash: l = "",
    } = typeof n == "string" ? En(n) : n,
    u;
  return (
    s
      ? ((s = s.replace(/\/\/+/g, "/")),
        s.startsWith("/") ? (u = ih(s.substring(1), "/")) : (u = ih(s, r)))
      : (u = r),
    { pathname: u, search: kg(a), hash: bg(l) }
  );
}
function ih(n, r) {
  let s = r.replace(/\/+$/, "").split("/");
  return (
    n.split("/").forEach((l) => {
      l === ".." ? s.length > 1 && s.pop() : l !== "." && s.push(l);
    }),
    s.length > 1 ? s.join("/") : "/"
  );
}
function ml(n, r, s, a) {
  return `Cannot include a '${n}' character in a manually specified \`to.${r}\` field [${JSON.stringify(a)}].  Please separate it out to the \`to.${s}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function xg(n) {
  return n.filter(
    (r, s) => s === 0 || (r.route.path && r.route.path.length > 0),
  );
}
function Fl(n) {
  let r = xg(n);
  return r.map((s, a) => (a === r.length - 1 ? s.pathname : s.pathnameBase));
}
function la(n, r, s, a = !1) {
  let l;
  typeof n == "string"
    ? (l = En(n))
    : ((l = { ...n }),
      Se(
        !l.pathname || !l.pathname.includes("?"),
        ml("?", "pathname", "search", l),
      ),
      Se(
        !l.pathname || !l.pathname.includes("#"),
        ml("#", "pathname", "hash", l),
      ),
      Se(!l.search || !l.search.includes("#"), ml("#", "search", "hash", l)));
  let u = n === "" || l.pathname === "",
    d = u ? "/" : l.pathname,
    f;
  if (d == null) f = s;
  else {
    let x = r.length - 1;
    if (!a && d.startsWith("..")) {
      let _ = d.split("/");
      for (; _[0] === ".."; ) (_.shift(), (x -= 1));
      l.pathname = _.join("/");
    }
    f = x >= 0 ? r[x] : "/";
  }
  let p = wg(l, f),
    y = d && d !== "/" && d.endsWith("/"),
    v = (u || d === ".") && s.endsWith("/");
  return (!p.pathname.endsWith("/") && (y || v) && (p.pathname += "/"), p);
}
var zt = (n) => n.join("/").replace(/\/\/+/g, "/"),
  _g = (n) => n.replace(/\/+$/, "").replace(/^\/*/, "/"),
  kg = (n) => (!n || n === "?" ? "" : n.startsWith("?") ? n : "?" + n),
  bg = (n) => (!n || n === "#" ? "" : n.startsWith("#") ? n : "#" + n),
  Sg = class {
    constructor(n, r, s, a = !1) {
      ((this.status = n),
        (this.statusText = r || ""),
        (this.internal = a),
        s instanceof Error
          ? ((this.data = s.toString()), (this.error = s))
          : (this.data = s));
    }
  };
function Eg(n) {
  return (
    n != null &&
    typeof n.status == "number" &&
    typeof n.statusText == "string" &&
    typeof n.internal == "boolean" &&
    "data" in n
  );
}
function jg(n) {
  return (
    n
      .map((r) => r.route.path)
      .filter(Boolean)
      .join("/")
      .replace(/\/\/*/g, "/") || "/"
  );
}
var qh =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
function Kh(n, r) {
  let s = n;
  if (typeof s != "string" || !vg.test(s))
    return { absoluteURL: void 0, isExternal: !1, to: s };
  let a = s,
    l = !1;
  if (qh)
    try {
      let u = new URL(window.location.href),
        d = s.startsWith("//") ? new URL(u.protocol + s) : new URL(s),
        f = er(d.pathname, r);
      d.origin === u.origin && f != null
        ? (s = f + d.search + d.hash)
        : (l = !0);
    } catch {
      At(
        !1,
        `<Link to="${s}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
      );
    }
  return { absoluteURL: a, isExternal: l, to: s };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Gh = ["POST", "PUT", "PATCH", "DELETE"];
new Set(Gh);
var Cg = ["GET", ...Gh];
new Set(Cg);
var jn = C.createContext(null);
jn.displayName = "DataRouter";
var ua = C.createContext(null);
ua.displayName = "DataRouterState";
var Rg = C.createContext(!1),
  Jh = C.createContext({ isTransitioning: !1 });
Jh.displayName = "ViewTransition";
var Tg = C.createContext(new Map());
Tg.displayName = "Fetchers";
var Ng = C.createContext(null);
Ng.displayName = "Await";
var pt = C.createContext(null);
pt.displayName = "Navigation";
var Ps = C.createContext(null);
Ps.displayName = "Location";
var Bt = C.createContext({ outlet: null, matches: [], isDataRoute: !1 });
Bt.displayName = "Route";
var Wl = C.createContext(null);
Wl.displayName = "RouteError";
var Qh = "REACT_ROUTER_ERROR",
  Pg = "REDIRECT",
  Og = "ROUTE_ERROR_RESPONSE";
function Ag(n) {
  if (n.startsWith(`${Qh}:${Pg}:{`))
    try {
      let r = JSON.parse(n.slice(28));
      if (
        typeof r == "object" &&
        r &&
        typeof r.status == "number" &&
        typeof r.statusText == "string" &&
        typeof r.location == "string" &&
        typeof r.reloadDocument == "boolean" &&
        typeof r.replace == "boolean"
      )
        return r;
    } catch {}
}
function Ig(n) {
  if (n.startsWith(`${Qh}:${Og}:{`))
    try {
      let r = JSON.parse(n.slice(40));
      if (
        typeof r == "object" &&
        r &&
        typeof r.status == "number" &&
        typeof r.statusText == "string"
      )
        return new Sg(r.status, r.statusText, r.data);
    } catch {}
}
function Lg(n, { relative: r } = {}) {
  Se(
    Cn(),
    "useHref() may be used only in the context of a <Router> component.",
  );
  let { basename: s, navigator: a } = C.useContext(pt),
    { hash: l, pathname: u, search: d } = Os(n, { relative: r }),
    f = u;
  return (
    s !== "/" && (f = u === "/" ? s : zt([s, u])),
    a.createHref({ pathname: f, search: d, hash: l })
  );
}
function Cn() {
  return C.useContext(Ps) != null;
}
function Ft() {
  return (
    Se(
      Cn(),
      "useLocation() may be used only in the context of a <Router> component.",
    ),
    C.useContext(Ps).location
  );
}
var Yh =
  "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Xh(n) {
  C.useContext(pt).static || C.useLayoutEffect(n);
}
function Rn() {
  let { isDataRoute: n } = C.useContext(Bt);
  return n ? Gg() : $g();
}
function $g() {
  Se(
    Cn(),
    "useNavigate() may be used only in the context of a <Router> component.",
  );
  let n = C.useContext(jn),
    { basename: r, navigator: s } = C.useContext(pt),
    { matches: a } = C.useContext(Bt),
    { pathname: l } = Ft(),
    u = JSON.stringify(Fl(a)),
    d = C.useRef(!1);
  return (
    Xh(() => {
      d.current = !0;
    }),
    C.useCallback(
      (p, y = {}) => {
        if ((At(d.current, Yh), !d.current)) return;
        if (typeof p == "number") {
          s.go(p);
          return;
        }
        let v = la(p, JSON.parse(u), l, y.relative === "path");
        (n == null &&
          r !== "/" &&
          (v.pathname = v.pathname === "/" ? r : zt([r, v.pathname])),
          (y.replace ? s.replace : s.push)(v, y.state, y));
      },
      [r, s, u, l, n],
    )
  );
}
C.createContext(null);
function Os(n, { relative: r } = {}) {
  let { matches: s } = C.useContext(Bt),
    { pathname: a } = Ft(),
    l = JSON.stringify(Fl(s));
  return C.useMemo(() => la(n, JSON.parse(l), a, r === "path"), [n, l, a, r]);
}
function Ug(n, r) {
  return Zh(n, r);
}
function Zh(n, r, s) {
  var E;
  Se(
    Cn(),
    "useRoutes() may be used only in the context of a <Router> component.",
  );
  let { navigator: a } = C.useContext(pt),
    { matches: l } = C.useContext(Bt),
    u = l[l.length - 1],
    d = u ? u.params : {},
    f = u ? u.pathname : "/",
    p = u ? u.pathnameBase : "/",
    y = u && u.route;
  {
    let A = (y && y.path) || "";
    tf(
      f,
      !y || A.endsWith("*") || A.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${f}" (under <Route path="${A}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${A}"> to <Route path="${A === "/" ? "*" : `${A}/*`}">.`,
    );
  }
  let v = Ft(),
    x;
  if (r) {
    let A = typeof r == "string" ? En(r) : r;
    (Se(
      p === "/" || ((E = A.pathname) == null ? void 0 : E.startsWith(p)),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${p}" but pathname "${A.pathname}" was given in the \`location\` prop.`,
    ),
      (x = A));
  } else x = v;
  let _ = x.pathname || "/",
    S = _;
  if (p !== "/") {
    let A = p.replace(/^\//, "").split("/");
    S = "/" + _.replace(/^\//, "").split("/").slice(A.length).join("/");
  }
  let N = Wh(n, { pathname: S });
  (At(
    y || N != null,
    `No routes matched location "${x.pathname}${x.search}${x.hash}" `,
  ),
    At(
      N == null ||
        N[N.length - 1].route.element !== void 0 ||
        N[N.length - 1].route.Component !== void 0 ||
        N[N.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${x.pathname}${x.search}${x.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    ));
  let j = Fg(
    N &&
      N.map((A) =>
        Object.assign({}, A, {
          params: Object.assign({}, d, A.params),
          pathname: zt([
            p,
            a.encodeLocation
              ? a.encodeLocation(
                  A.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23"),
                ).pathname
              : A.pathname,
          ]),
          pathnameBase:
            A.pathnameBase === "/"
              ? p
              : zt([
                  p,
                  a.encodeLocation
                    ? a.encodeLocation(
                        A.pathnameBase
                          .replace(/\?/g, "%3F")
                          .replace(/#/g, "%23"),
                      ).pathname
                    : A.pathnameBase,
                ]),
        }),
      ),
    l,
    s,
  );
  return r && j
    ? C.createElement(
        Ps.Provider,
        {
          value: {
            location: {
              pathname: "/",
              search: "",
              hash: "",
              state: null,
              key: "default",
              unstable_mask: void 0,
              ...x,
            },
            navigationType: "POP",
          },
        },
        j,
      )
    : j;
}
function Dg() {
  let n = Kg(),
    r = Eg(n)
      ? `${n.status} ${n.statusText}`
      : n instanceof Error
        ? n.message
        : JSON.stringify(n),
    s = n instanceof Error ? n.stack : null,
    a = "rgba(200,200,200, 0.5)",
    l = { padding: "0.5rem", backgroundColor: a },
    u = { padding: "2px 4px", backgroundColor: a },
    d = null;
  return (
    console.error("Error handled by React Router default ErrorBoundary:", n),
    (d = C.createElement(
      C.Fragment,
      null,
      C.createElement("p", null, "💿 Hey developer 👋"),
      C.createElement(
        "p",
        null,
        "You can provide a way better UX than this when your app throws errors by providing your own ",
        C.createElement("code", { style: u }, "ErrorBoundary"),
        " or",
        " ",
        C.createElement("code", { style: u }, "errorElement"),
        " prop on your route.",
      ),
    )),
    C.createElement(
      C.Fragment,
      null,
      C.createElement("h2", null, "Unexpected Application Error!"),
      C.createElement("h3", { style: { fontStyle: "italic" } }, r),
      s ? C.createElement("pre", { style: l }, s) : null,
      d,
    )
  );
}
var Mg = C.createElement(Dg, null),
  ef = class extends C.Component {
    constructor(n) {
      (super(n),
        (this.state = {
          location: n.location,
          revalidation: n.revalidation,
          error: n.error,
        }));
    }
    static getDerivedStateFromError(n) {
      return { error: n };
    }
    static getDerivedStateFromProps(n, r) {
      return r.location !== n.location ||
        (r.revalidation !== "idle" && n.revalidation === "idle")
        ? { error: n.error, location: n.location, revalidation: n.revalidation }
        : {
            error: n.error !== void 0 ? n.error : r.error,
            location: r.location,
            revalidation: n.revalidation || r.revalidation,
          };
    }
    componentDidCatch(n, r) {
      this.props.onError
        ? this.props.onError(n, r)
        : console.error(
            "React Router caught the following error during render",
            n,
          );
    }
    render() {
      let n = this.state.error;
      if (
        this.context &&
        typeof n == "object" &&
        n &&
        "digest" in n &&
        typeof n.digest == "string"
      ) {
        const s = Ig(n.digest);
        s && (n = s);
      }
      let r =
        n !== void 0
          ? C.createElement(
              Bt.Provider,
              { value: this.props.routeContext },
              C.createElement(Wl.Provider, {
                value: n,
                children: this.props.component,
              }),
            )
          : this.props.children;
      return this.context ? C.createElement(zg, { error: n }, r) : r;
    }
  };
ef.contextType = Rg;
var gl = new WeakMap();
function zg({ children: n, error: r }) {
  let { basename: s } = C.useContext(pt);
  if (
    typeof r == "object" &&
    r &&
    "digest" in r &&
    typeof r.digest == "string"
  ) {
    let a = Ag(r.digest);
    if (a) {
      let l = gl.get(r);
      if (l) throw l;
      let u = Kh(a.location, s);
      if (qh && !gl.get(r))
        if (u.isExternal || a.reloadDocument)
          window.location.href = u.absoluteURL || u.to;
        else {
          const d = Promise.resolve().then(() =>
            window.__reactRouterDataRouter.navigate(u.to, {
              replace: a.replace,
            }),
          );
          throw (gl.set(r, d), d);
        }
      return C.createElement("meta", {
        httpEquiv: "refresh",
        content: `0;url=${u.absoluteURL || u.to}`,
      });
    }
  }
  return n;
}
function Bg({ routeContext: n, match: r, children: s }) {
  let a = C.useContext(jn);
  return (
    a &&
      a.static &&
      a.staticContext &&
      (r.route.errorElement || r.route.ErrorBoundary) &&
      (a.staticContext._deepestRenderedBoundaryId = r.route.id),
    C.createElement(Bt.Provider, { value: n }, s)
  );
}
function Fg(n, r = [], s) {
  let a = s == null ? void 0 : s.state;
  if (n == null) {
    if (!a) return null;
    if (a.errors) n = a.matches;
    else if (r.length === 0 && !a.initialized && a.matches.length > 0)
      n = a.matches;
    else return null;
  }
  let l = n,
    u = a == null ? void 0 : a.errors;
  if (u != null) {
    let v = l.findIndex(
      (x) => x.route.id && (u == null ? void 0 : u[x.route.id]) !== void 0,
    );
    (Se(
      v >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(u).join(",")}`,
    ),
      (l = l.slice(0, Math.min(l.length, v + 1))));
  }
  let d = !1,
    f = -1;
  if (s && a) {
    d = a.renderFallback;
    for (let v = 0; v < l.length; v++) {
      let x = l[v];
      if (
        ((x.route.HydrateFallback || x.route.hydrateFallbackElement) && (f = v),
        x.route.id)
      ) {
        let { loaderData: _, errors: S } = a,
          N =
            x.route.loader &&
            !_.hasOwnProperty(x.route.id) &&
            (!S || S[x.route.id] === void 0);
        if (x.route.lazy || N) {
          (s.isStatic && (d = !0),
            f >= 0 ? (l = l.slice(0, f + 1)) : (l = [l[0]]));
          break;
        }
      }
    }
  }
  let p = s == null ? void 0 : s.onError,
    y =
      a && p
        ? (v, x) => {
            var _, S;
            p(v, {
              location: a.location,
              params:
                ((S = (_ = a.matches) == null ? void 0 : _[0]) == null
                  ? void 0
                  : S.params) ?? {},
              unstable_pattern: jg(a.matches),
              errorInfo: x,
            });
          }
        : void 0;
  return l.reduceRight((v, x, _) => {
    let S,
      N = !1,
      j = null,
      E = null;
    a &&
      ((S = u && x.route.id ? u[x.route.id] : void 0),
      (j = x.route.errorElement || Mg),
      d &&
        (f < 0 && _ === 0
          ? (tf(
              "route-fallback",
              !1,
              "No `HydrateFallback` element provided to render during initial hydration",
            ),
            (N = !0),
            (E = null))
          : f === _ &&
            ((N = !0), (E = x.route.hydrateFallbackElement || null))));
    let A = r.concat(l.slice(0, _ + 1)),
      L = () => {
        let I;
        return (
          S
            ? (I = j)
            : N
              ? (I = E)
              : x.route.Component
                ? (I = C.createElement(x.route.Component, null))
                : x.route.element
                  ? (I = x.route.element)
                  : (I = v),
          C.createElement(Bg, {
            match: x,
            routeContext: { outlet: v, matches: A, isDataRoute: a != null },
            children: I,
          })
        );
      };
    return a && (x.route.ErrorBoundary || x.route.errorElement || _ === 0)
      ? C.createElement(ef, {
          location: a.location,
          revalidation: a.revalidation,
          component: j,
          error: S,
          children: L(),
          routeContext: { outlet: null, matches: A, isDataRoute: !0 },
          onError: y,
        })
      : L();
  }, null);
}
function Vl(n) {
  return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Wg(n) {
  let r = C.useContext(jn);
  return (Se(r, Vl(n)), r);
}
function Vg(n) {
  let r = C.useContext(ua);
  return (Se(r, Vl(n)), r);
}
function Hg(n) {
  let r = C.useContext(Bt);
  return (Se(r, Vl(n)), r);
}
function Hl(n) {
  let r = Hg(n),
    s = r.matches[r.matches.length - 1];
  return (
    Se(
      s.route.id,
      `${n} can only be used on routes that contain a unique "id"`,
    ),
    s.route.id
  );
}
function qg() {
  return Hl("useRouteId");
}
function Kg() {
  var a;
  let n = C.useContext(Wl),
    r = Vg("useRouteError"),
    s = Hl("useRouteError");
  return n !== void 0 ? n : (a = r.errors) == null ? void 0 : a[s];
}
function Gg() {
  let { router: n } = Wg("useNavigate"),
    r = Hl("useNavigate"),
    s = C.useRef(!1);
  return (
    Xh(() => {
      s.current = !0;
    }),
    C.useCallback(
      async (l, u = {}) => {
        (At(s.current, Yh),
          s.current &&
            (typeof l == "number"
              ? await n.navigate(l)
              : await n.navigate(l, { fromRouteId: r, ...u })));
      },
      [n, r],
    )
  );
}
var ah = {};
function tf(n, r, s) {
  !r && !ah[n] && ((ah[n] = !0), At(!1, s));
}
C.memo(Jg);
function Jg({ routes: n, future: r, state: s, isStatic: a, onError: l }) {
  return Zh(n, void 0, { state: s, isStatic: a, onError: l });
}
function oh({ to: n, replace: r, state: s, relative: a }) {
  Se(
    Cn(),
    "<Navigate> may be used only in the context of a <Router> component.",
  );
  let { static: l } = C.useContext(pt);
  At(
    !l,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.",
  );
  let { matches: u } = C.useContext(Bt),
    { pathname: d } = Ft(),
    f = Rn(),
    p = la(n, Fl(u), d, a === "path"),
    y = JSON.stringify(p);
  return (
    C.useEffect(() => {
      f(JSON.parse(y), { replace: r, state: s, relative: a });
    }, [f, y, a, r, s]),
    null
  );
}
function Xt(n) {
  Se(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.",
  );
}
function Qg({
  basename: n = "/",
  children: r = null,
  location: s,
  navigationType: a = "POP",
  navigator: l,
  static: u = !1,
  unstable_useTransitions: d,
}) {
  Se(
    !Cn(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.",
  );
  let f = n.replace(/^\/*/, "/"),
    p = C.useMemo(
      () => ({
        basename: f,
        navigator: l,
        static: u,
        unstable_useTransitions: d,
        future: {},
      }),
      [f, l, u, d],
    );
  typeof s == "string" && (s = En(s));
  let {
      pathname: y = "/",
      search: v = "",
      hash: x = "",
      state: _ = null,
      key: S = "default",
      unstable_mask: N,
    } = s,
    j = C.useMemo(() => {
      let E = er(y, f);
      return E == null
        ? null
        : {
            location: {
              pathname: E,
              search: v,
              hash: x,
              state: _,
              key: S,
              unstable_mask: N,
            },
            navigationType: a,
          };
    }, [f, y, v, x, _, S, a, N]);
  return (
    At(
      j != null,
      `<Router basename="${f}"> is not able to match the URL "${y}${v}${x}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    j == null
      ? null
      : C.createElement(
          pt.Provider,
          { value: p },
          C.createElement(Ps.Provider, { children: r, value: j }),
        )
  );
}
function Yg({ children: n, location: r }) {
  return Ug(Tl(n), r);
}
function Tl(n, r = []) {
  let s = [];
  return (
    C.Children.forEach(n, (a, l) => {
      if (!C.isValidElement(a)) return;
      let u = [...r, l];
      if (a.type === C.Fragment) {
        s.push.apply(s, Tl(a.props.children, u));
        return;
      }
      (Se(
        a.type === Xt,
        `[${typeof a.type == "string" ? a.type : a.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`,
      ),
        Se(
          !a.props.index || !a.props.children,
          "An index route cannot have child routes.",
        ));
      let d = {
        id: a.props.id || u.join("-"),
        caseSensitive: a.props.caseSensitive,
        element: a.props.element,
        Component: a.props.Component,
        index: a.props.index,
        path: a.props.path,
        middleware: a.props.middleware,
        loader: a.props.loader,
        action: a.props.action,
        hydrateFallbackElement: a.props.hydrateFallbackElement,
        HydrateFallback: a.props.HydrateFallback,
        errorElement: a.props.errorElement,
        ErrorBoundary: a.props.ErrorBoundary,
        hasErrorBoundary:
          a.props.hasErrorBoundary === !0 ||
          a.props.ErrorBoundary != null ||
          a.props.errorElement != null,
        shouldRevalidate: a.props.shouldRevalidate,
        handle: a.props.handle,
        lazy: a.props.lazy,
      };
      (a.props.children && (d.children = Tl(a.props.children, u)), s.push(d));
    }),
    s
  );
}
var ea = "get",
  ta = "application/x-www-form-urlencoded";
function ca(n) {
  return typeof HTMLElement < "u" && n instanceof HTMLElement;
}
function Xg(n) {
  return ca(n) && n.tagName.toLowerCase() === "button";
}
function Zg(n) {
  return ca(n) && n.tagName.toLowerCase() === "form";
}
function ey(n) {
  return ca(n) && n.tagName.toLowerCase() === "input";
}
function ty(n) {
  return !!(n.metaKey || n.altKey || n.ctrlKey || n.shiftKey);
}
function ry(n, r) {
  return n.button === 0 && (!r || r === "_self") && !ty(n);
}
var Hi = null;
function ny() {
  if (Hi === null)
    try {
      (new FormData(document.createElement("form"), 0), (Hi = !1));
    } catch {
      Hi = !0;
    }
  return Hi;
}
var sy = new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
]);
function yl(n) {
  return n != null && !sy.has(n)
    ? (At(
        !1,
        `"${n}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${ta}"`,
      ),
      null)
    : n;
}
function iy(n, r) {
  let s, a, l, u, d;
  if (Zg(n)) {
    let f = n.getAttribute("action");
    ((a = f ? er(f, r) : null),
      (s = n.getAttribute("method") || ea),
      (l = yl(n.getAttribute("enctype")) || ta),
      (u = new FormData(n)));
  } else if (Xg(n) || (ey(n) && (n.type === "submit" || n.type === "image"))) {
    let f = n.form;
    if (f == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>',
      );
    let p = n.getAttribute("formaction") || f.getAttribute("action");
    if (
      ((a = p ? er(p, r) : null),
      (s = n.getAttribute("formmethod") || f.getAttribute("method") || ea),
      (l =
        yl(n.getAttribute("formenctype")) ||
        yl(f.getAttribute("enctype")) ||
        ta),
      (u = new FormData(f, n)),
      !ny())
    ) {
      let { name: y, type: v, value: x } = n;
      if (v === "image") {
        let _ = y ? `${y}.` : "";
        (u.append(`${_}x`, "0"), u.append(`${_}y`, "0"));
      } else y && u.append(y, x);
    }
  } else {
    if (ca(n))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">',
      );
    ((s = ea), (a = null), (l = ta), (d = n));
  }
  return (
    u && l === "text/plain" && ((d = u), (u = void 0)),
    { action: a, method: s.toLowerCase(), encType: l, formData: u, body: d }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function ql(n, r) {
  if (n === !1 || n === null || typeof n > "u") throw new Error(r);
}
function ay(n, r, s, a) {
  let l =
    typeof n == "string"
      ? new URL(
          n,
          typeof window > "u"
            ? "server://singlefetch/"
            : window.location.origin,
        )
      : n;
  return (
    s
      ? l.pathname.endsWith("/")
        ? (l.pathname = `${l.pathname}_.${a}`)
        : (l.pathname = `${l.pathname}.${a}`)
      : l.pathname === "/"
        ? (l.pathname = `_root.${a}`)
        : r && er(l.pathname, r) === "/"
          ? (l.pathname = `${r.replace(/\/$/, "")}/_root.${a}`)
          : (l.pathname = `${l.pathname.replace(/\/$/, "")}.${a}`),
    l
  );
}
async function oy(n, r) {
  if (n.id in r) return r[n.id];
  try {
    let s = await import(n.module);
    return ((r[n.id] = s), s);
  } catch (s) {
    return (
      console.error(
        `Error loading route module \`${n.module}\`, reloading page...`,
      ),
      console.error(s),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function ly(n) {
  return n == null
    ? !1
    : n.href == null
      ? n.rel === "preload" &&
        typeof n.imageSrcSet == "string" &&
        typeof n.imageSizes == "string"
      : typeof n.rel == "string" && typeof n.href == "string";
}
async function uy(n, r, s) {
  let a = await Promise.all(
    n.map(async (l) => {
      let u = r.routes[l.route.id];
      if (u) {
        let d = await oy(u, s);
        return d.links ? d.links() : [];
      }
      return [];
    }),
  );
  return fy(
    a
      .flat(1)
      .filter(ly)
      .filter((l) => l.rel === "stylesheet" || l.rel === "preload")
      .map((l) =>
        l.rel === "stylesheet"
          ? { ...l, rel: "prefetch", as: "style" }
          : { ...l, rel: "prefetch" },
      ),
  );
}
function lh(n, r, s, a, l, u) {
  let d = (p, y) => (s[y] ? p.route.id !== s[y].route.id : !0),
    f = (p, y) => {
      var v;
      return (
        s[y].pathname !== p.pathname ||
        (((v = s[y].route.path) == null ? void 0 : v.endsWith("*")) &&
          s[y].params["*"] !== p.params["*"])
      );
    };
  return u === "assets"
    ? r.filter((p, y) => d(p, y) || f(p, y))
    : u === "data"
      ? r.filter((p, y) => {
          var x;
          let v = a.routes[p.route.id];
          if (!v || !v.hasLoader) return !1;
          if (d(p, y) || f(p, y)) return !0;
          if (p.route.shouldRevalidate) {
            let _ = p.route.shouldRevalidate({
              currentUrl: new URL(
                l.pathname + l.search + l.hash,
                window.origin,
              ),
              currentParams: ((x = s[0]) == null ? void 0 : x.params) || {},
              nextUrl: new URL(n, window.origin),
              nextParams: p.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof _ == "boolean") return _;
          }
          return !0;
        })
      : [];
}
function cy(n, r, { includeHydrateFallback: s } = {}) {
  return dy(
    n
      .map((a) => {
        let l = r.routes[a.route.id];
        if (!l) return [];
        let u = [l.module];
        return (
          l.clientActionModule && (u = u.concat(l.clientActionModule)),
          l.clientLoaderModule && (u = u.concat(l.clientLoaderModule)),
          s &&
            l.hydrateFallbackModule &&
            (u = u.concat(l.hydrateFallbackModule)),
          l.imports && (u = u.concat(l.imports)),
          u
        );
      })
      .flat(1),
  );
}
function dy(n) {
  return [...new Set(n)];
}
function hy(n) {
  let r = {},
    s = Object.keys(n).sort();
  for (let a of s) r[a] = n[a];
  return r;
}
function fy(n, r) {
  let s = new Set();
  return (
    new Set(r),
    n.reduce((a, l) => {
      let u = JSON.stringify(hy(l));
      return (s.has(u) || (s.add(u), a.push({ key: u, link: l })), a);
    }, [])
  );
}
function rf() {
  let n = C.useContext(jn);
  return (
    ql(
      n,
      "You must render this element inside a <DataRouterContext.Provider> element",
    ),
    n
  );
}
function py() {
  let n = C.useContext(ua);
  return (
    ql(
      n,
      "You must render this element inside a <DataRouterStateContext.Provider> element",
    ),
    n
  );
}
var Kl = C.createContext(void 0);
Kl.displayName = "FrameworkContext";
function nf() {
  let n = C.useContext(Kl);
  return (
    ql(n, "You must render this element inside a <HydratedRouter> element"),
    n
  );
}
function my(n, r) {
  let s = C.useContext(Kl),
    [a, l] = C.useState(!1),
    [u, d] = C.useState(!1),
    {
      onFocus: f,
      onBlur: p,
      onMouseEnter: y,
      onMouseLeave: v,
      onTouchStart: x,
    } = r,
    _ = C.useRef(null);
  (C.useEffect(() => {
    if ((n === "render" && d(!0), n === "viewport")) {
      let j = (A) => {
          A.forEach((L) => {
            d(L.isIntersecting);
          });
        },
        E = new IntersectionObserver(j, { threshold: 0.5 });
      return (
        _.current && E.observe(_.current),
        () => {
          E.disconnect();
        }
      );
    }
  }, [n]),
    C.useEffect(() => {
      if (a) {
        let j = setTimeout(() => {
          d(!0);
        }, 100);
        return () => {
          clearTimeout(j);
        };
      }
    }, [a]));
  let S = () => {
      l(!0);
    },
    N = () => {
      (l(!1), d(!1));
    };
  return s
    ? n !== "intent"
      ? [u, _, {}]
      : [
          u,
          _,
          {
            onFocus: gs(f, S),
            onBlur: gs(p, N),
            onMouseEnter: gs(y, S),
            onMouseLeave: gs(v, N),
            onTouchStart: gs(x, S),
          },
        ]
    : [!1, _, {}];
}
function gs(n, r) {
  return (s) => {
    (n && n(s), s.defaultPrevented || r(s));
  };
}
function gy({ page: n, ...r }) {
  let { router: s } = rf(),
    a = C.useMemo(() => Wh(s.routes, n, s.basename), [s.routes, n, s.basename]);
  return a ? C.createElement(vy, { page: n, matches: a, ...r }) : null;
}
function yy(n) {
  let { manifest: r, routeModules: s } = nf(),
    [a, l] = C.useState([]);
  return (
    C.useEffect(() => {
      let u = !1;
      return (
        uy(n, r, s).then((d) => {
          u || l(d);
        }),
        () => {
          u = !0;
        }
      );
    }, [n, r, s]),
    a
  );
}
function vy({ page: n, matches: r, ...s }) {
  let a = Ft(),
    { future: l, manifest: u, routeModules: d } = nf(),
    { basename: f } = rf(),
    { loaderData: p, matches: y } = py(),
    v = C.useMemo(() => lh(n, r, y, u, a, "data"), [n, r, y, u, a]),
    x = C.useMemo(() => lh(n, r, y, u, a, "assets"), [n, r, y, u, a]),
    _ = C.useMemo(() => {
      if (n === a.pathname + a.search + a.hash) return [];
      let j = new Set(),
        E = !1;
      if (
        (r.forEach((L) => {
          var B;
          let I = u.routes[L.route.id];
          !I ||
            !I.hasLoader ||
            ((!v.some((re) => re.route.id === L.route.id) &&
              L.route.id in p &&
              (B = d[L.route.id]) != null &&
              B.shouldRevalidate) ||
            I.hasClientLoader
              ? (E = !0)
              : j.add(L.route.id));
        }),
        j.size === 0)
      )
        return [];
      let A = ay(n, f, l.unstable_trailingSlashAwareDataRequests, "data");
      return (
        E &&
          j.size > 0 &&
          A.searchParams.set(
            "_routes",
            r
              .filter((L) => j.has(L.route.id))
              .map((L) => L.route.id)
              .join(","),
          ),
        [A.pathname + A.search]
      );
    }, [f, l.unstable_trailingSlashAwareDataRequests, p, a, u, v, r, n, d]),
    S = C.useMemo(() => cy(x, u), [x, u]),
    N = yy(x);
  return C.createElement(
    C.Fragment,
    null,
    _.map((j) =>
      C.createElement("link", {
        key: j,
        rel: "prefetch",
        as: "fetch",
        href: j,
        ...s,
      }),
    ),
    S.map((j) =>
      C.createElement("link", { key: j, rel: "modulepreload", href: j, ...s }),
    ),
    N.map(({ key: j, link: E }) =>
      C.createElement("link", {
        key: j,
        nonce: s.nonce,
        ...E,
        crossOrigin: E.crossOrigin ?? s.crossOrigin,
      }),
    ),
  );
}
function wy(...n) {
  return (r) => {
    n.forEach((s) => {
      typeof s == "function" ? s(r) : s != null && (s.current = r);
    });
  };
}
var xy =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
try {
  xy && (window.__reactRouterVersion = "7.13.1");
} catch {}
function _y({
  basename: n,
  children: r,
  unstable_useTransitions: s,
  window: a,
}) {
  let l = C.useRef();
  l.current == null && (l.current = tg({ window: a, v5Compat: !0 }));
  let u = l.current,
    [d, f] = C.useState({ action: u.action, location: u.location }),
    p = C.useCallback(
      (y) => {
        s === !1 ? f(y) : C.startTransition(() => f(y));
      },
      [s],
    );
  return (
    C.useLayoutEffect(() => u.listen(p), [u, p]),
    C.createElement(Qg, {
      basename: n,
      children: r,
      location: d.location,
      navigationType: d.action,
      navigator: u,
      unstable_useTransitions: s,
    })
  );
}
var sf = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  af = C.forwardRef(function (
    {
      onClick: r,
      discover: s = "render",
      prefetch: a = "none",
      relative: l,
      reloadDocument: u,
      replace: d,
      unstable_mask: f,
      state: p,
      target: y,
      to: v,
      preventScrollReset: x,
      viewTransition: _,
      unstable_defaultShouldRevalidate: S,
      ...N
    },
    j,
  ) {
    let {
        basename: E,
        navigator: A,
        unstable_useTransitions: L,
      } = C.useContext(pt),
      I = typeof v == "string" && sf.test(v),
      B = Kh(v, E);
    v = B.to;
    let re = Lg(v, { relative: l }),
      Y = Ft(),
      se = null;
    if (f) {
      let Ie = la(f, [], Y.unstable_mask ? Y.unstable_mask.pathname : "/", !0);
      (E !== "/" &&
        (Ie.pathname = Ie.pathname === "/" ? E : zt([E, Ie.pathname])),
        (se = A.createHref(Ie)));
    }
    let [me, _e, at] = my(a, N),
      Wt = Ey(v, {
        replace: d,
        unstable_mask: f,
        state: p,
        target: y,
        preventScrollReset: x,
        relative: l,
        viewTransition: _,
        unstable_defaultShouldRevalidate: S,
        unstable_useTransitions: L,
      });
    function mt(Ie) {
      (r && r(Ie), Ie.defaultPrevented || Wt(Ie));
    }
    let He = !(B.isExternal || u),
      Xe = C.createElement("a", {
        ...N,
        ...at,
        href: (He ? se : void 0) || B.absoluteURL || re,
        onClick: He ? mt : r,
        ref: wy(j, _e),
        target: y,
        "data-discover": !I && s === "render" ? "true" : void 0,
      });
    return me && !I
      ? C.createElement(C.Fragment, null, Xe, C.createElement(gy, { page: re }))
      : Xe;
  });
af.displayName = "Link";
var ky = C.forwardRef(function (
  {
    "aria-current": r = "page",
    caseSensitive: s = !1,
    className: a = "",
    end: l = !1,
    style: u,
    to: d,
    viewTransition: f,
    children: p,
    ...y
  },
  v,
) {
  let x = Os(d, { relative: y.relative }),
    _ = Ft(),
    S = C.useContext(ua),
    { navigator: N, basename: j } = C.useContext(pt),
    E = S != null && Ny(x) && f === !0,
    A = N.encodeLocation ? N.encodeLocation(x).pathname : x.pathname,
    L = _.pathname,
    I =
      S && S.navigation && S.navigation.location
        ? S.navigation.location.pathname
        : null;
  (s ||
    ((L = L.toLowerCase()),
    (I = I ? I.toLowerCase() : null),
    (A = A.toLowerCase())),
    I && j && (I = er(I, j) || I));
  const B = A !== "/" && A.endsWith("/") ? A.length - 1 : A.length;
  let re = L === A || (!l && L.startsWith(A) && L.charAt(B) === "/"),
    Y =
      I != null &&
      (I === A || (!l && I.startsWith(A) && I.charAt(A.length) === "/")),
    se = { isActive: re, isPending: Y, isTransitioning: E },
    me = re ? r : void 0,
    _e;
  typeof a == "function"
    ? (_e = a(se))
    : (_e = [
        a,
        re ? "active" : null,
        Y ? "pending" : null,
        E ? "transitioning" : null,
      ]
        .filter(Boolean)
        .join(" "));
  let at = typeof u == "function" ? u(se) : u;
  return C.createElement(
    af,
    {
      ...y,
      "aria-current": me,
      className: _e,
      ref: v,
      style: at,
      to: d,
      viewTransition: f,
    },
    typeof p == "function" ? p(se) : p,
  );
});
ky.displayName = "NavLink";
var by = C.forwardRef(
  (
    {
      discover: n = "render",
      fetcherKey: r,
      navigate: s,
      reloadDocument: a,
      replace: l,
      state: u,
      method: d = ea,
      action: f,
      onSubmit: p,
      relative: y,
      preventScrollReset: v,
      viewTransition: x,
      unstable_defaultShouldRevalidate: _,
      ...S
    },
    N,
  ) => {
    let { unstable_useTransitions: j } = C.useContext(pt),
      E = Ry(),
      A = Ty(f, { relative: y }),
      L = d.toLowerCase() === "get" ? "get" : "post",
      I = typeof f == "string" && sf.test(f),
      B = (re) => {
        if ((p && p(re), re.defaultPrevented)) return;
        re.preventDefault();
        let Y = re.nativeEvent.submitter,
          se = (Y == null ? void 0 : Y.getAttribute("formmethod")) || d,
          me = () =>
            E(Y || re.currentTarget, {
              fetcherKey: r,
              method: se,
              navigate: s,
              replace: l,
              state: u,
              relative: y,
              preventScrollReset: v,
              viewTransition: x,
              unstable_defaultShouldRevalidate: _,
            });
        j && s !== !1 ? C.startTransition(() => me()) : me();
      };
    return C.createElement("form", {
      ref: N,
      method: L,
      action: A,
      onSubmit: a ? p : B,
      ...S,
      "data-discover": !I && n === "render" ? "true" : void 0,
    });
  },
);
by.displayName = "Form";
function Sy(n) {
  return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function of(n) {
  let r = C.useContext(jn);
  return (Se(r, Sy(n)), r);
}
function Ey(
  n,
  {
    target: r,
    replace: s,
    unstable_mask: a,
    state: l,
    preventScrollReset: u,
    relative: d,
    viewTransition: f,
    unstable_defaultShouldRevalidate: p,
    unstable_useTransitions: y,
  } = {},
) {
  let v = Rn(),
    x = Ft(),
    _ = Os(n, { relative: d });
  return C.useCallback(
    (S) => {
      if (ry(S, r)) {
        S.preventDefault();
        let N = s !== void 0 ? s : ks(x) === ks(_),
          j = () =>
            v(n, {
              replace: N,
              unstable_mask: a,
              state: l,
              preventScrollReset: u,
              relative: d,
              viewTransition: f,
              unstable_defaultShouldRevalidate: p,
            });
        y ? C.startTransition(() => j()) : j();
      }
    },
    [x, v, _, s, a, l, r, n, u, d, f, p, y],
  );
}
var jy = 0,
  Cy = () => `__${String(++jy)}__`;
function Ry() {
  let { router: n } = of("useSubmit"),
    { basename: r } = C.useContext(pt),
    s = qg(),
    a = n.fetch,
    l = n.navigate;
  return C.useCallback(
    async (u, d = {}) => {
      let { action: f, method: p, encType: y, formData: v, body: x } = iy(u, r);
      if (d.navigate === !1) {
        let _ = d.fetcherKey || Cy();
        await a(_, s, d.action || f, {
          unstable_defaultShouldRevalidate: d.unstable_defaultShouldRevalidate,
          preventScrollReset: d.preventScrollReset,
          formData: v,
          body: x,
          formMethod: d.method || p,
          formEncType: d.encType || y,
          flushSync: d.flushSync,
        });
      } else
        await l(d.action || f, {
          unstable_defaultShouldRevalidate: d.unstable_defaultShouldRevalidate,
          preventScrollReset: d.preventScrollReset,
          formData: v,
          body: x,
          formMethod: d.method || p,
          formEncType: d.encType || y,
          replace: d.replace,
          state: d.state,
          fromRouteId: s,
          flushSync: d.flushSync,
          viewTransition: d.viewTransition,
        });
    },
    [a, l, r, s],
  );
}
function Ty(n, { relative: r } = {}) {
  let { basename: s } = C.useContext(pt),
    a = C.useContext(Bt);
  Se(a, "useFormAction must be used inside a RouteContext");
  let [l] = a.matches.slice(-1),
    u = { ...Os(n || ".", { relative: r }) },
    d = Ft();
  if (n == null) {
    u.search = d.search;
    let f = new URLSearchParams(u.search),
      p = f.getAll("index");
    if (p.some((v) => v === "")) {
      (f.delete("index"),
        p.filter((x) => x).forEach((x) => f.append("index", x)));
      let v = f.toString();
      u.search = v ? `?${v}` : "";
    }
  }
  return (
    (!n || n === ".") &&
      l.route.index &&
      (u.search = u.search ? u.search.replace(/^\?/, "?index&") : "?index"),
    s !== "/" && (u.pathname = u.pathname === "/" ? s : zt([s, u.pathname])),
    ks(u)
  );
}
function Ny(n, { relative: r } = {}) {
  let s = C.useContext(Jh);
  Se(
    s != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: a } = of("useViewTransitionState"),
    l = Os(n, { relative: r });
  if (!s.isTransitioning) return !1;
  let u = er(s.currentLocation.pathname, a) || s.currentLocation.pathname,
    d = er(s.nextLocation.pathname, a) || s.nextLocation.pathname;
  return na(l.pathname, d) != null || na(l.pathname, u) != null;
}
var Py = Uh();
function bs({ className: n = "w-5 h-5", ...r }) {
  return m.jsx(Fh, { className: `animate-spin ${n}`, ...r });
}
function Oy({ message: n = "Loading ChildTrack...", className: r = "" }) {
  return m.jsx("div", {
    className:
      "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-400/90 via-orange-300/90 to-rose-400/90 backdrop-blur-xl",
    children: m.jsxs("div", {
      className: `glass-card rounded-3xl p-12 text-center shadow-2xl animate-fade-scale max-w-md w-full mx-4 ${r}`,
      children: [
        m.jsx("div", {
          className:
            "w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-blue to-primary-coral rounded-3xl flex items-center justify-center shadow-xl",
          children: m.jsx(bs, { className: "w-12 h-12 text-white" }),
        }),
        m.jsx("h2", {
          className: "font-heading font-bold text-2xl text-gray-800 mb-3",
          children: "Loading Dashboard",
        }),
        m.jsx("p", { className: "text-gray-600 mb-8", children: n }),
        m.jsxs("div", {
          className:
            "flex items-center justify-center gap-3 text-sm text-gray-500",
          children: [
            m.jsx(bs, { className: "w-4 h-4" }),
            m.jsx("span", { children: "Please wait while we fetch your data" }),
          ],
        }),
      ],
    }),
  });
}
function Ay() {
  const n = Rn(),
    [r, s] = C.useState(0);
  return (
    C.useEffect(() => {
      const a = setInterval(() => {
        s((l) =>
          l >= 100
            ? (clearInterval(a), setTimeout(() => n("/login"), 300), 100)
            : l + 8,
        );
      }, 200);
      return () => clearInterval(a);
    }, [n]),
    m.jsxs("div", {
      className:
        "min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-400 via-orange-300 to-rose-400",
      children: [
        m.jsxs("div", {
          className: "w-full max-w-md mx-auto text-center mb-8",
          children: [
            m.jsx("div", {
              className: `w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-300/40 to-pink-300/40 \r
                        rounded-3xl flex items-center justify-center backdrop-blur-sm border-4 border-white/40 shadow-2xl`,
              children: m.jsx("div", {
                className:
                  "w-28 h-28 bg-gradient-to-br from-primary-blue to-primary-coral rounded-2xl flex items-center justify-center shadow-xl animate-pulse",
                children: m.jsx("span", {
                  className: "text-4xl animate-bounce",
                  children: "🌸",
                }),
              }),
            }),
            m.jsx("h1", {
              className:
                "text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-2 drop-shadow-lg",
              children: "ChildTrack",
            }),
            m.jsx("p", {
              className:
                "text-xl text-white/90 font-medium tracking-wide drop-shadow-md",
              children: "Nursery Management",
            }),
          ],
        }),
        m.jsxs("div", {
          className:
            "w-full max-w-md mx-auto glass-card rounded-2xl p-6 shadow-2xl backdrop-blur-xl",
          children: [
            m.jsxs("div", {
              className: "flex items-center justify-center gap-3 mb-6",
              children: [
                m.jsx(bs, { className: "w-8 h-8 text-primary-blue" }),
                m.jsx("span", {
                  className: "text-lg font-semibold text-gray-800",
                  children: "Initializing...",
                }),
              ],
            }),
            m.jsx("div", {
              className: "w-full bg-white/30 rounded-xl h-3 overflow-hidden",
              children: m.jsx("div", {
                className:
                  "h-full bg-gradient-to-r from-primary-blue to-primary-coral rounded-xl shadow-lg transition-all duration-500 ease-out shadow-[0_0_20px_rgba(74,144,226,0.5)]",
                style: { width: `${r}%` },
              }),
            }),
            m.jsx("p", {
              className: "text-sm text-gray-600 mt-3 text-center font-medium",
              children: r === 100 ? "Ready!" : `${r}%`,
            }),
          ],
        }),
        m.jsxs("div", {
          className: "flex gap-6 mt-12 text-xs text-white/70",
          children: [
            m.jsxs("div", {
              className: "flex items-center gap-1",
              children: [
                m.jsx("div", {
                  className:
                    "w-2 h-2 bg-accent-green rounded-full animate-pulse",
                }),
                m.jsx("span", { children: "Supabase Connected" }),
              ],
            }),
            m.jsxs("div", {
              className: "flex items-center gap-1",
              children: [
                m.jsx("div", {
                  className:
                    "w-2 h-2 bg-accent-green rounded-full animate-pulse",
                }),
                m.jsx("span", { children: "Real-time Ready" }),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
function da(n, r) {
  var s = {};
  for (var a in n)
    Object.prototype.hasOwnProperty.call(n, a) &&
      r.indexOf(a) < 0 &&
      (s[a] = n[a]);
  if (n != null && typeof Object.getOwnPropertySymbols == "function")
    for (var l = 0, a = Object.getOwnPropertySymbols(n); l < a.length; l++)
      r.indexOf(a[l]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(n, a[l]) &&
        (s[a[l]] = n[a[l]]);
  return s;
}
function Iy(n, r, s, a) {
  function l(u) {
    return u instanceof s
      ? u
      : new s(function (d) {
          d(u);
        });
  }
  return new (s || (s = Promise))(function (u, d) {
    function f(v) {
      try {
        y(a.next(v));
      } catch (x) {
        d(x);
      }
    }
    function p(v) {
      try {
        y(a.throw(v));
      } catch (x) {
        d(x);
      }
    }
    function y(v) {
      v.done ? u(v.value) : l(v.value).then(f, p);
    }
    y((a = a.apply(n, r || [])).next());
  });
}
const Ly = (n) => (n ? (...r) => n(...r) : (...r) => fetch(...r));
class Gl extends Error {
  constructor(r, s = "FunctionsError", a) {
    (super(r), (this.name = s), (this.context = a));
  }
}
class $y extends Gl {
  constructor(r) {
    super(
      "Failed to send a request to the Edge Function",
      "FunctionsFetchError",
      r,
    );
  }
}
class uh extends Gl {
  constructor(r) {
    super("Relay Error invoking the Edge Function", "FunctionsRelayError", r);
  }
}
class ch extends Gl {
  constructor(r) {
    super(
      "Edge Function returned a non-2xx status code",
      "FunctionsHttpError",
      r,
    );
  }
}
var Nl;
(function (n) {
  ((n.Any = "any"),
    (n.ApNortheast1 = "ap-northeast-1"),
    (n.ApNortheast2 = "ap-northeast-2"),
    (n.ApSouth1 = "ap-south-1"),
    (n.ApSoutheast1 = "ap-southeast-1"),
    (n.ApSoutheast2 = "ap-southeast-2"),
    (n.CaCentral1 = "ca-central-1"),
    (n.EuCentral1 = "eu-central-1"),
    (n.EuWest1 = "eu-west-1"),
    (n.EuWest2 = "eu-west-2"),
    (n.EuWest3 = "eu-west-3"),
    (n.SaEast1 = "sa-east-1"),
    (n.UsEast1 = "us-east-1"),
    (n.UsWest1 = "us-west-1"),
    (n.UsWest2 = "us-west-2"));
})(Nl || (Nl = {}));
class Uy {
  constructor(r, { headers: s = {}, customFetch: a, region: l = Nl.Any } = {}) {
    ((this.url = r),
      (this.headers = s),
      (this.region = l),
      (this.fetch = Ly(a)));
  }
  setAuth(r) {
    this.headers.Authorization = `Bearer ${r}`;
  }
  invoke(r) {
    return Iy(this, arguments, void 0, function* (s, a = {}) {
      var l;
      let u, d;
      try {
        const { headers: f, method: p, body: y, signal: v, timeout: x } = a;
        let _ = {},
          { region: S } = a;
        S || (S = this.region);
        const N = new URL(`${this.url}/${s}`);
        S &&
          S !== "any" &&
          ((_["x-region"] = S), N.searchParams.set("forceFunctionRegion", S));
        let j;
        y &&
        ((f && !Object.prototype.hasOwnProperty.call(f, "Content-Type")) || !f)
          ? (typeof Blob < "u" && y instanceof Blob) || y instanceof ArrayBuffer
            ? ((_["Content-Type"] = "application/octet-stream"), (j = y))
            : typeof y == "string"
              ? ((_["Content-Type"] = "text/plain"), (j = y))
              : typeof FormData < "u" && y instanceof FormData
                ? (j = y)
                : ((_["Content-Type"] = "application/json"),
                  (j = JSON.stringify(y)))
          : y &&
              typeof y != "string" &&
              !(typeof Blob < "u" && y instanceof Blob) &&
              !(y instanceof ArrayBuffer) &&
              !(typeof FormData < "u" && y instanceof FormData)
            ? (j = JSON.stringify(y))
            : (j = y);
        let E = v;
        x &&
          ((d = new AbortController()),
          (u = setTimeout(() => d.abort(), x)),
          v
            ? ((E = d.signal), v.addEventListener("abort", () => d.abort()))
            : (E = d.signal));
        const A = yield this.fetch(N.toString(), {
            method: p || "POST",
            headers: Object.assign(
              Object.assign(Object.assign({}, _), this.headers),
              f,
            ),
            body: j,
            signal: E,
          }).catch((re) => {
            throw new $y(re);
          }),
          L = A.headers.get("x-relay-error");
        if (L && L === "true") throw new uh(A);
        if (!A.ok) throw new ch(A);
        let I = (
            (l = A.headers.get("Content-Type")) !== null && l !== void 0
              ? l
              : "text/plain"
          )
            .split(";")[0]
            .trim(),
          B;
        return (
          I === "application/json"
            ? (B = yield A.json())
            : I === "application/octet-stream" || I === "application/pdf"
              ? (B = yield A.blob())
              : I === "text/event-stream"
                ? (B = A)
                : I === "multipart/form-data"
                  ? (B = yield A.formData())
                  : (B = yield A.text()),
          { data: B, error: null, response: A }
        );
      } catch (f) {
        return {
          data: null,
          error: f,
          response: f instanceof ch || f instanceof uh ? f.context : void 0,
        };
      } finally {
        u && clearTimeout(u);
      }
    });
  }
}
var Dy = class extends Error {
    constructor(n) {
      (super(n.message),
        (this.name = "PostgrestError"),
        (this.details = n.details),
        (this.hint = n.hint),
        (this.code = n.code));
    }
  },
  My = class {
    constructor(n) {
      var r, s, a;
      ((this.shouldThrowOnError = !1),
        (this.method = n.method),
        (this.url = n.url),
        (this.headers = new Headers(n.headers)),
        (this.schema = n.schema),
        (this.body = n.body),
        (this.shouldThrowOnError =
          (r = n.shouldThrowOnError) !== null && r !== void 0 ? r : !1),
        (this.signal = n.signal),
        (this.isMaybeSingle =
          (s = n.isMaybeSingle) !== null && s !== void 0 ? s : !1),
        (this.urlLengthLimit =
          (a = n.urlLengthLimit) !== null && a !== void 0 ? a : 8e3),
        n.fetch ? (this.fetch = n.fetch) : (this.fetch = fetch));
    }
    throwOnError() {
      return ((this.shouldThrowOnError = !0), this);
    }
    setHeader(n, r) {
      return (
        (this.headers = new Headers(this.headers)),
        this.headers.set(n, r),
        this
      );
    }
    then(n, r) {
      var s = this;
      (this.schema === void 0 ||
        (["GET", "HEAD"].includes(this.method)
          ? this.headers.set("Accept-Profile", this.schema)
          : this.headers.set("Content-Profile", this.schema)),
        this.method !== "GET" &&
          this.method !== "HEAD" &&
          this.headers.set("Content-Type", "application/json"));
      const a = this.fetch;
      let l = a(this.url.toString(), {
        method: this.method,
        headers: this.headers,
        body: JSON.stringify(this.body),
        signal: this.signal,
      }).then(async (u) => {
        let d = null,
          f = null,
          p = null,
          y = u.status,
          v = u.statusText;
        if (u.ok) {
          var x, _;
          if (s.method !== "HEAD") {
            var S;
            const A = await u.text();
            A === "" ||
              (s.headers.get("Accept") === "text/csv" ||
              (s.headers.get("Accept") &&
                !((S = s.headers.get("Accept")) === null || S === void 0) &&
                S.includes("application/vnd.pgrst.plan+text"))
                ? (f = A)
                : (f = JSON.parse(A)));
          }
          const j =
              (x = s.headers.get("Prefer")) === null || x === void 0
                ? void 0
                : x.match(/count=(exact|planned|estimated)/),
            E =
              (_ = u.headers.get("content-range")) === null || _ === void 0
                ? void 0
                : _.split("/");
          (j && E && E.length > 1 && (p = parseInt(E[1])),
            s.isMaybeSingle &&
              s.method === "GET" &&
              Array.isArray(f) &&
              (f.length > 1
                ? ((d = {
                    code: "PGRST116",
                    details: `Results contain ${f.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                    hint: null,
                    message:
                      "JSON object requested, multiple (or no) rows returned",
                  }),
                  (f = null),
                  (p = null),
                  (y = 406),
                  (v = "Not Acceptable"))
                : f.length === 1
                  ? (f = f[0])
                  : (f = null)));
        } else {
          var N;
          const j = await u.text();
          try {
            ((d = JSON.parse(j)),
              Array.isArray(d) &&
                u.status === 404 &&
                ((f = []), (d = null), (y = 200), (v = "OK")));
          } catch {
            u.status === 404 && j === ""
              ? ((y = 204), (v = "No Content"))
              : (d = { message: j });
          }
          if (
            (d &&
              s.isMaybeSingle &&
              !(d == null || (N = d.details) === null || N === void 0) &&
              N.includes("0 rows") &&
              ((d = null), (y = 200), (v = "OK")),
            d && s.shouldThrowOnError)
          )
            throw new Dy(d);
        }
        return { error: d, data: f, count: p, status: y, statusText: v };
      });
      return (
        this.shouldThrowOnError ||
          (l = l.catch((u) => {
            var d;
            let f = "",
              p = "",
              y = "";
            const v = u == null ? void 0 : u.cause;
            if (v) {
              var x, _, S, N;
              const A =
                  (x = v == null ? void 0 : v.message) !== null && x !== void 0
                    ? x
                    : "",
                L =
                  (_ = v == null ? void 0 : v.code) !== null && _ !== void 0
                    ? _
                    : "";
              ((f = `${(S = u == null ? void 0 : u.name) !== null && S !== void 0 ? S : "FetchError"}: ${u == null ? void 0 : u.message}`),
                (f += `

Caused by: ${(N = v == null ? void 0 : v.name) !== null && N !== void 0 ? N : "Error"}: ${A}`),
                L && (f += ` (${L})`),
                v != null &&
                  v.stack &&
                  (f += `
${v.stack}`));
            } else {
              var j;
              f =
                (j = u == null ? void 0 : u.stack) !== null && j !== void 0
                  ? j
                  : "";
            }
            const E = this.url.toString().length;
            return (
              (u == null ? void 0 : u.name) === "AbortError" ||
              (u == null ? void 0 : u.code) === "ABORT_ERR"
                ? ((y = ""),
                  (p = "Request was aborted (timeout or manual cancellation)"),
                  E > this.urlLengthLimit &&
                    (p += `. Note: Your request URL is ${E} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`))
                : ((v == null ? void 0 : v.name) === "HeadersOverflowError" ||
                    (v == null ? void 0 : v.code) ===
                      "UND_ERR_HEADERS_OVERFLOW") &&
                  ((y = ""),
                  (p = "HTTP headers exceeded server limits (typically 16KB)"),
                  E > this.urlLengthLimit &&
                    (p += `. Your request URL is ${E} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)),
              {
                error: {
                  message: `${(d = u == null ? void 0 : u.name) !== null && d !== void 0 ? d : "FetchError"}: ${u == null ? void 0 : u.message}`,
                  details: f,
                  hint: p,
                  code: y,
                },
                data: null,
                count: null,
                status: 0,
                statusText: "",
              }
            );
          })),
        l.then(n, r)
      );
    }
    returns() {
      return this;
    }
    overrideTypes() {
      return this;
    }
  },
  zy = class extends My {
    select(n) {
      let r = !1;
      const s = (n ?? "*")
        .split("")
        .map((a) => (/\s/.test(a) && !r ? "" : (a === '"' && (r = !r), a)))
        .join("");
      return (
        this.url.searchParams.set("select", s),
        this.headers.append("Prefer", "return=representation"),
        this
      );
    }
    order(
      n,
      {
        ascending: r = !0,
        nullsFirst: s,
        foreignTable: a,
        referencedTable: l = a,
      } = {},
    ) {
      const u = l ? `${l}.order` : "order",
        d = this.url.searchParams.get(u);
      return (
        this.url.searchParams.set(
          u,
          `${d ? `${d},` : ""}${n}.${r ? "asc" : "desc"}${s === void 0 ? "" : s ? ".nullsfirst" : ".nullslast"}`,
        ),
        this
      );
    }
    limit(n, { foreignTable: r, referencedTable: s = r } = {}) {
      const a = typeof s > "u" ? "limit" : `${s}.limit`;
      return (this.url.searchParams.set(a, `${n}`), this);
    }
    range(n, r, { foreignTable: s, referencedTable: a = s } = {}) {
      const l = typeof a > "u" ? "offset" : `${a}.offset`,
        u = typeof a > "u" ? "limit" : `${a}.limit`;
      return (
        this.url.searchParams.set(l, `${n}`),
        this.url.searchParams.set(u, `${r - n + 1}`),
        this
      );
    }
    abortSignal(n) {
      return ((this.signal = n), this);
    }
    single() {
      return (
        this.headers.set("Accept", "application/vnd.pgrst.object+json"),
        this
      );
    }
    maybeSingle() {
      return (
        this.method === "GET"
          ? this.headers.set("Accept", "application/json")
          : this.headers.set("Accept", "application/vnd.pgrst.object+json"),
        (this.isMaybeSingle = !0),
        this
      );
    }
    csv() {
      return (this.headers.set("Accept", "text/csv"), this);
    }
    geojson() {
      return (this.headers.set("Accept", "application/geo+json"), this);
    }
    explain({
      analyze: n = !1,
      verbose: r = !1,
      settings: s = !1,
      buffers: a = !1,
      wal: l = !1,
      format: u = "text",
    } = {}) {
      var d;
      const f = [
          n ? "analyze" : null,
          r ? "verbose" : null,
          s ? "settings" : null,
          a ? "buffers" : null,
          l ? "wal" : null,
        ]
          .filter(Boolean)
          .join("|"),
        p =
          (d = this.headers.get("Accept")) !== null && d !== void 0
            ? d
            : "application/json";
      return (
        this.headers.set(
          "Accept",
          `application/vnd.pgrst.plan+${u}; for="${p}"; options=${f};`,
        ),
        u === "json" ? this : this
      );
    }
    rollback() {
      return (this.headers.append("Prefer", "tx=rollback"), this);
    }
    returns() {
      return this;
    }
    maxAffected(n) {
      return (
        this.headers.append("Prefer", "handling=strict"),
        this.headers.append("Prefer", `max-affected=${n}`),
        this
      );
    }
  };
const dh = new RegExp("[,()]");
var xn = class extends zy {
    eq(n, r) {
      return (this.url.searchParams.append(n, `eq.${r}`), this);
    }
    neq(n, r) {
      return (this.url.searchParams.append(n, `neq.${r}`), this);
    }
    gt(n, r) {
      return (this.url.searchParams.append(n, `gt.${r}`), this);
    }
    gte(n, r) {
      return (this.url.searchParams.append(n, `gte.${r}`), this);
    }
    lt(n, r) {
      return (this.url.searchParams.append(n, `lt.${r}`), this);
    }
    lte(n, r) {
      return (this.url.searchParams.append(n, `lte.${r}`), this);
    }
    like(n, r) {
      return (this.url.searchParams.append(n, `like.${r}`), this);
    }
    likeAllOf(n, r) {
      return (
        this.url.searchParams.append(n, `like(all).{${r.join(",")}}`),
        this
      );
    }
    likeAnyOf(n, r) {
      return (
        this.url.searchParams.append(n, `like(any).{${r.join(",")}}`),
        this
      );
    }
    ilike(n, r) {
      return (this.url.searchParams.append(n, `ilike.${r}`), this);
    }
    ilikeAllOf(n, r) {
      return (
        this.url.searchParams.append(n, `ilike(all).{${r.join(",")}}`),
        this
      );
    }
    ilikeAnyOf(n, r) {
      return (
        this.url.searchParams.append(n, `ilike(any).{${r.join(",")}}`),
        this
      );
    }
    regexMatch(n, r) {
      return (this.url.searchParams.append(n, `match.${r}`), this);
    }
    regexIMatch(n, r) {
      return (this.url.searchParams.append(n, `imatch.${r}`), this);
    }
    is(n, r) {
      return (this.url.searchParams.append(n, `is.${r}`), this);
    }
    isDistinct(n, r) {
      return (this.url.searchParams.append(n, `isdistinct.${r}`), this);
    }
    in(n, r) {
      const s = Array.from(new Set(r))
        .map((a) => (typeof a == "string" && dh.test(a) ? `"${a}"` : `${a}`))
        .join(",");
      return (this.url.searchParams.append(n, `in.(${s})`), this);
    }
    notIn(n, r) {
      const s = Array.from(new Set(r))
        .map((a) => (typeof a == "string" && dh.test(a) ? `"${a}"` : `${a}`))
        .join(",");
      return (this.url.searchParams.append(n, `not.in.(${s})`), this);
    }
    contains(n, r) {
      return (
        typeof r == "string"
          ? this.url.searchParams.append(n, `cs.${r}`)
          : Array.isArray(r)
            ? this.url.searchParams.append(n, `cs.{${r.join(",")}}`)
            : this.url.searchParams.append(n, `cs.${JSON.stringify(r)}`),
        this
      );
    }
    containedBy(n, r) {
      return (
        typeof r == "string"
          ? this.url.searchParams.append(n, `cd.${r}`)
          : Array.isArray(r)
            ? this.url.searchParams.append(n, `cd.{${r.join(",")}}`)
            : this.url.searchParams.append(n, `cd.${JSON.stringify(r)}`),
        this
      );
    }
    rangeGt(n, r) {
      return (this.url.searchParams.append(n, `sr.${r}`), this);
    }
    rangeGte(n, r) {
      return (this.url.searchParams.append(n, `nxl.${r}`), this);
    }
    rangeLt(n, r) {
      return (this.url.searchParams.append(n, `sl.${r}`), this);
    }
    rangeLte(n, r) {
      return (this.url.searchParams.append(n, `nxr.${r}`), this);
    }
    rangeAdjacent(n, r) {
      return (this.url.searchParams.append(n, `adj.${r}`), this);
    }
    overlaps(n, r) {
      return (
        typeof r == "string"
          ? this.url.searchParams.append(n, `ov.${r}`)
          : this.url.searchParams.append(n, `ov.{${r.join(",")}}`),
        this
      );
    }
    textSearch(n, r, { config: s, type: a } = {}) {
      let l = "";
      a === "plain"
        ? (l = "pl")
        : a === "phrase"
          ? (l = "ph")
          : a === "websearch" && (l = "w");
      const u = s === void 0 ? "" : `(${s})`;
      return (this.url.searchParams.append(n, `${l}fts${u}.${r}`), this);
    }
    match(n) {
      return (
        Object.entries(n)
          .filter(([r, s]) => s !== void 0)
          .forEach(([r, s]) => {
            this.url.searchParams.append(r, `eq.${s}`);
          }),
        this
      );
    }
    not(n, r, s) {
      return (this.url.searchParams.append(n, `not.${r}.${s}`), this);
    }
    or(n, { foreignTable: r, referencedTable: s = r } = {}) {
      const a = s ? `${s}.or` : "or";
      return (this.url.searchParams.append(a, `(${n})`), this);
    }
    filter(n, r, s) {
      return (this.url.searchParams.append(n, `${r}.${s}`), this);
    }
  },
  By = class {
    constructor(
      n,
      { headers: r = {}, schema: s, fetch: a, urlLengthLimit: l = 8e3 },
    ) {
      ((this.url = n),
        (this.headers = new Headers(r)),
        (this.schema = s),
        (this.fetch = a),
        (this.urlLengthLimit = l));
    }
    cloneRequestState() {
      return {
        url: new URL(this.url.toString()),
        headers: new Headers(this.headers),
      };
    }
    select(n, r) {
      const { head: s = !1, count: a } = r ?? {},
        l = s ? "HEAD" : "GET";
      let u = !1;
      const d = (n ?? "*")
          .split("")
          .map((y) => (/\s/.test(y) && !u ? "" : (y === '"' && (u = !u), y)))
          .join(""),
        { url: f, headers: p } = this.cloneRequestState();
      return (
        f.searchParams.set("select", d),
        a && p.append("Prefer", `count=${a}`),
        new xn({
          method: l,
          url: f,
          headers: p,
          schema: this.schema,
          fetch: this.fetch,
          urlLengthLimit: this.urlLengthLimit,
        })
      );
    }
    insert(n, { count: r, defaultToNull: s = !0 } = {}) {
      var a;
      const l = "POST",
        { url: u, headers: d } = this.cloneRequestState();
      if (
        (r && d.append("Prefer", `count=${r}`),
        s || d.append("Prefer", "missing=default"),
        Array.isArray(n))
      ) {
        const f = n.reduce((p, y) => p.concat(Object.keys(y)), []);
        if (f.length > 0) {
          const p = [...new Set(f)].map((y) => `"${y}"`);
          u.searchParams.set("columns", p.join(","));
        }
      }
      return new xn({
        method: l,
        url: u,
        headers: d,
        schema: this.schema,
        body: n,
        fetch: (a = this.fetch) !== null && a !== void 0 ? a : fetch,
        urlLengthLimit: this.urlLengthLimit,
      });
    }
    upsert(
      n,
      {
        onConflict: r,
        ignoreDuplicates: s = !1,
        count: a,
        defaultToNull: l = !0,
      } = {},
    ) {
      var u;
      const d = "POST",
        { url: f, headers: p } = this.cloneRequestState();
      if (
        (p.append("Prefer", `resolution=${s ? "ignore" : "merge"}-duplicates`),
        r !== void 0 && f.searchParams.set("on_conflict", r),
        a && p.append("Prefer", `count=${a}`),
        l || p.append("Prefer", "missing=default"),
        Array.isArray(n))
      ) {
        const y = n.reduce((v, x) => v.concat(Object.keys(x)), []);
        if (y.length > 0) {
          const v = [...new Set(y)].map((x) => `"${x}"`);
          f.searchParams.set("columns", v.join(","));
        }
      }
      return new xn({
        method: d,
        url: f,
        headers: p,
        schema: this.schema,
        body: n,
        fetch: (u = this.fetch) !== null && u !== void 0 ? u : fetch,
        urlLengthLimit: this.urlLengthLimit,
      });
    }
    update(n, { count: r } = {}) {
      var s;
      const a = "PATCH",
        { url: l, headers: u } = this.cloneRequestState();
      return (
        r && u.append("Prefer", `count=${r}`),
        new xn({
          method: a,
          url: l,
          headers: u,
          schema: this.schema,
          body: n,
          fetch: (s = this.fetch) !== null && s !== void 0 ? s : fetch,
          urlLengthLimit: this.urlLengthLimit,
        })
      );
    }
    delete({ count: n } = {}) {
      var r;
      const s = "DELETE",
        { url: a, headers: l } = this.cloneRequestState();
      return (
        n && l.append("Prefer", `count=${n}`),
        new xn({
          method: s,
          url: a,
          headers: l,
          schema: this.schema,
          fetch: (r = this.fetch) !== null && r !== void 0 ? r : fetch,
          urlLengthLimit: this.urlLengthLimit,
        })
      );
    }
  };
function Ss(n) {
  "@babel/helpers - typeof";
  return (
    (Ss =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (r) {
            return typeof r;
          }
        : function (r) {
            return r &&
              typeof Symbol == "function" &&
              r.constructor === Symbol &&
              r !== Symbol.prototype
              ? "symbol"
              : typeof r;
          }),
    Ss(n)
  );
}
function Fy(n, r) {
  if (Ss(n) != "object" || !n) return n;
  var s = n[Symbol.toPrimitive];
  if (s !== void 0) {
    var a = s.call(n, r);
    if (Ss(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r === "string" ? String : Number)(n);
}
function Wy(n) {
  var r = Fy(n, "string");
  return Ss(r) == "symbol" ? r : r + "";
}
function Vy(n, r, s) {
  return (
    (r = Wy(r)) in n
      ? Object.defineProperty(n, r, {
          value: s,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (n[r] = s),
    n
  );
}
function hh(n, r) {
  var s = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(n);
    (r &&
      (a = a.filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      })),
      s.push.apply(s, a));
  }
  return s;
}
function qi(n) {
  for (var r = 1; r < arguments.length; r++) {
    var s = arguments[r] != null ? arguments[r] : {};
    r % 2
      ? hh(Object(s), !0).forEach(function (a) {
          Vy(n, a, s[a]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(s))
        : hh(Object(s)).forEach(function (a) {
            Object.defineProperty(n, a, Object.getOwnPropertyDescriptor(s, a));
          });
  }
  return n;
}
var Hy = class lf {
  constructor(
    r,
    {
      headers: s = {},
      schema: a,
      fetch: l,
      timeout: u,
      urlLengthLimit: d = 8e3,
    } = {},
  ) {
    ((this.url = r),
      (this.headers = new Headers(s)),
      (this.schemaName = a),
      (this.urlLengthLimit = d));
    const f = l ?? globalThis.fetch;
    u !== void 0 && u > 0
      ? (this.fetch = (p, y) => {
          const v = new AbortController(),
            x = setTimeout(() => v.abort(), u),
            _ = y == null ? void 0 : y.signal;
          if (_) {
            if (_.aborted) return (clearTimeout(x), f(p, y));
            const S = () => {
              (clearTimeout(x), v.abort());
            };
            return (
              _.addEventListener("abort", S, { once: !0 }),
              f(p, qi(qi({}, y), {}, { signal: v.signal })).finally(() => {
                (clearTimeout(x), _.removeEventListener("abort", S));
              })
            );
          }
          return f(p, qi(qi({}, y), {}, { signal: v.signal })).finally(() =>
            clearTimeout(x),
          );
        })
      : (this.fetch = f);
  }
  from(r) {
    if (!r || typeof r != "string" || r.trim() === "")
      throw new Error(
        "Invalid relation name: relation must be a non-empty string.",
      );
    return new By(new URL(`${this.url}/${r}`), {
      headers: new Headers(this.headers),
      schema: this.schemaName,
      fetch: this.fetch,
      urlLengthLimit: this.urlLengthLimit,
    });
  }
  schema(r) {
    return new lf(this.url, {
      headers: this.headers,
      schema: r,
      fetch: this.fetch,
      urlLengthLimit: this.urlLengthLimit,
    });
  }
  rpc(r, s = {}, { head: a = !1, get: l = !1, count: u } = {}) {
    var d;
    let f;
    const p = new URL(`${this.url}/rpc/${r}`);
    let y;
    const v = (S) =>
        S !== null && typeof S == "object" && (!Array.isArray(S) || S.some(v)),
      x = a && Object.values(s).some(v);
    x
      ? ((f = "POST"), (y = s))
      : a || l
        ? ((f = a ? "HEAD" : "GET"),
          Object.entries(s)
            .filter(([S, N]) => N !== void 0)
            .map(([S, N]) => [
              S,
              Array.isArray(N) ? `{${N.join(",")}}` : `${N}`,
            ])
            .forEach(([S, N]) => {
              p.searchParams.append(S, N);
            }))
        : ((f = "POST"), (y = s));
    const _ = new Headers(this.headers);
    return (
      x
        ? _.set("Prefer", u ? `count=${u},return=minimal` : "return=minimal")
        : u && _.set("Prefer", `count=${u}`),
      new xn({
        method: f,
        url: p,
        headers: _,
        schema: this.schemaName,
        body: y,
        fetch: (d = this.fetch) !== null && d !== void 0 ? d : fetch,
        urlLengthLimit: this.urlLengthLimit,
      })
    );
  }
};
class qy {
  constructor() {}
  static detectEnvironment() {
    var r;
    if (typeof WebSocket < "u")
      return { type: "native", constructor: WebSocket };
    if (typeof globalThis < "u" && typeof globalThis.WebSocket < "u")
      return { type: "native", constructor: globalThis.WebSocket };
    if (typeof global < "u" && typeof global.WebSocket < "u")
      return { type: "native", constructor: global.WebSocket };
    if (
      typeof globalThis < "u" &&
      typeof globalThis.WebSocketPair < "u" &&
      typeof globalThis.WebSocket > "u"
    )
      return {
        type: "cloudflare",
        error:
          "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
        workaround:
          "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime.",
      };
    if (
      (typeof globalThis < "u" && globalThis.EdgeRuntime) ||
      (typeof navigator < "u" &&
        !((r = navigator.userAgent) === null || r === void 0) &&
        r.includes("Vercel-Edge"))
    )
      return {
        type: "unsupported",
        error:
          "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
        workaround:
          "Use serverless functions or a different deployment target for WebSocket functionality.",
      };
    const s = globalThis.process;
    if (s) {
      const a = s.versions;
      if (a && a.node) {
        const l = a.node,
          u = parseInt(l.replace(/^v/, "").split(".")[0]);
        return u >= 22
          ? typeof globalThis.WebSocket < "u"
            ? { type: "native", constructor: globalThis.WebSocket }
            : {
                type: "unsupported",
                error: `Node.js ${u} detected but native WebSocket not found.`,
                workaround:
                  "Provide a WebSocket implementation via the transport option.",
              }
          : {
              type: "unsupported",
              error: `Node.js ${u} detected without native WebSocket support.`,
              workaround: `For Node.js < 22, install "ws" package and provide it via the transport option:
import ws from "ws"
new RealtimeClient(url, { transport: ws })`,
            };
      }
    }
    return {
      type: "unsupported",
      error: "Unknown JavaScript runtime without WebSocket support.",
      workaround:
        "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation.",
    };
  }
  static getWebSocketConstructor() {
    const r = this.detectEnvironment();
    if (r.constructor) return r.constructor;
    let s = r.error || "WebSocket not supported in this environment.";
    throw (
      r.workaround &&
        (s += `

Suggested solution: ${r.workaround}`),
      new Error(s)
    );
  }
  static createWebSocket(r, s) {
    const a = this.getWebSocketConstructor();
    return new a(r, s);
  }
  static isWebSocketSupported() {
    try {
      const r = this.detectEnvironment();
      return r.type === "native" || r.type === "ws";
    } catch {
      return !1;
    }
  }
}
const Ky = "2.99.3",
  Gy = `realtime-js/${Ky}`,
  Jy = "1.0.0",
  uf = "2.0.0",
  fh = uf,
  Pl = 1e4,
  Qy = 1e3,
  Yy = 100;
var _r;
(function (n) {
  ((n[(n.connecting = 0)] = "connecting"),
    (n[(n.open = 1)] = "open"),
    (n[(n.closing = 2)] = "closing"),
    (n[(n.closed = 3)] = "closed"));
})(_r || (_r = {}));
var Ue;
(function (n) {
  ((n.closed = "closed"),
    (n.errored = "errored"),
    (n.joined = "joined"),
    (n.joining = "joining"),
    (n.leaving = "leaving"));
})(Ue || (Ue = {}));
var Pt;
(function (n) {
  ((n.close = "phx_close"),
    (n.error = "phx_error"),
    (n.join = "phx_join"),
    (n.reply = "phx_reply"),
    (n.leave = "phx_leave"),
    (n.access_token = "access_token"));
})(Pt || (Pt = {}));
var Ol;
(function (n) {
  n.websocket = "websocket";
})(Ol || (Ol = {}));
var Mr;
(function (n) {
  ((n.Connecting = "connecting"),
    (n.Open = "open"),
    (n.Closing = "closing"),
    (n.Closed = "closed"));
})(Mr || (Mr = {}));
class Xy {
  constructor(r) {
    ((this.HEADER_LENGTH = 1),
      (this.USER_BROADCAST_PUSH_META_LENGTH = 6),
      (this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 }),
      (this.BINARY_ENCODING = 0),
      (this.JSON_ENCODING = 1),
      (this.BROADCAST_EVENT = "broadcast"),
      (this.allowedMetadataKeys = []),
      (this.allowedMetadataKeys = r ?? []));
  }
  encode(r, s) {
    if (
      r.event === this.BROADCAST_EVENT &&
      !(r.payload instanceof ArrayBuffer) &&
      typeof r.payload.event == "string"
    )
      return s(this._binaryEncodeUserBroadcastPush(r));
    let a = [r.join_ref, r.ref, r.topic, r.event, r.payload];
    return s(JSON.stringify(a));
  }
  _binaryEncodeUserBroadcastPush(r) {
    var s;
    return this._isArrayBuffer(
      (s = r.payload) === null || s === void 0 ? void 0 : s.payload,
    )
      ? this._encodeBinaryUserBroadcastPush(r)
      : this._encodeJsonUserBroadcastPush(r);
  }
  _encodeBinaryUserBroadcastPush(r) {
    var s, a;
    const l =
      (a = (s = r.payload) === null || s === void 0 ? void 0 : s.payload) !==
        null && a !== void 0
        ? a
        : new ArrayBuffer(0);
    return this._encodeUserBroadcastPush(r, this.BINARY_ENCODING, l);
  }
  _encodeJsonUserBroadcastPush(r) {
    var s, a;
    const l =
        (a = (s = r.payload) === null || s === void 0 ? void 0 : s.payload) !==
          null && a !== void 0
          ? a
          : {},
      d = new TextEncoder().encode(JSON.stringify(l)).buffer;
    return this._encodeUserBroadcastPush(r, this.JSON_ENCODING, d);
  }
  _encodeUserBroadcastPush(r, s, a) {
    var l, u;
    const d = r.topic,
      f = (l = r.ref) !== null && l !== void 0 ? l : "",
      p = (u = r.join_ref) !== null && u !== void 0 ? u : "",
      y = r.payload.event,
      v = this.allowedMetadataKeys
        ? this._pick(r.payload, this.allowedMetadataKeys)
        : {},
      x = Object.keys(v).length === 0 ? "" : JSON.stringify(v);
    if (p.length > 255)
      throw new Error(`joinRef length ${p.length} exceeds maximum of 255`);
    if (f.length > 255)
      throw new Error(`ref length ${f.length} exceeds maximum of 255`);
    if (d.length > 255)
      throw new Error(`topic length ${d.length} exceeds maximum of 255`);
    if (y.length > 255)
      throw new Error(`userEvent length ${y.length} exceeds maximum of 255`);
    if (x.length > 255)
      throw new Error(`metadata length ${x.length} exceeds maximum of 255`);
    const _ =
        this.USER_BROADCAST_PUSH_META_LENGTH +
        p.length +
        f.length +
        d.length +
        y.length +
        x.length,
      S = new ArrayBuffer(this.HEADER_LENGTH + _);
    let N = new DataView(S),
      j = 0;
    (N.setUint8(j++, this.KINDS.userBroadcastPush),
      N.setUint8(j++, p.length),
      N.setUint8(j++, f.length),
      N.setUint8(j++, d.length),
      N.setUint8(j++, y.length),
      N.setUint8(j++, x.length),
      N.setUint8(j++, s),
      Array.from(p, (A) => N.setUint8(j++, A.charCodeAt(0))),
      Array.from(f, (A) => N.setUint8(j++, A.charCodeAt(0))),
      Array.from(d, (A) => N.setUint8(j++, A.charCodeAt(0))),
      Array.from(y, (A) => N.setUint8(j++, A.charCodeAt(0))),
      Array.from(x, (A) => N.setUint8(j++, A.charCodeAt(0))));
    var E = new Uint8Array(S.byteLength + a.byteLength);
    return (
      E.set(new Uint8Array(S), 0),
      E.set(new Uint8Array(a), S.byteLength),
      E.buffer
    );
  }
  decode(r, s) {
    if (this._isArrayBuffer(r)) {
      let a = this._binaryDecode(r);
      return s(a);
    }
    if (typeof r == "string") {
      const a = JSON.parse(r),
        [l, u, d, f, p] = a;
      return s({ join_ref: l, ref: u, topic: d, event: f, payload: p });
    }
    return s({});
  }
  _binaryDecode(r) {
    const s = new DataView(r),
      a = s.getUint8(0),
      l = new TextDecoder();
    switch (a) {
      case this.KINDS.userBroadcast:
        return this._decodeUserBroadcast(r, s, l);
    }
  }
  _decodeUserBroadcast(r, s, a) {
    const l = s.getUint8(1),
      u = s.getUint8(2),
      d = s.getUint8(3),
      f = s.getUint8(4);
    let p = this.HEADER_LENGTH + 4;
    const y = a.decode(r.slice(p, p + l));
    p = p + l;
    const v = a.decode(r.slice(p, p + u));
    p = p + u;
    const x = a.decode(r.slice(p, p + d));
    p = p + d;
    const _ = r.slice(p, r.byteLength),
      S = f === this.JSON_ENCODING ? JSON.parse(a.decode(_)) : _,
      N = { type: this.BROADCAST_EVENT, event: v, payload: S };
    return (
      d > 0 && (N.meta = JSON.parse(x)),
      {
        join_ref: null,
        ref: null,
        topic: y,
        event: this.BROADCAST_EVENT,
        payload: N,
      }
    );
  }
  _isArrayBuffer(r) {
    var s;
    return (
      r instanceof ArrayBuffer ||
      ((s = r == null ? void 0 : r.constructor) === null || s === void 0
        ? void 0
        : s.name) === "ArrayBuffer"
    );
  }
  _pick(r, s) {
    return !r || typeof r != "object"
      ? {}
      : Object.fromEntries(Object.entries(r).filter(([a]) => s.includes(a)));
  }
}
class cf {
  constructor(r, s) {
    ((this.callback = r),
      (this.timerCalc = s),
      (this.timer = void 0),
      (this.tries = 0),
      (this.callback = r),
      (this.timerCalc = s));
  }
  reset() {
    ((this.tries = 0), clearTimeout(this.timer), (this.timer = void 0));
  }
  scheduleTimeout() {
    (clearTimeout(this.timer),
      (this.timer = setTimeout(
        () => {
          ((this.tries = this.tries + 1), this.callback());
        },
        this.timerCalc(this.tries + 1),
      )));
  }
}
var ve;
(function (n) {
  ((n.abstime = "abstime"),
    (n.bool = "bool"),
    (n.date = "date"),
    (n.daterange = "daterange"),
    (n.float4 = "float4"),
    (n.float8 = "float8"),
    (n.int2 = "int2"),
    (n.int4 = "int4"),
    (n.int4range = "int4range"),
    (n.int8 = "int8"),
    (n.int8range = "int8range"),
    (n.json = "json"),
    (n.jsonb = "jsonb"),
    (n.money = "money"),
    (n.numeric = "numeric"),
    (n.oid = "oid"),
    (n.reltime = "reltime"),
    (n.text = "text"),
    (n.time = "time"),
    (n.timestamp = "timestamp"),
    (n.timestamptz = "timestamptz"),
    (n.timetz = "timetz"),
    (n.tsrange = "tsrange"),
    (n.tstzrange = "tstzrange"));
})(ve || (ve = {}));
const ph = (n, r, s = {}) => {
    var a;
    const l = (a = s.skipTypes) !== null && a !== void 0 ? a : [];
    return r
      ? Object.keys(r).reduce((u, d) => ((u[d] = Zy(d, n, r, l)), u), {})
      : {};
  },
  Zy = (n, r, s, a) => {
    const l = r.find((f) => f.name === n),
      u = l == null ? void 0 : l.type,
      d = s[n];
    return u && !a.includes(u) ? df(u, d) : Al(d);
  },
  df = (n, r) => {
    if (n.charAt(0) === "_") {
      const s = n.slice(1, n.length);
      return nv(r, s);
    }
    switch (n) {
      case ve.bool:
        return ev(r);
      case ve.float4:
      case ve.float8:
      case ve.int2:
      case ve.int4:
      case ve.int8:
      case ve.numeric:
      case ve.oid:
        return tv(r);
      case ve.json:
      case ve.jsonb:
        return rv(r);
      case ve.timestamp:
        return sv(r);
      case ve.abstime:
      case ve.date:
      case ve.daterange:
      case ve.int4range:
      case ve.int8range:
      case ve.money:
      case ve.reltime:
      case ve.text:
      case ve.time:
      case ve.timestamptz:
      case ve.timetz:
      case ve.tsrange:
      case ve.tstzrange:
        return Al(r);
      default:
        return Al(r);
    }
  },
  Al = (n) => n,
  ev = (n) => {
    switch (n) {
      case "t":
        return !0;
      case "f":
        return !1;
      default:
        return n;
    }
  },
  tv = (n) => {
    if (typeof n == "string") {
      const r = parseFloat(n);
      if (!Number.isNaN(r)) return r;
    }
    return n;
  },
  rv = (n) => {
    if (typeof n == "string")
      try {
        return JSON.parse(n);
      } catch {
        return n;
      }
    return n;
  },
  nv = (n, r) => {
    if (typeof n != "string") return n;
    const s = n.length - 1,
      a = n[s];
    if (n[0] === "{" && a === "}") {
      let u;
      const d = n.slice(1, s);
      try {
        u = JSON.parse("[" + d + "]");
      } catch {
        u = d ? d.split(",") : [];
      }
      return u.map((f) => df(r, f));
    }
    return n;
  },
  sv = (n) => (typeof n == "string" ? n.replace(" ", "T") : n),
  hf = (n) => {
    const r = new URL(n);
    return (
      (r.protocol = r.protocol.replace(/^ws/i, "http")),
      (r.pathname = r.pathname
        .replace(/\/+$/, "")
        .replace(/\/socket\/websocket$/i, "")
        .replace(/\/socket$/i, "")
        .replace(/\/websocket$/i, "")),
      r.pathname === "" || r.pathname === "/"
        ? (r.pathname = "/api/broadcast")
        : (r.pathname = r.pathname + "/api/broadcast"),
      r.href
    );
  };
class vl {
  constructor(r, s, a = {}, l = Pl) {
    ((this.channel = r),
      (this.event = s),
      (this.payload = a),
      (this.timeout = l),
      (this.sent = !1),
      (this.timeoutTimer = void 0),
      (this.ref = ""),
      (this.receivedResp = null),
      (this.recHooks = []),
      (this.refEvent = null));
  }
  resend(r) {
    ((this.timeout = r),
      this._cancelRefEvent(),
      (this.ref = ""),
      (this.refEvent = null),
      (this.receivedResp = null),
      (this.sent = !1),
      this.send());
  }
  send() {
    this._hasReceived("timeout") ||
      (this.startTimeout(),
      (this.sent = !0),
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload,
        ref: this.ref,
        join_ref: this.channel._joinRef(),
      }));
  }
  updatePayload(r) {
    this.payload = Object.assign(Object.assign({}, this.payload), r);
  }
  receive(r, s) {
    var a;
    return (
      this._hasReceived(r) &&
        s(
          (a = this.receivedResp) === null || a === void 0
            ? void 0
            : a.response,
        ),
      this.recHooks.push({ status: r, callback: s }),
      this
    );
  }
  startTimeout() {
    if (this.timeoutTimer) return;
    ((this.ref = this.channel.socket._makeRef()),
      (this.refEvent = this.channel._replyEventName(this.ref)));
    const r = (s) => {
      (this._cancelRefEvent(),
        this._cancelTimeout(),
        (this.receivedResp = s),
        this._matchReceive(s));
    };
    (this.channel._on(this.refEvent, {}, r),
      (this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout)));
  }
  trigger(r, s) {
    this.refEvent &&
      this.channel._trigger(this.refEvent, { status: r, response: s });
  }
  destroy() {
    (this._cancelRefEvent(), this._cancelTimeout());
  }
  _cancelRefEvent() {
    this.refEvent && this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    (clearTimeout(this.timeoutTimer), (this.timeoutTimer = void 0));
  }
  _matchReceive({ status: r, response: s }) {
    this.recHooks.filter((a) => a.status === r).forEach((a) => a.callback(s));
  }
  _hasReceived(r) {
    return this.receivedResp && this.receivedResp.status === r;
  }
}
var mh;
(function (n) {
  ((n.SYNC = "sync"), (n.JOIN = "join"), (n.LEAVE = "leave"));
})(mh || (mh = {}));
class ws {
  constructor(r, s) {
    ((this.channel = r),
      (this.state = {}),
      (this.pendingDiffs = []),
      (this.joinRef = null),
      (this.enabled = !1),
      (this.caller = {
        onJoin: () => {},
        onLeave: () => {},
        onSync: () => {},
      }));
    const a = (s == null ? void 0 : s.events) || {
      state: "presence_state",
      diff: "presence_diff",
    };
    (this.channel._on(a.state, {}, (l) => {
      const { onJoin: u, onLeave: d, onSync: f } = this.caller;
      ((this.joinRef = this.channel._joinRef()),
        (this.state = ws.syncState(this.state, l, u, d)),
        this.pendingDiffs.forEach((p) => {
          this.state = ws.syncDiff(this.state, p, u, d);
        }),
        (this.pendingDiffs = []),
        f());
    }),
      this.channel._on(a.diff, {}, (l) => {
        const { onJoin: u, onLeave: d, onSync: f } = this.caller;
        this.inPendingSyncState()
          ? this.pendingDiffs.push(l)
          : ((this.state = ws.syncDiff(this.state, l, u, d)), f());
      }),
      this.onJoin((l, u, d) => {
        this.channel._trigger("presence", {
          event: "join",
          key: l,
          currentPresences: u,
          newPresences: d,
        });
      }),
      this.onLeave((l, u, d) => {
        this.channel._trigger("presence", {
          event: "leave",
          key: l,
          currentPresences: u,
          leftPresences: d,
        });
      }),
      this.onSync(() => {
        this.channel._trigger("presence", { event: "sync" });
      }));
  }
  static syncState(r, s, a, l) {
    const u = this.cloneDeep(r),
      d = this.transformState(s),
      f = {},
      p = {};
    return (
      this.map(u, (y, v) => {
        d[y] || (p[y] = v);
      }),
      this.map(d, (y, v) => {
        const x = u[y];
        if (x) {
          const _ = v.map((E) => E.presence_ref),
            S = x.map((E) => E.presence_ref),
            N = v.filter((E) => S.indexOf(E.presence_ref) < 0),
            j = x.filter((E) => _.indexOf(E.presence_ref) < 0);
          (N.length > 0 && (f[y] = N), j.length > 0 && (p[y] = j));
        } else f[y] = v;
      }),
      this.syncDiff(u, { joins: f, leaves: p }, a, l)
    );
  }
  static syncDiff(r, s, a, l) {
    const { joins: u, leaves: d } = {
      joins: this.transformState(s.joins),
      leaves: this.transformState(s.leaves),
    };
    return (
      a || (a = () => {}),
      l || (l = () => {}),
      this.map(u, (f, p) => {
        var y;
        const v = (y = r[f]) !== null && y !== void 0 ? y : [];
        if (((r[f] = this.cloneDeep(p)), v.length > 0)) {
          const x = r[f].map((S) => S.presence_ref),
            _ = v.filter((S) => x.indexOf(S.presence_ref) < 0);
          r[f].unshift(..._);
        }
        a(f, v, p);
      }),
      this.map(d, (f, p) => {
        let y = r[f];
        if (!y) return;
        const v = p.map((x) => x.presence_ref);
        ((y = y.filter((x) => v.indexOf(x.presence_ref) < 0)),
          (r[f] = y),
          l(f, y, p),
          y.length === 0 && delete r[f]);
      }),
      r
    );
  }
  static map(r, s) {
    return Object.getOwnPropertyNames(r).map((a) => s(a, r[a]));
  }
  static transformState(r) {
    return (
      (r = this.cloneDeep(r)),
      Object.getOwnPropertyNames(r).reduce((s, a) => {
        const l = r[a];
        return (
          "metas" in l
            ? (s[a] = l.metas.map(
                (u) => (
                  (u.presence_ref = u.phx_ref),
                  delete u.phx_ref,
                  delete u.phx_ref_prev,
                  u
                ),
              ))
            : (s[a] = l),
          s
        );
      }, {})
    );
  }
  static cloneDeep(r) {
    return JSON.parse(JSON.stringify(r));
  }
  onJoin(r) {
    this.caller.onJoin = r;
  }
  onLeave(r) {
    this.caller.onLeave = r;
  }
  onSync(r) {
    this.caller.onSync = r;
  }
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
}
var gh;
(function (n) {
  ((n.ALL = "*"),
    (n.INSERT = "INSERT"),
    (n.UPDATE = "UPDATE"),
    (n.DELETE = "DELETE"));
})(gh || (gh = {}));
var xs;
(function (n) {
  ((n.BROADCAST = "broadcast"),
    (n.PRESENCE = "presence"),
    (n.POSTGRES_CHANGES = "postgres_changes"),
    (n.SYSTEM = "system"));
})(xs || (xs = {}));
var Zt;
(function (n) {
  ((n.SUBSCRIBED = "SUBSCRIBED"),
    (n.TIMED_OUT = "TIMED_OUT"),
    (n.CLOSED = "CLOSED"),
    (n.CHANNEL_ERROR = "CHANNEL_ERROR"));
})(Zt || (Zt = {}));
class bn {
  constructor(r, s = { config: {} }, a) {
    var l, u;
    if (
      ((this.topic = r),
      (this.params = s),
      (this.socket = a),
      (this.bindings = {}),
      (this.state = Ue.closed),
      (this.joinedOnce = !1),
      (this.pushBuffer = []),
      (this.subTopic = r.replace(/^realtime:/i, "")),
      (this.params.config = Object.assign(
        {
          broadcast: { ack: !1, self: !1 },
          presence: { key: "", enabled: !1 },
          private: !1,
        },
        s.config,
      )),
      (this.timeout = this.socket.timeout),
      (this.joinPush = new vl(this, Pt.join, this.params, this.timeout)),
      (this.rejoinTimer = new cf(
        () => this._rejoinUntilConnected(),
        this.socket.reconnectAfterMs,
      )),
      this.joinPush.receive("ok", () => {
        ((this.state = Ue.joined),
          this.rejoinTimer.reset(),
          this.pushBuffer.forEach((d) => d.send()),
          (this.pushBuffer = []));
      }),
      this._onClose(() => {
        (this.rejoinTimer.reset(),
          this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`),
          (this.state = Ue.closed),
          this.socket._remove(this));
      }),
      this._onError((d) => {
        this._isLeaving() ||
          this._isClosed() ||
          (this.socket.log("channel", `error ${this.topic}`, d),
          (this.state = Ue.errored),
          this.rejoinTimer.scheduleTimeout());
      }),
      this.joinPush.receive("timeout", () => {
        this._isJoining() &&
          (this.socket.log(
            "channel",
            `timeout ${this.topic}`,
            this.joinPush.timeout,
          ),
          (this.state = Ue.errored),
          this.rejoinTimer.scheduleTimeout());
      }),
      this.joinPush.receive("error", (d) => {
        this._isLeaving() ||
          this._isClosed() ||
          (this.socket.log("channel", `error ${this.topic}`, d),
          (this.state = Ue.errored),
          this.rejoinTimer.scheduleTimeout());
      }),
      this._on(Pt.reply, {}, (d, f) => {
        this._trigger(this._replyEventName(f), d);
      }),
      (this.presence = new ws(this)),
      (this.broadcastEndpointURL = hf(this.socket.endPoint)),
      (this.private = this.params.config.private || !1),
      !this.private &&
        !(
          (u =
            (l = this.params.config) === null || l === void 0
              ? void 0
              : l.broadcast) === null || u === void 0
        ) &&
        u.replay)
    )
      throw `tried to use replay on public channel '${this.topic}'. It must be a private channel.`;
  }
  subscribe(r, s = this.timeout) {
    var a, l, u;
    if (
      (this.socket.isConnected() || this.socket.connect(),
      this.state == Ue.closed)
    ) {
      const {
          config: { broadcast: d, presence: f, private: p },
        } = this.params,
        y =
          (l =
            (a = this.bindings.postgres_changes) === null || a === void 0
              ? void 0
              : a.map((S) => S.filter)) !== null && l !== void 0
            ? l
            : [],
        v =
          (!!this.bindings[xs.PRESENCE] &&
            this.bindings[xs.PRESENCE].length > 0) ||
          ((u = this.params.config.presence) === null || u === void 0
            ? void 0
            : u.enabled) === !0,
        x = {},
        _ = {
          broadcast: d,
          presence: Object.assign(Object.assign({}, f), { enabled: v }),
          postgres_changes: y,
          private: p,
        };
      (this.socket.accessTokenValue &&
        (x.access_token = this.socket.accessTokenValue),
        this._onError((S) => (r == null ? void 0 : r(Zt.CHANNEL_ERROR, S))),
        this._onClose(() => (r == null ? void 0 : r(Zt.CLOSED))),
        this.updateJoinPayload(Object.assign({ config: _ }, x)),
        (this.joinedOnce = !0),
        this._rejoin(s),
        this.joinPush
          .receive("ok", async ({ postgres_changes: S }) => {
            var N;
            if (
              (this.socket._isManualToken() || this.socket.setAuth(),
              S === void 0)
            ) {
              r == null || r(Zt.SUBSCRIBED);
              return;
            } else {
              const j = this.bindings.postgres_changes,
                E =
                  (N = j == null ? void 0 : j.length) !== null && N !== void 0
                    ? N
                    : 0,
                A = [];
              for (let L = 0; L < E; L++) {
                const I = j[L],
                  {
                    filter: { event: B, schema: re, table: Y, filter: se },
                  } = I,
                  me = S && S[L];
                if (
                  me &&
                  me.event === B &&
                  bn.isFilterValueEqual(me.schema, re) &&
                  bn.isFilterValueEqual(me.table, Y) &&
                  bn.isFilterValueEqual(me.filter, se)
                )
                  A.push(Object.assign(Object.assign({}, I), { id: me.id }));
                else {
                  (this.unsubscribe(),
                    (this.state = Ue.errored),
                    r == null ||
                      r(
                        Zt.CHANNEL_ERROR,
                        new Error(
                          "mismatch between server and client bindings for postgres changes",
                        ),
                      ));
                  return;
                }
              }
              ((this.bindings.postgres_changes = A), r && r(Zt.SUBSCRIBED));
              return;
            }
          })
          .receive("error", (S) => {
            ((this.state = Ue.errored),
              r == null ||
                r(
                  Zt.CHANNEL_ERROR,
                  new Error(
                    JSON.stringify(Object.values(S).join(", ") || "error"),
                  ),
                ));
          })
          .receive("timeout", () => {
            r == null || r(Zt.TIMED_OUT);
          }));
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  async track(r, s = {}) {
    return await this.send(
      { type: "presence", event: "track", payload: r },
      s.timeout || this.timeout,
    );
  }
  async untrack(r = {}) {
    return await this.send({ type: "presence", event: "untrack" }, r);
  }
  on(r, s, a) {
    return (
      this.state === Ue.joined &&
        r === xs.PRESENCE &&
        (this.socket.log(
          "channel",
          `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`,
        ),
        this.unsubscribe().then(async () => await this.subscribe())),
      this._on(r, s, a)
    );
  }
  async httpSend(r, s, a = {}) {
    var l;
    if (s == null) return Promise.reject("Payload is required for httpSend()");
    const u = {
      apikey: this.socket.apiKey ? this.socket.apiKey : "",
      "Content-Type": "application/json",
    };
    this.socket.accessTokenValue &&
      (u.Authorization = `Bearer ${this.socket.accessTokenValue}`);
    const d = {
        method: "POST",
        headers: u,
        body: JSON.stringify({
          messages: [
            {
              topic: this.subTopic,
              event: r,
              payload: s,
              private: this.private,
            },
          ],
        }),
      },
      f = await this._fetchWithTimeout(
        this.broadcastEndpointURL,
        d,
        (l = a.timeout) !== null && l !== void 0 ? l : this.timeout,
      );
    if (f.status === 202) return { success: !0 };
    let p = f.statusText;
    try {
      const y = await f.json();
      p = y.error || y.message || p;
    } catch {}
    return Promise.reject(new Error(p));
  }
  async send(r, s = {}) {
    var a, l;
    if (!this._canPush() && r.type === "broadcast") {
      console.warn(
        "Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.",
      );
      const { event: u, payload: d } = r,
        f = {
          apikey: this.socket.apiKey ? this.socket.apiKey : "",
          "Content-Type": "application/json",
        };
      this.socket.accessTokenValue &&
        (f.Authorization = `Bearer ${this.socket.accessTokenValue}`);
      const p = {
        method: "POST",
        headers: f,
        body: JSON.stringify({
          messages: [
            {
              topic: this.subTopic,
              event: u,
              payload: d,
              private: this.private,
            },
          ],
        }),
      };
      try {
        const y = await this._fetchWithTimeout(
          this.broadcastEndpointURL,
          p,
          (a = s.timeout) !== null && a !== void 0 ? a : this.timeout,
        );
        return (
          await ((l = y.body) === null || l === void 0 ? void 0 : l.cancel()),
          y.ok ? "ok" : "error"
        );
      } catch (y) {
        return y.name === "AbortError" ? "timed out" : "error";
      }
    } else
      return new Promise((u) => {
        var d, f, p;
        const y = this._push(r.type, r, s.timeout || this.timeout);
        (r.type === "broadcast" &&
          !(
            !(
              (p =
                (f =
                  (d = this.params) === null || d === void 0
                    ? void 0
                    : d.config) === null || f === void 0
                  ? void 0
                  : f.broadcast) === null || p === void 0
            ) && p.ack
          ) &&
          u("ok"),
          y.receive("ok", () => u("ok")),
          y.receive("error", () => u("error")),
          y.receive("timeout", () => u("timed out")));
      });
  }
  updateJoinPayload(r) {
    this.joinPush.updatePayload(r);
  }
  unsubscribe(r = this.timeout) {
    this.state = Ue.leaving;
    const s = () => {
      (this.socket.log("channel", `leave ${this.topic}`),
        this._trigger(Pt.close, "leave", this._joinRef()));
    };
    this.joinPush.destroy();
    let a = null;
    return new Promise((l) => {
      ((a = new vl(this, Pt.leave, {}, r)),
        a
          .receive("ok", () => {
            (s(), l("ok"));
          })
          .receive("timeout", () => {
            (s(), l("timed out"));
          })
          .receive("error", () => {
            l("error");
          }),
        a.send(),
        this._canPush() || a.trigger("ok", {}));
    }).finally(() => {
      a == null || a.destroy();
    });
  }
  teardown() {
    (this.pushBuffer.forEach((r) => r.destroy()),
      (this.pushBuffer = []),
      this.rejoinTimer.reset(),
      this.joinPush.destroy(),
      (this.state = Ue.closed),
      (this.bindings = {}));
  }
  async _fetchWithTimeout(r, s, a) {
    const l = new AbortController(),
      u = setTimeout(() => l.abort(), a),
      d = await this.socket.fetch(
        r,
        Object.assign(Object.assign({}, s), { signal: l.signal }),
      );
    return (clearTimeout(u), d);
  }
  _push(r, s, a = this.timeout) {
    if (!this.joinedOnce)
      throw `tried to push '${r}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    let l = new vl(this, r, s, a);
    return (this._canPush() ? l.send() : this._addToPushBuffer(l), l);
  }
  _addToPushBuffer(r) {
    if (
      (r.startTimeout(), this.pushBuffer.push(r), this.pushBuffer.length > Yy)
    ) {
      const s = this.pushBuffer.shift();
      s &&
        (s.destroy(),
        this.socket.log(
          "channel",
          `discarded push due to buffer overflow: ${s.event}`,
          s.payload,
        ));
    }
  }
  _onMessage(r, s, a) {
    return s;
  }
  _isMember(r) {
    return this.topic === r;
  }
  _joinRef() {
    return this.joinPush.ref;
  }
  _trigger(r, s, a) {
    var l, u;
    const d = r.toLocaleLowerCase(),
      { close: f, error: p, leave: y, join: v } = Pt;
    if (a && [f, p, y, v].indexOf(d) >= 0 && a !== this._joinRef()) return;
    let _ = this._onMessage(d, s, a);
    if (s && !_)
      throw "channel onMessage callbacks must return the payload, modified or unmodified";
    ["insert", "update", "delete"].includes(d)
      ? (l = this.bindings.postgres_changes) === null ||
        l === void 0 ||
        l
          .filter((S) => {
            var N, j, E;
            return (
              ((N = S.filter) === null || N === void 0 ? void 0 : N.event) ===
                "*" ||
              ((E =
                (j = S.filter) === null || j === void 0 ? void 0 : j.event) ===
                null || E === void 0
                ? void 0
                : E.toLocaleLowerCase()) === d
            );
          })
          .map((S) => S.callback(_, a))
      : (u = this.bindings[d]) === null ||
        u === void 0 ||
        u
          .filter((S) => {
            var N, j, E, A, L, I;
            if (["broadcast", "presence", "postgres_changes"].includes(d))
              if ("id" in S) {
                const B = S.id,
                  re =
                    (N = S.filter) === null || N === void 0 ? void 0 : N.event;
                return (
                  B &&
                  ((j = s.ids) === null || j === void 0
                    ? void 0
                    : j.includes(B)) &&
                  (re === "*" ||
                    (re == null ? void 0 : re.toLocaleLowerCase()) ===
                      ((E = s.data) === null || E === void 0
                        ? void 0
                        : E.type.toLocaleLowerCase()))
                );
              } else {
                const B =
                  (L =
                    (A = S == null ? void 0 : S.filter) === null || A === void 0
                      ? void 0
                      : A.event) === null || L === void 0
                    ? void 0
                    : L.toLocaleLowerCase();
                return (
                  B === "*" ||
                  B ===
                    ((I = s == null ? void 0 : s.event) === null || I === void 0
                      ? void 0
                      : I.toLocaleLowerCase())
                );
              }
            else return S.type.toLocaleLowerCase() === d;
          })
          .map((S) => {
            if (typeof _ == "object" && "ids" in _) {
              const N = _.data,
                {
                  schema: j,
                  table: E,
                  commit_timestamp: A,
                  type: L,
                  errors: I,
                } = N;
              _ = Object.assign(
                Object.assign(
                  {},
                  {
                    schema: j,
                    table: E,
                    commit_timestamp: A,
                    eventType: L,
                    new: {},
                    old: {},
                    errors: I,
                  },
                ),
                this._getPayloadRecords(N),
              );
            }
            S.callback(_, a);
          });
  }
  _isClosed() {
    return this.state === Ue.closed;
  }
  _isJoined() {
    return this.state === Ue.joined;
  }
  _isJoining() {
    return this.state === Ue.joining;
  }
  _isLeaving() {
    return this.state === Ue.leaving;
  }
  _replyEventName(r) {
    return `chan_reply_${r}`;
  }
  _on(r, s, a) {
    const l = r.toLocaleLowerCase(),
      u = { type: l, filter: s, callback: a };
    return (
      this.bindings[l] ? this.bindings[l].push(u) : (this.bindings[l] = [u]),
      this
    );
  }
  _off(r, s) {
    const a = r.toLocaleLowerCase();
    return (
      this.bindings[a] &&
        (this.bindings[a] = this.bindings[a].filter((l) => {
          var u;
          return !(
            ((u = l.type) === null || u === void 0
              ? void 0
              : u.toLocaleLowerCase()) === a && bn.isEqual(l.filter, s)
          );
        })),
      this
    );
  }
  static isEqual(r, s) {
    if (Object.keys(r).length !== Object.keys(s).length) return !1;
    for (const a in r) if (r[a] !== s[a]) return !1;
    return !0;
  }
  static isFilterValueEqual(r, s) {
    return (r ?? void 0) === (s ?? void 0);
  }
  _rejoinUntilConnected() {
    (this.rejoinTimer.scheduleTimeout(),
      this.socket.isConnected() && this._rejoin());
  }
  _onClose(r) {
    this._on(Pt.close, {}, r);
  }
  _onError(r) {
    this._on(Pt.error, {}, (s) => r(s));
  }
  _canPush() {
    return this.socket.isConnected() && this._isJoined();
  }
  _rejoin(r = this.timeout) {
    this._isLeaving() ||
      (this.socket._leaveOpenTopic(this.topic),
      (this.state = Ue.joining),
      this.joinPush.resend(r));
  }
  _getPayloadRecords(r) {
    const s = { new: {}, old: {} };
    return (
      (r.type === "INSERT" || r.type === "UPDATE") &&
        (s.new = ph(r.columns, r.record)),
      (r.type === "UPDATE" || r.type === "DELETE") &&
        (s.old = ph(r.columns, r.old_record)),
      s
    );
  }
}
const wl = () => {},
  Ki = {
    HEARTBEAT_INTERVAL: 25e3,
    RECONNECT_DELAY: 10,
    HEARTBEAT_TIMEOUT_FALLBACK: 100,
  },
  iv = [1e3, 2e3, 5e3, 1e4],
  av = 1e4,
  ov = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
class lv {
  constructor(r, s) {
    var a;
    if (
      ((this.accessTokenValue = null),
      (this.apiKey = null),
      (this._manuallySetToken = !1),
      (this.channels = new Array()),
      (this.endPoint = ""),
      (this.httpEndpoint = ""),
      (this.headers = {}),
      (this.params = {}),
      (this.timeout = Pl),
      (this.transport = null),
      (this.heartbeatIntervalMs = Ki.HEARTBEAT_INTERVAL),
      (this.heartbeatTimer = void 0),
      (this.pendingHeartbeatRef = null),
      (this.heartbeatCallback = wl),
      (this.ref = 0),
      (this.reconnectTimer = null),
      (this.vsn = fh),
      (this.logger = wl),
      (this.conn = null),
      (this.sendBuffer = []),
      (this.serializer = new Xy()),
      (this.stateChangeCallbacks = {
        open: [],
        close: [],
        error: [],
        message: [],
      }),
      (this.accessToken = null),
      (this._connectionState = "disconnected"),
      (this._wasManualDisconnect = !1),
      (this._authPromise = null),
      (this._heartbeatSentAt = null),
      (this._resolveFetch = (l) =>
        l ? (...u) => l(...u) : (...u) => fetch(...u)),
      !(
        !((a = s == null ? void 0 : s.params) === null || a === void 0) &&
        a.apikey
      ))
    )
      throw new Error("API key is required to connect to Realtime");
    ((this.apiKey = s.params.apikey),
      (this.endPoint = `${r}/${Ol.websocket}`),
      (this.httpEndpoint = hf(r)),
      this._initializeOptions(s),
      this._setupReconnectionTimer(),
      (this.fetch = this._resolveFetch(s == null ? void 0 : s.fetch)));
  }
  connect() {
    if (
      !(
        this.isConnecting() ||
        this.isDisconnecting() ||
        (this.conn !== null && this.isConnected())
      )
    ) {
      if (
        (this._setConnectionState("connecting"),
        this.accessToken &&
          !this._authPromise &&
          this._setAuthSafely("connect"),
        this.transport)
      )
        this.conn = new this.transport(this.endpointURL());
      else
        try {
          this.conn = qy.createWebSocket(this.endpointURL());
        } catch (r) {
          this._setConnectionState("disconnected");
          const s = r.message;
          throw s.includes("Node.js")
            ? new Error(`${s}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`)
            : new Error(`WebSocket not available: ${s}`);
        }
      this._setupConnectionHandlers();
    }
  }
  endpointURL() {
    return this._appendParams(
      this.endPoint,
      Object.assign({}, this.params, { vsn: this.vsn }),
    );
  }
  disconnect(r, s) {
    if (!this.isDisconnecting())
      if ((this._setConnectionState("disconnecting", !0), this.conn)) {
        const a = setTimeout(() => {
          this._setConnectionState("disconnected");
        }, 100);
        ((this.conn.onclose = () => {
          (clearTimeout(a), this._setConnectionState("disconnected"));
        }),
          typeof this.conn.close == "function" &&
            (r ? this.conn.close(r, s ?? "") : this.conn.close()),
          this._teardownConnection());
      } else this._setConnectionState("disconnected");
  }
  getChannels() {
    return this.channels;
  }
  async removeChannel(r) {
    const s = await r.unsubscribe();
    return (this.channels.length === 0 && this.disconnect(), s);
  }
  async removeAllChannels() {
    const r = await Promise.all(this.channels.map((s) => s.unsubscribe()));
    return ((this.channels = []), this.disconnect(), r);
  }
  log(r, s, a) {
    this.logger(r, s, a);
  }
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case _r.connecting:
        return Mr.Connecting;
      case _r.open:
        return Mr.Open;
      case _r.closing:
        return Mr.Closing;
      default:
        return Mr.Closed;
    }
  }
  isConnected() {
    return this.connectionState() === Mr.Open;
  }
  isConnecting() {
    return this._connectionState === "connecting";
  }
  isDisconnecting() {
    return this._connectionState === "disconnecting";
  }
  channel(r, s = { config: {} }) {
    const a = `realtime:${r}`,
      l = this.getChannels().find((u) => u.topic === a);
    if (l) return l;
    {
      const u = new bn(`realtime:${r}`, s, this);
      return (this.channels.push(u), u);
    }
  }
  push(r) {
    const { topic: s, event: a, payload: l, ref: u } = r,
      d = () => {
        this.encode(r, (f) => {
          var p;
          (p = this.conn) === null || p === void 0 || p.send(f);
        });
      };
    (this.log("push", `${s} ${a} (${u})`, l),
      this.isConnected() ? d() : this.sendBuffer.push(d));
  }
  async setAuth(r = null) {
    this._authPromise = this._performAuth(r);
    try {
      await this._authPromise;
    } finally {
      this._authPromise = null;
    }
  }
  _isManualToken() {
    return this._manuallySetToken;
  }
  async sendHeartbeat() {
    var r;
    if (!this.isConnected()) {
      try {
        this.heartbeatCallback("disconnected");
      } catch (s) {
        this.log("error", "error in heartbeat callback", s);
      }
      return;
    }
    if (this.pendingHeartbeatRef) {
      ((this.pendingHeartbeatRef = null),
        (this._heartbeatSentAt = null),
        this.log(
          "transport",
          "heartbeat timeout. Attempting to re-establish connection",
        ));
      try {
        this.heartbeatCallback("timeout");
      } catch (s) {
        this.log("error", "error in heartbeat callback", s);
      }
      ((this._wasManualDisconnect = !1),
        (r = this.conn) === null ||
          r === void 0 ||
          r.close(Qy, "heartbeat timeout"),
        setTimeout(() => {
          var s;
          this.isConnected() ||
            (s = this.reconnectTimer) === null ||
            s === void 0 ||
            s.scheduleTimeout();
        }, Ki.HEARTBEAT_TIMEOUT_FALLBACK));
      return;
    }
    ((this._heartbeatSentAt = Date.now()),
      (this.pendingHeartbeatRef = this._makeRef()),
      this.push({
        topic: "phoenix",
        event: "heartbeat",
        payload: {},
        ref: this.pendingHeartbeatRef,
      }));
    try {
      this.heartbeatCallback("sent");
    } catch (s) {
      this.log("error", "error in heartbeat callback", s);
    }
    this._setAuthSafely("heartbeat");
  }
  onHeartbeat(r) {
    this.heartbeatCallback = r;
  }
  flushSendBuffer() {
    this.isConnected() &&
      this.sendBuffer.length > 0 &&
      (this.sendBuffer.forEach((r) => r()), (this.sendBuffer = []));
  }
  _makeRef() {
    let r = this.ref + 1;
    return (
      r === this.ref ? (this.ref = 0) : (this.ref = r),
      this.ref.toString()
    );
  }
  _leaveOpenTopic(r) {
    let s = this.channels.find(
      (a) => a.topic === r && (a._isJoined() || a._isJoining()),
    );
    s &&
      (this.log("transport", `leaving duplicate topic "${r}"`),
      s.unsubscribe());
  }
  _remove(r) {
    this.channels = this.channels.filter((s) => s.topic !== r.topic);
  }
  _onConnMessage(r) {
    this.decode(r.data, (s) => {
      if (
        s.topic === "phoenix" &&
        s.event === "phx_reply" &&
        s.ref &&
        s.ref === this.pendingHeartbeatRef
      ) {
        const y = this._heartbeatSentAt
          ? Date.now() - this._heartbeatSentAt
          : void 0;
        try {
          this.heartbeatCallback(s.payload.status === "ok" ? "ok" : "error", y);
        } catch (v) {
          this.log("error", "error in heartbeat callback", v);
        }
        ((this._heartbeatSentAt = null), (this.pendingHeartbeatRef = null));
      }
      const { topic: a, event: l, payload: u, ref: d } = s,
        f = d ? `(${d})` : "",
        p = u.status || "";
      (this.log("receive", `${p} ${a} ${l} ${f}`.trim(), u),
        this.channels
          .filter((y) => y._isMember(a))
          .forEach((y) => y._trigger(l, u, d)),
        this._triggerStateCallbacks("message", s));
    });
  }
  _clearTimer(r) {
    var s;
    r === "heartbeat" && this.heartbeatTimer
      ? (clearInterval(this.heartbeatTimer), (this.heartbeatTimer = void 0))
      : r === "reconnect" &&
        ((s = this.reconnectTimer) === null || s === void 0 || s.reset());
  }
  _clearAllTimers() {
    (this._clearTimer("heartbeat"), this._clearTimer("reconnect"));
  }
  _setupConnectionHandlers() {
    this.conn &&
      ("binaryType" in this.conn && (this.conn.binaryType = "arraybuffer"),
      (this.conn.onopen = () => this._onConnOpen()),
      (this.conn.onerror = (r) => this._onConnError(r)),
      (this.conn.onmessage = (r) => this._onConnMessage(r)),
      (this.conn.onclose = (r) => this._onConnClose(r)),
      this.conn.readyState === _r.open && this._onConnOpen());
  }
  _teardownConnection() {
    if (this.conn) {
      if (
        this.conn.readyState === _r.open ||
        this.conn.readyState === _r.connecting
      )
        try {
          this.conn.close();
        } catch (r) {
          this.log("error", "Error closing connection", r);
        }
      ((this.conn.onopen = null),
        (this.conn.onerror = null),
        (this.conn.onmessage = null),
        (this.conn.onclose = null),
        (this.conn = null));
    }
    (this._clearAllTimers(),
      this._terminateWorker(),
      this.channels.forEach((r) => r.teardown()));
  }
  _onConnOpen() {
    (this._setConnectionState("connected"),
      this.log("transport", `connected to ${this.endpointURL()}`),
      (
        this._authPromise ||
        (this.accessToken && !this.accessTokenValue
          ? this.setAuth()
          : Promise.resolve())
      )
        .then(() => {
          (this.accessTokenValue &&
            (this.channels.forEach((s) => {
              s.updateJoinPayload({ access_token: this.accessTokenValue });
            }),
            (this.sendBuffer = []),
            this.channels.forEach((s) => {
              s._isJoining() && ((s.joinPush.sent = !1), s.joinPush.send());
            })),
            this.flushSendBuffer());
        })
        .catch((s) => {
          (this.log("error", "error waiting for auth on connect", s),
            this.flushSendBuffer());
        }),
      this._clearTimer("reconnect"),
      this.worker
        ? this.workerRef || this._startWorkerHeartbeat()
        : this._startHeartbeat(),
      this._triggerStateCallbacks("open"));
  }
  _startHeartbeat() {
    (this.heartbeatTimer && clearInterval(this.heartbeatTimer),
      (this.heartbeatTimer = setInterval(
        () => this.sendHeartbeat(),
        this.heartbeatIntervalMs,
      )));
  }
  _startWorkerHeartbeat() {
    this.workerUrl
      ? this.log("worker", `starting worker for from ${this.workerUrl}`)
      : this.log("worker", "starting default worker");
    const r = this._workerObjectUrl(this.workerUrl);
    ((this.workerRef = new Worker(r)),
      (this.workerRef.onerror = (s) => {
        (this.log("worker", "worker error", s.message),
          this._terminateWorker());
      }),
      (this.workerRef.onmessage = (s) => {
        s.data.event === "keepAlive" && this.sendHeartbeat();
      }),
      this.workerRef.postMessage({
        event: "start",
        interval: this.heartbeatIntervalMs,
      }));
  }
  _terminateWorker() {
    this.workerRef &&
      (this.log("worker", "terminating worker"),
      this.workerRef.terminate(),
      (this.workerRef = void 0));
  }
  _onConnClose(r) {
    var s;
    (this._setConnectionState("disconnected"),
      this.log("transport", "close", r),
      this._triggerChanError(),
      this._clearTimer("heartbeat"),
      this._wasManualDisconnect ||
        (s = this.reconnectTimer) === null ||
        s === void 0 ||
        s.scheduleTimeout(),
      this._triggerStateCallbacks("close", r));
  }
  _onConnError(r) {
    (this._setConnectionState("disconnected"),
      this.log("transport", `${r}`),
      this._triggerChanError(),
      this._triggerStateCallbacks("error", r));
    try {
      this.heartbeatCallback("error");
    } catch (s) {
      this.log("error", "error in heartbeat callback", s);
    }
  }
  _triggerChanError() {
    this.channels.forEach((r) => r._trigger(Pt.error));
  }
  _appendParams(r, s) {
    if (Object.keys(s).length === 0) return r;
    const a = r.match(/\?/) ? "&" : "?",
      l = new URLSearchParams(s);
    return `${r}${a}${l}`;
  }
  _workerObjectUrl(r) {
    let s;
    if (r) s = r;
    else {
      const a = new Blob([ov], { type: "application/javascript" });
      s = URL.createObjectURL(a);
    }
    return s;
  }
  _setConnectionState(r, s = !1) {
    ((this._connectionState = r),
      r === "connecting"
        ? (this._wasManualDisconnect = !1)
        : r === "disconnecting" && (this._wasManualDisconnect = s));
  }
  async _performAuth(r = null) {
    let s,
      a = !1;
    if (r) ((s = r), (a = !0));
    else if (this.accessToken)
      try {
        s = await this.accessToken();
      } catch (l) {
        (this.log("error", "Error fetching access token from callback", l),
          (s = this.accessTokenValue));
      }
    else s = this.accessTokenValue;
    (a
      ? (this._manuallySetToken = !0)
      : this.accessToken && (this._manuallySetToken = !1),
      this.accessTokenValue != s &&
        ((this.accessTokenValue = s),
        this.channels.forEach((l) => {
          const u = { access_token: s, version: Gy };
          (s && l.updateJoinPayload(u),
            l.joinedOnce &&
              l._isJoined() &&
              l._push(Pt.access_token, { access_token: s }));
        })));
  }
  async _waitForAuthIfNeeded() {
    this._authPromise && (await this._authPromise);
  }
  _setAuthSafely(r = "general") {
    this._isManualToken() ||
      this.setAuth().catch((s) => {
        this.log("error", `Error setting auth in ${r}`, s);
      });
  }
  _triggerStateCallbacks(r, s) {
    try {
      this.stateChangeCallbacks[r].forEach((a) => {
        try {
          a(s);
        } catch (l) {
          this.log("error", `error in ${r} callback`, l);
        }
      });
    } catch (a) {
      this.log("error", `error triggering ${r} callbacks`, a);
    }
  }
  _setupReconnectionTimer() {
    this.reconnectTimer = new cf(async () => {
      setTimeout(async () => {
        (await this._waitForAuthIfNeeded(),
          this.isConnected() || this.connect());
      }, Ki.RECONNECT_DELAY);
    }, this.reconnectAfterMs);
  }
  _initializeOptions(r) {
    var s, a, l, u, d, f, p, y, v, x, _, S;
    switch (
      ((this.transport =
        (s = r == null ? void 0 : r.transport) !== null && s !== void 0
          ? s
          : null),
      (this.timeout =
        (a = r == null ? void 0 : r.timeout) !== null && a !== void 0 ? a : Pl),
      (this.heartbeatIntervalMs =
        (l = r == null ? void 0 : r.heartbeatIntervalMs) !== null &&
        l !== void 0
          ? l
          : Ki.HEARTBEAT_INTERVAL),
      (this.worker =
        (u = r == null ? void 0 : r.worker) !== null && u !== void 0 ? u : !1),
      (this.accessToken =
        (d = r == null ? void 0 : r.accessToken) !== null && d !== void 0
          ? d
          : null),
      (this.heartbeatCallback =
        (f = r == null ? void 0 : r.heartbeatCallback) !== null && f !== void 0
          ? f
          : wl),
      (this.vsn =
        (p = r == null ? void 0 : r.vsn) !== null && p !== void 0 ? p : fh),
      r != null && r.params && (this.params = r.params),
      r != null && r.logger && (this.logger = r.logger),
      ((r != null && r.logLevel) || (r != null && r.log_level)) &&
        ((this.logLevel = r.logLevel || r.log_level),
        (this.params = Object.assign(Object.assign({}, this.params), {
          log_level: this.logLevel,
        }))),
      (this.reconnectAfterMs =
        (y = r == null ? void 0 : r.reconnectAfterMs) !== null && y !== void 0
          ? y
          : (N) => iv[N - 1] || av),
      this.vsn)
    ) {
      case Jy:
        ((this.encode =
          (v = r == null ? void 0 : r.encode) !== null && v !== void 0
            ? v
            : (N, j) => j(JSON.stringify(N))),
          (this.decode =
            (x = r == null ? void 0 : r.decode) !== null && x !== void 0
              ? x
              : (N, j) => j(JSON.parse(N))));
        break;
      case uf:
        ((this.encode =
          (_ = r == null ? void 0 : r.encode) !== null && _ !== void 0
            ? _
            : this.serializer.encode.bind(this.serializer)),
          (this.decode =
            (S = r == null ? void 0 : r.decode) !== null && S !== void 0
              ? S
              : this.serializer.decode.bind(this.serializer)));
        break;
      default:
        throw new Error(`Unsupported serializer version: ${this.vsn}`);
    }
    if (this.worker) {
      if (typeof window < "u" && !window.Worker)
        throw new Error("Web Worker is not supported");
      this.workerUrl = r == null ? void 0 : r.workerUrl;
    }
  }
}
var Es = class extends Error {
  constructor(n, r) {
    var s;
    (super(n),
      (this.name = "IcebergError"),
      (this.status = r.status),
      (this.icebergType = r.icebergType),
      (this.icebergCode = r.icebergCode),
      (this.details = r.details),
      (this.isCommitStateUnknown =
        r.icebergType === "CommitStateUnknownException" ||
        ([500, 502, 504].includes(r.status) &&
          ((s = r.icebergType) == null ? void 0 : s.includes("CommitState")) ===
            !0)));
  }
  isNotFound() {
    return this.status === 404;
  }
  isConflict() {
    return this.status === 409;
  }
  isAuthenticationTimeout() {
    return this.status === 419;
  }
};
function uv(n, r, s) {
  const a = new URL(r, n);
  if (s)
    for (const [l, u] of Object.entries(s))
      u !== void 0 && a.searchParams.set(l, u);
  return a.toString();
}
async function cv(n) {
  return !n || n.type === "none"
    ? {}
    : n.type === "bearer"
      ? { Authorization: `Bearer ${n.token}` }
      : n.type === "header"
        ? { [n.name]: n.value }
        : n.type === "custom"
          ? await n.getHeaders()
          : {};
}
function dv(n) {
  const r = n.fetchImpl ?? globalThis.fetch;
  return {
    async request({ method: s, path: a, query: l, body: u, headers: d }) {
      const f = uv(n.baseUrl, a, l),
        p = await cv(n.auth),
        y = await r(f, {
          method: s,
          headers: {
            ...(u ? { "Content-Type": "application/json" } : {}),
            ...p,
            ...d,
          },
          body: u ? JSON.stringify(u) : void 0,
        }),
        v = await y.text(),
        x = (y.headers.get("content-type") || "").includes("application/json"),
        _ = x && v ? JSON.parse(v) : v;
      if (!y.ok) {
        const S = x ? _ : void 0,
          N = S == null ? void 0 : S.error;
        throw new Es(
          (N == null ? void 0 : N.message) ??
            `Request failed with status ${y.status}`,
          {
            status: y.status,
            icebergType: N == null ? void 0 : N.type,
            icebergCode: N == null ? void 0 : N.code,
            details: S,
          },
        );
      }
      return { status: y.status, headers: y.headers, data: _ };
    },
  };
}
function Gi(n) {
  return n.join("");
}
var hv = class {
  constructor(n, r = "") {
    ((this.client = n), (this.prefix = r));
  }
  async listNamespaces(n) {
    const r = n ? { parent: Gi(n.namespace) } : void 0;
    return (
      await this.client.request({
        method: "GET",
        path: `${this.prefix}/namespaces`,
        query: r,
      })
    ).data.namespaces.map((a) => ({ namespace: a }));
  }
  async createNamespace(n, r) {
    const s = {
      namespace: n.namespace,
      properties: r == null ? void 0 : r.properties,
    };
    return (
      await this.client.request({
        method: "POST",
        path: `${this.prefix}/namespaces`,
        body: s,
      })
    ).data;
  }
  async dropNamespace(n) {
    await this.client.request({
      method: "DELETE",
      path: `${this.prefix}/namespaces/${Gi(n.namespace)}`,
    });
  }
  async loadNamespaceMetadata(n) {
    return {
      properties: (
        await this.client.request({
          method: "GET",
          path: `${this.prefix}/namespaces/${Gi(n.namespace)}`,
        })
      ).data.properties,
    };
  }
  async namespaceExists(n) {
    try {
      return (
        await this.client.request({
          method: "HEAD",
          path: `${this.prefix}/namespaces/${Gi(n.namespace)}`,
        }),
        !0
      );
    } catch (r) {
      if (r instanceof Es && r.status === 404) return !1;
      throw r;
    }
  }
  async createNamespaceIfNotExists(n, r) {
    try {
      return await this.createNamespace(n, r);
    } catch (s) {
      if (s instanceof Es && s.status === 409) return;
      throw s;
    }
  }
};
function pn(n) {
  return n.join("");
}
var fv = class {
    constructor(n, r = "", s) {
      ((this.client = n), (this.prefix = r), (this.accessDelegation = s));
    }
    async listTables(n) {
      return (
        await this.client.request({
          method: "GET",
          path: `${this.prefix}/namespaces/${pn(n.namespace)}/tables`,
        })
      ).data.identifiers;
    }
    async createTable(n, r) {
      const s = {};
      return (
        this.accessDelegation &&
          (s["X-Iceberg-Access-Delegation"] = this.accessDelegation),
        (
          await this.client.request({
            method: "POST",
            path: `${this.prefix}/namespaces/${pn(n.namespace)}/tables`,
            body: r,
            headers: s,
          })
        ).data.metadata
      );
    }
    async updateTable(n, r) {
      const s = await this.client.request({
        method: "POST",
        path: `${this.prefix}/namespaces/${pn(n.namespace)}/tables/${n.name}`,
        body: r,
      });
      return {
        "metadata-location": s.data["metadata-location"],
        metadata: s.data.metadata,
      };
    }
    async dropTable(n, r) {
      await this.client.request({
        method: "DELETE",
        path: `${this.prefix}/namespaces/${pn(n.namespace)}/tables/${n.name}`,
        query: { purgeRequested: String((r == null ? void 0 : r.purge) ?? !1) },
      });
    }
    async loadTable(n) {
      const r = {};
      return (
        this.accessDelegation &&
          (r["X-Iceberg-Access-Delegation"] = this.accessDelegation),
        (
          await this.client.request({
            method: "GET",
            path: `${this.prefix}/namespaces/${pn(n.namespace)}/tables/${n.name}`,
            headers: r,
          })
        ).data.metadata
      );
    }
    async tableExists(n) {
      const r = {};
      this.accessDelegation &&
        (r["X-Iceberg-Access-Delegation"] = this.accessDelegation);
      try {
        return (
          await this.client.request({
            method: "HEAD",
            path: `${this.prefix}/namespaces/${pn(n.namespace)}/tables/${n.name}`,
            headers: r,
          }),
          !0
        );
      } catch (s) {
        if (s instanceof Es && s.status === 404) return !1;
        throw s;
      }
    }
    async createTableIfNotExists(n, r) {
      try {
        return await this.createTable(n, r);
      } catch (s) {
        if (s instanceof Es && s.status === 409)
          return await this.loadTable({ namespace: n.namespace, name: r.name });
        throw s;
      }
    }
  },
  pv = class {
    constructor(n) {
      var a;
      let r = "v1";
      n.catalogName && (r += `/${n.catalogName}`);
      const s = n.baseUrl.endsWith("/") ? n.baseUrl : `${n.baseUrl}/`;
      ((this.client = dv({ baseUrl: s, auth: n.auth, fetchImpl: n.fetch })),
        (this.accessDelegation =
          (a = n.accessDelegation) == null ? void 0 : a.join(",")),
        (this.namespaceOps = new hv(this.client, r)),
        (this.tableOps = new fv(this.client, r, this.accessDelegation)));
    }
    async listNamespaces(n) {
      return this.namespaceOps.listNamespaces(n);
    }
    async createNamespace(n, r) {
      return this.namespaceOps.createNamespace(n, r);
    }
    async dropNamespace(n) {
      await this.namespaceOps.dropNamespace(n);
    }
    async loadNamespaceMetadata(n) {
      return this.namespaceOps.loadNamespaceMetadata(n);
    }
    async listTables(n) {
      return this.tableOps.listTables(n);
    }
    async createTable(n, r) {
      return this.tableOps.createTable(n, r);
    }
    async updateTable(n, r) {
      return this.tableOps.updateTable(n, r);
    }
    async dropTable(n, r) {
      await this.tableOps.dropTable(n, r);
    }
    async loadTable(n) {
      return this.tableOps.loadTable(n);
    }
    async namespaceExists(n) {
      return this.namespaceOps.namespaceExists(n);
    }
    async tableExists(n) {
      return this.tableOps.tableExists(n);
    }
    async createNamespaceIfNotExists(n, r) {
      return this.namespaceOps.createNamespaceIfNotExists(n, r);
    }
    async createTableIfNotExists(n, r) {
      return this.tableOps.createTableIfNotExists(n, r);
    }
  },
  ha = class extends Error {
    constructor(n, r = "storage", s, a) {
      (super(n),
        (this.__isStorageError = !0),
        (this.namespace = r),
        (this.name = r === "vectors" ? "StorageVectorsError" : "StorageError"),
        (this.status = s),
        (this.statusCode = a));
    }
  };
function fa(n) {
  return typeof n == "object" && n !== null && "__isStorageError" in n;
}
var Il = class extends ha {
    constructor(n, r, s, a = "storage") {
      (super(n, a, r, s),
        (this.name =
          a === "vectors" ? "StorageVectorsApiError" : "StorageApiError"),
        (this.status = r),
        (this.statusCode = s));
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        statusCode: this.statusCode,
      };
    }
  },
  ff = class extends ha {
    constructor(n, r, s = "storage") {
      (super(n, s),
        (this.name =
          s === "vectors"
            ? "StorageVectorsUnknownError"
            : "StorageUnknownError"),
        (this.originalError = r));
    }
  };
const mv = (n) => (n ? (...r) => n(...r) : (...r) => fetch(...r)),
  gv = (n) => {
    if (typeof n != "object" || n === null) return !1;
    const r = Object.getPrototypeOf(n);
    return (
      (r === null ||
        r === Object.prototype ||
        Object.getPrototypeOf(r) === null) &&
      !(Symbol.toStringTag in n) &&
      !(Symbol.iterator in n)
    );
  },
  Ll = (n) => {
    if (Array.isArray(n)) return n.map((s) => Ll(s));
    if (typeof n == "function" || n !== Object(n)) return n;
    const r = {};
    return (
      Object.entries(n).forEach(([s, a]) => {
        const l = s.replace(/([-_][a-z])/gi, (u) =>
          u.toUpperCase().replace(/[-_]/g, ""),
        );
        r[l] = Ll(a);
      }),
      r
    );
  },
  yv = (n) =>
    !n ||
    typeof n != "string" ||
    n.length === 0 ||
    n.length > 100 ||
    n.trim() !== n ||
    n.includes("/") ||
    n.includes("\\")
      ? !1
      : /^[\w!.\*'() &$@=;:+,?-]+$/.test(n);
function js(n) {
  "@babel/helpers - typeof";
  return (
    (js =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (r) {
            return typeof r;
          }
        : function (r) {
            return r &&
              typeof Symbol == "function" &&
              r.constructor === Symbol &&
              r !== Symbol.prototype
              ? "symbol"
              : typeof r;
          }),
    js(n)
  );
}
function vv(n, r) {
  if (js(n) != "object" || !n) return n;
  var s = n[Symbol.toPrimitive];
  if (s !== void 0) {
    var a = s.call(n, r);
    if (js(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r === "string" ? String : Number)(n);
}
function wv(n) {
  var r = vv(n, "string");
  return js(r) == "symbol" ? r : r + "";
}
function xv(n, r, s) {
  return (
    (r = wv(r)) in n
      ? Object.defineProperty(n, r, {
          value: s,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (n[r] = s),
    n
  );
}
function yh(n, r) {
  var s = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(n);
    (r &&
      (a = a.filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      })),
      s.push.apply(s, a));
  }
  return s;
}
function ee(n) {
  for (var r = 1; r < arguments.length; r++) {
    var s = arguments[r] != null ? arguments[r] : {};
    r % 2
      ? yh(Object(s), !0).forEach(function (a) {
          xv(n, a, s[a]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(s))
        : yh(Object(s)).forEach(function (a) {
            Object.defineProperty(n, a, Object.getOwnPropertyDescriptor(s, a));
          });
  }
  return n;
}
const vh = (n) => {
    var r;
    return (
      n.msg ||
      n.message ||
      n.error_description ||
      (typeof n.error == "string"
        ? n.error
        : (r = n.error) === null || r === void 0
          ? void 0
          : r.message) ||
      JSON.stringify(n)
    );
  },
  _v = async (n, r, s, a) => {
    if (n !== null && typeof n == "object" && typeof n.json == "function") {
      const l = n;
      let u = parseInt(l.status, 10);
      (Number.isFinite(u) || (u = 500),
        l
          .json()
          .then((d) => {
            const f =
              (d == null ? void 0 : d.statusCode) ||
              (d == null ? void 0 : d.code) ||
              u + "";
            r(new Il(vh(d), u, f, a));
          })
          .catch(() => {
            const d = u + "";
            r(new Il(l.statusText || `HTTP ${u} error`, u, d, a));
          }));
    } else r(new ff(vh(n), n, a));
  },
  kv = (n, r, s, a) => {
    const l = { method: n, headers: (r == null ? void 0 : r.headers) || {} };
    return n === "GET" || n === "HEAD" || !a
      ? ee(ee({}, l), s)
      : (gv(a)
          ? ((l.headers = ee(
              { "Content-Type": "application/json" },
              r == null ? void 0 : r.headers,
            )),
            (l.body = JSON.stringify(a)))
          : (l.body = a),
        r != null && r.duplex && (l.duplex = r.duplex),
        ee(ee({}, l), s));
  };
async function ys(n, r, s, a, l, u, d) {
  return new Promise((f, p) => {
    n(s, kv(r, a, l, u))
      .then((y) => {
        if (!y.ok) throw y;
        if (a != null && a.noResolveJson) return y;
        if (d === "vectors") {
          const v = y.headers.get("content-type");
          if (y.headers.get("content-length") === "0" || y.status === 204)
            return {};
          if (!v || !v.includes("application/json")) return {};
        }
        return y.json();
      })
      .then((y) => f(y))
      .catch((y) => _v(y, p, a, d));
  });
}
function pf(n = "storage") {
  return {
    get: async (r, s, a, l) => ys(r, "GET", s, a, l, void 0, n),
    post: async (r, s, a, l, u) => ys(r, "POST", s, l, u, a, n),
    put: async (r, s, a, l, u) => ys(r, "PUT", s, l, u, a, n),
    head: async (r, s, a, l) =>
      ys(r, "HEAD", s, ee(ee({}, a), {}, { noResolveJson: !0 }), l, void 0, n),
    remove: async (r, s, a, l, u) => ys(r, "DELETE", s, l, u, a, n),
  };
}
const bv = pf("storage"),
  { get: Cs, post: Nt, put: $l, head: Sv, remove: Jl } = bv,
  ft = pf("vectors");
var Tn = class {
    constructor(n, r = {}, s, a = "storage") {
      ((this.shouldThrowOnError = !1),
        (this.url = n),
        (this.headers = r),
        (this.fetch = mv(s)),
        (this.namespace = a));
    }
    throwOnError() {
      return ((this.shouldThrowOnError = !0), this);
    }
    setHeader(n, r) {
      return ((this.headers = ee(ee({}, this.headers), {}, { [n]: r })), this);
    }
    async handleOperation(n) {
      var r = this;
      try {
        return { data: await n(), error: null };
      } catch (s) {
        if (r.shouldThrowOnError) throw s;
        if (fa(s)) return { data: null, error: s };
        throw s;
      }
    }
  },
  Ev = class {
    constructor(n, r) {
      ((this.downloadFn = n), (this.shouldThrowOnError = r));
    }
    then(n, r) {
      return this.execute().then(n, r);
    }
    async execute() {
      var n = this;
      try {
        return { data: (await n.downloadFn()).body, error: null };
      } catch (r) {
        if (n.shouldThrowOnError) throw r;
        if (fa(r)) return { data: null, error: r };
        throw r;
      }
    }
  };
let mf;
mf = Symbol.toStringTag;
var jv = class {
  constructor(n, r) {
    ((this.downloadFn = n),
      (this.shouldThrowOnError = r),
      (this[mf] = "BlobDownloadBuilder"),
      (this.promise = null));
  }
  asStream() {
    return new Ev(this.downloadFn, this.shouldThrowOnError);
  }
  then(n, r) {
    return this.getPromise().then(n, r);
  }
  catch(n) {
    return this.getPromise().catch(n);
  }
  finally(n) {
    return this.getPromise().finally(n);
  }
  getPromise() {
    return (this.promise || (this.promise = this.execute()), this.promise);
  }
  async execute() {
    var n = this;
    try {
      return { data: await (await n.downloadFn()).blob(), error: null };
    } catch (r) {
      if (n.shouldThrowOnError) throw r;
      if (fa(r)) return { data: null, error: r };
      throw r;
    }
  }
};
const Cv = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } },
  wh = {
    cacheControl: "3600",
    contentType: "text/plain;charset=UTF-8",
    upsert: !1,
  };
var Rv = class extends Tn {
  constructor(n, r = {}, s, a) {
    (super(n, r, a, "storage"), (this.bucketId = s));
  }
  async uploadOrUpdate(n, r, s, a) {
    var l = this;
    return l.handleOperation(async () => {
      let u;
      const d = ee(ee({}, wh), a);
      let f = ee(
        ee({}, l.headers),
        n === "POST" && { "x-upsert": String(d.upsert) },
      );
      const p = d.metadata;
      (typeof Blob < "u" && s instanceof Blob
        ? ((u = new FormData()),
          u.append("cacheControl", d.cacheControl),
          p && u.append("metadata", l.encodeMetadata(p)),
          u.append("", s))
        : typeof FormData < "u" && s instanceof FormData
          ? ((u = s),
            u.has("cacheControl") || u.append("cacheControl", d.cacheControl),
            p &&
              !u.has("metadata") &&
              u.append("metadata", l.encodeMetadata(p)))
          : ((u = s),
            (f["cache-control"] = `max-age=${d.cacheControl}`),
            (f["content-type"] = d.contentType),
            p && (f["x-metadata"] = l.toBase64(l.encodeMetadata(p))),
            ((typeof ReadableStream < "u" && u instanceof ReadableStream) ||
              (u &&
                typeof u == "object" &&
                "pipe" in u &&
                typeof u.pipe == "function")) &&
              !d.duplex &&
              (d.duplex = "half")),
        a != null && a.headers && (f = ee(ee({}, f), a.headers)));
      const y = l._removeEmptyFolders(r),
        v = l._getFinalPath(y),
        x = await (n == "PUT" ? $l : Nt)(
          l.fetch,
          `${l.url}/object/${v}`,
          u,
          ee({ headers: f }, d != null && d.duplex ? { duplex: d.duplex } : {}),
        );
      return { path: y, id: x.Id, fullPath: x.Key };
    });
  }
  async upload(n, r, s) {
    return this.uploadOrUpdate("POST", n, r, s);
  }
  async uploadToSignedUrl(n, r, s, a) {
    var l = this;
    const u = l._removeEmptyFolders(n),
      d = l._getFinalPath(u),
      f = new URL(l.url + `/object/upload/sign/${d}`);
    return (
      f.searchParams.set("token", r),
      l.handleOperation(async () => {
        let p;
        const y = ee({ upsert: wh.upsert }, a),
          v = ee(ee({}, l.headers), { "x-upsert": String(y.upsert) });
        return (
          typeof Blob < "u" && s instanceof Blob
            ? ((p = new FormData()),
              p.append("cacheControl", y.cacheControl),
              p.append("", s))
            : typeof FormData < "u" && s instanceof FormData
              ? ((p = s), p.append("cacheControl", y.cacheControl))
              : ((p = s),
                (v["cache-control"] = `max-age=${y.cacheControl}`),
                (v["content-type"] = y.contentType)),
          {
            path: u,
            fullPath: (await $l(l.fetch, f.toString(), p, { headers: v })).Key,
          }
        );
      })
    );
  }
  async createSignedUploadUrl(n, r) {
    var s = this;
    return s.handleOperation(async () => {
      let a = s._getFinalPath(n);
      const l = ee({}, s.headers);
      r != null && r.upsert && (l["x-upsert"] = "true");
      const u = await Nt(
          s.fetch,
          `${s.url}/object/upload/sign/${a}`,
          {},
          { headers: l },
        ),
        d = new URL(s.url + u.url),
        f = d.searchParams.get("token");
      if (!f) throw new ha("No token returned by API");
      return { signedUrl: d.toString(), path: n, token: f };
    });
  }
  async update(n, r, s) {
    return this.uploadOrUpdate("PUT", n, r, s);
  }
  async move(n, r, s) {
    var a = this;
    return a.handleOperation(
      async () =>
        await Nt(
          a.fetch,
          `${a.url}/object/move`,
          {
            bucketId: a.bucketId,
            sourceKey: n,
            destinationKey: r,
            destinationBucket: s == null ? void 0 : s.destinationBucket,
          },
          { headers: a.headers },
        ),
    );
  }
  async copy(n, r, s) {
    var a = this;
    return a.handleOperation(async () => ({
      path: (
        await Nt(
          a.fetch,
          `${a.url}/object/copy`,
          {
            bucketId: a.bucketId,
            sourceKey: n,
            destinationKey: r,
            destinationBucket: s == null ? void 0 : s.destinationBucket,
          },
          { headers: a.headers },
        )
      ).Key,
    }));
  }
  async createSignedUrl(n, r, s) {
    var a = this;
    return a.handleOperation(async () => {
      let l = a._getFinalPath(n);
      const u =
        typeof (s == null ? void 0 : s.transform) == "object" &&
        s.transform !== null &&
        Object.keys(s.transform).length > 0;
      let d = await Nt(
        a.fetch,
        `${a.url}/object/sign/${l}`,
        ee({ expiresIn: r }, u ? { transform: s.transform } : {}),
        { headers: a.headers },
      );
      const f =
          s != null && s.download
            ? `&download=${s.download === !0 ? "" : s.download}`
            : "",
        p =
          u && d.signedURL.includes("/object/sign/")
            ? d.signedURL.replace("/object/sign/", "/render/image/sign/")
            : d.signedURL;
      return { signedUrl: encodeURI(`${a.url}${p}${f}`) };
    });
  }
  async createSignedUrls(n, r, s) {
    var a = this;
    return a.handleOperation(async () => {
      const l = await Nt(
          a.fetch,
          `${a.url}/object/sign/${a.bucketId}`,
          { expiresIn: r, paths: n },
          { headers: a.headers },
        ),
        u =
          s != null && s.download
            ? `&download=${s.download === !0 ? "" : s.download}`
            : "";
      return l.map((d) =>
        ee(
          ee({}, d),
          {},
          {
            signedUrl: d.signedURL
              ? encodeURI(`${a.url}${d.signedURL}${u}`)
              : null,
          },
        ),
      );
    });
  }
  download(n, r, s) {
    const a =
        typeof (r == null ? void 0 : r.transform) < "u"
          ? "render/image/authenticated"
          : "object",
      l = this.transformOptsToQueryString(
        (r == null ? void 0 : r.transform) || {},
      ),
      u = l ? `?${l}` : "",
      d = this._getFinalPath(n),
      f = () =>
        Cs(
          this.fetch,
          `${this.url}/${a}/${d}${u}`,
          { headers: this.headers, noResolveJson: !0 },
          s,
        );
    return new jv(f, this.shouldThrowOnError);
  }
  async info(n) {
    var r = this;
    const s = r._getFinalPath(n);
    return r.handleOperation(async () =>
      Ll(
        await Cs(r.fetch, `${r.url}/object/info/${s}`, { headers: r.headers }),
      ),
    );
  }
  async exists(n) {
    var r = this;
    const s = r._getFinalPath(n);
    try {
      return (
        await Sv(r.fetch, `${r.url}/object/${s}`, { headers: r.headers }),
        { data: !0, error: null }
      );
    } catch (l) {
      if (r.shouldThrowOnError) throw l;
      if (fa(l)) {
        var a;
        const u =
          l instanceof Il
            ? l.status
            : l instanceof ff
              ? (a = l.originalError) === null || a === void 0
                ? void 0
                : a.status
              : void 0;
        if (u !== void 0 && [400, 404].includes(u))
          return { data: !1, error: l };
      }
      throw l;
    }
  }
  getPublicUrl(n, r) {
    const s = this._getFinalPath(n),
      a = [],
      l =
        r != null && r.download
          ? `download=${r.download === !0 ? "" : r.download}`
          : "";
    l !== "" && a.push(l);
    const u =
        typeof (r == null ? void 0 : r.transform) < "u"
          ? "render/image"
          : "object",
      d = this.transformOptsToQueryString(
        (r == null ? void 0 : r.transform) || {},
      );
    d !== "" && a.push(d);
    let f = a.join("&");
    return (
      f !== "" && (f = `?${f}`),
      { data: { publicUrl: encodeURI(`${this.url}/${u}/public/${s}${f}`) } }
    );
  }
  async remove(n) {
    var r = this;
    return r.handleOperation(
      async () =>
        await Jl(
          r.fetch,
          `${r.url}/object/${r.bucketId}`,
          { prefixes: n },
          { headers: r.headers },
        ),
    );
  }
  async list(n, r, s) {
    var a = this;
    return a.handleOperation(async () => {
      const l = ee(ee(ee({}, Cv), r), {}, { prefix: n || "" });
      return await Nt(
        a.fetch,
        `${a.url}/object/list/${a.bucketId}`,
        l,
        { headers: a.headers },
        s,
      );
    });
  }
  async listV2(n, r) {
    var s = this;
    return s.handleOperation(async () => {
      const a = ee({}, n);
      return await Nt(
        s.fetch,
        `${s.url}/object/list-v2/${s.bucketId}`,
        a,
        { headers: s.headers },
        r,
      );
    });
  }
  encodeMetadata(n) {
    return JSON.stringify(n);
  }
  toBase64(n) {
    return typeof Buffer < "u" ? Buffer.from(n).toString("base64") : btoa(n);
  }
  _getFinalPath(n) {
    return `${this.bucketId}/${n.replace(/^\/+/, "")}`;
  }
  _removeEmptyFolders(n) {
    return n.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
  }
  transformOptsToQueryString(n) {
    const r = [];
    return (
      n.width && r.push(`width=${n.width}`),
      n.height && r.push(`height=${n.height}`),
      n.resize && r.push(`resize=${n.resize}`),
      n.format && r.push(`format=${n.format}`),
      n.quality && r.push(`quality=${n.quality}`),
      r.join("&")
    );
  }
};
const Tv = "2.99.3",
  As = { "X-Client-Info": `storage-js/${Tv}` };
var Nv = class extends Tn {
    constructor(n, r = {}, s, a) {
      const l = new URL(n);
      a != null &&
        a.useNewHostname &&
        /supabase\.(co|in|red)$/.test(l.hostname) &&
        !l.hostname.includes("storage.supabase.") &&
        (l.hostname = l.hostname.replace("supabase.", "storage.supabase."));
      const u = l.href.replace(/\/$/, ""),
        d = ee(ee({}, As), r);
      super(u, d, s, "storage");
    }
    async listBuckets(n) {
      var r = this;
      return r.handleOperation(async () => {
        const s = r.listBucketOptionsToQueryString(n);
        return await Cs(r.fetch, `${r.url}/bucket${s}`, { headers: r.headers });
      });
    }
    async getBucket(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          await Cs(r.fetch, `${r.url}/bucket/${n}`, { headers: r.headers }),
      );
    }
    async createBucket(n, r = { public: !1 }) {
      var s = this;
      return s.handleOperation(
        async () =>
          await Nt(
            s.fetch,
            `${s.url}/bucket`,
            {
              id: n,
              name: n,
              type: r.type,
              public: r.public,
              file_size_limit: r.fileSizeLimit,
              allowed_mime_types: r.allowedMimeTypes,
            },
            { headers: s.headers },
          ),
      );
    }
    async updateBucket(n, r) {
      var s = this;
      return s.handleOperation(
        async () =>
          await $l(
            s.fetch,
            `${s.url}/bucket/${n}`,
            {
              id: n,
              name: n,
              public: r.public,
              file_size_limit: r.fileSizeLimit,
              allowed_mime_types: r.allowedMimeTypes,
            },
            { headers: s.headers },
          ),
      );
    }
    async emptyBucket(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          await Nt(
            r.fetch,
            `${r.url}/bucket/${n}/empty`,
            {},
            { headers: r.headers },
          ),
      );
    }
    async deleteBucket(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          await Jl(r.fetch, `${r.url}/bucket/${n}`, {}, { headers: r.headers }),
      );
    }
    listBucketOptionsToQueryString(n) {
      const r = {};
      return (
        n &&
          ("limit" in n && (r.limit = String(n.limit)),
          "offset" in n && (r.offset = String(n.offset)),
          n.search && (r.search = n.search),
          n.sortColumn && (r.sortColumn = n.sortColumn),
          n.sortOrder && (r.sortOrder = n.sortOrder)),
        Object.keys(r).length > 0 ? "?" + new URLSearchParams(r).toString() : ""
      );
    }
  },
  Pv = class extends Tn {
    constructor(n, r = {}, s) {
      const a = n.replace(/\/$/, ""),
        l = ee(ee({}, As), r);
      super(a, l, s, "storage");
    }
    async createBucket(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          await Nt(
            r.fetch,
            `${r.url}/bucket`,
            { name: n },
            { headers: r.headers },
          ),
      );
    }
    async listBuckets(n) {
      var r = this;
      return r.handleOperation(async () => {
        const s = new URLSearchParams();
        ((n == null ? void 0 : n.limit) !== void 0 &&
          s.set("limit", n.limit.toString()),
          (n == null ? void 0 : n.offset) !== void 0 &&
            s.set("offset", n.offset.toString()),
          n != null && n.sortColumn && s.set("sortColumn", n.sortColumn),
          n != null && n.sortOrder && s.set("sortOrder", n.sortOrder),
          n != null && n.search && s.set("search", n.search));
        const a = s.toString(),
          l = a ? `${r.url}/bucket?${a}` : `${r.url}/bucket`;
        return await Cs(r.fetch, l, { headers: r.headers });
      });
    }
    async deleteBucket(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          await Jl(r.fetch, `${r.url}/bucket/${n}`, {}, { headers: r.headers }),
      );
    }
    from(n) {
      var r = this;
      if (!yv(n))
        throw new ha(
          "Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.",
        );
      const s = new pv({
          baseUrl: this.url,
          catalogName: n,
          auth: { type: "custom", getHeaders: async () => r.headers },
          fetch: this.fetch,
        }),
        a = this.shouldThrowOnError;
      return new Proxy(s, {
        get(l, u) {
          const d = l[u];
          return typeof d != "function"
            ? d
            : async (...f) => {
                try {
                  return { data: await d.apply(l, f), error: null };
                } catch (p) {
                  if (a) throw p;
                  return { data: null, error: p };
                }
              };
        },
      });
    }
  },
  Ov = class extends Tn {
    constructor(n, r = {}, s) {
      const a = n.replace(/\/$/, ""),
        l = ee(ee({}, As), {}, { "Content-Type": "application/json" }, r);
      super(a, l, s, "vectors");
    }
    async createIndex(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          (await ft.post(r.fetch, `${r.url}/CreateIndex`, n, {
            headers: r.headers,
          })) || {},
      );
    }
    async getIndex(n, r) {
      var s = this;
      return s.handleOperation(
        async () =>
          await ft.post(
            s.fetch,
            `${s.url}/GetIndex`,
            { vectorBucketName: n, indexName: r },
            { headers: s.headers },
          ),
      );
    }
    async listIndexes(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          await ft.post(r.fetch, `${r.url}/ListIndexes`, n, {
            headers: r.headers,
          }),
      );
    }
    async deleteIndex(n, r) {
      var s = this;
      return s.handleOperation(
        async () =>
          (await ft.post(
            s.fetch,
            `${s.url}/DeleteIndex`,
            { vectorBucketName: n, indexName: r },
            { headers: s.headers },
          )) || {},
      );
    }
  },
  Av = class extends Tn {
    constructor(n, r = {}, s) {
      const a = n.replace(/\/$/, ""),
        l = ee(ee({}, As), {}, { "Content-Type": "application/json" }, r);
      super(a, l, s, "vectors");
    }
    async putVectors(n) {
      var r = this;
      if (n.vectors.length < 1 || n.vectors.length > 500)
        throw new Error("Vector batch size must be between 1 and 500 items");
      return r.handleOperation(
        async () =>
          (await ft.post(r.fetch, `${r.url}/PutVectors`, n, {
            headers: r.headers,
          })) || {},
      );
    }
    async getVectors(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          await ft.post(r.fetch, `${r.url}/GetVectors`, n, {
            headers: r.headers,
          }),
      );
    }
    async listVectors(n) {
      var r = this;
      if (n.segmentCount !== void 0) {
        if (n.segmentCount < 1 || n.segmentCount > 16)
          throw new Error("segmentCount must be between 1 and 16");
        if (
          n.segmentIndex !== void 0 &&
          (n.segmentIndex < 0 || n.segmentIndex >= n.segmentCount)
        )
          throw new Error(
            `segmentIndex must be between 0 and ${n.segmentCount - 1}`,
          );
      }
      return r.handleOperation(
        async () =>
          await ft.post(r.fetch, `${r.url}/ListVectors`, n, {
            headers: r.headers,
          }),
      );
    }
    async queryVectors(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          await ft.post(r.fetch, `${r.url}/QueryVectors`, n, {
            headers: r.headers,
          }),
      );
    }
    async deleteVectors(n) {
      var r = this;
      if (n.keys.length < 1 || n.keys.length > 500)
        throw new Error("Keys batch size must be between 1 and 500 items");
      return r.handleOperation(
        async () =>
          (await ft.post(r.fetch, `${r.url}/DeleteVectors`, n, {
            headers: r.headers,
          })) || {},
      );
    }
  },
  Iv = class extends Tn {
    constructor(n, r = {}, s) {
      const a = n.replace(/\/$/, ""),
        l = ee(ee({}, As), {}, { "Content-Type": "application/json" }, r);
      super(a, l, s, "vectors");
    }
    async createBucket(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          (await ft.post(
            r.fetch,
            `${r.url}/CreateVectorBucket`,
            { vectorBucketName: n },
            { headers: r.headers },
          )) || {},
      );
    }
    async getBucket(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          await ft.post(
            r.fetch,
            `${r.url}/GetVectorBucket`,
            { vectorBucketName: n },
            { headers: r.headers },
          ),
      );
    }
    async listBuckets(n = {}) {
      var r = this;
      return r.handleOperation(
        async () =>
          await ft.post(r.fetch, `${r.url}/ListVectorBuckets`, n, {
            headers: r.headers,
          }),
      );
    }
    async deleteBucket(n) {
      var r = this;
      return r.handleOperation(
        async () =>
          (await ft.post(
            r.fetch,
            `${r.url}/DeleteVectorBucket`,
            { vectorBucketName: n },
            { headers: r.headers },
          )) || {},
      );
    }
  },
  Lv = class extends Iv {
    constructor(n, r = {}) {
      super(n, r.headers || {}, r.fetch);
    }
    from(n) {
      return new $v(this.url, this.headers, n, this.fetch);
    }
    async createBucket(n) {
      var r = () => super.createBucket,
        s = this;
      return r().call(s, n);
    }
    async getBucket(n) {
      var r = () => super.getBucket,
        s = this;
      return r().call(s, n);
    }
    async listBuckets(n = {}) {
      var r = () => super.listBuckets,
        s = this;
      return r().call(s, n);
    }
    async deleteBucket(n) {
      var r = () => super.deleteBucket,
        s = this;
      return r().call(s, n);
    }
  },
  $v = class extends Ov {
    constructor(n, r, s, a) {
      (super(n, r, a), (this.vectorBucketName = s));
    }
    async createIndex(n) {
      var r = () => super.createIndex,
        s = this;
      return r().call(
        s,
        ee(ee({}, n), {}, { vectorBucketName: s.vectorBucketName }),
      );
    }
    async listIndexes(n = {}) {
      var r = () => super.listIndexes,
        s = this;
      return r().call(
        s,
        ee(ee({}, n), {}, { vectorBucketName: s.vectorBucketName }),
      );
    }
    async getIndex(n) {
      var r = () => super.getIndex,
        s = this;
      return r().call(s, s.vectorBucketName, n);
    }
    async deleteIndex(n) {
      var r = () => super.deleteIndex,
        s = this;
      return r().call(s, s.vectorBucketName, n);
    }
    index(n) {
      return new Uv(
        this.url,
        this.headers,
        this.vectorBucketName,
        n,
        this.fetch,
      );
    }
  },
  Uv = class extends Av {
    constructor(n, r, s, a, l) {
      (super(n, r, l), (this.vectorBucketName = s), (this.indexName = a));
    }
    async putVectors(n) {
      var r = () => super.putVectors,
        s = this;
      return r().call(
        s,
        ee(
          ee({}, n),
          {},
          { vectorBucketName: s.vectorBucketName, indexName: s.indexName },
        ),
      );
    }
    async getVectors(n) {
      var r = () => super.getVectors,
        s = this;
      return r().call(
        s,
        ee(
          ee({}, n),
          {},
          { vectorBucketName: s.vectorBucketName, indexName: s.indexName },
        ),
      );
    }
    async listVectors(n = {}) {
      var r = () => super.listVectors,
        s = this;
      return r().call(
        s,
        ee(
          ee({}, n),
          {},
          { vectorBucketName: s.vectorBucketName, indexName: s.indexName },
        ),
      );
    }
    async queryVectors(n) {
      var r = () => super.queryVectors,
        s = this;
      return r().call(
        s,
        ee(
          ee({}, n),
          {},
          { vectorBucketName: s.vectorBucketName, indexName: s.indexName },
        ),
      );
    }
    async deleteVectors(n) {
      var r = () => super.deleteVectors,
        s = this;
      return r().call(
        s,
        ee(
          ee({}, n),
          {},
          { vectorBucketName: s.vectorBucketName, indexName: s.indexName },
        ),
      );
    }
  },
  Dv = class extends Nv {
    constructor(n, r = {}, s, a) {
      super(n, r, s, a);
    }
    from(n) {
      return new Rv(this.url, this.headers, n, this.fetch);
    }
    get vectors() {
      return new Lv(this.url + "/vector", {
        headers: this.headers,
        fetch: this.fetch,
      });
    }
    get analytics() {
      return new Pv(this.url + "/iceberg", this.headers, this.fetch);
    }
  };
const gf = "2.99.3",
  _n = 30 * 1e3,
  Ul = 3,
  xl = Ul * _n,
  Mv = "http://localhost:9999",
  zv = "supabase.auth.token",
  Bv = { "X-Client-Info": `gotrue-js/${gf}` },
  Dl = "X-Supabase-Api-Version",
  yf = {
    "2024-01-01": {
      timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
      name: "2024-01-01",
    },
  },
  Fv = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,
  Wv = 600 * 1e3;
class Rs extends Error {
  constructor(r, s, a) {
    (super(r),
      (this.__isAuthError = !0),
      (this.name = "AuthError"),
      (this.status = s),
      (this.code = a));
  }
}
function K(n) {
  return typeof n == "object" && n !== null && "__isAuthError" in n;
}
class Vv extends Rs {
  constructor(r, s, a) {
    (super(r, s, a),
      (this.name = "AuthApiError"),
      (this.status = s),
      (this.code = a));
  }
}
function Hv(n) {
  return K(n) && n.name === "AuthApiError";
}
class zr extends Rs {
  constructor(r, s) {
    (super(r), (this.name = "AuthUnknownError"), (this.originalError = s));
  }
}
class tr extends Rs {
  constructor(r, s, a, l) {
    (super(r, a, l), (this.name = s), (this.status = a));
  }
}
class ht extends tr {
  constructor() {
    super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
  }
}
function _l(n) {
  return K(n) && n.name === "AuthSessionMissingError";
}
class mn extends tr {
  constructor() {
    super(
      "Auth session or user missing",
      "AuthInvalidTokenResponseError",
      500,
      void 0,
    );
  }
}
class Ji extends tr {
  constructor(r) {
    super(r, "AuthInvalidCredentialsError", 400, void 0);
  }
}
class Qi extends tr {
  constructor(r, s = null) {
    (super(r, "AuthImplicitGrantRedirectError", 500, void 0),
      (this.details = null),
      (this.details = s));
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
function qv(n) {
  return K(n) && n.name === "AuthImplicitGrantRedirectError";
}
class xh extends tr {
  constructor(r, s = null) {
    (super(r, "AuthPKCEGrantCodeExchangeError", 500, void 0),
      (this.details = null),
      (this.details = s));
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
class Kv extends tr {
  constructor() {
    super(
      "PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.",
      "AuthPKCECodeVerifierMissingError",
      400,
      "pkce_code_verifier_not_found",
    );
  }
}
class Ml extends tr {
  constructor(r, s) {
    super(r, "AuthRetryableFetchError", s, void 0);
  }
}
function kl(n) {
  return K(n) && n.name === "AuthRetryableFetchError";
}
class _h extends tr {
  constructor(r, s, a) {
    (super(r, "AuthWeakPasswordError", s, "weak_password"), (this.reasons = a));
  }
}
class zl extends tr {
  constructor(r) {
    super(r, "AuthInvalidJwtError", 400, "invalid_jwt");
  }
}
const sa =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(
      "",
    ),
  kh = ` 	
\r=`.split(""),
  Gv = (() => {
    const n = new Array(128);
    for (let r = 0; r < n.length; r += 1) n[r] = -1;
    for (let r = 0; r < kh.length; r += 1) n[kh[r].charCodeAt(0)] = -2;
    for (let r = 0; r < sa.length; r += 1) n[sa[r].charCodeAt(0)] = r;
    return n;
  })();
function bh(n, r, s) {
  if (n !== null)
    for (r.queue = (r.queue << 8) | n, r.queuedBits += 8; r.queuedBits >= 6; ) {
      const a = (r.queue >> (r.queuedBits - 6)) & 63;
      (s(sa[a]), (r.queuedBits -= 6));
    }
  else if (r.queuedBits > 0)
    for (
      r.queue = r.queue << (6 - r.queuedBits), r.queuedBits = 6;
      r.queuedBits >= 6;
    ) {
      const a = (r.queue >> (r.queuedBits - 6)) & 63;
      (s(sa[a]), (r.queuedBits -= 6));
    }
}
function vf(n, r, s) {
  const a = Gv[n];
  if (a > -1)
    for (r.queue = (r.queue << 6) | a, r.queuedBits += 6; r.queuedBits >= 8; )
      (s((r.queue >> (r.queuedBits - 8)) & 255), (r.queuedBits -= 8));
  else {
    if (a === -2) return;
    throw new Error(`Invalid Base64-URL character "${String.fromCharCode(n)}"`);
  }
}
function Sh(n) {
  const r = [],
    s = (d) => {
      r.push(String.fromCodePoint(d));
    },
    a = { utf8seq: 0, codepoint: 0 },
    l = { queue: 0, queuedBits: 0 },
    u = (d) => {
      Yv(d, a, s);
    };
  for (let d = 0; d < n.length; d += 1) vf(n.charCodeAt(d), l, u);
  return r.join("");
}
function Jv(n, r) {
  if (n <= 127) {
    r(n);
    return;
  } else if (n <= 2047) {
    (r(192 | (n >> 6)), r(128 | (n & 63)));
    return;
  } else if (n <= 65535) {
    (r(224 | (n >> 12)), r(128 | ((n >> 6) & 63)), r(128 | (n & 63)));
    return;
  } else if (n <= 1114111) {
    (r(240 | (n >> 18)),
      r(128 | ((n >> 12) & 63)),
      r(128 | ((n >> 6) & 63)),
      r(128 | (n & 63)));
    return;
  }
  throw new Error(`Unrecognized Unicode codepoint: ${n.toString(16)}`);
}
function Qv(n, r) {
  for (let s = 0; s < n.length; s += 1) {
    let a = n.charCodeAt(s);
    if (a > 55295 && a <= 56319) {
      const l = ((a - 55296) * 1024) & 65535;
      ((a = (((n.charCodeAt(s + 1) - 56320) & 65535) | l) + 65536), (s += 1));
    }
    Jv(a, r);
  }
}
function Yv(n, r, s) {
  if (r.utf8seq === 0) {
    if (n <= 127) {
      s(n);
      return;
    }
    for (let a = 1; a < 6; a += 1)
      if (((n >> (7 - a)) & 1) === 0) {
        r.utf8seq = a;
        break;
      }
    if (r.utf8seq === 2) r.codepoint = n & 31;
    else if (r.utf8seq === 3) r.codepoint = n & 15;
    else if (r.utf8seq === 4) r.codepoint = n & 7;
    else throw new Error("Invalid UTF-8 sequence");
    r.utf8seq -= 1;
  } else if (r.utf8seq > 0) {
    if (n <= 127) throw new Error("Invalid UTF-8 sequence");
    ((r.codepoint = (r.codepoint << 6) | (n & 63)),
      (r.utf8seq -= 1),
      r.utf8seq === 0 && s(r.codepoint));
  }
}
function Sn(n) {
  const r = [],
    s = { queue: 0, queuedBits: 0 },
    a = (l) => {
      r.push(l);
    };
  for (let l = 0; l < n.length; l += 1) vf(n.charCodeAt(l), s, a);
  return new Uint8Array(r);
}
function Xv(n) {
  const r = [];
  return (Qv(n, (s) => r.push(s)), new Uint8Array(r));
}
function Br(n) {
  const r = [],
    s = { queue: 0, queuedBits: 0 },
    a = (l) => {
      r.push(l);
    };
  return (n.forEach((l) => bh(l, s, a)), bh(null, s, a), r.join(""));
}
function Zv(n) {
  return Math.round(Date.now() / 1e3) + n;
}
function e0() {
  return Symbol("auth-callback");
}
const Ve = () => typeof window < "u" && typeof document < "u",
  $r = { tested: !1, writable: !1 },
  wf = () => {
    if (!Ve()) return !1;
    try {
      if (typeof globalThis.localStorage != "object") return !1;
    } catch {
      return !1;
    }
    if ($r.tested) return $r.writable;
    const n = `lswt-${Math.random()}${Math.random()}`;
    try {
      (globalThis.localStorage.setItem(n, n),
        globalThis.localStorage.removeItem(n),
        ($r.tested = !0),
        ($r.writable = !0));
    } catch {
      (($r.tested = !0), ($r.writable = !1));
    }
    return $r.writable;
  };
function t0(n) {
  const r = {},
    s = new URL(n);
  if (s.hash && s.hash[0] === "#")
    try {
      new URLSearchParams(s.hash.substring(1)).forEach((l, u) => {
        r[u] = l;
      });
    } catch {}
  return (
    s.searchParams.forEach((a, l) => {
      r[l] = a;
    }),
    r
  );
}
const xf = (n) => (n ? (...r) => n(...r) : (...r) => fetch(...r)),
  r0 = (n) =>
    typeof n == "object" &&
    n !== null &&
    "status" in n &&
    "ok" in n &&
    "json" in n &&
    typeof n.json == "function",
  kn = async (n, r, s) => {
    await n.setItem(r, JSON.stringify(s));
  },
  Ur = async (n, r) => {
    const s = await n.getItem(r);
    if (!s) return null;
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  },
  We = async (n, r) => {
    await n.removeItem(r);
  };
class pa {
  constructor() {
    this.promise = new pa.promiseConstructor((r, s) => {
      ((this.resolve = r), (this.reject = s));
    });
  }
}
pa.promiseConstructor = Promise;
function Yi(n) {
  const r = n.split(".");
  if (r.length !== 3) throw new zl("Invalid JWT structure");
  for (let a = 0; a < r.length; a++)
    if (!Fv.test(r[a])) throw new zl("JWT not in base64url format");
  return {
    header: JSON.parse(Sh(r[0])),
    payload: JSON.parse(Sh(r[1])),
    signature: Sn(r[2]),
    raw: { header: r[0], payload: r[1] },
  };
}
async function n0(n) {
  return await new Promise((r) => {
    setTimeout(() => r(null), n);
  });
}
function s0(n, r) {
  return new Promise((a, l) => {
    (async () => {
      for (let u = 0; u < 1 / 0; u++)
        try {
          const d = await n(u);
          if (!r(u, null, d)) {
            a(d);
            return;
          }
        } catch (d) {
          if (!r(u, d)) {
            l(d);
            return;
          }
        }
    })();
  });
}
function i0(n) {
  return ("0" + n.toString(16)).substr(-2);
}
function a0() {
  const r = new Uint32Array(56);
  if (typeof crypto > "u") {
    const s =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",
      a = s.length;
    let l = "";
    for (let u = 0; u < 56; u++) l += s.charAt(Math.floor(Math.random() * a));
    return l;
  }
  return (crypto.getRandomValues(r), Array.from(r, i0).join(""));
}
async function o0(n) {
  const s = new TextEncoder().encode(n),
    a = await crypto.subtle.digest("SHA-256", s),
    l = new Uint8Array(a);
  return Array.from(l)
    .map((u) => String.fromCharCode(u))
    .join("");
}
async function l0(n) {
  if (
    !(
      typeof crypto < "u" &&
      typeof crypto.subtle < "u" &&
      typeof TextEncoder < "u"
    )
  )
    return (
      console.warn(
        "WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.",
      ),
      n
    );
  const s = await o0(n);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function gn(n, r, s = !1) {
  const a = a0();
  let l = a;
  (s && (l += "/PASSWORD_RECOVERY"), await kn(n, `${r}-code-verifier`, l));
  const u = await l0(a);
  return [u, a === u ? "plain" : "s256"];
}
const u0 = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function c0(n) {
  const r = n.headers.get(Dl);
  if (!r || !r.match(u0)) return null;
  try {
    return new Date(`${r}T00:00:00.0Z`);
  } catch {
    return null;
  }
}
function d0(n) {
  if (!n) throw new Error("Missing exp claim");
  const r = Math.floor(Date.now() / 1e3);
  if (n <= r) throw new Error("JWT has expired");
}
function h0(n) {
  switch (n) {
    case "RS256":
      return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
    case "ES256":
      return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
    default:
      throw new Error("Invalid alg claim");
  }
}
const f0 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function yn(n) {
  if (!f0.test(n))
    throw new Error(
      "@supabase/auth-js: Expected parameter to be UUID but is not",
    );
}
function bl() {
  const n = {};
  return new Proxy(n, {
    get: (r, s) => {
      if (s === "__isUserNotAvailableProxy") return !0;
      if (typeof s == "symbol") {
        const a = s.toString();
        if (
          a === "Symbol(Symbol.toPrimitive)" ||
          a === "Symbol(Symbol.toStringTag)" ||
          a === "Symbol(util.inspect.custom)"
        )
          return;
      }
      throw new Error(
        `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${s}" property of the session object is not supported. Please use getUser() instead.`,
      );
    },
    set: (r, s) => {
      throw new Error(
        `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${s}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`,
      );
    },
    deleteProperty: (r, s) => {
      throw new Error(
        `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${s}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`,
      );
    },
  });
}
function p0(n, r) {
  return new Proxy(n, {
    get: (s, a, l) => {
      if (a === "__isInsecureUserWarningProxy") return !0;
      if (typeof a == "symbol") {
        const u = a.toString();
        if (
          u === "Symbol(Symbol.toPrimitive)" ||
          u === "Symbol(Symbol.toStringTag)" ||
          u === "Symbol(util.inspect.custom)" ||
          u === "Symbol(nodejs.util.inspect.custom)"
        )
          return Reflect.get(s, a, l);
      }
      return (
        !r.value &&
          typeof a == "string" &&
          (console.warn(
            "Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.",
          ),
          (r.value = !0)),
        Reflect.get(s, a, l)
      );
    },
  });
}
function Eh(n) {
  return JSON.parse(JSON.stringify(n));
}
const Dr = (n) =>
    n.msg || n.message || n.error_description || n.error || JSON.stringify(n),
  m0 = [502, 503, 504];
async function jh(n) {
  var r;
  if (!r0(n)) throw new Ml(Dr(n), 0);
  if (m0.includes(n.status)) throw new Ml(Dr(n), n.status);
  let s;
  try {
    s = await n.json();
  } catch (u) {
    throw new zr(Dr(u), u);
  }
  let a;
  const l = c0(n);
  if (
    (l &&
    l.getTime() >= yf["2024-01-01"].timestamp &&
    typeof s == "object" &&
    s &&
    typeof s.code == "string"
      ? (a = s.code)
      : typeof s == "object" &&
        s &&
        typeof s.error_code == "string" &&
        (a = s.error_code),
    a)
  ) {
    if (a === "weak_password")
      throw new _h(
        Dr(s),
        n.status,
        ((r = s.weak_password) === null || r === void 0 ? void 0 : r.reasons) ||
          [],
      );
    if (a === "session_not_found") throw new ht();
  } else if (
    typeof s == "object" &&
    s &&
    typeof s.weak_password == "object" &&
    s.weak_password &&
    Array.isArray(s.weak_password.reasons) &&
    s.weak_password.reasons.length &&
    s.weak_password.reasons.reduce((u, d) => u && typeof d == "string", !0)
  )
    throw new _h(Dr(s), n.status, s.weak_password.reasons);
  throw new Vv(Dr(s), n.status || 500, a);
}
const g0 = (n, r, s, a) => {
  const l = { method: n, headers: (r == null ? void 0 : r.headers) || {} };
  return n === "GET"
    ? l
    : ((l.headers = Object.assign(
        { "Content-Type": "application/json;charset=UTF-8" },
        r == null ? void 0 : r.headers,
      )),
      (l.body = JSON.stringify(a)),
      Object.assign(Object.assign({}, l), s));
};
async function Q(n, r, s, a) {
  var l;
  const u = Object.assign({}, a == null ? void 0 : a.headers);
  (u[Dl] || (u[Dl] = yf["2024-01-01"].name),
    a != null && a.jwt && (u.Authorization = `Bearer ${a.jwt}`));
  const d =
    (l = a == null ? void 0 : a.query) !== null && l !== void 0 ? l : {};
  a != null && a.redirectTo && (d.redirect_to = a.redirectTo);
  const f = Object.keys(d).length
      ? "?" + new URLSearchParams(d).toString()
      : "",
    p = await y0(
      n,
      r,
      s + f,
      { headers: u, noResolveJson: a == null ? void 0 : a.noResolveJson },
      {},
      a == null ? void 0 : a.body,
    );
  return a != null && a.xform
    ? a == null
      ? void 0
      : a.xform(p)
    : { data: Object.assign({}, p), error: null };
}
async function y0(n, r, s, a, l, u) {
  const d = g0(r, a, l, u);
  let f;
  try {
    f = await n(s, Object.assign({}, d));
  } catch (p) {
    throw (console.error(p), new Ml(Dr(p), 0));
  }
  if ((f.ok || (await jh(f)), a != null && a.noResolveJson)) return f;
  try {
    return await f.json();
  } catch (p) {
    await jh(p);
  }
}
function Tt(n) {
  var r;
  let s = null;
  x0(n) &&
    ((s = Object.assign({}, n)),
    n.expires_at || (s.expires_at = Zv(n.expires_in)));
  const a = (r = n.user) !== null && r !== void 0 ? r : n;
  return { data: { session: s, user: a }, error: null };
}
function Ch(n) {
  const r = Tt(n);
  return (
    !r.error &&
      n.weak_password &&
      typeof n.weak_password == "object" &&
      Array.isArray(n.weak_password.reasons) &&
      n.weak_password.reasons.length &&
      n.weak_password.message &&
      typeof n.weak_password.message == "string" &&
      n.weak_password.reasons.reduce((s, a) => s && typeof a == "string", !0) &&
      (r.data.weak_password = n.weak_password),
    r
  );
}
function kr(n) {
  var r;
  return {
    data: { user: (r = n.user) !== null && r !== void 0 ? r : n },
    error: null,
  };
}
function v0(n) {
  return { data: n, error: null };
}
function w0(n) {
  const {
      action_link: r,
      email_otp: s,
      hashed_token: a,
      redirect_to: l,
      verification_type: u,
    } = n,
    d = da(n, [
      "action_link",
      "email_otp",
      "hashed_token",
      "redirect_to",
      "verification_type",
    ]),
    f = {
      action_link: r,
      email_otp: s,
      hashed_token: a,
      redirect_to: l,
      verification_type: u,
    },
    p = Object.assign({}, d);
  return { data: { properties: f, user: p }, error: null };
}
function Rh(n) {
  return n;
}
function x0(n) {
  return n.access_token && n.refresh_token && n.expires_in;
}
const Sl = ["global", "local", "others"];
class _0 {
  constructor({ url: r = "", headers: s = {}, fetch: a }) {
    ((this.url = r),
      (this.headers = s),
      (this.fetch = xf(a)),
      (this.mfa = {
        listFactors: this._listFactors.bind(this),
        deleteFactor: this._deleteFactor.bind(this),
      }),
      (this.oauth = {
        listClients: this._listOAuthClients.bind(this),
        createClient: this._createOAuthClient.bind(this),
        getClient: this._getOAuthClient.bind(this),
        updateClient: this._updateOAuthClient.bind(this),
        deleteClient: this._deleteOAuthClient.bind(this),
        regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this),
      }),
      (this.customProviders = {
        listProviders: this._listCustomProviders.bind(this),
        createProvider: this._createCustomProvider.bind(this),
        getProvider: this._getCustomProvider.bind(this),
        updateProvider: this._updateCustomProvider.bind(this),
        deleteProvider: this._deleteCustomProvider.bind(this),
      }));
  }
  async signOut(r, s = Sl[0]) {
    if (Sl.indexOf(s) < 0)
      throw new Error(
        `@supabase/auth-js: Parameter scope must be one of ${Sl.join(", ")}`,
      );
    try {
      return (
        await Q(this.fetch, "POST", `${this.url}/logout?scope=${s}`, {
          headers: this.headers,
          jwt: r,
          noResolveJson: !0,
        }),
        { data: null, error: null }
      );
    } catch (a) {
      if (K(a)) return { data: null, error: a };
      throw a;
    }
  }
  async inviteUserByEmail(r, s = {}) {
    try {
      return await Q(this.fetch, "POST", `${this.url}/invite`, {
        body: { email: r, data: s.data },
        headers: this.headers,
        redirectTo: s.redirectTo,
        xform: kr,
      });
    } catch (a) {
      if (K(a)) return { data: { user: null }, error: a };
      throw a;
    }
  }
  async generateLink(r) {
    try {
      const { options: s } = r,
        a = da(r, ["options"]),
        l = Object.assign(Object.assign({}, a), s);
      return (
        "newEmail" in a &&
          ((l.new_email = a == null ? void 0 : a.newEmail), delete l.newEmail),
        await Q(this.fetch, "POST", `${this.url}/admin/generate_link`, {
          body: l,
          headers: this.headers,
          xform: w0,
          redirectTo: s == null ? void 0 : s.redirectTo,
        })
      );
    } catch (s) {
      if (K(s)) return { data: { properties: null, user: null }, error: s };
      throw s;
    }
  }
  async createUser(r) {
    try {
      return await Q(this.fetch, "POST", `${this.url}/admin/users`, {
        body: r,
        headers: this.headers,
        xform: kr,
      });
    } catch (s) {
      if (K(s)) return { data: { user: null }, error: s };
      throw s;
    }
  }
  async listUsers(r) {
    var s, a, l, u, d, f, p;
    try {
      const y = { nextPage: null, lastPage: 0, total: 0 },
        v = await Q(this.fetch, "GET", `${this.url}/admin/users`, {
          headers: this.headers,
          noResolveJson: !0,
          query: {
            page:
              (a =
                (s = r == null ? void 0 : r.page) === null || s === void 0
                  ? void 0
                  : s.toString()) !== null && a !== void 0
                ? a
                : "",
            per_page:
              (u =
                (l = r == null ? void 0 : r.perPage) === null || l === void 0
                  ? void 0
                  : l.toString()) !== null && u !== void 0
                ? u
                : "",
          },
          xform: Rh,
        });
      if (v.error) throw v.error;
      const x = await v.json(),
        _ =
          (d = v.headers.get("x-total-count")) !== null && d !== void 0 ? d : 0,
        S =
          (p =
            (f = v.headers.get("link")) === null || f === void 0
              ? void 0
              : f.split(",")) !== null && p !== void 0
            ? p
            : [];
      return (
        S.length > 0 &&
          (S.forEach((N) => {
            const j = parseInt(N.split(";")[0].split("=")[1].substring(0, 1)),
              E = JSON.parse(N.split(";")[1].split("=")[1]);
            y[`${E}Page`] = j;
          }),
          (y.total = parseInt(_))),
        { data: Object.assign(Object.assign({}, x), y), error: null }
      );
    } catch (y) {
      if (K(y)) return { data: { users: [] }, error: y };
      throw y;
    }
  }
  async getUserById(r) {
    yn(r);
    try {
      return await Q(this.fetch, "GET", `${this.url}/admin/users/${r}`, {
        headers: this.headers,
        xform: kr,
      });
    } catch (s) {
      if (K(s)) return { data: { user: null }, error: s };
      throw s;
    }
  }
  async updateUserById(r, s) {
    yn(r);
    try {
      return await Q(this.fetch, "PUT", `${this.url}/admin/users/${r}`, {
        body: s,
        headers: this.headers,
        xform: kr,
      });
    } catch (a) {
      if (K(a)) return { data: { user: null }, error: a };
      throw a;
    }
  }
  async deleteUser(r, s = !1) {
    yn(r);
    try {
      return await Q(this.fetch, "DELETE", `${this.url}/admin/users/${r}`, {
        headers: this.headers,
        body: { should_soft_delete: s },
        xform: kr,
      });
    } catch (a) {
      if (K(a)) return { data: { user: null }, error: a };
      throw a;
    }
  }
  async _listFactors(r) {
    yn(r.userId);
    try {
      const { data: s, error: a } = await Q(
        this.fetch,
        "GET",
        `${this.url}/admin/users/${r.userId}/factors`,
        {
          headers: this.headers,
          xform: (l) => ({ data: { factors: l }, error: null }),
        },
      );
      return { data: s, error: a };
    } catch (s) {
      if (K(s)) return { data: null, error: s };
      throw s;
    }
  }
  async _deleteFactor(r) {
    (yn(r.userId), yn(r.id));
    try {
      return {
        data: await Q(
          this.fetch,
          "DELETE",
          `${this.url}/admin/users/${r.userId}/factors/${r.id}`,
          { headers: this.headers },
        ),
        error: null,
      };
    } catch (s) {
      if (K(s)) return { data: null, error: s };
      throw s;
    }
  }
  async _listOAuthClients(r) {
    var s, a, l, u, d, f, p;
    try {
      const y = { nextPage: null, lastPage: 0, total: 0 },
        v = await Q(this.fetch, "GET", `${this.url}/admin/oauth/clients`, {
          headers: this.headers,
          noResolveJson: !0,
          query: {
            page:
              (a =
                (s = r == null ? void 0 : r.page) === null || s === void 0
                  ? void 0
                  : s.toString()) !== null && a !== void 0
                ? a
                : "",
            per_page:
              (u =
                (l = r == null ? void 0 : r.perPage) === null || l === void 0
                  ? void 0
                  : l.toString()) !== null && u !== void 0
                ? u
                : "",
          },
          xform: Rh,
        });
      if (v.error) throw v.error;
      const x = await v.json(),
        _ =
          (d = v.headers.get("x-total-count")) !== null && d !== void 0 ? d : 0,
        S =
          (p =
            (f = v.headers.get("link")) === null || f === void 0
              ? void 0
              : f.split(",")) !== null && p !== void 0
            ? p
            : [];
      return (
        S.length > 0 &&
          (S.forEach((N) => {
            const j = parseInt(N.split(";")[0].split("=")[1].substring(0, 1)),
              E = JSON.parse(N.split(";")[1].split("=")[1]);
            y[`${E}Page`] = j;
          }),
          (y.total = parseInt(_))),
        { data: Object.assign(Object.assign({}, x), y), error: null }
      );
    } catch (y) {
      if (K(y)) return { data: { clients: [] }, error: y };
      throw y;
    }
  }
  async _createOAuthClient(r) {
    try {
      return await Q(this.fetch, "POST", `${this.url}/admin/oauth/clients`, {
        body: r,
        headers: this.headers,
        xform: (s) => ({ data: s, error: null }),
      });
    } catch (s) {
      if (K(s)) return { data: null, error: s };
      throw s;
    }
  }
  async _getOAuthClient(r) {
    try {
      return await Q(
        this.fetch,
        "GET",
        `${this.url}/admin/oauth/clients/${r}`,
        { headers: this.headers, xform: (s) => ({ data: s, error: null }) },
      );
    } catch (s) {
      if (K(s)) return { data: null, error: s };
      throw s;
    }
  }
  async _updateOAuthClient(r, s) {
    try {
      return await Q(
        this.fetch,
        "PUT",
        `${this.url}/admin/oauth/clients/${r}`,
        {
          body: s,
          headers: this.headers,
          xform: (a) => ({ data: a, error: null }),
        },
      );
    } catch (a) {
      if (K(a)) return { data: null, error: a };
      throw a;
    }
  }
  async _deleteOAuthClient(r) {
    try {
      return (
        await Q(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${r}`, {
          headers: this.headers,
          noResolveJson: !0,
        }),
        { data: null, error: null }
      );
    } catch (s) {
      if (K(s)) return { data: null, error: s };
      throw s;
    }
  }
  async _regenerateOAuthClientSecret(r) {
    try {
      return await Q(
        this.fetch,
        "POST",
        `${this.url}/admin/oauth/clients/${r}/regenerate_secret`,
        { headers: this.headers, xform: (s) => ({ data: s, error: null }) },
      );
    } catch (s) {
      if (K(s)) return { data: null, error: s };
      throw s;
    }
  }
  async _listCustomProviders(r) {
    try {
      const s = {};
      return (
        r != null && r.type && (s.type = r.type),
        await Q(this.fetch, "GET", `${this.url}/admin/custom-providers`, {
          headers: this.headers,
          query: s,
          xform: (a) => {
            var l;
            return {
              data: {
                providers:
                  (l = a == null ? void 0 : a.providers) !== null &&
                  l !== void 0
                    ? l
                    : [],
              },
              error: null,
            };
          },
        })
      );
    } catch (s) {
      if (K(s)) return { data: { providers: [] }, error: s };
      throw s;
    }
  }
  async _createCustomProvider(r) {
    try {
      return await Q(this.fetch, "POST", `${this.url}/admin/custom-providers`, {
        body: r,
        headers: this.headers,
        xform: (s) => ({ data: s, error: null }),
      });
    } catch (s) {
      if (K(s)) return { data: null, error: s };
      throw s;
    }
  }
  async _getCustomProvider(r) {
    try {
      return await Q(
        this.fetch,
        "GET",
        `${this.url}/admin/custom-providers/${r}`,
        { headers: this.headers, xform: (s) => ({ data: s, error: null }) },
      );
    } catch (s) {
      if (K(s)) return { data: null, error: s };
      throw s;
    }
  }
  async _updateCustomProvider(r, s) {
    try {
      return await Q(
        this.fetch,
        "PUT",
        `${this.url}/admin/custom-providers/${r}`,
        {
          body: s,
          headers: this.headers,
          xform: (a) => ({ data: a, error: null }),
        },
      );
    } catch (a) {
      if (K(a)) return { data: null, error: a };
      throw a;
    }
  }
  async _deleteCustomProvider(r) {
    try {
      return (
        await Q(
          this.fetch,
          "DELETE",
          `${this.url}/admin/custom-providers/${r}`,
          { headers: this.headers, noResolveJson: !0 },
        ),
        { data: null, error: null }
      );
    } catch (s) {
      if (K(s)) return { data: null, error: s };
      throw s;
    }
  }
}
function Th(n = {}) {
  return {
    getItem: (r) => n[r] || null,
    setItem: (r, s) => {
      n[r] = s;
    },
    removeItem: (r) => {
      delete n[r];
    },
  };
}
const Mt = {
  debug: !!(
    globalThis &&
    wf() &&
    globalThis.localStorage &&
    globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true"
  ),
};
class _f extends Error {
  constructor(r) {
    (super(r), (this.isAcquireTimeout = !0));
  }
}
class Nh extends _f {}
async function k0(n, r, s) {
  Mt.debug &&
    console.log("@supabase/gotrue-js: navigatorLock: acquire lock", n, r);
  const a = new globalThis.AbortController();
  let l;
  (r > 0 &&
    (l = setTimeout(() => {
      (a.abort(),
        Mt.debug &&
          console.log(
            "@supabase/gotrue-js: navigatorLock acquire timed out",
            n,
          ));
    }, r)),
    await Promise.resolve());
  try {
    return await globalThis.navigator.locks.request(
      n,
      r === 0
        ? { mode: "exclusive", ifAvailable: !0 }
        : { mode: "exclusive", signal: a.signal },
      async (u) => {
        if (u) {
          (clearTimeout(l),
            Mt.debug &&
              console.log(
                "@supabase/gotrue-js: navigatorLock: acquired",
                n,
                u.name,
              ));
          try {
            return await s();
          } finally {
            Mt.debug &&
              console.log(
                "@supabase/gotrue-js: navigatorLock: released",
                n,
                u.name,
              );
          }
        } else {
          if (r === 0)
            throw (
              Mt.debug &&
                console.log(
                  "@supabase/gotrue-js: navigatorLock: not immediately available",
                  n,
                ),
              new Nh(
                `Acquiring an exclusive Navigator LockManager lock "${n}" immediately failed`,
              )
            );
          if (Mt.debug)
            try {
              const d = await globalThis.navigator.locks.query();
              console.log(
                "@supabase/gotrue-js: Navigator LockManager state",
                JSON.stringify(d, null, "  "),
              );
            } catch (d) {
              console.warn(
                "@supabase/gotrue-js: Error when querying Navigator LockManager state",
                d,
              );
            }
          return (
            console.warn(
              "@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request",
            ),
            clearTimeout(l),
            await s()
          );
        }
      },
    );
  } catch (u) {
    if (
      (r > 0 && clearTimeout(l),
      (u == null ? void 0 : u.name) === "AbortError" && r > 0)
    ) {
      if (a.signal.aborted)
        return (
          Mt.debug &&
            console.log(
              "@supabase/gotrue-js: navigatorLock: acquire timeout, recovering by stealing lock",
              n,
            ),
          console.warn(
            `@supabase/gotrue-js: Lock "${n}" was not released within ${r}ms. This may indicate an orphaned lock from a component unmount (e.g., React Strict Mode). Forcefully acquiring the lock to recover.`,
          ),
          await Promise.resolve().then(() =>
            globalThis.navigator.locks.request(
              n,
              { mode: "exclusive", steal: !0 },
              async (d) => {
                if (d) {
                  Mt.debug &&
                    console.log(
                      "@supabase/gotrue-js: navigatorLock: recovered (stolen)",
                      n,
                      d.name,
                    );
                  try {
                    return await s();
                  } finally {
                    Mt.debug &&
                      console.log(
                        "@supabase/gotrue-js: navigatorLock: released (stolen)",
                        n,
                        d.name,
                      );
                  }
                } else
                  return (
                    console.warn(
                      "@supabase/gotrue-js: Navigator LockManager returned null lock even with steal: true",
                    ),
                    await s()
                  );
              },
            ),
          )
        );
      throw (
        Mt.debug &&
          console.log(
            "@supabase/gotrue-js: navigatorLock: lock was stolen by another request",
            n,
          ),
        new Nh(`Lock "${n}" was released because another request stole it`)
      );
    }
    throw u;
  }
}
function b0() {
  if (typeof globalThis != "object")
    try {
      (Object.defineProperty(Object.prototype, "__magic__", {
        get: function () {
          return this;
        },
        configurable: !0,
      }),
        (__magic__.globalThis = __magic__),
        delete Object.prototype.__magic__);
    } catch {
      typeof self < "u" && (self.globalThis = self);
    }
}
function kf(n) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(n))
    throw new Error(`@supabase/auth-js: Address "${n}" is invalid.`);
  return n.toLowerCase();
}
function S0(n) {
  return parseInt(n, 16);
}
function E0(n) {
  const r = new TextEncoder().encode(n);
  return "0x" + Array.from(r, (a) => a.toString(16).padStart(2, "0")).join("");
}
function j0(n) {
  var r;
  const {
    chainId: s,
    domain: a,
    expirationTime: l,
    issuedAt: u = new Date(),
    nonce: d,
    notBefore: f,
    requestId: p,
    resources: y,
    scheme: v,
    uri: x,
    version: _,
  } = n;
  {
    if (!Number.isInteger(s))
      throw new Error(
        `@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${s}`,
      );
    if (!a)
      throw new Error(
        '@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.',
      );
    if (d && d.length < 8)
      throw new Error(
        `@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${d}`,
      );
    if (!x)
      throw new Error(
        '@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.',
      );
    if (_ !== "1")
      throw new Error(
        `@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${_}`,
      );
    if (
      !((r = n.statement) === null || r === void 0) &&
      r.includes(`
`)
    )
      throw new Error(
        `@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${n.statement}`,
      );
  }
  const S = kf(n.address),
    N = v ? `${v}://${a}` : a,
    j = n.statement
      ? `${n.statement}
`
      : "",
    E = `${N} wants you to sign in with your Ethereum account:
${S}

${j}`;
  let A = `URI: ${x}
Version: ${_}
Chain ID: ${s}${
    d
      ? `
Nonce: ${d}`
      : ""
  }
Issued At: ${u.toISOString()}`;
  if (
    (l &&
      (A += `
Expiration Time: ${l.toISOString()}`),
    f &&
      (A += `
Not Before: ${f.toISOString()}`),
    p &&
      (A += `
Request ID: ${p}`),
    y)
  ) {
    let L = `
Resources:`;
    for (const I of y) {
      if (!I || typeof I != "string")
        throw new Error(
          `@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${I}`,
        );
      L += `
- ${I}`;
    }
    A += L;
  }
  return `${E}
${A}`;
}
class Ae extends Error {
  constructor({ message: r, code: s, cause: a, name: l }) {
    var u;
    (super(r, { cause: a }),
      (this.__isWebAuthnError = !0),
      (this.name =
        (u = l ?? (a instanceof Error ? a.name : void 0)) !== null &&
        u !== void 0
          ? u
          : "Unknown Error"),
      (this.code = s));
  }
}
class ia extends Ae {
  constructor(r, s) {
    (super({
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: s,
      message: r,
    }),
      (this.name = "WebAuthnUnknownError"),
      (this.originalError = s));
  }
}
function C0({ error: n, options: r }) {
  var s, a, l;
  const { publicKey: u } = r;
  if (!u) throw Error("options was missing required publicKey property");
  if (n.name === "AbortError") {
    if (r.signal instanceof AbortSignal)
      return new Ae({
        message: "Registration ceremony was sent an abort signal",
        code: "ERROR_CEREMONY_ABORTED",
        cause: n,
      });
  } else if (n.name === "ConstraintError") {
    if (
      ((s = u.authenticatorSelection) === null || s === void 0
        ? void 0
        : s.requireResidentKey) === !0
    )
      return new Ae({
        message:
          "Discoverable credentials were required but no available authenticator supported it",
        code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
        cause: n,
      });
    if (
      r.mediation === "conditional" &&
      ((a = u.authenticatorSelection) === null || a === void 0
        ? void 0
        : a.userVerification) === "required"
    )
      return new Ae({
        message:
          "User verification was required during automatic registration but it could not be performed",
        code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",
        cause: n,
      });
    if (
      ((l = u.authenticatorSelection) === null || l === void 0
        ? void 0
        : l.userVerification) === "required"
    )
      return new Ae({
        message:
          "User verification was required but no available authenticator supported it",
        code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
        cause: n,
      });
  } else {
    if (n.name === "InvalidStateError")
      return new Ae({
        message: "The authenticator was previously registered",
        code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
        cause: n,
      });
    if (n.name === "NotAllowedError")
      return new Ae({
        message: n.message,
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: n,
      });
    if (n.name === "NotSupportedError")
      return u.pubKeyCredParams.filter((f) => f.type === "public-key")
        .length === 0
        ? new Ae({
            message: 'No entry in pubKeyCredParams was of type "public-key"',
            code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
            cause: n,
          })
        : new Ae({
            message:
              "No available authenticator supported any of the specified pubKeyCredParams algorithms",
            code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
            cause: n,
          });
    if (n.name === "SecurityError") {
      const d = window.location.hostname;
      if (bf(d)) {
        if (u.rp.id !== d)
          return new Ae({
            message: `The RP ID "${u.rp.id}" is invalid for this domain`,
            code: "ERROR_INVALID_RP_ID",
            cause: n,
          });
      } else
        return new Ae({
          message: `${window.location.hostname} is an invalid domain`,
          code: "ERROR_INVALID_DOMAIN",
          cause: n,
        });
    } else if (n.name === "TypeError") {
      if (u.user.id.byteLength < 1 || u.user.id.byteLength > 64)
        return new Ae({
          message: "User ID was not between 1 and 64 characters",
          code: "ERROR_INVALID_USER_ID_LENGTH",
          cause: n,
        });
    } else if (n.name === "UnknownError")
      return new Ae({
        message:
          "The authenticator was unable to process the specified options, or could not create a new credential",
        code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
        cause: n,
      });
  }
  return new Ae({
    message: "a Non-Webauthn related error has occurred",
    code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
    cause: n,
  });
}
function R0({ error: n, options: r }) {
  const { publicKey: s } = r;
  if (!s) throw Error("options was missing required publicKey property");
  if (n.name === "AbortError") {
    if (r.signal instanceof AbortSignal)
      return new Ae({
        message: "Authentication ceremony was sent an abort signal",
        code: "ERROR_CEREMONY_ABORTED",
        cause: n,
      });
  } else {
    if (n.name === "NotAllowedError")
      return new Ae({
        message: n.message,
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: n,
      });
    if (n.name === "SecurityError") {
      const a = window.location.hostname;
      if (bf(a)) {
        if (s.rpId !== a)
          return new Ae({
            message: `The RP ID "${s.rpId}" is invalid for this domain`,
            code: "ERROR_INVALID_RP_ID",
            cause: n,
          });
      } else
        return new Ae({
          message: `${window.location.hostname} is an invalid domain`,
          code: "ERROR_INVALID_DOMAIN",
          cause: n,
        });
    } else if (n.name === "UnknownError")
      return new Ae({
        message:
          "The authenticator was unable to process the specified options, or could not create a new assertion signature",
        code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
        cause: n,
      });
  }
  return new Ae({
    message: "a Non-Webauthn related error has occurred",
    code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
    cause: n,
  });
}
class T0 {
  createNewAbortSignal() {
    if (this.controller) {
      const s = new Error("Cancelling existing WebAuthn API call for new one");
      ((s.name = "AbortError"), this.controller.abort(s));
    }
    const r = new AbortController();
    return ((this.controller = r), r.signal);
  }
  cancelCeremony() {
    if (this.controller) {
      const r = new Error("Manually cancelling existing WebAuthn API call");
      ((r.name = "AbortError"),
        this.controller.abort(r),
        (this.controller = void 0));
    }
  }
}
const N0 = new T0();
function P0(n) {
  if (!n) throw new Error("Credential creation options are required");
  if (
    typeof PublicKeyCredential < "u" &&
    "parseCreationOptionsFromJSON" in PublicKeyCredential &&
    typeof PublicKeyCredential.parseCreationOptionsFromJSON == "function"
  )
    return PublicKeyCredential.parseCreationOptionsFromJSON(n);
  const { challenge: r, user: s, excludeCredentials: a } = n,
    l = da(n, ["challenge", "user", "excludeCredentials"]),
    u = Sn(r).buffer,
    d = Object.assign(Object.assign({}, s), { id: Sn(s.id).buffer }),
    f = Object.assign(Object.assign({}, l), { challenge: u, user: d });
  if (a && a.length > 0) {
    f.excludeCredentials = new Array(a.length);
    for (let p = 0; p < a.length; p++) {
      const y = a[p];
      f.excludeCredentials[p] = Object.assign(Object.assign({}, y), {
        id: Sn(y.id).buffer,
        type: y.type || "public-key",
        transports: y.transports,
      });
    }
  }
  return f;
}
function O0(n) {
  if (!n) throw new Error("Credential request options are required");
  if (
    typeof PublicKeyCredential < "u" &&
    "parseRequestOptionsFromJSON" in PublicKeyCredential &&
    typeof PublicKeyCredential.parseRequestOptionsFromJSON == "function"
  )
    return PublicKeyCredential.parseRequestOptionsFromJSON(n);
  const { challenge: r, allowCredentials: s } = n,
    a = da(n, ["challenge", "allowCredentials"]),
    l = Sn(r).buffer,
    u = Object.assign(Object.assign({}, a), { challenge: l });
  if (s && s.length > 0) {
    u.allowCredentials = new Array(s.length);
    for (let d = 0; d < s.length; d++) {
      const f = s[d];
      u.allowCredentials[d] = Object.assign(Object.assign({}, f), {
        id: Sn(f.id).buffer,
        type: f.type || "public-key",
        transports: f.transports,
      });
    }
  }
  return u;
}
function A0(n) {
  var r;
  if ("toJSON" in n && typeof n.toJSON == "function") return n.toJSON();
  const s = n;
  return {
    id: n.id,
    rawId: n.id,
    response: {
      attestationObject: Br(new Uint8Array(n.response.attestationObject)),
      clientDataJSON: Br(new Uint8Array(n.response.clientDataJSON)),
    },
    type: "public-key",
    clientExtensionResults: n.getClientExtensionResults(),
    authenticatorAttachment:
      (r = s.authenticatorAttachment) !== null && r !== void 0 ? r : void 0,
  };
}
function I0(n) {
  var r;
  if ("toJSON" in n && typeof n.toJSON == "function") return n.toJSON();
  const s = n,
    a = n.getClientExtensionResults(),
    l = n.response;
  return {
    id: n.id,
    rawId: n.id,
    response: {
      authenticatorData: Br(new Uint8Array(l.authenticatorData)),
      clientDataJSON: Br(new Uint8Array(l.clientDataJSON)),
      signature: Br(new Uint8Array(l.signature)),
      userHandle: l.userHandle ? Br(new Uint8Array(l.userHandle)) : void 0,
    },
    type: "public-key",
    clientExtensionResults: a,
    authenticatorAttachment:
      (r = s.authenticatorAttachment) !== null && r !== void 0 ? r : void 0,
  };
}
function bf(n) {
  return n === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(n);
}
function Ph() {
  var n, r;
  return !!(
    Ve() &&
    "PublicKeyCredential" in window &&
    window.PublicKeyCredential &&
    "credentials" in navigator &&
    typeof ((n = navigator == null ? void 0 : navigator.credentials) === null ||
    n === void 0
      ? void 0
      : n.create) == "function" &&
    typeof ((r = navigator == null ? void 0 : navigator.credentials) === null ||
    r === void 0
      ? void 0
      : r.get) == "function"
  );
}
async function L0(n) {
  try {
    const r = await navigator.credentials.create(n);
    return r
      ? r instanceof PublicKeyCredential
        ? { data: r, error: null }
        : {
            data: null,
            error: new ia("Browser returned unexpected credential type", r),
          }
      : { data: null, error: new ia("Empty credential response", r) };
  } catch (r) {
    return { data: null, error: C0({ error: r, options: n }) };
  }
}
async function $0(n) {
  try {
    const r = await navigator.credentials.get(n);
    return r
      ? r instanceof PublicKeyCredential
        ? { data: r, error: null }
        : {
            data: null,
            error: new ia("Browser returned unexpected credential type", r),
          }
      : { data: null, error: new ia("Empty credential response", r) };
  } catch (r) {
    return { data: null, error: R0({ error: r, options: n }) };
  }
}
const U0 = {
    hints: ["security-key"],
    authenticatorSelection: {
      authenticatorAttachment: "cross-platform",
      requireResidentKey: !1,
      userVerification: "preferred",
      residentKey: "discouraged",
    },
    attestation: "direct",
  },
  D0 = {
    userVerification: "preferred",
    hints: ["security-key"],
    attestation: "direct",
  };
function aa(...n) {
  const r = (l) => l !== null && typeof l == "object" && !Array.isArray(l),
    s = (l) => l instanceof ArrayBuffer || ArrayBuffer.isView(l),
    a = {};
  for (const l of n)
    if (l)
      for (const u in l) {
        const d = l[u];
        if (d !== void 0)
          if (Array.isArray(d)) a[u] = d;
          else if (s(d)) a[u] = d;
          else if (r(d)) {
            const f = a[u];
            r(f) ? (a[u] = aa(f, d)) : (a[u] = aa(d));
          } else a[u] = d;
      }
  return a;
}
function M0(n, r) {
  return aa(U0, n, r || {});
}
function z0(n, r) {
  return aa(D0, n, r || {});
}
class B0 {
  constructor(r) {
    ((this.client = r),
      (this.enroll = this._enroll.bind(this)),
      (this.challenge = this._challenge.bind(this)),
      (this.verify = this._verify.bind(this)),
      (this.authenticate = this._authenticate.bind(this)),
      (this.register = this._register.bind(this)));
  }
  async _enroll(r) {
    return this.client.mfa.enroll(
      Object.assign(Object.assign({}, r), { factorType: "webauthn" }),
    );
  }
  async _challenge(
    { factorId: r, webauthn: s, friendlyName: a, signal: l },
    u,
  ) {
    var d;
    try {
      const { data: f, error: p } = await this.client.mfa.challenge({
        factorId: r,
        webauthn: s,
      });
      if (!f) return { data: null, error: p };
      const y = l ?? N0.createNewAbortSignal();
      if (f.webauthn.type === "create") {
        const { user: v } = f.webauthn.credential_options.publicKey;
        if (!v.name) {
          const x = a;
          if (x) v.name = `${v.id}:${x}`;
          else {
            const S = (await this.client.getUser()).data.user,
              N =
                ((d = S == null ? void 0 : S.user_metadata) === null ||
                d === void 0
                  ? void 0
                  : d.name) ||
                (S == null ? void 0 : S.email) ||
                (S == null ? void 0 : S.id) ||
                "User";
            v.name = `${v.id}:${N}`;
          }
        }
        v.displayName || (v.displayName = v.name);
      }
      switch (f.webauthn.type) {
        case "create": {
          const v = M0(
              f.webauthn.credential_options.publicKey,
              u == null ? void 0 : u.create,
            ),
            { data: x, error: _ } = await L0({ publicKey: v, signal: y });
          return x
            ? {
                data: {
                  factorId: r,
                  challengeId: f.id,
                  webauthn: { type: f.webauthn.type, credential_response: x },
                },
                error: null,
              }
            : { data: null, error: _ };
        }
        case "request": {
          const v = z0(
              f.webauthn.credential_options.publicKey,
              u == null ? void 0 : u.request,
            ),
            { data: x, error: _ } = await $0(
              Object.assign(Object.assign({}, f.webauthn.credential_options), {
                publicKey: v,
                signal: y,
              }),
            );
          return x
            ? {
                data: {
                  factorId: r,
                  challengeId: f.id,
                  webauthn: { type: f.webauthn.type, credential_response: x },
                },
                error: null,
              }
            : { data: null, error: _ };
        }
      }
    } catch (f) {
      return K(f)
        ? { data: null, error: f }
        : { data: null, error: new zr("Unexpected error in challenge", f) };
    }
  }
  async _verify({ challengeId: r, factorId: s, webauthn: a }) {
    return this.client.mfa.verify({ factorId: s, challengeId: r, webauthn: a });
  }
  async _authenticate(
    {
      factorId: r,
      webauthn: {
        rpId: s = typeof window < "u" ? window.location.hostname : void 0,
        rpOrigins: a = typeof window < "u" ? [window.location.origin] : void 0,
        signal: l,
      } = {},
    },
    u,
  ) {
    if (!s)
      return {
        data: null,
        error: new Rs("rpId is required for WebAuthn authentication"),
      };
    try {
      if (!Ph())
        return {
          data: null,
          error: new zr("Browser does not support WebAuthn", null),
        };
      const { data: d, error: f } = await this.challenge(
        { factorId: r, webauthn: { rpId: s, rpOrigins: a }, signal: l },
        { request: u },
      );
      if (!d) return { data: null, error: f };
      const { webauthn: p } = d;
      return this._verify({
        factorId: r,
        challengeId: d.challengeId,
        webauthn: {
          type: p.type,
          rpId: s,
          rpOrigins: a,
          credential_response: p.credential_response,
        },
      });
    } catch (d) {
      return K(d)
        ? { data: null, error: d }
        : { data: null, error: new zr("Unexpected error in authenticate", d) };
    }
  }
  async _register(
    {
      friendlyName: r,
      webauthn: {
        rpId: s = typeof window < "u" ? window.location.hostname : void 0,
        rpOrigins: a = typeof window < "u" ? [window.location.origin] : void 0,
        signal: l,
      } = {},
    },
    u,
  ) {
    if (!s)
      return {
        data: null,
        error: new Rs("rpId is required for WebAuthn registration"),
      };
    try {
      if (!Ph())
        return {
          data: null,
          error: new zr("Browser does not support WebAuthn", null),
        };
      const { data: d, error: f } = await this._enroll({ friendlyName: r });
      if (!d)
        return (
          await this.client.mfa
            .listFactors()
            .then((v) => {
              var x;
              return (x = v.data) === null || x === void 0
                ? void 0
                : x.all.find(
                    (_) =>
                      _.factor_type === "webauthn" &&
                      _.friendly_name === r &&
                      _.status !== "unverified",
                  );
            })
            .then((v) =>
              v
                ? this.client.mfa.unenroll({
                    factorId: v == null ? void 0 : v.id,
                  })
                : void 0,
            ),
          { data: null, error: f }
        );
      const { data: p, error: y } = await this._challenge(
        {
          factorId: d.id,
          friendlyName: d.friendly_name,
          webauthn: { rpId: s, rpOrigins: a },
          signal: l,
        },
        { create: u },
      );
      return p
        ? this._verify({
            factorId: d.id,
            challengeId: p.challengeId,
            webauthn: {
              rpId: s,
              rpOrigins: a,
              type: p.webauthn.type,
              credential_response: p.webauthn.credential_response,
            },
          })
        : { data: null, error: y };
    } catch (d) {
      return K(d)
        ? { data: null, error: d }
        : { data: null, error: new zr("Unexpected error in register", d) };
    }
  }
}
b0();
const F0 = {
  url: Mv,
  storageKey: zv,
  autoRefreshToken: !0,
  persistSession: !0,
  detectSessionInUrl: !0,
  headers: Bv,
  flowType: "implicit",
  debug: !1,
  hasCustomAuthorizationHeader: !1,
  throwOnError: !1,
  lockAcquireTimeout: 5e3,
  skipAutoInitialize: !1,
};
async function Oh(n, r, s) {
  return await s();
}
const vn = {};
class Ts {
  get jwks() {
    var r, s;
    return (s =
      (r = vn[this.storageKey]) === null || r === void 0 ? void 0 : r.jwks) !==
      null && s !== void 0
      ? s
      : { keys: [] };
  }
  set jwks(r) {
    vn[this.storageKey] = Object.assign(
      Object.assign({}, vn[this.storageKey]),
      { jwks: r },
    );
  }
  get jwks_cached_at() {
    var r, s;
    return (s =
      (r = vn[this.storageKey]) === null || r === void 0
        ? void 0
        : r.cachedAt) !== null && s !== void 0
      ? s
      : Number.MIN_SAFE_INTEGER;
  }
  set jwks_cached_at(r) {
    vn[this.storageKey] = Object.assign(
      Object.assign({}, vn[this.storageKey]),
      { cachedAt: r },
    );
  }
  constructor(r) {
    var s, a, l;
    ((this.userStorage = null),
      (this.memoryStorage = null),
      (this.stateChangeEmitters = new Map()),
      (this.autoRefreshTicker = null),
      (this.autoRefreshTickTimeout = null),
      (this.visibilityChangedCallback = null),
      (this.refreshingDeferred = null),
      (this.initializePromise = null),
      (this.detectSessionInUrl = !0),
      (this.hasCustomAuthorizationHeader = !1),
      (this.suppressGetSessionWarning = !1),
      (this.lockAcquired = !1),
      (this.pendingInLock = []),
      (this.broadcastChannel = null),
      (this.logger = console.log));
    const u = Object.assign(Object.assign({}, F0), r);
    if (
      ((this.storageKey = u.storageKey),
      (this.instanceID =
        (s = Ts.nextInstanceID[this.storageKey]) !== null && s !== void 0
          ? s
          : 0),
      (Ts.nextInstanceID[this.storageKey] = this.instanceID + 1),
      (this.logDebugMessages = !!u.debug),
      typeof u.debug == "function" && (this.logger = u.debug),
      this.instanceID > 0 && Ve())
    ) {
      const d = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
      (console.warn(d), this.logDebugMessages && console.trace(d));
    }
    if (
      ((this.persistSession = u.persistSession),
      (this.autoRefreshToken = u.autoRefreshToken),
      (this.admin = new _0({ url: u.url, headers: u.headers, fetch: u.fetch })),
      (this.url = u.url),
      (this.headers = u.headers),
      (this.fetch = xf(u.fetch)),
      (this.lock = u.lock || Oh),
      (this.detectSessionInUrl = u.detectSessionInUrl),
      (this.flowType = u.flowType),
      (this.hasCustomAuthorizationHeader = u.hasCustomAuthorizationHeader),
      (this.throwOnError = u.throwOnError),
      (this.lockAcquireTimeout = u.lockAcquireTimeout),
      u.lock
        ? (this.lock = u.lock)
        : this.persistSession &&
            Ve() &&
            !(
              (a = globalThis == null ? void 0 : globalThis.navigator) ===
                null || a === void 0
            ) &&
            a.locks
          ? (this.lock = k0)
          : (this.lock = Oh),
      this.jwks ||
        ((this.jwks = { keys: [] }),
        (this.jwks_cached_at = Number.MIN_SAFE_INTEGER)),
      (this.mfa = {
        verify: this._verify.bind(this),
        enroll: this._enroll.bind(this),
        unenroll: this._unenroll.bind(this),
        challenge: this._challenge.bind(this),
        listFactors: this._listFactors.bind(this),
        challengeAndVerify: this._challengeAndVerify.bind(this),
        getAuthenticatorAssuranceLevel:
          this._getAuthenticatorAssuranceLevel.bind(this),
        webauthn: new B0(this),
      }),
      (this.oauth = {
        getAuthorizationDetails: this._getAuthorizationDetails.bind(this),
        approveAuthorization: this._approveAuthorization.bind(this),
        denyAuthorization: this._denyAuthorization.bind(this),
        listGrants: this._listOAuthGrants.bind(this),
        revokeGrant: this._revokeOAuthGrant.bind(this),
      }),
      this.persistSession
        ? (u.storage
            ? (this.storage = u.storage)
            : wf()
              ? (this.storage = globalThis.localStorage)
              : ((this.memoryStorage = {}),
                (this.storage = Th(this.memoryStorage))),
          u.userStorage && (this.userStorage = u.userStorage))
        : ((this.memoryStorage = {}), (this.storage = Th(this.memoryStorage))),
      Ve() &&
        globalThis.BroadcastChannel &&
        this.persistSession &&
        this.storageKey)
    ) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(
          this.storageKey,
        );
      } catch (d) {
        console.error(
          "Failed to create a new BroadcastChannel, multi-tab state changes will not be available",
          d,
        );
      }
      (l = this.broadcastChannel) === null ||
        l === void 0 ||
        l.addEventListener("message", async (d) => {
          this._debug(
            "received broadcast notification from other tab or client",
            d,
          );
          try {
            await this._notifyAllSubscribers(d.data.event, d.data.session, !1);
          } catch (f) {
            this._debug("#broadcastChannel", "error", f);
          }
        });
    }
    u.skipAutoInitialize ||
      this.initialize().catch((d) => {
        this._debug("#initialize()", "error", d);
      });
  }
  isThrowOnErrorEnabled() {
    return this.throwOnError;
  }
  _returnResult(r) {
    if (this.throwOnError && r && r.error) throw r.error;
    return r;
  }
  _logPrefix() {
    return `GoTrueClient@${this.storageKey}:${this.instanceID} (${gf}) ${new Date().toISOString()}`;
  }
  _debug(...r) {
    return (
      this.logDebugMessages && this.logger(this._logPrefix(), ...r),
      this
    );
  }
  async initialize() {
    return this.initializePromise
      ? await this.initializePromise
      : ((this.initializePromise = (async () =>
          await this._acquireLock(
            this.lockAcquireTimeout,
            async () => await this._initialize(),
          ))()),
        await this.initializePromise);
  }
  async _initialize() {
    var r;
    try {
      let s = {},
        a = "none";
      if (
        (Ve() &&
          ((s = t0(window.location.href)),
          this._isImplicitGrantCallback(s)
            ? (a = "implicit")
            : (await this._isPKCECallback(s)) && (a = "pkce")),
        Ve() && this.detectSessionInUrl && a !== "none")
      ) {
        const { data: l, error: u } = await this._getSessionFromURL(s, a);
        if (u) {
          if (
            (this._debug(
              "#_initialize()",
              "error detecting session from URL",
              u,
            ),
            qv(u))
          ) {
            const p =
              (r = u.details) === null || r === void 0 ? void 0 : r.code;
            if (
              p === "identity_already_exists" ||
              p === "identity_not_found" ||
              p === "single_identity_not_deletable"
            )
              return { error: u };
          }
          return { error: u };
        }
        const { session: d, redirectType: f } = l;
        return (
          this._debug(
            "#_initialize()",
            "detected session in URL",
            d,
            "redirect type",
            f,
          ),
          await this._saveSession(d),
          setTimeout(async () => {
            f === "recovery"
              ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", d)
              : await this._notifyAllSubscribers("SIGNED_IN", d);
          }, 0),
          { error: null }
        );
      }
      return (await this._recoverAndRefresh(), { error: null });
    } catch (s) {
      return K(s)
        ? this._returnResult({ error: s })
        : this._returnResult({
            error: new zr("Unexpected error during initialization", s),
          });
    } finally {
      (await this._handleVisibilityChange(),
        this._debug("#_initialize()", "end"));
    }
  }
  async signInAnonymously(r) {
    var s, a, l;
    try {
      const u = await Q(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            data:
              (a =
                (s = r == null ? void 0 : r.options) === null || s === void 0
                  ? void 0
                  : s.data) !== null && a !== void 0
                ? a
                : {},
            gotrue_meta_security: {
              captcha_token:
                (l = r == null ? void 0 : r.options) === null || l === void 0
                  ? void 0
                  : l.captchaToken,
            },
          },
          xform: Tt,
        }),
        { data: d, error: f } = u;
      if (f || !d)
        return this._returnResult({
          data: { user: null, session: null },
          error: f,
        });
      const p = d.session,
        y = d.user;
      return (
        d.session &&
          (await this._saveSession(d.session),
          await this._notifyAllSubscribers("SIGNED_IN", p)),
        this._returnResult({ data: { user: y, session: p }, error: null })
      );
    } catch (u) {
      if (K(u))
        return this._returnResult({
          data: { user: null, session: null },
          error: u,
        });
      throw u;
    }
  }
  async signUp(r) {
    var s, a, l;
    try {
      let u;
      if ("email" in r) {
        const { email: v, password: x, options: _ } = r;
        let S = null,
          N = null;
        (this.flowType === "pkce" &&
          ([S, N] = await gn(this.storage, this.storageKey)),
          (u = await Q(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            redirectTo: _ == null ? void 0 : _.emailRedirectTo,
            body: {
              email: v,
              password: x,
              data:
                (s = _ == null ? void 0 : _.data) !== null && s !== void 0
                  ? s
                  : {},
              gotrue_meta_security: {
                captcha_token: _ == null ? void 0 : _.captchaToken,
              },
              code_challenge: S,
              code_challenge_method: N,
            },
            xform: Tt,
          })));
      } else if ("phone" in r) {
        const { phone: v, password: x, options: _ } = r;
        u = await Q(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            phone: v,
            password: x,
            data:
              (a = _ == null ? void 0 : _.data) !== null && a !== void 0
                ? a
                : {},
            channel:
              (l = _ == null ? void 0 : _.channel) !== null && l !== void 0
                ? l
                : "sms",
            gotrue_meta_security: {
              captcha_token: _ == null ? void 0 : _.captchaToken,
            },
          },
          xform: Tt,
        });
      } else
        throw new Ji(
          "You must provide either an email or phone number and a password",
        );
      const { data: d, error: f } = u;
      if (f || !d)
        return (
          await We(this.storage, `${this.storageKey}-code-verifier`),
          this._returnResult({ data: { user: null, session: null }, error: f })
        );
      const p = d.session,
        y = d.user;
      return (
        d.session &&
          (await this._saveSession(d.session),
          await this._notifyAllSubscribers("SIGNED_IN", p)),
        this._returnResult({ data: { user: y, session: p }, error: null })
      );
    } catch (u) {
      if ((await We(this.storage, `${this.storageKey}-code-verifier`), K(u)))
        return this._returnResult({
          data: { user: null, session: null },
          error: u,
        });
      throw u;
    }
  }
  async signInWithPassword(r) {
    try {
      let s;
      if ("email" in r) {
        const { email: u, password: d, options: f } = r;
        s = await Q(
          this.fetch,
          "POST",
          `${this.url}/token?grant_type=password`,
          {
            headers: this.headers,
            body: {
              email: u,
              password: d,
              gotrue_meta_security: {
                captcha_token: f == null ? void 0 : f.captchaToken,
              },
            },
            xform: Ch,
          },
        );
      } else if ("phone" in r) {
        const { phone: u, password: d, options: f } = r;
        s = await Q(
          this.fetch,
          "POST",
          `${this.url}/token?grant_type=password`,
          {
            headers: this.headers,
            body: {
              phone: u,
              password: d,
              gotrue_meta_security: {
                captcha_token: f == null ? void 0 : f.captchaToken,
              },
            },
            xform: Ch,
          },
        );
      } else
        throw new Ji(
          "You must provide either an email or phone number and a password",
        );
      const { data: a, error: l } = s;
      if (l)
        return this._returnResult({
          data: { user: null, session: null },
          error: l,
        });
      if (!a || !a.session || !a.user) {
        const u = new mn();
        return this._returnResult({
          data: { user: null, session: null },
          error: u,
        });
      }
      return (
        a.session &&
          (await this._saveSession(a.session),
          await this._notifyAllSubscribers("SIGNED_IN", a.session)),
        this._returnResult({
          data: Object.assign(
            { user: a.user, session: a.session },
            a.weak_password ? { weakPassword: a.weak_password } : null,
          ),
          error: l,
        })
      );
    } catch (s) {
      if (K(s))
        return this._returnResult({
          data: { user: null, session: null },
          error: s,
        });
      throw s;
    }
  }
  async signInWithOAuth(r) {
    var s, a, l, u;
    return await this._handleProviderSignIn(r.provider, {
      redirectTo:
        (s = r.options) === null || s === void 0 ? void 0 : s.redirectTo,
      scopes: (a = r.options) === null || a === void 0 ? void 0 : a.scopes,
      queryParams:
        (l = r.options) === null || l === void 0 ? void 0 : l.queryParams,
      skipBrowserRedirect:
        (u = r.options) === null || u === void 0
          ? void 0
          : u.skipBrowserRedirect,
    });
  }
  async exchangeCodeForSession(r) {
    return (
      await this.initializePromise,
      this._acquireLock(this.lockAcquireTimeout, async () =>
        this._exchangeCodeForSession(r),
      )
    );
  }
  async signInWithWeb3(r) {
    const { chain: s } = r;
    switch (s) {
      case "ethereum":
        return await this.signInWithEthereum(r);
      case "solana":
        return await this.signInWithSolana(r);
      default:
        throw new Error(`@supabase/auth-js: Unsupported chain "${s}"`);
    }
  }
  async signInWithEthereum(r) {
    var s, a, l, u, d, f, p, y, v, x, _;
    let S, N;
    if ("message" in r) ((S = r.message), (N = r.signature));
    else {
      const { chain: j, wallet: E, statement: A, options: L } = r;
      let I;
      if (Ve())
        if (typeof E == "object") I = E;
        else {
          const _e = window;
          if (
            "ethereum" in _e &&
            typeof _e.ethereum == "object" &&
            "request" in _e.ethereum &&
            typeof _e.ethereum.request == "function"
          )
            I = _e.ethereum;
          else
            throw new Error(
              "@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.",
            );
        }
      else {
        if (typeof E != "object" || !(L != null && L.url))
          throw new Error(
            "@supabase/auth-js: Both wallet and url must be specified in non-browser environments.",
          );
        I = E;
      }
      const B = new URL(
          (s = L == null ? void 0 : L.url) !== null && s !== void 0
            ? s
            : window.location.href,
        ),
        re = await I.request({ method: "eth_requestAccounts" })
          .then((_e) => _e)
          .catch(() => {
            throw new Error(
              "@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid",
            );
          });
      if (!re || re.length === 0)
        throw new Error(
          "@supabase/auth-js: No accounts available. Please ensure the wallet is connected.",
        );
      const Y = kf(re[0]);
      let se =
        (a = L == null ? void 0 : L.signInWithEthereum) === null || a === void 0
          ? void 0
          : a.chainId;
      if (!se) {
        const _e = await I.request({ method: "eth_chainId" });
        se = S0(_e);
      }
      const me = {
        domain: B.host,
        address: Y,
        statement: A,
        uri: B.href,
        version: "1",
        chainId: se,
        nonce:
          (l = L == null ? void 0 : L.signInWithEthereum) === null ||
          l === void 0
            ? void 0
            : l.nonce,
        issuedAt:
          (d =
            (u = L == null ? void 0 : L.signInWithEthereum) === null ||
            u === void 0
              ? void 0
              : u.issuedAt) !== null && d !== void 0
            ? d
            : new Date(),
        expirationTime:
          (f = L == null ? void 0 : L.signInWithEthereum) === null ||
          f === void 0
            ? void 0
            : f.expirationTime,
        notBefore:
          (p = L == null ? void 0 : L.signInWithEthereum) === null ||
          p === void 0
            ? void 0
            : p.notBefore,
        requestId:
          (y = L == null ? void 0 : L.signInWithEthereum) === null ||
          y === void 0
            ? void 0
            : y.requestId,
        resources:
          (v = L == null ? void 0 : L.signInWithEthereum) === null ||
          v === void 0
            ? void 0
            : v.resources,
      };
      ((S = j0(me)),
        (N = await I.request({ method: "personal_sign", params: [E0(S), Y] })));
    }
    try {
      const { data: j, error: E } = await Q(
        this.fetch,
        "POST",
        `${this.url}/token?grant_type=web3`,
        {
          headers: this.headers,
          body: Object.assign(
            { chain: "ethereum", message: S, signature: N },
            !((x = r.options) === null || x === void 0) && x.captchaToken
              ? {
                  gotrue_meta_security: {
                    captcha_token:
                      (_ = r.options) === null || _ === void 0
                        ? void 0
                        : _.captchaToken,
                  },
                }
              : null,
          ),
          xform: Tt,
        },
      );
      if (E) throw E;
      if (!j || !j.session || !j.user) {
        const A = new mn();
        return this._returnResult({
          data: { user: null, session: null },
          error: A,
        });
      }
      return (
        j.session &&
          (await this._saveSession(j.session),
          await this._notifyAllSubscribers("SIGNED_IN", j.session)),
        this._returnResult({ data: Object.assign({}, j), error: E })
      );
    } catch (j) {
      if (K(j))
        return this._returnResult({
          data: { user: null, session: null },
          error: j,
        });
      throw j;
    }
  }
  async signInWithSolana(r) {
    var s, a, l, u, d, f, p, y, v, x, _, S;
    let N, j;
    if ("message" in r) ((N = r.message), (j = r.signature));
    else {
      const { chain: E, wallet: A, statement: L, options: I } = r;
      let B;
      if (Ve())
        if (typeof A == "object") B = A;
        else {
          const Y = window;
          if (
            "solana" in Y &&
            typeof Y.solana == "object" &&
            (("signIn" in Y.solana && typeof Y.solana.signIn == "function") ||
              ("signMessage" in Y.solana &&
                typeof Y.solana.signMessage == "function"))
          )
            B = Y.solana;
          else
            throw new Error(
              "@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.",
            );
        }
      else {
        if (typeof A != "object" || !(I != null && I.url))
          throw new Error(
            "@supabase/auth-js: Both wallet and url must be specified in non-browser environments.",
          );
        B = A;
      }
      const re = new URL(
        (s = I == null ? void 0 : I.url) !== null && s !== void 0
          ? s
          : window.location.href,
      );
      if ("signIn" in B && B.signIn) {
        const Y = await B.signIn(
          Object.assign(
            Object.assign(
              Object.assign(
                { issuedAt: new Date().toISOString() },
                I == null ? void 0 : I.signInWithSolana,
              ),
              { version: "1", domain: re.host, uri: re.href },
            ),
            L ? { statement: L } : null,
          ),
        );
        let se;
        if (Array.isArray(Y) && Y[0] && typeof Y[0] == "object") se = Y[0];
        else if (
          Y &&
          typeof Y == "object" &&
          "signedMessage" in Y &&
          "signature" in Y
        )
          se = Y;
        else
          throw new Error(
            "@supabase/auth-js: Wallet method signIn() returned unrecognized value",
          );
        if (
          "signedMessage" in se &&
          "signature" in se &&
          (typeof se.signedMessage == "string" ||
            se.signedMessage instanceof Uint8Array) &&
          se.signature instanceof Uint8Array
        )
          ((N =
            typeof se.signedMessage == "string"
              ? se.signedMessage
              : new TextDecoder().decode(se.signedMessage)),
            (j = se.signature));
        else
          throw new Error(
            "@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields",
          );
      } else {
        if (
          !("signMessage" in B) ||
          typeof B.signMessage != "function" ||
          !("publicKey" in B) ||
          typeof B != "object" ||
          !B.publicKey ||
          !("toBase58" in B.publicKey) ||
          typeof B.publicKey.toBase58 != "function"
        )
          throw new Error(
            "@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API",
          );
        N = [
          `${re.host} wants you to sign in with your Solana account:`,
          B.publicKey.toBase58(),
          ...(L ? ["", L, ""] : [""]),
          "Version: 1",
          `URI: ${re.href}`,
          `Issued At: ${(l = (a = I == null ? void 0 : I.signInWithSolana) === null || a === void 0 ? void 0 : a.issuedAt) !== null && l !== void 0 ? l : new Date().toISOString()}`,
          ...(!(
            (u = I == null ? void 0 : I.signInWithSolana) === null ||
            u === void 0
          ) && u.notBefore
            ? [`Not Before: ${I.signInWithSolana.notBefore}`]
            : []),
          ...(!(
            (d = I == null ? void 0 : I.signInWithSolana) === null ||
            d === void 0
          ) && d.expirationTime
            ? [`Expiration Time: ${I.signInWithSolana.expirationTime}`]
            : []),
          ...(!(
            (f = I == null ? void 0 : I.signInWithSolana) === null ||
            f === void 0
          ) && f.chainId
            ? [`Chain ID: ${I.signInWithSolana.chainId}`]
            : []),
          ...(!(
            (p = I == null ? void 0 : I.signInWithSolana) === null ||
            p === void 0
          ) && p.nonce
            ? [`Nonce: ${I.signInWithSolana.nonce}`]
            : []),
          ...(!(
            (y = I == null ? void 0 : I.signInWithSolana) === null ||
            y === void 0
          ) && y.requestId
            ? [`Request ID: ${I.signInWithSolana.requestId}`]
            : []),
          ...(!(
            (x =
              (v = I == null ? void 0 : I.signInWithSolana) === null ||
              v === void 0
                ? void 0
                : v.resources) === null || x === void 0
          ) && x.length
            ? [
                "Resources",
                ...I.signInWithSolana.resources.map((se) => `- ${se}`),
              ]
            : []),
        ].join(`
`);
        const Y = await B.signMessage(new TextEncoder().encode(N), "utf8");
        if (!Y || !(Y instanceof Uint8Array))
          throw new Error(
            "@supabase/auth-js: Wallet signMessage() API returned an recognized value",
          );
        j = Y;
      }
    }
    try {
      const { data: E, error: A } = await Q(
        this.fetch,
        "POST",
        `${this.url}/token?grant_type=web3`,
        {
          headers: this.headers,
          body: Object.assign(
            { chain: "solana", message: N, signature: Br(j) },
            !((_ = r.options) === null || _ === void 0) && _.captchaToken
              ? {
                  gotrue_meta_security: {
                    captcha_token:
                      (S = r.options) === null || S === void 0
                        ? void 0
                        : S.captchaToken,
                  },
                }
              : null,
          ),
          xform: Tt,
        },
      );
      if (A) throw A;
      if (!E || !E.session || !E.user) {
        const L = new mn();
        return this._returnResult({
          data: { user: null, session: null },
          error: L,
        });
      }
      return (
        E.session &&
          (await this._saveSession(E.session),
          await this._notifyAllSubscribers("SIGNED_IN", E.session)),
        this._returnResult({ data: Object.assign({}, E), error: A })
      );
    } catch (E) {
      if (K(E))
        return this._returnResult({
          data: { user: null, session: null },
          error: E,
        });
      throw E;
    }
  }
  async _exchangeCodeForSession(r) {
    const s = await Ur(this.storage, `${this.storageKey}-code-verifier`),
      [a, l] = (s ?? "").split("/");
    try {
      if (!a && this.flowType === "pkce") throw new Kv();
      const { data: u, error: d } = await Q(
        this.fetch,
        "POST",
        `${this.url}/token?grant_type=pkce`,
        {
          headers: this.headers,
          body: { auth_code: r, code_verifier: a },
          xform: Tt,
        },
      );
      if ((await We(this.storage, `${this.storageKey}-code-verifier`), d))
        throw d;
      if (!u || !u.session || !u.user) {
        const f = new mn();
        return this._returnResult({
          data: { user: null, session: null, redirectType: null },
          error: f,
        });
      }
      return (
        u.session &&
          (await this._saveSession(u.session),
          await this._notifyAllSubscribers("SIGNED_IN", u.session)),
        this._returnResult({
          data: Object.assign(Object.assign({}, u), {
            redirectType: l ?? null,
          }),
          error: d,
        })
      );
    } catch (u) {
      if ((await We(this.storage, `${this.storageKey}-code-verifier`), K(u)))
        return this._returnResult({
          data: { user: null, session: null, redirectType: null },
          error: u,
        });
      throw u;
    }
  }
  async signInWithIdToken(r) {
    try {
      const {
          options: s,
          provider: a,
          token: l,
          access_token: u,
          nonce: d,
        } = r,
        f = await Q(
          this.fetch,
          "POST",
          `${this.url}/token?grant_type=id_token`,
          {
            headers: this.headers,
            body: {
              provider: a,
              id_token: l,
              access_token: u,
              nonce: d,
              gotrue_meta_security: {
                captcha_token: s == null ? void 0 : s.captchaToken,
              },
            },
            xform: Tt,
          },
        ),
        { data: p, error: y } = f;
      if (y)
        return this._returnResult({
          data: { user: null, session: null },
          error: y,
        });
      if (!p || !p.session || !p.user) {
        const v = new mn();
        return this._returnResult({
          data: { user: null, session: null },
          error: v,
        });
      }
      return (
        p.session &&
          (await this._saveSession(p.session),
          await this._notifyAllSubscribers("SIGNED_IN", p.session)),
        this._returnResult({ data: p, error: y })
      );
    } catch (s) {
      if (K(s))
        return this._returnResult({
          data: { user: null, session: null },
          error: s,
        });
      throw s;
    }
  }
  async signInWithOtp(r) {
    var s, a, l, u, d;
    try {
      if ("email" in r) {
        const { email: f, options: p } = r;
        let y = null,
          v = null;
        this.flowType === "pkce" &&
          ([y, v] = await gn(this.storage, this.storageKey));
        const { error: x } = await Q(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email: f,
            data:
              (s = p == null ? void 0 : p.data) !== null && s !== void 0
                ? s
                : {},
            create_user:
              (a = p == null ? void 0 : p.shouldCreateUser) !== null &&
              a !== void 0
                ? a
                : !0,
            gotrue_meta_security: {
              captcha_token: p == null ? void 0 : p.captchaToken,
            },
            code_challenge: y,
            code_challenge_method: v,
          },
          redirectTo: p == null ? void 0 : p.emailRedirectTo,
        });
        return this._returnResult({
          data: { user: null, session: null },
          error: x,
        });
      }
      if ("phone" in r) {
        const { phone: f, options: p } = r,
          { data: y, error: v } = await Q(
            this.fetch,
            "POST",
            `${this.url}/otp`,
            {
              headers: this.headers,
              body: {
                phone: f,
                data:
                  (l = p == null ? void 0 : p.data) !== null && l !== void 0
                    ? l
                    : {},
                create_user:
                  (u = p == null ? void 0 : p.shouldCreateUser) !== null &&
                  u !== void 0
                    ? u
                    : !0,
                gotrue_meta_security: {
                  captcha_token: p == null ? void 0 : p.captchaToken,
                },
                channel:
                  (d = p == null ? void 0 : p.channel) !== null && d !== void 0
                    ? d
                    : "sms",
              },
            },
          );
        return this._returnResult({
          data: {
            user: null,
            session: null,
            messageId: y == null ? void 0 : y.message_id,
          },
          error: v,
        });
      }
      throw new Ji("You must provide either an email or phone number.");
    } catch (f) {
      if ((await We(this.storage, `${this.storageKey}-code-verifier`), K(f)))
        return this._returnResult({
          data: { user: null, session: null },
          error: f,
        });
      throw f;
    }
  }
  async verifyOtp(r) {
    var s, a;
    try {
      let l, u;
      "options" in r &&
        ((l = (s = r.options) === null || s === void 0 ? void 0 : s.redirectTo),
        (u =
          (a = r.options) === null || a === void 0 ? void 0 : a.captchaToken));
      const { data: d, error: f } = await Q(
        this.fetch,
        "POST",
        `${this.url}/verify`,
        {
          headers: this.headers,
          body: Object.assign(Object.assign({}, r), {
            gotrue_meta_security: { captcha_token: u },
          }),
          redirectTo: l,
          xform: Tt,
        },
      );
      if (f) throw f;
      if (!d) throw new Error("An error occurred on token verification.");
      const p = d.session,
        y = d.user;
      return (
        p != null &&
          p.access_token &&
          (await this._saveSession(p),
          await this._notifyAllSubscribers(
            r.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN",
            p,
          )),
        this._returnResult({ data: { user: y, session: p }, error: null })
      );
    } catch (l) {
      if (K(l))
        return this._returnResult({
          data: { user: null, session: null },
          error: l,
        });
      throw l;
    }
  }
  async signInWithSSO(r) {
    var s, a, l, u, d;
    try {
      let f = null,
        p = null;
      this.flowType === "pkce" &&
        ([f, p] = await gn(this.storage, this.storageKey));
      const y = await Q(this.fetch, "POST", `${this.url}/sso`, {
        body: Object.assign(
          Object.assign(
            Object.assign(
              Object.assign(
                Object.assign(
                  {},
                  "providerId" in r ? { provider_id: r.providerId } : null,
                ),
                "domain" in r ? { domain: r.domain } : null,
              ),
              {
                redirect_to:
                  (a =
                    (s = r.options) === null || s === void 0
                      ? void 0
                      : s.redirectTo) !== null && a !== void 0
                    ? a
                    : void 0,
              },
            ),
            !((l = r == null ? void 0 : r.options) === null || l === void 0) &&
              l.captchaToken
              ? {
                  gotrue_meta_security: {
                    captcha_token: r.options.captchaToken,
                  },
                }
              : null,
          ),
          {
            skip_http_redirect: !0,
            code_challenge: f,
            code_challenge_method: p,
          },
        ),
        headers: this.headers,
        xform: v0,
      });
      return (
        !((u = y.data) === null || u === void 0) &&
          u.url &&
          Ve() &&
          !(
            !((d = r.options) === null || d === void 0) && d.skipBrowserRedirect
          ) &&
          window.location.assign(y.data.url),
        this._returnResult(y)
      );
    } catch (f) {
      if ((await We(this.storage, `${this.storageKey}-code-verifier`), K(f)))
        return this._returnResult({ data: null, error: f });
      throw f;
    }
  }
  async reauthenticate() {
    return (
      await this.initializePromise,
      await this._acquireLock(
        this.lockAcquireTimeout,
        async () => await this._reauthenticate(),
      )
    );
  }
  async _reauthenticate() {
    try {
      return await this._useSession(async (r) => {
        const {
          data: { session: s },
          error: a,
        } = r;
        if (a) throw a;
        if (!s) throw new ht();
        const { error: l } = await Q(
          this.fetch,
          "GET",
          `${this.url}/reauthenticate`,
          { headers: this.headers, jwt: s.access_token },
        );
        return this._returnResult({
          data: { user: null, session: null },
          error: l,
        });
      });
    } catch (r) {
      if (K(r))
        return this._returnResult({
          data: { user: null, session: null },
          error: r,
        });
      throw r;
    }
  }
  async resend(r) {
    try {
      const s = `${this.url}/resend`;
      if ("email" in r) {
        const { email: a, type: l, options: u } = r,
          { error: d } = await Q(this.fetch, "POST", s, {
            headers: this.headers,
            body: {
              email: a,
              type: l,
              gotrue_meta_security: {
                captcha_token: u == null ? void 0 : u.captchaToken,
              },
            },
            redirectTo: u == null ? void 0 : u.emailRedirectTo,
          });
        return this._returnResult({
          data: { user: null, session: null },
          error: d,
        });
      } else if ("phone" in r) {
        const { phone: a, type: l, options: u } = r,
          { data: d, error: f } = await Q(this.fetch, "POST", s, {
            headers: this.headers,
            body: {
              phone: a,
              type: l,
              gotrue_meta_security: {
                captcha_token: u == null ? void 0 : u.captchaToken,
              },
            },
          });
        return this._returnResult({
          data: {
            user: null,
            session: null,
            messageId: d == null ? void 0 : d.message_id,
          },
          error: f,
        });
      }
      throw new Ji(
        "You must provide either an email or phone number and a type",
      );
    } catch (s) {
      if (K(s))
        return this._returnResult({
          data: { user: null, session: null },
          error: s,
        });
      throw s;
    }
  }
  async getSession() {
    return (
      await this.initializePromise,
      await this._acquireLock(this.lockAcquireTimeout, async () =>
        this._useSession(async (s) => s),
      )
    );
  }
  async _acquireLock(r, s) {
    this._debug("#_acquireLock", "begin", r);
    try {
      if (this.lockAcquired) {
        const a = this.pendingInLock.length
            ? this.pendingInLock[this.pendingInLock.length - 1]
            : Promise.resolve(),
          l = (async () => (await a, await s()))();
        return (
          this.pendingInLock.push(
            (async () => {
              try {
                await l;
              } catch {}
            })(),
          ),
          l
        );
      }
      return await this.lock(`lock:${this.storageKey}`, r, async () => {
        this._debug(
          "#_acquireLock",
          "lock acquired for storage key",
          this.storageKey,
        );
        try {
          this.lockAcquired = !0;
          const a = s();
          for (
            this.pendingInLock.push(
              (async () => {
                try {
                  await a;
                } catch {}
              })(),
            ),
              await a;
            this.pendingInLock.length;
          ) {
            const l = [...this.pendingInLock];
            (await Promise.all(l), this.pendingInLock.splice(0, l.length));
          }
          return await a;
        } finally {
          (this._debug(
            "#_acquireLock",
            "lock released for storage key",
            this.storageKey,
          ),
            (this.lockAcquired = !1));
        }
      });
    } finally {
      this._debug("#_acquireLock", "end");
    }
  }
  async _useSession(r) {
    this._debug("#_useSession", "begin");
    try {
      const s = await this.__loadSession();
      return await r(s);
    } finally {
      this._debug("#_useSession", "end");
    }
  }
  async __loadSession() {
    (this._debug("#__loadSession()", "begin"),
      this.lockAcquired ||
        this._debug(
          "#__loadSession()",
          "used outside of an acquired lock!",
          new Error().stack,
        ));
    try {
      let r = null;
      const s = await Ur(this.storage, this.storageKey);
      if (
        (this._debug("#getSession()", "session from storage", s),
        s !== null &&
          (this._isValidSession(s)
            ? (r = s)
            : (this._debug(
                "#getSession()",
                "session from storage is not valid",
              ),
              await this._removeSession())),
        !r)
      )
        return { data: { session: null }, error: null };
      const a = r.expires_at ? r.expires_at * 1e3 - Date.now() < xl : !1;
      if (
        (this._debug(
          "#__loadSession()",
          `session has${a ? "" : " not"} expired`,
          "expires_at",
          r.expires_at,
        ),
        !a)
      ) {
        if (this.userStorage) {
          const d = await Ur(this.userStorage, this.storageKey + "-user");
          d != null && d.user ? (r.user = d.user) : (r.user = bl());
        }
        if (
          this.storage.isServer &&
          r.user &&
          !r.user.__isUserNotAvailableProxy
        ) {
          const d = { value: this.suppressGetSessionWarning };
          ((r.user = p0(r.user, d)),
            d.value && (this.suppressGetSessionWarning = !0));
        }
        return { data: { session: r }, error: null };
      }
      const { data: l, error: u } = await this._callRefreshToken(
        r.refresh_token,
      );
      return u
        ? this._returnResult({ data: { session: null }, error: u })
        : this._returnResult({ data: { session: l }, error: null });
    } finally {
      this._debug("#__loadSession()", "end");
    }
  }
  async getUser(r) {
    if (r) return await this._getUser(r);
    await this.initializePromise;
    const s = await this._acquireLock(
      this.lockAcquireTimeout,
      async () => await this._getUser(),
    );
    return (s.data.user && (this.suppressGetSessionWarning = !0), s);
  }
  async _getUser(r) {
    try {
      return r
        ? await Q(this.fetch, "GET", `${this.url}/user`, {
            headers: this.headers,
            jwt: r,
            xform: kr,
          })
        : await this._useSession(async (s) => {
            var a, l, u;
            const { data: d, error: f } = s;
            if (f) throw f;
            return !(
              !((a = d.session) === null || a === void 0) && a.access_token
            ) && !this.hasCustomAuthorizationHeader
              ? { data: { user: null }, error: new ht() }
              : await Q(this.fetch, "GET", `${this.url}/user`, {
                  headers: this.headers,
                  jwt:
                    (u =
                      (l = d.session) === null || l === void 0
                        ? void 0
                        : l.access_token) !== null && u !== void 0
                      ? u
                      : void 0,
                  xform: kr,
                });
          });
    } catch (s) {
      if (K(s))
        return (
          _l(s) &&
            (await this._removeSession(),
            await We(this.storage, `${this.storageKey}-code-verifier`)),
          this._returnResult({ data: { user: null }, error: s })
        );
      throw s;
    }
  }
  async updateUser(r, s = {}) {
    return (
      await this.initializePromise,
      await this._acquireLock(
        this.lockAcquireTimeout,
        async () => await this._updateUser(r, s),
      )
    );
  }
  async _updateUser(r, s = {}) {
    try {
      return await this._useSession(async (a) => {
        const { data: l, error: u } = a;
        if (u) throw u;
        if (!l.session) throw new ht();
        const d = l.session;
        let f = null,
          p = null;
        this.flowType === "pkce" &&
          r.email != null &&
          ([f, p] = await gn(this.storage, this.storageKey));
        const { data: y, error: v } = await Q(
          this.fetch,
          "PUT",
          `${this.url}/user`,
          {
            headers: this.headers,
            redirectTo: s == null ? void 0 : s.emailRedirectTo,
            body: Object.assign(Object.assign({}, r), {
              code_challenge: f,
              code_challenge_method: p,
            }),
            jwt: d.access_token,
            xform: kr,
          },
        );
        if (v) throw v;
        return (
          (d.user = y.user),
          await this._saveSession(d),
          await this._notifyAllSubscribers("USER_UPDATED", d),
          this._returnResult({ data: { user: d.user }, error: null })
        );
      });
    } catch (a) {
      if ((await We(this.storage, `${this.storageKey}-code-verifier`), K(a)))
        return this._returnResult({ data: { user: null }, error: a });
      throw a;
    }
  }
  async setSession(r) {
    return (
      await this.initializePromise,
      await this._acquireLock(
        this.lockAcquireTimeout,
        async () => await this._setSession(r),
      )
    );
  }
  async _setSession(r) {
    try {
      if (!r.access_token || !r.refresh_token) throw new ht();
      const s = Date.now() / 1e3;
      let a = s,
        l = !0,
        u = null;
      const { payload: d } = Yi(r.access_token);
      if ((d.exp && ((a = d.exp), (l = a <= s)), l)) {
        const { data: f, error: p } = await this._callRefreshToken(
          r.refresh_token,
        );
        if (p)
          return this._returnResult({
            data: { user: null, session: null },
            error: p,
          });
        if (!f) return { data: { user: null, session: null }, error: null };
        u = f;
      } else {
        const { data: f, error: p } = await this._getUser(r.access_token);
        if (p)
          return this._returnResult({
            data: { user: null, session: null },
            error: p,
          });
        ((u = {
          access_token: r.access_token,
          refresh_token: r.refresh_token,
          user: f.user,
          token_type: "bearer",
          expires_in: a - s,
          expires_at: a,
        }),
          await this._saveSession(u),
          await this._notifyAllSubscribers("SIGNED_IN", u));
      }
      return this._returnResult({
        data: { user: u.user, session: u },
        error: null,
      });
    } catch (s) {
      if (K(s))
        return this._returnResult({
          data: { session: null, user: null },
          error: s,
        });
      throw s;
    }
  }
  async refreshSession(r) {
    return (
      await this.initializePromise,
      await this._acquireLock(
        this.lockAcquireTimeout,
        async () => await this._refreshSession(r),
      )
    );
  }
  async _refreshSession(r) {
    try {
      return await this._useSession(async (s) => {
        var a;
        if (!r) {
          const { data: d, error: f } = s;
          if (f) throw f;
          r = (a = d.session) !== null && a !== void 0 ? a : void 0;
        }
        if (!(r != null && r.refresh_token)) throw new ht();
        const { data: l, error: u } = await this._callRefreshToken(
          r.refresh_token,
        );
        return u
          ? this._returnResult({
              data: { user: null, session: null },
              error: u,
            })
          : l
            ? this._returnResult({
                data: { user: l.user, session: l },
                error: null,
              })
            : this._returnResult({
                data: { user: null, session: null },
                error: null,
              });
      });
    } catch (s) {
      if (K(s))
        return this._returnResult({
          data: { user: null, session: null },
          error: s,
        });
      throw s;
    }
  }
  async _getSessionFromURL(r, s) {
    try {
      if (!Ve()) throw new Qi("No browser detected.");
      if (r.error || r.error_description || r.error_code)
        throw new Qi(
          r.error_description ||
            "Error in URL with unspecified error_description",
          {
            error: r.error || "unspecified_error",
            code: r.error_code || "unspecified_code",
          },
        );
      switch (s) {
        case "implicit":
          if (this.flowType === "pkce")
            throw new xh("Not a valid PKCE flow url.");
          break;
        case "pkce":
          if (this.flowType === "implicit")
            throw new Qi("Not a valid implicit grant flow url.");
          break;
        default:
      }
      if (s === "pkce") {
        if (
          (this._debug("#_initialize()", "begin", "is PKCE flow", !0), !r.code)
        )
          throw new xh("No code detected.");
        const { data: L, error: I } = await this._exchangeCodeForSession(
          r.code,
        );
        if (I) throw I;
        const B = new URL(window.location.href);
        return (
          B.searchParams.delete("code"),
          window.history.replaceState(window.history.state, "", B.toString()),
          { data: { session: L.session, redirectType: null }, error: null }
        );
      }
      const {
        provider_token: a,
        provider_refresh_token: l,
        access_token: u,
        refresh_token: d,
        expires_in: f,
        expires_at: p,
        token_type: y,
      } = r;
      if (!u || !f || !d || !y) throw new Qi("No session defined in URL");
      const v = Math.round(Date.now() / 1e3),
        x = parseInt(f);
      let _ = v + x;
      p && (_ = parseInt(p));
      const S = _ - v;
      S * 1e3 <= _n &&
        console.warn(
          `@supabase/gotrue-js: Session as retrieved from URL expires in ${S}s, should have been closer to ${x}s`,
        );
      const N = _ - x;
      v - N >= 120
        ? console.warn(
            "@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",
            N,
            _,
            v,
          )
        : v - N < 0 &&
          console.warn(
            "@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",
            N,
            _,
            v,
          );
      const { data: j, error: E } = await this._getUser(u);
      if (E) throw E;
      const A = {
        provider_token: a,
        provider_refresh_token: l,
        access_token: u,
        expires_in: x,
        expires_at: _,
        refresh_token: d,
        token_type: y,
        user: j.user,
      };
      return (
        (window.location.hash = ""),
        this._debug("#_getSessionFromURL()", "clearing window.location.hash"),
        this._returnResult({
          data: { session: A, redirectType: r.type },
          error: null,
        })
      );
    } catch (a) {
      if (K(a))
        return this._returnResult({
          data: { session: null, redirectType: null },
          error: a,
        });
      throw a;
    }
  }
  _isImplicitGrantCallback(r) {
    return typeof this.detectSessionInUrl == "function"
      ? this.detectSessionInUrl(new URL(window.location.href), r)
      : !!(r.access_token || r.error_description);
  }
  async _isPKCECallback(r) {
    const s = await Ur(this.storage, `${this.storageKey}-code-verifier`);
    return !!(r.code && s);
  }
  async signOut(r = { scope: "global" }) {
    return (
      await this.initializePromise,
      await this._acquireLock(
        this.lockAcquireTimeout,
        async () => await this._signOut(r),
      )
    );
  }
  async _signOut({ scope: r } = { scope: "global" }) {
    return await this._useSession(async (s) => {
      var a;
      const { data: l, error: u } = s;
      if (u && !_l(u)) return this._returnResult({ error: u });
      const d =
        (a = l.session) === null || a === void 0 ? void 0 : a.access_token;
      if (d) {
        const { error: f } = await this.admin.signOut(d, r);
        if (
          f &&
          !(
            (Hv(f) &&
              (f.status === 404 || f.status === 401 || f.status === 403)) ||
            _l(f)
          )
        )
          return this._returnResult({ error: f });
      }
      return (
        r !== "others" &&
          (await this._removeSession(),
          await We(this.storage, `${this.storageKey}-code-verifier`)),
        this._returnResult({ error: null })
      );
    });
  }
  onAuthStateChange(r) {
    const s = e0(),
      a = {
        id: s,
        callback: r,
        unsubscribe: () => {
          (this._debug(
            "#unsubscribe()",
            "state change callback with id removed",
            s,
          ),
            this.stateChangeEmitters.delete(s));
        },
      };
    return (
      this._debug("#onAuthStateChange()", "registered callback with id", s),
      this.stateChangeEmitters.set(s, a),
      (async () => (
        await this.initializePromise,
        await this._acquireLock(this.lockAcquireTimeout, async () => {
          this._emitInitialSession(s);
        })
      ))(),
      { data: { subscription: a } }
    );
  }
  async _emitInitialSession(r) {
    return await this._useSession(async (s) => {
      var a, l;
      try {
        const {
          data: { session: u },
          error: d,
        } = s;
        if (d) throw d;
        (await ((a = this.stateChangeEmitters.get(r)) === null || a === void 0
          ? void 0
          : a.callback("INITIAL_SESSION", u)),
          this._debug("INITIAL_SESSION", "callback id", r, "session", u));
      } catch (u) {
        (await ((l = this.stateChangeEmitters.get(r)) === null || l === void 0
          ? void 0
          : l.callback("INITIAL_SESSION", null)),
          this._debug("INITIAL_SESSION", "callback id", r, "error", u),
          console.error(u));
      }
    });
  }
  async resetPasswordForEmail(r, s = {}) {
    let a = null,
      l = null;
    this.flowType === "pkce" &&
      ([a, l] = await gn(this.storage, this.storageKey, !0));
    try {
      return await Q(this.fetch, "POST", `${this.url}/recover`, {
        body: {
          email: r,
          code_challenge: a,
          code_challenge_method: l,
          gotrue_meta_security: { captcha_token: s.captchaToken },
        },
        headers: this.headers,
        redirectTo: s.redirectTo,
      });
    } catch (u) {
      if ((await We(this.storage, `${this.storageKey}-code-verifier`), K(u)))
        return this._returnResult({ data: null, error: u });
      throw u;
    }
  }
  async getUserIdentities() {
    var r;
    try {
      const { data: s, error: a } = await this.getUser();
      if (a) throw a;
      return this._returnResult({
        data: {
          identities: (r = s.user.identities) !== null && r !== void 0 ? r : [],
        },
        error: null,
      });
    } catch (s) {
      if (K(s)) return this._returnResult({ data: null, error: s });
      throw s;
    }
  }
  async linkIdentity(r) {
    return "token" in r
      ? this.linkIdentityIdToken(r)
      : this.linkIdentityOAuth(r);
  }
  async linkIdentityOAuth(r) {
    var s;
    try {
      const { data: a, error: l } = await this._useSession(async (u) => {
        var d, f, p, y, v;
        const { data: x, error: _ } = u;
        if (_) throw _;
        const S = await this._getUrlForProvider(
          `${this.url}/user/identities/authorize`,
          r.provider,
          {
            redirectTo:
              (d = r.options) === null || d === void 0 ? void 0 : d.redirectTo,
            scopes:
              (f = r.options) === null || f === void 0 ? void 0 : f.scopes,
            queryParams:
              (p = r.options) === null || p === void 0 ? void 0 : p.queryParams,
            skipBrowserRedirect: !0,
          },
        );
        return await Q(this.fetch, "GET", S, {
          headers: this.headers,
          jwt:
            (v =
              (y = x.session) === null || y === void 0
                ? void 0
                : y.access_token) !== null && v !== void 0
              ? v
              : void 0,
        });
      });
      if (l) throw l;
      return (
        Ve() &&
          !(
            !((s = r.options) === null || s === void 0) && s.skipBrowserRedirect
          ) &&
          window.location.assign(a == null ? void 0 : a.url),
        this._returnResult({
          data: { provider: r.provider, url: a == null ? void 0 : a.url },
          error: null,
        })
      );
    } catch (a) {
      if (K(a))
        return this._returnResult({
          data: { provider: r.provider, url: null },
          error: a,
        });
      throw a;
    }
  }
  async linkIdentityIdToken(r) {
    return await this._useSession(async (s) => {
      var a;
      try {
        const {
          error: l,
          data: { session: u },
        } = s;
        if (l) throw l;
        const {
            options: d,
            provider: f,
            token: p,
            access_token: y,
            nonce: v,
          } = r,
          x = await Q(
            this.fetch,
            "POST",
            `${this.url}/token?grant_type=id_token`,
            {
              headers: this.headers,
              jwt:
                (a = u == null ? void 0 : u.access_token) !== null &&
                a !== void 0
                  ? a
                  : void 0,
              body: {
                provider: f,
                id_token: p,
                access_token: y,
                nonce: v,
                link_identity: !0,
                gotrue_meta_security: {
                  captcha_token: d == null ? void 0 : d.captchaToken,
                },
              },
              xform: Tt,
            },
          ),
          { data: _, error: S } = x;
        return S
          ? this._returnResult({
              data: { user: null, session: null },
              error: S,
            })
          : !_ || !_.session || !_.user
            ? this._returnResult({
                data: { user: null, session: null },
                error: new mn(),
              })
            : (_.session &&
                (await this._saveSession(_.session),
                await this._notifyAllSubscribers("USER_UPDATED", _.session)),
              this._returnResult({ data: _, error: S }));
      } catch (l) {
        if ((await We(this.storage, `${this.storageKey}-code-verifier`), K(l)))
          return this._returnResult({
            data: { user: null, session: null },
            error: l,
          });
        throw l;
      }
    });
  }
  async unlinkIdentity(r) {
    try {
      return await this._useSession(async (s) => {
        var a, l;
        const { data: u, error: d } = s;
        if (d) throw d;
        return await Q(
          this.fetch,
          "DELETE",
          `${this.url}/user/identities/${r.identity_id}`,
          {
            headers: this.headers,
            jwt:
              (l =
                (a = u.session) === null || a === void 0
                  ? void 0
                  : a.access_token) !== null && l !== void 0
                ? l
                : void 0,
          },
        );
      });
    } catch (s) {
      if (K(s)) return this._returnResult({ data: null, error: s });
      throw s;
    }
  }
  async _refreshAccessToken(r) {
    const s = `#_refreshAccessToken(${r.substring(0, 5)}...)`;
    this._debug(s, "begin");
    try {
      const a = Date.now();
      return await s0(
        async (l) => (
          l > 0 && (await n0(200 * Math.pow(2, l - 1))),
          this._debug(s, "refreshing attempt", l),
          await Q(
            this.fetch,
            "POST",
            `${this.url}/token?grant_type=refresh_token`,
            { body: { refresh_token: r }, headers: this.headers, xform: Tt },
          )
        ),
        (l, u) => {
          const d = 200 * Math.pow(2, l);
          return u && kl(u) && Date.now() + d - a < _n;
        },
      );
    } catch (a) {
      if ((this._debug(s, "error", a), K(a)))
        return this._returnResult({
          data: { session: null, user: null },
          error: a,
        });
      throw a;
    } finally {
      this._debug(s, "end");
    }
  }
  _isValidSession(r) {
    return (
      typeof r == "object" &&
      r !== null &&
      "access_token" in r &&
      "refresh_token" in r &&
      "expires_at" in r
    );
  }
  async _handleProviderSignIn(r, s) {
    const a = await this._getUrlForProvider(`${this.url}/authorize`, r, {
      redirectTo: s.redirectTo,
      scopes: s.scopes,
      queryParams: s.queryParams,
    });
    return (
      this._debug(
        "#_handleProviderSignIn()",
        "provider",
        r,
        "options",
        s,
        "url",
        a,
      ),
      Ve() && !s.skipBrowserRedirect && window.location.assign(a),
      { data: { provider: r, url: a }, error: null }
    );
  }
  async _recoverAndRefresh() {
    var r, s;
    const a = "#_recoverAndRefresh()";
    this._debug(a, "begin");
    try {
      const l = await Ur(this.storage, this.storageKey);
      if (l && this.userStorage) {
        let d = await Ur(this.userStorage, this.storageKey + "-user");
        (!this.storage.isServer &&
          Object.is(this.storage, this.userStorage) &&
          !d &&
          ((d = { user: l.user }),
          await kn(this.userStorage, this.storageKey + "-user", d)),
          (l.user =
            (r = d == null ? void 0 : d.user) !== null && r !== void 0
              ? r
              : bl()));
      } else if (l && !l.user && !l.user) {
        const d = await Ur(this.storage, this.storageKey + "-user");
        d && d != null && d.user
          ? ((l.user = d.user),
            await We(this.storage, this.storageKey + "-user"),
            await kn(this.storage, this.storageKey, l))
          : (l.user = bl());
      }
      if (
        (this._debug(a, "session from storage", l), !this._isValidSession(l))
      ) {
        (this._debug(a, "session is not valid"),
          l !== null && (await this._removeSession()));
        return;
      }
      const u =
        ((s = l.expires_at) !== null && s !== void 0 ? s : 1 / 0) * 1e3 -
          Date.now() <
        xl;
      if (
        (this._debug(
          a,
          `session has${u ? "" : " not"} expired with margin of ${xl}s`,
        ),
        u)
      ) {
        if (this.autoRefreshToken && l.refresh_token) {
          const { error: d } = await this._callRefreshToken(l.refresh_token);
          d &&
            (console.error(d),
            kl(d) ||
              (this._debug(
                a,
                "refresh failed with a non-retryable error, removing the session",
                d,
              ),
              await this._removeSession()));
        }
      } else if (l.user && l.user.__isUserNotAvailableProxy === !0)
        try {
          const { data: d, error: f } = await this._getUser(l.access_token);
          !f && d != null && d.user
            ? ((l.user = d.user),
              await this._saveSession(l),
              await this._notifyAllSubscribers("SIGNED_IN", l))
            : this._debug(
                a,
                "could not get user data, skipping SIGNED_IN notification",
              );
        } catch (d) {
          (console.error("Error getting user data:", d),
            this._debug(
              a,
              "error getting user data, skipping SIGNED_IN notification",
              d,
            ));
        }
      else await this._notifyAllSubscribers("SIGNED_IN", l);
    } catch (l) {
      (this._debug(a, "error", l), console.error(l));
      return;
    } finally {
      this._debug(a, "end");
    }
  }
  async _callRefreshToken(r) {
    var s, a;
    if (!r) throw new ht();
    if (this.refreshingDeferred) return this.refreshingDeferred.promise;
    const l = `#_callRefreshToken(${r.substring(0, 5)}...)`;
    this._debug(l, "begin");
    try {
      this.refreshingDeferred = new pa();
      const { data: u, error: d } = await this._refreshAccessToken(r);
      if (d) throw d;
      if (!u.session) throw new ht();
      (await this._saveSession(u.session),
        await this._notifyAllSubscribers("TOKEN_REFRESHED", u.session));
      const f = { data: u.session, error: null };
      return (this.refreshingDeferred.resolve(f), f);
    } catch (u) {
      if ((this._debug(l, "error", u), K(u))) {
        const d = { data: null, error: u };
        return (
          kl(u) || (await this._removeSession()),
          (s = this.refreshingDeferred) === null ||
            s === void 0 ||
            s.resolve(d),
          d
        );
      }
      throw (
        (a = this.refreshingDeferred) === null || a === void 0 || a.reject(u),
        u
      );
    } finally {
      ((this.refreshingDeferred = null), this._debug(l, "end"));
    }
  }
  async _notifyAllSubscribers(r, s, a = !0) {
    const l = `#_notifyAllSubscribers(${r})`;
    this._debug(l, "begin", s, `broadcast = ${a}`);
    try {
      this.broadcastChannel &&
        a &&
        this.broadcastChannel.postMessage({ event: r, session: s });
      const u = [],
        d = Array.from(this.stateChangeEmitters.values()).map(async (f) => {
          try {
            await f.callback(r, s);
          } catch (p) {
            u.push(p);
          }
        });
      if ((await Promise.all(d), u.length > 0)) {
        for (let f = 0; f < u.length; f += 1) console.error(u[f]);
        throw u[0];
      }
    } finally {
      this._debug(l, "end");
    }
  }
  async _saveSession(r) {
    (this._debug("#_saveSession()", r),
      (this.suppressGetSessionWarning = !0),
      await We(this.storage, `${this.storageKey}-code-verifier`));
    const s = Object.assign({}, r),
      a = s.user && s.user.__isUserNotAvailableProxy === !0;
    if (this.userStorage) {
      !a &&
        s.user &&
        (await kn(this.userStorage, this.storageKey + "-user", {
          user: s.user,
        }));
      const l = Object.assign({}, s);
      delete l.user;
      const u = Eh(l);
      await kn(this.storage, this.storageKey, u);
    } else {
      const l = Eh(s);
      await kn(this.storage, this.storageKey, l);
    }
  }
  async _removeSession() {
    (this._debug("#_removeSession()"),
      (this.suppressGetSessionWarning = !1),
      await We(this.storage, this.storageKey),
      await We(this.storage, this.storageKey + "-code-verifier"),
      await We(this.storage, this.storageKey + "-user"),
      this.userStorage &&
        (await We(this.userStorage, this.storageKey + "-user")),
      await this._notifyAllSubscribers("SIGNED_OUT", null));
  }
  _removeVisibilityChangedCallback() {
    this._debug("#_removeVisibilityChangedCallback()");
    const r = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      r &&
        Ve() &&
        window != null &&
        window.removeEventListener &&
        window.removeEventListener("visibilitychange", r);
    } catch (s) {
      console.error("removing visibilitychange callback failed", s);
    }
  }
  async _startAutoRefresh() {
    (await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()"));
    const r = setInterval(() => this._autoRefreshTokenTick(), _n);
    ((this.autoRefreshTicker = r),
      r && typeof r == "object" && typeof r.unref == "function"
        ? r.unref()
        : typeof Deno < "u" &&
          typeof Deno.unrefTimer == "function" &&
          Deno.unrefTimer(r));
    const s = setTimeout(async () => {
      (await this.initializePromise, await this._autoRefreshTokenTick());
    }, 0);
    ((this.autoRefreshTickTimeout = s),
      s && typeof s == "object" && typeof s.unref == "function"
        ? s.unref()
        : typeof Deno < "u" &&
          typeof Deno.unrefTimer == "function" &&
          Deno.unrefTimer(s));
  }
  async _stopAutoRefresh() {
    this._debug("#_stopAutoRefresh()");
    const r = this.autoRefreshTicker;
    ((this.autoRefreshTicker = null), r && clearInterval(r));
    const s = this.autoRefreshTickTimeout;
    ((this.autoRefreshTickTimeout = null), s && clearTimeout(s));
  }
  async startAutoRefresh() {
    (this._removeVisibilityChangedCallback(), await this._startAutoRefresh());
  }
  async stopAutoRefresh() {
    (this._removeVisibilityChangedCallback(), await this._stopAutoRefresh());
  }
  async _autoRefreshTokenTick() {
    this._debug("#_autoRefreshTokenTick()", "begin");
    try {
      await this._acquireLock(0, async () => {
        try {
          const r = Date.now();
          try {
            return await this._useSession(async (s) => {
              const {
                data: { session: a },
              } = s;
              if (!a || !a.refresh_token || !a.expires_at) {
                this._debug("#_autoRefreshTokenTick()", "no session");
                return;
              }
              const l = Math.floor((a.expires_at * 1e3 - r) / _n);
              (this._debug(
                "#_autoRefreshTokenTick()",
                `access token expires in ${l} ticks, a tick lasts ${_n}ms, refresh threshold is ${Ul} ticks`,
              ),
                l <= Ul && (await this._callRefreshToken(a.refresh_token)));
            });
          } catch (s) {
            console.error(
              "Auto refresh tick failed with error. This is likely a transient error.",
              s,
            );
          }
        } finally {
          this._debug("#_autoRefreshTokenTick()", "end");
        }
      });
    } catch (r) {
      if (r.isAcquireTimeout || r instanceof _f)
        this._debug("auto refresh token tick lock not available");
      else throw r;
    }
  }
  async _handleVisibilityChange() {
    if (
      (this._debug("#_handleVisibilityChange()"),
      !Ve() || !(window != null && window.addEventListener))
    )
      return (this.autoRefreshToken && this.startAutoRefresh(), !1);
    try {
      ((this.visibilityChangedCallback = async () => {
        try {
          await this._onVisibilityChanged(!1);
        } catch (r) {
          this._debug("#visibilityChangedCallback", "error", r);
        }
      }),
        window == null ||
          window.addEventListener(
            "visibilitychange",
            this.visibilityChangedCallback,
          ),
        await this._onVisibilityChanged(!0));
    } catch (r) {
      console.error("_handleVisibilityChange", r);
    }
  }
  async _onVisibilityChanged(r) {
    const s = `#_onVisibilityChanged(${r})`;
    (this._debug(s, "visibilityState", document.visibilityState),
      document.visibilityState === "visible"
        ? (this.autoRefreshToken && this._startAutoRefresh(),
          r ||
            (await this.initializePromise,
            await this._acquireLock(this.lockAcquireTimeout, async () => {
              if (document.visibilityState !== "visible") {
                this._debug(
                  s,
                  "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting",
                );
                return;
              }
              await this._recoverAndRefresh();
            })))
        : document.visibilityState === "hidden" &&
          this.autoRefreshToken &&
          this._stopAutoRefresh());
  }
  async _getUrlForProvider(r, s, a) {
    const l = [`provider=${encodeURIComponent(s)}`];
    if (
      (a != null &&
        a.redirectTo &&
        l.push(`redirect_to=${encodeURIComponent(a.redirectTo)}`),
      a != null && a.scopes && l.push(`scopes=${encodeURIComponent(a.scopes)}`),
      this.flowType === "pkce")
    ) {
      const [u, d] = await gn(this.storage, this.storageKey),
        f = new URLSearchParams({
          code_challenge: `${encodeURIComponent(u)}`,
          code_challenge_method: `${encodeURIComponent(d)}`,
        });
      l.push(f.toString());
    }
    if (a != null && a.queryParams) {
      const u = new URLSearchParams(a.queryParams);
      l.push(u.toString());
    }
    return (
      a != null &&
        a.skipBrowserRedirect &&
        l.push(`skip_http_redirect=${a.skipBrowserRedirect}`),
      `${r}?${l.join("&")}`
    );
  }
  async _unenroll(r) {
    try {
      return await this._useSession(async (s) => {
        var a;
        const { data: l, error: u } = s;
        return u
          ? this._returnResult({ data: null, error: u })
          : await Q(this.fetch, "DELETE", `${this.url}/factors/${r.factorId}`, {
              headers: this.headers,
              jwt:
                (a = l == null ? void 0 : l.session) === null || a === void 0
                  ? void 0
                  : a.access_token,
            });
      });
    } catch (s) {
      if (K(s)) return this._returnResult({ data: null, error: s });
      throw s;
    }
  }
  async _enroll(r) {
    try {
      return await this._useSession(async (s) => {
        var a, l;
        const { data: u, error: d } = s;
        if (d) return this._returnResult({ data: null, error: d });
        const f = Object.assign(
            { friendly_name: r.friendlyName, factor_type: r.factorType },
            r.factorType === "phone"
              ? { phone: r.phone }
              : r.factorType === "totp"
                ? { issuer: r.issuer }
                : {},
          ),
          { data: p, error: y } = await Q(
            this.fetch,
            "POST",
            `${this.url}/factors`,
            {
              body: f,
              headers: this.headers,
              jwt:
                (a = u == null ? void 0 : u.session) === null || a === void 0
                  ? void 0
                  : a.access_token,
            },
          );
        return y
          ? this._returnResult({ data: null, error: y })
          : (r.factorType === "totp" &&
              p.type === "totp" &&
              !((l = p == null ? void 0 : p.totp) === null || l === void 0) &&
              l.qr_code &&
              (p.totp.qr_code = `data:image/svg+xml;utf-8,${p.totp.qr_code}`),
            this._returnResult({ data: p, error: null }));
      });
    } catch (s) {
      if (K(s)) return this._returnResult({ data: null, error: s });
      throw s;
    }
  }
  async _verify(r) {
    return this._acquireLock(this.lockAcquireTimeout, async () => {
      try {
        return await this._useSession(async (s) => {
          var a;
          const { data: l, error: u } = s;
          if (u) return this._returnResult({ data: null, error: u });
          const d = Object.assign(
              { challenge_id: r.challengeId },
              "webauthn" in r
                ? {
                    webauthn: Object.assign(Object.assign({}, r.webauthn), {
                      credential_response:
                        r.webauthn.type === "create"
                          ? A0(r.webauthn.credential_response)
                          : I0(r.webauthn.credential_response),
                    }),
                  }
                : { code: r.code },
            ),
            { data: f, error: p } = await Q(
              this.fetch,
              "POST",
              `${this.url}/factors/${r.factorId}/verify`,
              {
                body: d,
                headers: this.headers,
                jwt:
                  (a = l == null ? void 0 : l.session) === null || a === void 0
                    ? void 0
                    : a.access_token,
              },
            );
          return p
            ? this._returnResult({ data: null, error: p })
            : (await this._saveSession(
                Object.assign(
                  { expires_at: Math.round(Date.now() / 1e3) + f.expires_in },
                  f,
                ),
              ),
              await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", f),
              this._returnResult({ data: f, error: p }));
        });
      } catch (s) {
        if (K(s)) return this._returnResult({ data: null, error: s });
        throw s;
      }
    });
  }
  async _challenge(r) {
    return this._acquireLock(this.lockAcquireTimeout, async () => {
      try {
        return await this._useSession(async (s) => {
          var a;
          const { data: l, error: u } = s;
          if (u) return this._returnResult({ data: null, error: u });
          const d = await Q(
            this.fetch,
            "POST",
            `${this.url}/factors/${r.factorId}/challenge`,
            {
              body: r,
              headers: this.headers,
              jwt:
                (a = l == null ? void 0 : l.session) === null || a === void 0
                  ? void 0
                  : a.access_token,
            },
          );
          if (d.error) return d;
          const { data: f } = d;
          if (f.type !== "webauthn") return { data: f, error: null };
          switch (f.webauthn.type) {
            case "create":
              return {
                data: Object.assign(Object.assign({}, f), {
                  webauthn: Object.assign(Object.assign({}, f.webauthn), {
                    credential_options: Object.assign(
                      Object.assign({}, f.webauthn.credential_options),
                      {
                        publicKey: P0(f.webauthn.credential_options.publicKey),
                      },
                    ),
                  }),
                }),
                error: null,
              };
            case "request":
              return {
                data: Object.assign(Object.assign({}, f), {
                  webauthn: Object.assign(Object.assign({}, f.webauthn), {
                    credential_options: Object.assign(
                      Object.assign({}, f.webauthn.credential_options),
                      {
                        publicKey: O0(f.webauthn.credential_options.publicKey),
                      },
                    ),
                  }),
                }),
                error: null,
              };
          }
        });
      } catch (s) {
        if (K(s)) return this._returnResult({ data: null, error: s });
        throw s;
      }
    });
  }
  async _challengeAndVerify(r) {
    const { data: s, error: a } = await this._challenge({
      factorId: r.factorId,
    });
    return a
      ? this._returnResult({ data: null, error: a })
      : await this._verify({
          factorId: r.factorId,
          challengeId: s.id,
          code: r.code,
        });
  }
  async _listFactors() {
    var r;
    const {
      data: { user: s },
      error: a,
    } = await this.getUser();
    if (a) return { data: null, error: a };
    const l = { all: [], phone: [], totp: [], webauthn: [] };
    for (const u of (r = s == null ? void 0 : s.factors) !== null &&
    r !== void 0
      ? r
      : [])
      (l.all.push(u), u.status === "verified" && l[u.factor_type].push(u));
    return { data: l, error: null };
  }
  async _getAuthenticatorAssuranceLevel(r) {
    var s, a, l, u;
    if (r)
      try {
        const { payload: S } = Yi(r);
        let N = null;
        S.aal && (N = S.aal);
        let j = N;
        const {
          data: { user: E },
          error: A,
        } = await this.getUser(r);
        if (A) return this._returnResult({ data: null, error: A });
        ((a =
          (s = E == null ? void 0 : E.factors) === null || s === void 0
            ? void 0
            : s.filter((B) => B.status === "verified")) !== null && a !== void 0
          ? a
          : []
        ).length > 0 && (j = "aal2");
        const I = S.amr || [];
        return {
          data: {
            currentLevel: N,
            nextLevel: j,
            currentAuthenticationMethods: I,
          },
          error: null,
        };
      } catch (S) {
        if (K(S)) return this._returnResult({ data: null, error: S });
        throw S;
      }
    const {
      data: { session: d },
      error: f,
    } = await this.getSession();
    if (f) return this._returnResult({ data: null, error: f });
    if (!d)
      return {
        data: {
          currentLevel: null,
          nextLevel: null,
          currentAuthenticationMethods: [],
        },
        error: null,
      };
    const { payload: p } = Yi(d.access_token);
    let y = null;
    p.aal && (y = p.aal);
    let v = y;
    ((u =
      (l = d.user.factors) === null || l === void 0
        ? void 0
        : l.filter((S) => S.status === "verified")) !== null && u !== void 0
      ? u
      : []
    ).length > 0 && (v = "aal2");
    const _ = p.amr || [];
    return {
      data: { currentLevel: y, nextLevel: v, currentAuthenticationMethods: _ },
      error: null,
    };
  }
  async _getAuthorizationDetails(r) {
    try {
      return await this._useSession(async (s) => {
        const {
          data: { session: a },
          error: l,
        } = s;
        return l
          ? this._returnResult({ data: null, error: l })
          : a
            ? await Q(
                this.fetch,
                "GET",
                `${this.url}/oauth/authorizations/${r}`,
                {
                  headers: this.headers,
                  jwt: a.access_token,
                  xform: (u) => ({ data: u, error: null }),
                },
              )
            : this._returnResult({ data: null, error: new ht() });
      });
    } catch (s) {
      if (K(s)) return this._returnResult({ data: null, error: s });
      throw s;
    }
  }
  async _approveAuthorization(r, s) {
    try {
      return await this._useSession(async (a) => {
        const {
          data: { session: l },
          error: u,
        } = a;
        if (u) return this._returnResult({ data: null, error: u });
        if (!l) return this._returnResult({ data: null, error: new ht() });
        const d = await Q(
          this.fetch,
          "POST",
          `${this.url}/oauth/authorizations/${r}/consent`,
          {
            headers: this.headers,
            jwt: l.access_token,
            body: { action: "approve" },
            xform: (f) => ({ data: f, error: null }),
          },
        );
        return (
          d.data &&
            d.data.redirect_url &&
            Ve() &&
            !(s != null && s.skipBrowserRedirect) &&
            window.location.assign(d.data.redirect_url),
          d
        );
      });
    } catch (a) {
      if (K(a)) return this._returnResult({ data: null, error: a });
      throw a;
    }
  }
  async _denyAuthorization(r, s) {
    try {
      return await this._useSession(async (a) => {
        const {
          data: { session: l },
          error: u,
        } = a;
        if (u) return this._returnResult({ data: null, error: u });
        if (!l) return this._returnResult({ data: null, error: new ht() });
        const d = await Q(
          this.fetch,
          "POST",
          `${this.url}/oauth/authorizations/${r}/consent`,
          {
            headers: this.headers,
            jwt: l.access_token,
            body: { action: "deny" },
            xform: (f) => ({ data: f, error: null }),
          },
        );
        return (
          d.data &&
            d.data.redirect_url &&
            Ve() &&
            !(s != null && s.skipBrowserRedirect) &&
            window.location.assign(d.data.redirect_url),
          d
        );
      });
    } catch (a) {
      if (K(a)) return this._returnResult({ data: null, error: a });
      throw a;
    }
  }
  async _listOAuthGrants() {
    try {
      return await this._useSession(async (r) => {
        const {
          data: { session: s },
          error: a,
        } = r;
        return a
          ? this._returnResult({ data: null, error: a })
          : s
            ? await Q(this.fetch, "GET", `${this.url}/user/oauth/grants`, {
                headers: this.headers,
                jwt: s.access_token,
                xform: (l) => ({ data: l, error: null }),
              })
            : this._returnResult({ data: null, error: new ht() });
      });
    } catch (r) {
      if (K(r)) return this._returnResult({ data: null, error: r });
      throw r;
    }
  }
  async _revokeOAuthGrant(r) {
    try {
      return await this._useSession(async (s) => {
        const {
          data: { session: a },
          error: l,
        } = s;
        return l
          ? this._returnResult({ data: null, error: l })
          : a
            ? (await Q(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, {
                headers: this.headers,
                jwt: a.access_token,
                query: { client_id: r.clientId },
                noResolveJson: !0,
              }),
              { data: {}, error: null })
            : this._returnResult({ data: null, error: new ht() });
      });
    } catch (s) {
      if (K(s)) return this._returnResult({ data: null, error: s });
      throw s;
    }
  }
  async fetchJwk(r, s = { keys: [] }) {
    let a = s.keys.find((f) => f.kid === r);
    if (a) return a;
    const l = Date.now();
    if (
      ((a = this.jwks.keys.find((f) => f.kid === r)),
      a && this.jwks_cached_at + Wv > l)
    )
      return a;
    const { data: u, error: d } = await Q(
      this.fetch,
      "GET",
      `${this.url}/.well-known/jwks.json`,
      { headers: this.headers },
    );
    if (d) throw d;
    return !u.keys ||
      u.keys.length === 0 ||
      ((this.jwks = u),
      (this.jwks_cached_at = l),
      (a = u.keys.find((f) => f.kid === r)),
      !a)
      ? null
      : a;
  }
  async getClaims(r, s = {}) {
    try {
      let a = r;
      if (!a) {
        const { data: S, error: N } = await this.getSession();
        if (N || !S.session)
          return this._returnResult({ data: null, error: N });
        a = S.session.access_token;
      }
      const {
        header: l,
        payload: u,
        signature: d,
        raw: { header: f, payload: p },
      } = Yi(a);
      (s != null && s.allowExpired) || d0(u.exp);
      const y =
        !l.alg ||
        l.alg.startsWith("HS") ||
        !l.kid ||
        !("crypto" in globalThis && "subtle" in globalThis.crypto)
          ? null
          : await this.fetchJwk(
              l.kid,
              s != null && s.keys
                ? { keys: s.keys }
                : s == null
                  ? void 0
                  : s.jwks,
            );
      if (!y) {
        const { error: S } = await this.getUser(a);
        if (S) throw S;
        return { data: { claims: u, header: l, signature: d }, error: null };
      }
      const v = h0(l.alg),
        x = await crypto.subtle.importKey("jwk", y, v, !0, ["verify"]);
      if (!(await crypto.subtle.verify(v, x, d, Xv(`${f}.${p}`))))
        throw new zl("Invalid JWT signature");
      return { data: { claims: u, header: l, signature: d }, error: null };
    } catch (a) {
      if (K(a)) return this._returnResult({ data: null, error: a });
      throw a;
    }
  }
}
Ts.nextInstanceID = {};
const W0 = Ts,
  V0 = "2.99.3";
let vs = "";
typeof Deno < "u"
  ? (vs = "deno")
  : typeof document < "u"
    ? (vs = "web")
    : typeof navigator < "u" && navigator.product === "ReactNative"
      ? (vs = "react-native")
      : (vs = "node");
const H0 = { "X-Client-Info": `supabase-js-${vs}/${V0}` },
  q0 = { headers: H0 },
  K0 = { schema: "public" },
  G0 = {
    autoRefreshToken: !0,
    persistSession: !0,
    detectSessionInUrl: !0,
    flowType: "implicit",
  },
  J0 = {};
function Ns(n) {
  "@babel/helpers - typeof";
  return (
    (Ns =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (r) {
            return typeof r;
          }
        : function (r) {
            return r &&
              typeof Symbol == "function" &&
              r.constructor === Symbol &&
              r !== Symbol.prototype
              ? "symbol"
              : typeof r;
          }),
    Ns(n)
  );
}
function Q0(n, r) {
  if (Ns(n) != "object" || !n) return n;
  var s = n[Symbol.toPrimitive];
  if (s !== void 0) {
    var a = s.call(n, r);
    if (Ns(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r === "string" ? String : Number)(n);
}
function Y0(n) {
  var r = Q0(n, "string");
  return Ns(r) == "symbol" ? r : r + "";
}
function X0(n, r, s) {
  return (
    (r = Y0(r)) in n
      ? Object.defineProperty(n, r, {
          value: s,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (n[r] = s),
    n
  );
}
function Ah(n, r) {
  var s = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(n);
    (r &&
      (a = a.filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      })),
      s.push.apply(s, a));
  }
  return s;
}
function Te(n) {
  for (var r = 1; r < arguments.length; r++) {
    var s = arguments[r] != null ? arguments[r] : {};
    r % 2
      ? Ah(Object(s), !0).forEach(function (a) {
          X0(n, a, s[a]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(s))
        : Ah(Object(s)).forEach(function (a) {
            Object.defineProperty(n, a, Object.getOwnPropertyDescriptor(s, a));
          });
  }
  return n;
}
const Z0 = (n) => (n ? (...r) => n(...r) : (...r) => fetch(...r)),
  ew = () => Headers,
  tw = (n, r, s) => {
    const a = Z0(s),
      l = ew();
    return async (u, d) => {
      var f;
      const p = (f = await r()) !== null && f !== void 0 ? f : n;
      let y = new l(d == null ? void 0 : d.headers);
      return (
        y.has("apikey") || y.set("apikey", n),
        y.has("Authorization") || y.set("Authorization", `Bearer ${p}`),
        a(u, Te(Te({}, d), {}, { headers: y }))
      );
    };
  };
function rw(n) {
  return n.endsWith("/") ? n : n + "/";
}
function nw(n, r) {
  var s, a;
  const { db: l, auth: u, realtime: d, global: f } = n,
    { db: p, auth: y, realtime: v, global: x } = r,
    _ = {
      db: Te(Te({}, p), l),
      auth: Te(Te({}, y), u),
      realtime: Te(Te({}, v), d),
      storage: {},
      global: Te(
        Te(Te({}, x), f),
        {},
        {
          headers: Te(
            Te(
              {},
              (s = x == null ? void 0 : x.headers) !== null && s !== void 0
                ? s
                : {},
            ),
            (a = f == null ? void 0 : f.headers) !== null && a !== void 0
              ? a
              : {},
          ),
        },
      ),
      accessToken: async () => "",
    };
  return (
    n.accessToken ? (_.accessToken = n.accessToken) : delete _.accessToken,
    _
  );
}
function sw(n) {
  const r = n == null ? void 0 : n.trim();
  if (!r) throw new Error("supabaseUrl is required.");
  if (!r.match(/^https?:\/\//i))
    throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
  try {
    return new URL(rw(r));
  } catch {
    throw Error("Invalid supabaseUrl: Provided URL is malformed.");
  }
}
var iw = class extends W0 {
    constructor(n) {
      super(n);
    }
  },
  aw = class {
    constructor(n, r, s) {
      var a, l;
      ((this.supabaseUrl = n), (this.supabaseKey = r));
      const u = sw(n);
      if (!r) throw new Error("supabaseKey is required.");
      ((this.realtimeUrl = new URL("realtime/v1", u)),
        (this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace(
          "http",
          "ws",
        )),
        (this.authUrl = new URL("auth/v1", u)),
        (this.storageUrl = new URL("storage/v1", u)),
        (this.functionsUrl = new URL("functions/v1", u)));
      const d = `sb-${u.hostname.split(".")[0]}-auth-token`,
        f = {
          db: K0,
          realtime: J0,
          auth: Te(Te({}, G0), {}, { storageKey: d }),
          global: q0,
        },
        p = nw(s ?? {}, f);
      if (
        ((this.storageKey =
          (a = p.auth.storageKey) !== null && a !== void 0 ? a : ""),
        (this.headers =
          (l = p.global.headers) !== null && l !== void 0 ? l : {}),
        p.accessToken)
      )
        ((this.accessToken = p.accessToken),
          (this.auth = new Proxy(
            {},
            {
              get: (v, x) => {
                throw new Error(
                  `@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(x)} is not possible`,
                );
              },
            },
          )));
      else {
        var y;
        this.auth = this._initSupabaseAuthClient(
          (y = p.auth) !== null && y !== void 0 ? y : {},
          this.headers,
          p.global.fetch,
        );
      }
      ((this.fetch = tw(r, this._getAccessToken.bind(this), p.global.fetch)),
        (this.realtime = this._initRealtimeClient(
          Te(
            {
              headers: this.headers,
              accessToken: this._getAccessToken.bind(this),
            },
            p.realtime,
          ),
        )),
        this.accessToken &&
          Promise.resolve(this.accessToken())
            .then((v) => this.realtime.setAuth(v))
            .catch((v) =>
              console.warn("Failed to set initial Realtime auth token:", v),
            ),
        (this.rest = new Hy(new URL("rest/v1", u).href, {
          headers: this.headers,
          schema: p.db.schema,
          fetch: this.fetch,
          timeout: p.db.timeout,
          urlLengthLimit: p.db.urlLengthLimit,
        })),
        (this.storage = new Dv(
          this.storageUrl.href,
          this.headers,
          this.fetch,
          s == null ? void 0 : s.storage,
        )),
        p.accessToken || this._listenForAuthEvents());
    }
    get functions() {
      return new Uy(this.functionsUrl.href, {
        headers: this.headers,
        customFetch: this.fetch,
      });
    }
    from(n) {
      return this.rest.from(n);
    }
    schema(n) {
      return this.rest.schema(n);
    }
    rpc(n, r = {}, s = { head: !1, get: !1, count: void 0 }) {
      return this.rest.rpc(n, r, s);
    }
    channel(n, r = { config: {} }) {
      return this.realtime.channel(n, r);
    }
    getChannels() {
      return this.realtime.getChannels();
    }
    removeChannel(n) {
      return this.realtime.removeChannel(n);
    }
    removeAllChannels() {
      return this.realtime.removeAllChannels();
    }
    async _getAccessToken() {
      var n = this,
        r,
        s;
      if (n.accessToken) return await n.accessToken();
      const { data: a } = await n.auth.getSession();
      return (r =
        (s = a.session) === null || s === void 0 ? void 0 : s.access_token) !==
        null && r !== void 0
        ? r
        : n.supabaseKey;
    }
    _initSupabaseAuthClient(
      {
        autoRefreshToken: n,
        persistSession: r,
        detectSessionInUrl: s,
        storage: a,
        userStorage: l,
        storageKey: u,
        flowType: d,
        lock: f,
        debug: p,
        throwOnError: y,
      },
      v,
      x,
    ) {
      const _ = {
        Authorization: `Bearer ${this.supabaseKey}`,
        apikey: `${this.supabaseKey}`,
      };
      return new iw({
        url: this.authUrl.href,
        headers: Te(Te({}, _), v),
        storageKey: u,
        autoRefreshToken: n,
        persistSession: r,
        detectSessionInUrl: s,
        storage: a,
        userStorage: l,
        flowType: d,
        lock: f,
        debug: p,
        throwOnError: y,
        fetch: x,
        hasCustomAuthorizationHeader: Object.keys(this.headers).some(
          (S) => S.toLowerCase() === "authorization",
        ),
      });
    }
    _initRealtimeClient(n) {
      return new lv(
        this.realtimeUrl.href,
        Te(
          Te({}, n),
          {},
          {
            params: Te(
              Te({}, { apikey: this.supabaseKey }),
              n == null ? void 0 : n.params,
            ),
          },
        ),
      );
    }
    _listenForAuthEvents() {
      return this.auth.onAuthStateChange((n, r) => {
        this._handleTokenChanged(
          n,
          "CLIENT",
          r == null ? void 0 : r.access_token,
        );
      });
    }
    _handleTokenChanged(n, r, s) {
      (n === "TOKEN_REFRESHED" || n === "SIGNED_IN") &&
      this.changedAccessToken !== s
        ? ((this.changedAccessToken = s), this.realtime.setAuth(s))
        : n === "SIGNED_OUT" &&
          (this.realtime.setAuth(),
          r == "STORAGE" && this.auth.signOut(),
          (this.changedAccessToken = void 0));
    }
  };
const ow = (n, r, s) => new aw(n, r, s);
function lw() {
  if (typeof window < "u") return !1;
  const n = globalThis.process;
  if (!n) return !1;
  const r = n.version;
  if (r == null) return !1;
  const s = r.match(/^v(\d+)\./);
  return s ? parseInt(s[1], 10) <= 18 : !1;
}
lw() &&
  console.warn(
    "⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217",
  );
const Sf = "https://lzkhjmtfvksxobxdjytb.supabase.co",
  uw =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6a2hqbXRmdmtzeG9ieGRqeXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDcyODYsImV4cCI6MjA4OTYyMzI4Nn0.YmwbP8PB24Lc1vYaBPhfjkTRBFxwuwlmzxGM4skb09w";
console.log("[Supabase Debug] Environment Check:");
console.log("- URL configured:", !0);
console.log("- ANON_KEY configured:", !0);
console.log("- URL:", `${Sf.substring(0, 30)}...`);
const Ot = ow(Sf, uw, {
  auth: { autoRefreshToken: !0, persistSession: !0, detectSessionInUrl: !0 },
  global: { headers: { "x-client-info": "childtrack-web" } },
});
console.log("[Supabase] Client initialized, testing connection...");
Ot.from("profiles")
  .select("count", { count: "exact", head: !0 })
  .then(({ count: n, error: r }) => {
    r
      ? (console.warn("[Supabase Connection Test] WARNING:", r.message),
        console.warn(
          "- This may be due to RLS policy blocking unauthenticated access",
        ),
        console.warn(
          "- Make sure to run supabase-schema.sql in your Supabase SQL Editor",
        ))
      : console.log(
          "[Supabase Connection Test] SUCCESS - Profiles table accessible (count: " +
            n +
            ")",
        );
  });
function ma() {
  const [n, r] = C.useState(null),
    [s, a] = C.useState(!0),
    [l, u] = C.useState(!1),
    [d, f] = C.useState(null),
    [p, y] = C.useState(null);
  C.useEffect(() => {
    (console.log("[Auth] Initializing auth state..."),
      Ot.auth.getSession().then(({ data: { session: E }, error: A }) => {
        (console.log(
          "[Auth] getSession result:",
          A ? A.message : "success",
          E ? "session exists" : "no session",
        ),
          r(E),
          a(!1),
          E &&
            (console.log("[Auth] Session found, user ID:", E.user.id),
            u(!0),
            v(E.user.id).finally(() => u(!1))));
      }));
    const {
      data: { subscription: j },
    } = Ot.auth.onAuthStateChange(async (E, A) => {
      if ((r(A), a(!1), A)) {
        (u(!0), v(A.user.id).finally(() => u(!1)));
        const L = localStorage.getItem("supabase.auth.token");
        if (L && !A.access_token)
          try {
            const I = JSON.parse(L);
            Ot.auth.setSession(I);
          } catch {
            localStorage.removeItem("supabase.auth.token");
          }
      } else (f(null), y(null), localStorage.removeItem("supabase.auth.token"));
    });
    return () => j.unsubscribe();
  }, []);
  async function v(j) {
    console.log("[Auth] Fetching profile for user ID:", j);
    try {
      const { data: E, error: A } = await Ot.from("profiles")
        .select("id, email, role")
        .eq("id", j)
        .single();
      if (A) throw (console.error("[Auth] Profile fetch error:", A.message), A);
      (console.log("[Auth] Profile fetched successfully:", E),
        f(E || null),
        y((E == null ? void 0 : E.role) || null));
    } catch (E) {
      (console.error("[Auth] Error fetching user profile:", E.message),
        f(null),
        y(null));
    }
  }
  return {
    session: n,
    profile: d,
    userRole: p,
    isAuthenticated: !!n,
    isLoading: s || l,
    authLoading: s,
    roleLoading: l,
    signIn: async (j, E, A = !1) => {
      const { error: L } = await Ot.auth.signInWithPassword({
        email: j,
        password: E,
      });
      if (L) throw L;
      if (A) {
        const {
          data: { session: I },
        } = await Ot.auth.getSession();
        I && localStorage.setItem("supabase.auth.token", JSON.stringify(I));
      }
    },
    signOut: async () => {
      await Ot.auth.signOut();
    },
  };
}
const Ih = `
# ChildTrack Terms & Conditions

**Effective Date: January 1, 2025**

Welcome to ChildTrack! These Terms & Conditions ("Terms") govern your use of our nursery management platform.

## 1. Acceptance of Terms
By accessing or using ChildTrack, you agree to be bound by these Terms. If you do not agree, please do not use our services.

## 2. User Responsibilities
2.1 You agree to:
- Provide accurate information about children and staff
- Maintain confidentiality of parent information
- Use the platform only for legitimate nursery operations
- Report any technical issues promptly

2.2 Prohibited activities:
- Sharing login credentials
- Unauthorized data access
- Commercial use beyond licensed nursery operations

## 3. Data Privacy & Security
3.1 We collect:
- Child attendance records
- Staff schedules and qualifications
- Parent contact information (with consent)

3.2 We use industry-standard encryption and comply with GDPR/child protection regulations.

## 4. Intellectual Property
All ChildTrack software, logos, and materials are proprietary. You receive a limited license for nursery management use only.

## 5. Liability Limitation
ChildTrack is provided "as is". We are not liable for:
- Data entry errors by users
- Third-party service interruptions
- Indirect or consequential damages

## 6. Termination
We may suspend access if:
- Terms violations occur
- Unpaid fees accumulate
- Security risks detected

## 7. Changes to Terms
We may update these Terms. Continued use constitutes acceptance of changes.

## 8. Governing Law
These Terms governed by [Jurisdiction] laws.

**Last Updated: January 1, 2025**

*Contact support@childtrack.com for questions.*
`;
function ra({ isOpen: n, onAccept: r, onClose: s }) {
  const [a, l] = C.useState(!1);
  C.useEffect(
    () => (
      n
        ? (document.body.style.overflow = "hidden")
        : (document.body.style.overflow = "unset"),
      () => {
        document.body.style.overflow = "unset";
      }
    ),
    [n],
  );
  const u = async () => {
    l(!0);
    try {
      (localStorage.setItem(
        "childtrack_terms_accepted",
        new Date().toISOString(),
      ),
        r());
    } finally {
      l(!1);
    }
  };
  return n
    ? m.jsxs(m.Fragment, {
        children: [
          m.jsx("div", {
            className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            onClick: s,
          }),
          m.jsx("div", {
            className:
              "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8",
            children: m.jsxs("div", {
              className:
                "w-full max-w-4xl max-h-[90vh] glass-card rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-scale",
              children: [
                m.jsxs("div", {
                  className:
                    "sticky top-0 bg-white/80 backdrop-blur p-6 border-b border-gray-200 flex items-center justify-between z-10",
                  children: [
                    m.jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [
                        m.jsx(jl, { className: "w-6 h-6 text-emerald-500" }),
                        m.jsxs("div", {
                          children: [
                            m.jsx("h2", {
                              className:
                                "font-heading font-bold text-xl text-gray-800",
                              children: "Terms & Conditions",
                            }),
                            m.jsx("p", {
                              className: "text-sm text-gray-600",
                              children: "Please read and accept",
                            }),
                          ],
                        }),
                      ],
                    }),
                    m.jsx("button", {
                      onClick: s,
                      className:
                        "p-2 hover:bg-gray-100 rounded-xl transition-all",
                      "aria-label": "Close modal",
                      children: m.jsx(eh, {
                        className: "w-5 h-5 text-gray-500",
                      }),
                    }),
                  ],
                }),
                m.jsx("div", {
                  className:
                    "flex-1 overflow-y-auto p-6 prose prose-sm max-w-none",
                  children: m.jsx("div", {
                    className: "prose prose-gray max-w-none",
                    children: m.jsx("div", {
                      dangerouslySetInnerHTML: {
                        __html: Ih.replace(/\n/g, "<br>"),
                      },
                    }),
                  }),
                }),
                m.jsxs("div", {
                  className:
                    "sticky bottom-0 bg-white/90 backdrop-blur p-6 border-t border-gray-200 flex gap-3",
                  children: [
                    m.jsxs("button", {
                      onClick: s,
                      className:
                        "flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2",
                      children: [
                        m.jsx(zh, { className: "w-4 h-4" }),
                        "Read Later",
                      ],
                    }),
                    m.jsxs("button", {
                      onClick: u,
                      disabled: a,
                      className:
                        "flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                      children: [
                        a ? m.jsx(bs, {}) : m.jsx(El, { className: "w-5 h-5" }),
                        a ? "Saving..." : "I Accept",
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
          m.jsx("div", {
            className: "md:hidden fixed bottom-0 left-0 right-0 z-50",
            children: m.jsxs("div", {
              className:
                "bg-white/95 backdrop-blur rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col animate-slide-up-bottom",
              children: [
                m.jsxs("div", {
                  className:
                    "p-6 border-b border-gray-200 sticky top-0 bg-white/100 backdrop-blur flex items-center justify-between",
                  children: [
                    m.jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [
                        m.jsx(jl, { className: "w-6 h-6 text-emerald-500" }),
                        m.jsxs("div", {
                          children: [
                            m.jsx("h2", {
                              className: "font-bold text-lg text-gray-800",
                              children: "Terms & Conditions",
                            }),
                            m.jsx("p", {
                              className: "text-sm text-gray-600",
                              children: "Please read carefully",
                            }),
                          ],
                        }),
                      ],
                    }),
                    m.jsx("button", {
                      onClick: s,
                      className: "p-2 hover:bg-gray-100 rounded-xl",
                      children: m.jsx(eh, { className: "w-5 h-5" }),
                    }),
                  ],
                }),
                m.jsx("div", {
                  className: "flex-1 overflow-y-auto p-6 pb-20 prose prose-sm",
                  children: m.jsx("div", {
                    className: "prose prose-gray max-w-none",
                    dangerouslySetInnerHTML: {
                      __html: Ih.replace(/\n/g, "<br>"),
                    },
                  }),
                }),
                m.jsx("div", {
                  className:
                    "p-6 bg-white border-t border-gray-200 space-y-3 pt-4",
                  children: m.jsxs("button", {
                    onClick: u,
                    disabled: a,
                    className:
                      "w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed",
                    children: [
                      a ? m.jsx(bs, {}) : m.jsx(El, { className: "w-5 h-5" }),
                      a ? "Saving..." : "Accept Terms & Conditions",
                    ],
                  }),
                }),
              ],
            }),
          }),
        ],
      })
    : null;
}
function cw({ onSuccess: n }) {
  const [r, s] = C.useState(""),
    [a, l] = C.useState(""),
    [u, d] = C.useState(!1),
    [f, p] = C.useState(!1),
    [y, v] = C.useState(!1),
    [x, _] = C.useState(!1),
    [S, N] = C.useState(!1),
    [j, E] = C.useState(""),
    { signIn: A } = ma(),
    L = async (I) => {
      if ((I.preventDefault(), !y)) {
        E("Please accept the Terms & Conditions to continue.");
        return;
      }
      (N(!0), E(""));
      try {
        (console.log("[Login] Attempting sign in for:", r),
          await A(r, a, f),
          console.log("[Login] Sign in successful, calling onSuccess"),
          n == null || n(),
          console.log("[Login] onSuccess completed"));
      } catch (B) {
        (console.error("[Login] Sign in error:", B.message),
          E(B.message || "Login failed. Please check your credentials."),
          N(!1));
      }
    };
  return m.jsx("div", {
    className:
      "min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-400 via-orange-300 to-rose-400 pt-16 pb-20",
    children: m.jsxs("div", {
      className:
        "w-full max-w-lg xl:max-w-xl glass-card rounded-3xl p-8 shadow-2xl animate-fade-scale mx-4 sm:mx-6 lg:mx-auto",
      children: [
        m.jsxs("div", {
          className: "text-center mb-8",
          children: [
            m.jsx("div", {
              className: `w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-yellow-300/30 to-pink-300/30 \r
                          rounded-3xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30`,
              children: m.jsx("div", {
                className: "text-4xl",
                children: "👧👦🎒📚",
              }),
            }),
            m.jsx("h1", {
              className: "text-3xl font-heading font-bold text-gray-800 mb-2",
              children: "ChildTrack",
            }),
            m.jsx("p", {
              className: "text-gray-600 font-medium",
              children: "Welcome to Nursery Management",
            }),
          ],
        }),
        j &&
          m.jsx("div", {
            className: `glass-card-inner p-4 mb-6 text-red-600 text-sm rounded-2xl \r
                          border border-red-200/50 bg-red-50/80 backdrop-blur-sm animate-pulse`,
            children: j,
          }),
        m.jsxs("form", {
          onSubmit: L,
          className: "space-y-5",
          children: [
            m.jsxs("div", {
              children: [
                m.jsx("label", {
                  className: "block text-sm font-medium text-gray-700 mb-2",
                  children: "Email Address",
                }),
                m.jsxs("div", {
                  className: "relative",
                  children: [
                    m.jsx(Vm, {
                      className:
                        "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5",
                    }),
                    m.jsx("input", {
                      type: "email",
                      value: r,
                      onChange: (I) => s(I.target.value),
                      className: `w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 backdrop-blur-sm \r
                          border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none \r
                          focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue \r
                          transition-all shadow-sm hover:shadow-md`,
                      placeholder: "your@email.com",
                      required: !0,
                    }),
                  ],
                }),
              ],
            }),
            m.jsxs("div", {
              children: [
                m.jsx("label", {
                  className: "block text-sm font-medium text-gray-700 mb-2",
                  children: "Password",
                }),
                m.jsxs("div", {
                  className: "relative",
                  children: [
                    m.jsx(Wm, {
                      className:
                        "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5",
                    }),
                    m.jsx("input", {
                      type: u ? "text" : "password",
                      value: a,
                      onChange: (I) => l(I.target.value),
                      className: `w-full pl-12 pr-12 py-4 rounded-2xl bg-white/60 backdrop-blur-sm \r
                          border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none \r
                          focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue \r
                          transition-all shadow-sm hover:shadow-md`,
                      placeholder: "••••••••",
                      required: !0,
                    }),
                    m.jsx("button", {
                      type: "button",
                      onClick: () => d(!u),
                      className:
                        "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors",
                      children: u
                        ? m.jsx(Dm, { size: 20 })
                        : m.jsx(Mm, { size: 20 }),
                    }),
                  ],
                }),
              ],
            }),
            m.jsxs("div", {
              className: "space-y-3 pt-2",
              children: [
                m.jsxs("label", {
                  className: "flex items-center space-x-3 cursor-pointer group",
                  children: [
                    m.jsx("div", {
                      className: `w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${f ? "bg-primary-blue border-primary-blue shadow-sm" : "border-gray-300 hover:border-gray-400"}`,
                      onClick: () => p(!f),
                      children:
                        f && m.jsx(El, { size: 14, className: "text-white" }),
                    }),
                    m.jsx("span", {
                      className: "text-sm text-gray-700 select-none",
                      children: "Remember me",
                    }),
                  ],
                }),
                m.jsxs("label", {
                  className: "flex items-center space-x-3 cursor-pointer group",
                  children: [
                    m.jsx("div", {
                      className: `w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${y ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "border-gray-300 hover:border-gray-400"}`,
                      children:
                        y && m.jsx(jl, { size: 14, className: "text-white" }),
                    }),
                    m.jsx("span", {
                      className:
                        "text-sm text-primary-blue font-medium cursor-pointer underline hover:no-underline hover:text-primary-blue/80 transition-colors",
                      onClick: () => _(!0),
                      children: "I agree to Terms & Conditions *",
                    }),
                  ],
                }),
              ],
            }),
            m.jsx("button", {
              type: "submit",
              disabled: S || !y,
              className: `w-full font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 text-lg group ${S || !y ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-primary-blue to-primary-coral text-white hover:shadow-[0_0_25px_rgba(74,144,226,0.4)] hover:-translate-y-1 active:scale-[0.98] shadow-xl group-hover:animate-pulse-glow-mint"}`,
              children: S
                ? m.jsxs(m.Fragment, {
                    children: [
                      m.jsx(Fh, { className: "w-6 h-6 animate-spin" }),
                      "Signing in...",
                    ],
                  })
                : m.jsxs(m.Fragment, {
                    children: [m.jsx(oa, { size: 22 }), "Sign In"],
                  }),
            }),
          ],
        }),
        m.jsxs("div", {
          className:
            "mt-8 pt-6 border-t border-gray-200/50 space-y-3 text-center",
          children: [
            m.jsx("a", {
              href: "#",
              className:
                "block text-sm text-primary-blue hover:text-primary-blue/80 font-medium transition-colors",
              children: "Forgot Password?",
            }),
            m.jsxs("div", {
              className:
                "flex justify-center items-center space-x-4 text-xs text-gray-500",
              children: [
                m.jsx("a", {
                  href: "#",
                  className: "hover:text-gray-700 transition-colors",
                  children: "Terms of Service",
                }),
                m.jsx("span", { children: "•" }),
                m.jsx("a", {
                  href: "#",
                  className: "hover:text-gray-700 transition-colors",
                  children: "Privacy Policy",
                }),
              ],
            }),
            m.jsx("p", {
              className: "text-xs text-gray-400",
              children: "Secure login powered by Supabase",
            }),
          ],
        }),
        m.jsx(ra, {
          isOpen: x,
          onAccept: () => {
            (v(!0), _(!1));
          },
          onClose: () => _(!1),
        }),
      ],
    }),
  });
}
const wn = [
  {
    selector: '[data-tour="sidebar"]',
    title: "Navigation Sidebar",
    content:
      "Use this sidebar to quickly switch between different sections of your admin dashboard. Each icon represents a different module.",
    position: "right",
  },
  {
    selector: '[data-tour="stats"]',
    title: "Dashboard Stats",
    content:
      "Your key metrics at a glance. Track total children, staff members, daily attendance, and pending payments. Numbers animate to show real-time data.",
    position: "top",
  },
  {
    selector: '[data-tour="transport"]',
    title: "Transport Tracking",
    content:
      "Live transport monitoring. Track bus locations, children onboard, ETAs, and route progress in real-time. Tap any route for detailed status.",
    position: "left",
  },
  {
    selector: '[data-tour="recruitment"]',
    title: "Recruitment Pipeline",
    content:
      "Manage job applications. Review candidates by status (pending, interview, hired), view CVs, and take action directly from the dashboard.",
    position: "top",
  },
];
function dw() {
  const [n, r] = C.useState(0),
    [s, a] = C.useState(!1),
    [l, u] = C.useState(!1);
  C.useRef(null);
  const d = C.useRef(null);
  C.useEffect(() => {
    const j = localStorage.getItem("admin-tour-completed");
    localStorage.getItem("user-role") === "ADMIN" &&
      !j &&
      setTimeout(() => {
        (a(!0), u(!0));
      }, 1e3);
  }, []);
  const f = C.useCallback(() => {
      n < wn.length - 1 ? r(n + 1) : y();
    }, [n]),
    p = C.useCallback(() => {
      n > 0 && r(n - 1);
    }, [n]),
    y = C.useCallback(() => {
      (localStorage.setItem("admin-tour-completed", "true"), a(!1));
    }, []),
    v = C.useCallback(() => {
      y();
    }, [y]),
    x = wn[n],
    _ = document == null ? void 0 : document.querySelector(x.selector);
  if (
    (C.useEffect(() => {
      _ &&
        (_.scrollIntoView({ behavior: "smooth", block: "center" }),
        (d.current = _));
    }, [n, x.selector, _]),
    C.useEffect(() => {
      const j = (E) => {
        if (s)
          switch (E.key) {
            case "Escape":
              v();
              break;
            case "ArrowRight":
            case " ":
            case "Enter":
              (E.preventDefault(), f());
              break;
            case "ArrowLeft":
              p();
              break;
          }
      };
      return (
        document.addEventListener("keydown", j),
        () => document.removeEventListener("keydown", j)
      );
    }, [s, n, f, p, v]),
    !l || !s)
  )
    return null;
  const N = (() => {
    if (!d.current) return {};
    const j = d.current.getBoundingClientRect();
    let E = {};
    switch (x.position) {
      case "top":
        ((E.top = `${j.top - 120}px`),
          (E.left = `${j.left + j.width / 2}px`),
          (E.transform = "translateX(-50%)"));
        break;
      case "right":
        ((E.top = `${j.top + j.height / 2}px`),
          (E.left = `${j.right + 20}px`),
          (E.transform = "translateY(-50%)"));
        break;
      case "bottom":
        ((E.top = `${j.bottom + 20}px`),
          (E.left = `${j.left + j.width / 2}px`),
          (E.transform = "translateX(-50%)"));
        break;
      case "left":
        ((E.top = `${j.top + j.height / 2}px`),
          (E.left = `${j.left - 20}px`),
          (E.transform = "translateY(-50%)"));
        break;
    }
    return E;
  })();
  return Py.createPortal(
    m.jsxs("div", {
      className: "fixed inset-0 z-[9999] pointer-events-none",
      children: [
        m.jsx("div", {
          className:
            "fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] pointer-events-auto",
        }),
        d.current &&
          m.jsx("div", {
            className: "fixed inset-0 z-[10000]",
            style: {
              mask: `radial-gradient(circle 120px at ${d.current.getBoundingClientRect().left + d.current.getBoundingClientRect().width / 2}px ${d.current.getBoundingClientRect().top + d.current.getBoundingClientRect().height / 2}px, transparent 0%, black 100%)`,
              WebkitMask: `radial-gradient(circle 120px at ${d.current.getBoundingClientRect().left + d.current.getBoundingClientRect().width / 2}px ${d.current.getBoundingClientRect().top + d.current.getBoundingClientRect().height / 2}px, transparent 0%, black 100%)`,
            },
          }),
        m.jsxs("div", {
          className:
            "glass-card rounded-2xl shadow-2xl border border-white/20 p-6 max-w-sm w-80 z-[10001] animate-fade-scale pointer-events-auto",
          style: {
            position: "fixed",
            ...N,
            maxHeight: "70vh",
            overflow: "hidden",
          },
          children: [
            m.jsxs("div", {
              className: "flex items-center gap-2 mb-4",
              children: [
                m.jsx("div", {
                  className:
                    "w-8 h-8 rounded-xl bg-gradient-to-r from-primary-blue to-primary-coral flex items-center justify-center",
                  children: m.jsx("span", {
                    className: "text-white font-bold text-sm",
                    children: n + 1,
                  }),
                }),
                m.jsx("div", {
                  className: "flex-1",
                  children: m.jsx("h3", {
                    className: "font-heading font-bold text-lg text-gray-800",
                    children: x.title,
                  }),
                }),
              ],
            }),
            m.jsx("p", {
              className: "text-gray-600 mb-6 leading-relaxed",
              children: x.content,
            }),
            m.jsxs("div", {
              className: "flex items-center gap-2 mb-6",
              children: [
                m.jsx("div", {
                  className:
                    "flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden",
                  children: m.jsx("div", {
                    className:
                      "h-1.5 bg-gradient-to-r from-primary-blue to-primary-coral rounded-full transition-all duration-300",
                    style: { width: `${((n + 1) / wn.length) * 100}%` },
                  }),
                }),
                m.jsxs("span", {
                  className: "text-xs text-gray-500 font-medium",
                  children: ["Step ", n + 1, " of ", wn.length],
                }),
              ],
            }),
            m.jsxs("div", {
              className: "flex items-center gap-3 pt-2",
              children: [
                m.jsxs("button", {
                  onClick: v,
                  className:
                    "flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all font-medium",
                  children: [m.jsx(Qm, { size: 14 }), "Skip Tour"],
                }),
                n > 0 &&
                  m.jsxs("button", {
                    onClick: p,
                    className:
                      "flex items-center gap-1 text-sm text-primary-blue font-medium px-4 py-2 rounded-xl hover:bg-primary-blue/5 transition-all flex-1 justify-center",
                    children: [m.jsx(zh, { size: 16 }), "Back"],
                  }),
                m.jsx("button", {
                  onClick: f,
                  className: `flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl shadow-lg transition-all text-white ${n === wn.length - 1 ? "btn-gradient-coral w-full" : "bg-gradient-to-r from-primary-blue to-primary-coral hover:shadow-primary-blue/30 hover:-translate-y-0.5 px-6"}`,
                  children:
                    n === wn.length - 1
                      ? m.jsxs(m.Fragment, {
                          children: [
                            m.jsx(CheckCircle, { size: 18 }),
                            "Finish",
                          ],
                        })
                      : m.jsxs(m.Fragment, {
                          children: ["Next", m.jsx(Am, { size: 16 })],
                        }),
                }),
              ],
            }),
            m.jsxs("div", {
              className:
                "mt-4 pt-3 border-t border-gray-100 flex gap-6 text-xs text-gray-400",
              children: [
                m.jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [
                    m.jsx("kbd", {
                      className: "px-1.5 py-0.5 bg-gray-200 rounded font-mono",
                      children: "← →",
                    }),
                    m.jsx("span", { children: "Navigate" }),
                  ],
                }),
                m.jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [
                    m.jsx("kbd", {
                      className: "px-1.5 py-0.5 bg-gray-200 rounded font-mono",
                      children: "Esc",
                    }),
                    m.jsx("span", { children: "Close" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    document.body,
  );
}
function Ef() {
  const n = Rn(),
    r = () => {
      window.open(
        "https://apps.apple.com/app/childtrack-parent/id123456789",
        "_blank",
      );
    },
    s = () => {
      window.open(
        "https://play.google.com/store/apps/details?id=com.childtrack.parent",
        "_blank",
      );
    };
  return m.jsx("div", {
    className:
      "min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50 pt-16 pb-20",
    children: m.jsxs("div", {
      className:
        "max-w-lg xl:max-w-xl w-full glass-card rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in mx-4 sm:mx-6 lg:mx-auto",
      children: [
        m.jsx("div", {
          className:
            "w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent-pink to-rose-400 rounded-2xl flex items-center justify-center shadow-xl",
          children: m.jsx(Ym, { className: "w-12 h-12 text-white" }),
        }),
        m.jsx(Zm, { className: "w-16 h-16 text-accent-yellow mx-auto mb-4" }),
        m.jsx("h1", {
          className: "text-2xl font-heading font-bold text-gray-800 mb-3",
          children: "Mobile App Required",
        }),
        m.jsx("p", {
          className: "text-lg text-gray-600 mb-2",
          children: "This web portal is for ADMIN & STAFF only.",
        }),
        m.jsx("p", {
          className: "text-gray-500 mb-8",
          children:
            "DRIVER and PARENT roles must use the dedicated mobile applications.",
        }),
        m.jsx("div", {
          className: "space-y-4 mb-8",
          children: m.jsxs("div", {
            className:
              "bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50",
            children: [
              m.jsxs("div", {
                className: "flex items-center justify-center gap-3 mb-2",
                children: [
                  m.jsx(Km, { className: "w-5 h-5 text-primary-blue" }),
                  m.jsx("span", {
                    className: "font-semibold text-gray-800",
                    children: "Download ChildTrack Mobile App",
                  }),
                ],
              }),
              m.jsxs("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                  m.jsxs("button", {
                    onClick: r,
                    className:
                      "group bg-black/90 hover:bg-black text-white px-4 py-3 rounded-xl font-medium text-sm transition-all hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2",
                    children: [
                      m.jsx(Zd, {
                        className:
                          "w-4 h-4 group-hover:-translate-y-0.5 transition-transform",
                      }),
                      "App Store",
                    ],
                  }),
                  m.jsxs("button", {
                    onClick: s,
                    className:
                      "group bg-[#34A853]/90 hover:bg-[#34A853] text-white px-4 py-3 rounded-xl font-medium text-sm transition-all hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2",
                    children: [
                      m.jsx(Zd, {
                        className:
                          "w-4 h-4 group-hover:-translate-y-0.5 transition-transform",
                      }),
                      "Play Store",
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
        m.jsx("div", {
          className: "flex gap-4 pt-4 border-t border-gray-200/50",
          children: m.jsx("button", {
            onClick: () => n("/login"),
            className:
              "flex-1 bg-primary-blue/90 hover:bg-primary-blue text-white py-3 px-6 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all",
            children: "Back to Login",
          }),
        }),
        m.jsx("p", {
          className: "text-xs text-gray-400 mt-6",
          children: "Need web access? Contact administrator for role upgrade.",
        }),
      ],
    }),
  });
}
function Lh({ children: n, allowedRoles: r = ["ADMIN"] }) {
  const { profile: s, isAuthenticated: a, isLoading: l } = ma(),
    u = Rn(),
    [d, f] = C.useState(!1);
  return (
    C.useEffect(() => {
      if (l) return;
      if (!a || !s) {
        u("/login", { replace: !0 });
        return;
      }
      const p = s.role;
      if (!r.includes(p)) {
        if (p === "DRIVER" || p === "PARENT") {
          f(!0);
          return;
        }
        u("/unauthorized", { replace: !0 });
        return;
      }
    }, [a, s, l, u, r]),
    l
      ? m.jsx("div", {
          className:
            "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8",
          children: m.jsxs("div", {
            className: "text-center max-w-md mx-auto",
            children: [
              m.jsx("div", {
                className:
                  "w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center shadow-xl animate-spin-slow",
                children: m.jsx(Fm, { className: "w-10 h-10 text-white" }),
              }),
              m.jsx("h2", {
                className: "text-2xl font-heading font-bold text-gray-800 mb-2",
                children: "Loading Dashboard",
              }),
              m.jsx("p", {
                className: "text-gray-600",
                children: "Authenticating and fetching your profile...",
              }),
              m.jsx("div", {
                className: "flex justify-center mt-6",
                children: m.jsx("div", {
                  className:
                    "w-12 h-12 border-4 border-primary-blue/20 border-t-primary-blue rounded-full animate-spin",
                }),
              }),
            ],
          }),
        })
      : !a || !s
        ? null
        : d
          ? m.jsx(Ef, {})
          : n
  );
}
function hw() {
  const [n, r] = C.useState({
      childrenCount: 0,
      staffCount: 0,
      attendanceToday: 0,
      pendingPayments: 0,
      recentActivities: [],
      revenueData: [],
      applicants: [],
    }),
    [s, a] = C.useState(!0),
    [l, u] = C.useState(null);
  C.useEffect(() => {
    d();
  }, []);
  const d = async () => {
    (a(!0), u(null));
    try {
      const [f, p, y] = await Promise.all([
        Ot.from("children").select("*", { count: "exact", head: !1 }),
        Ot.from("profiles")
          .select("*", { count: "exact", head: !0 })
          .eq("role", "STAFF"),
        Ot.from("payments")
          .select("*", { count: "exact", head: !0 })
          .eq("status", "PENDING"),
      ]);
      r({
        childrenCount: f.count || 0,
        staffCount: p.count || 0,
        pendingPayments: y.count || 0,
        attendanceToday: 218,
        recentActivities: [],
        revenueData: [],
        applicants: [],
      });
    } catch (f) {
      u(f.message);
    } finally {
      a(!1);
    }
  };
  return { data: n, loading: s, error: l, refetch: d };
}
function fw({ end: n, duration: r = 2e3 }) {
  const [s, a] = C.useState(0);
  return (
    C.useEffect(() => {
      let l, u;
      const d = (f) => {
        l || (l = f);
        const p = Math.min((f - l) / r, 1);
        (a(Math.floor(p * n)), p < 1 && (u = requestAnimationFrame(d)));
      };
      return ((u = requestAnimationFrame(d)), () => cancelAnimationFrame(u));
    }, [n, r]),
    m.jsx("span", { children: s })
  );
}
function Xi({
  icon: n,
  label: r,
  value: s,
  trend: a,
  trendUp: l,
  color: u,
  delay: d,
}) {
  const f = {
    blue: "from-primary-blue to-blue-400",
    coral: "from-primary-coral to-orange-400",
    green: "from-accent-green to-emerald-400",
    purple: "from-accent-purple to-violet-400",
    yellow: "from-accent-yellow to-amber-400",
    pink: "from-accent-pink to-rose-400",
  };
  return m.jsxs("div", {
    className: `glass-card rounded-card p-5 card-hover animate-slide-up stagger-${d}`,
    children: [
      m.jsxs("div", {
        className: "flex items-start justify-between",
        children: [
          m.jsx("div", {
            className: `w-12 h-12 rounded-2xl bg-gradient-to-br ${f[u]} flex items-center justify-center shadow-lg`,
            children: m.jsx(n, {
              size: 24,
              className: "text-white",
              strokeWidth: 2,
            }),
          }),
          a &&
            m.jsxs("div", {
              className: `flex items-center gap-1 text-xs ${l ? "text-accent-green" : "text-red-500"}`,
              children: [
                m.jsx(Xm, { size: 14, className: !l && "rotate-180" }),
                m.jsx("span", { className: "font-medium", children: a }),
              ],
            }),
        ],
      }),
      m.jsxs("div", {
        className: "mt-4",
        children: [
          m.jsx("p", {
            className: "font-heading font-bold text-3xl text-gray-800",
            children: m.jsx(fw, { end: parseInt(s) }),
          }),
          m.jsx("p", { className: "text-sm text-gray-500 mt-1", children: r }),
        ],
      }),
    ],
  });
}
function $h() {
  const { data: n, loading: r, error: s } = hw(),
    a = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  return r
    ? m.jsxs("div", {
        className: "space-y-6",
        children: [
          m.jsxs("div", {
            className: "flex items-center justify-between",
            children: [
              m.jsxs("div", {
                children: [
                  m.jsx("div", {
                    className: "h-8 w-64 bg-gray-200 rounded animate-pulse",
                  }),
                  m.jsx("div", {
                    className:
                      "h-4 w-48 bg-gray-200 rounded mt-2 animate-pulse",
                  }),
                ],
              }),
              m.jsx("div", {
                className: "h-10 w-32 bg-gray-200 rounded-xl animate-pulse",
              }),
            ],
          }),
          m.jsx("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5",
            children: Array(4)
              .fill()
              .map((l, u) =>
                m.jsxs(
                  "div",
                  {
                    className: "glass-card rounded-card p-5 animate-pulse",
                    children: [
                      m.jsxs("div", {
                        className: "flex items-start justify-between",
                        children: [
                          m.jsx("div", {
                            className: "w-12 h-12 bg-gray-200 rounded-2xl",
                          }),
                          m.jsx("div", {
                            className: "w-16 h-4 bg-gray-200 rounded",
                          }),
                        ],
                      }),
                      m.jsxs("div", {
                        className: "mt-4 space-y-2",
                        children: [
                          m.jsx("div", {
                            className: "h-8 w-20 bg-gray-200 rounded",
                          }),
                          m.jsx("div", {
                            className: "h-4 w-24 bg-gray-200 rounded",
                          }),
                        ],
                      }),
                    ],
                  },
                  u,
                ),
              ),
          }),
        ],
      })
    : s
      ? m.jsxs("div", {
          className: "space-y-6 text-center p-20",
          children: [
            m.jsx(Lm, { className: "w-20 h-20 text-red-400 mx-auto mb-6" }),
            m.jsx("h2", {
              className: "font-heading text-2xl font-bold text-gray-800 mb-4",
              children: "Dashboard Data Unavailable",
            }),
            m.jsx("p", {
              className: "text-gray-600 mb-8 max-w-md mx-auto",
              children: s,
            }),
            m.jsx("button", {
              className:
                "btn-gradient px-8 py-3 rounded-xl text-white font-semibold shadow-lg mx-auto inline-flex items-center gap-2",
              children: "Retry Data Load",
            }),
          ],
        })
      : m.jsxs("div", {
          className: "space-y-6",
          children: [
            m.jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                m.jsxs("div", {
                  children: [
                    m.jsx("h2", {
                      className:
                        "font-heading font-bold text-2xl text-gray-800",
                      children: "Welcome to My Nursery! 🌈",
                    }),
                    m.jsx("p", { className: "text-gray-500", children: a }),
                  ],
                }),
                m.jsx("button", {
                  className:
                    "btn-gradient glow-mint px-5 py-2.5 rounded-xl text-white font-medium shadow-lg text-sm",
                  children: "+ Add Child 🌟",
                }),
              ],
            }),
            m.jsxs("div", {
              className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5",
              children: [
                m.jsx(Xi, {
                  icon: _s,
                  label: "Total Children",
                  value: n.childrenCount || 0,
                  trend: "+12%",
                  trendUp: !0,
                  color: "blue",
                  delay: 1,
                }),
                m.jsx(Xi, {
                  icon: oa,
                  label: "Staff Members",
                  value: n.staffCount || 0,
                  trend: "+3%",
                  trendUp: !0,
                  color: "purple",
                  delay: 2,
                }),
                m.jsx(Xi, {
                  icon: eg,
                  label: "Present Today",
                  value: n.attendanceToday || 0,
                  trend: "88%",
                  trendUp: !0,
                  color: "green",
                  delay: 3,
                }),
                m.jsx(Xi, {
                  icon: Bh,
                  label: "Pending Payments",
                  value: n.pendingPayments || 0,
                  trend: "$4,250",
                  trendUp: !1,
                  color: "coral",
                  delay: 4,
                }),
              ],
            }),
            m.jsxs("div", {
              className: "grid grid-cols-1 lg:grid-cols-3 gap-5",
              children: [
                m.jsxs("div", {
                  className: "lg:col-span-2 glass-card rounded-card p-6",
                  children: [
                    m.jsxs("div", {
                      className: "flex items-center justify-between mb-6",
                      children: [
                        m.jsx("h3", {
                          className:
                            "font-heading font-bold text-lg text-gray-800",
                          children: "Attendance This Week",
                        }),
                        m.jsx("button", {
                          className:
                            "text-sm text-primary-blue font-medium hover:underline",
                          children: "View Report",
                        }),
                      ],
                    }),
                    m.jsx("div", {
                      className:
                        "flex items-end justify-between gap-4 h-32 bg-gray-50 rounded-xl p-4",
                      children: ["Mon", "Tue", "Wed", "Thu", "Fri"].map(
                        (l, u) =>
                          m.jsxs(
                            "div",
                            {
                              className: "flex flex-col items-center flex-1",
                              children: [
                                m.jsx("div", {
                                  className: `w-8 h-24 bg-gradient-to-t from-primary-blue to-blue-300 rounded-lg shadow-lg ${u % 2 ? "opacity-80" : ""}`,
                                }),
                                m.jsx("span", {
                                  className: "text-xs text-gray-500 mt-2",
                                  children: l,
                                }),
                              ],
                            },
                            l,
                          ),
                      ),
                    }),
                    m.jsxs("div", {
                      className:
                        "mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm",
                      children: [
                        m.jsx("span", {
                          className: "text-gray-500",
                          children: "Average: 92%",
                        }),
                        m.jsx("span", {
                          className: "font-medium text-accent-green",
                          children: "+5% this week",
                        }),
                      ],
                    }),
                  ],
                }),
                m.jsxs("div", {
                  className: "glass-card rounded-card p-6",
                  children: [
                    m.jsxs("div", {
                      className: "flex items-center justify-between mb-4",
                      children: [
                        m.jsx("h3", {
                          className:
                            "font-heading font-bold text-lg text-gray-800",
                          children: "Recent Activity",
                        }),
                        m.jsx("button", {
                          className:
                            "text-sm text-primary-blue hover:underline",
                          children: "View All",
                        }),
                      ],
                    }),
                    m.jsx("div", {
                      className: "space-y-3",
                      children:
                        n.recentActivities && n.recentActivities.length === 0
                          ? m.jsxs("div", {
                              className: "text-center py-8 text-gray-400",
                              children: [
                                m.jsx(zm, {
                                  className:
                                    "w-12 h-12 mx-auto mb-2 opacity-50",
                                }),
                                m.jsx("p", {
                                  className: "text-sm",
                                  children: "No recent activity",
                                }),
                              ],
                            })
                          : (n.recentActivities || [])
                              .slice(0, 4)
                              .map((l, u) =>
                                m.jsx(
                                  "div",
                                  {
                                    className:
                                      "p-3 rounded-lg bg-white/50 hover:bg-white transition-all",
                                    children: m.jsxs("div", {
                                      className: "flex items-center gap-3",
                                      children: [
                                        m.jsx("div", {
                                          className:
                                            "w-8 h-8 rounded-lg bg-primary-blue/20 flex items-center justify-center",
                                          children: m.jsx(_s, {
                                            size: 16,
                                            className: "text-primary-blue",
                                          }),
                                        }),
                                        m.jsxs("div", {
                                          className: "flex-1",
                                          children: [
                                            m.jsx("p", {
                                              className:
                                                "text-sm font-medium text-gray-800",
                                              children:
                                                (l == null
                                                  ? void 0
                                                  : l.title) || "Activity",
                                            }),
                                            m.jsx("p", {
                                              className:
                                                "text-xs text-gray-500",
                                              children:
                                                (l == null ? void 0 : l.time) ||
                                                "Now",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  },
                                  u,
                                ),
                              ),
                    }),
                  ],
                }),
              ],
            }),
            m.jsxs("div", {
              className: "grid grid-cols-1 lg:grid-cols-2 gap-5",
              children: [
                m.jsxs("div", {
                  className: "glass-card rounded-card p-6",
                  children: [
                    m.jsxs("div", {
                      className: "flex items-center gap-2 mb-4",
                      children: [
                        m.jsx("h3", {
                          className:
                            "font-heading font-bold text-lg text-gray-800",
                          children: "Transport Status",
                        }),
                        m.jsx(Mh, { className: "w-5 h-5 text-primary-blue" }),
                      ],
                    }),
                    m.jsx("div", {
                      className: "space-y-3",
                      children:
                        (n.transportRoutes || []).length === 0
                          ? m.jsxs("div", {
                              className: "text-center py-8 text-gray-400",
                              children: [
                                m.jsx(Hm, {
                                  className:
                                    "w-12 h-12 mx-auto mb-2 opacity-50",
                                }),
                                m.jsx("p", {
                                  className: "text-sm",
                                  children: "No active routes",
                                }),
                              ],
                            })
                          : ["Route A - Active (8 kids)", "Route B - Idle"].map(
                              (l, u) =>
                                m.jsx(
                                  "div",
                                  {
                                    className: "p-3 rounded-xl bg-white/50",
                                    children: m.jsx("p", {
                                      className:
                                        "text-sm font-medium text-gray-800",
                                      children: l,
                                    }),
                                  },
                                  u,
                                ),
                            ),
                    }),
                  ],
                }),
                m.jsxs("div", {
                  className: "glass-card rounded-card p-6",
                  children: [
                    m.jsxs("div", {
                      className: "flex items-center gap-2 mb-4",
                      children: [
                        m.jsx("h3", {
                          className:
                            "font-heading font-bold text-lg text-gray-800",
                          children: "Recruitment",
                        }),
                        m.jsx(Cl, { className: "w-5 h-5 text-accent-purple" }),
                      ],
                    }),
                    m.jsx("div", {
                      className: "space-y-3",
                      children:
                        (n.applicants || []).length === 0
                          ? m.jsxs("div", {
                              className: "text-center py-8 text-gray-400",
                              children: [
                                m.jsx(Cl, {
                                  className:
                                    "w-12 h-12 mx-auto mb-2 opacity-50",
                                }),
                                m.jsx("p", {
                                  className: "text-sm",
                                  children: "No new applications",
                                }),
                              ],
                            })
                          : [
                              "Emily Watson - Teacher (Pending)",
                              "Robert Chen - Nurse (Interview)",
                            ].map((l, u) =>
                              m.jsx(
                                "div",
                                {
                                  className: "p-3 rounded-xl bg-white/50",
                                  children: m.jsx("p", {
                                    className:
                                      "text-sm font-medium text-gray-800",
                                    children: l,
                                  }),
                                },
                                u,
                              ),
                            ),
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
}
const pw = {
    dashboard: "Dashboard",
    children: "Children",
    staff: "Staff",
    classes: "Classes",
    finance: "Finance",
    transport: "Transport",
    recruitment: "Recruitment",
    settings: "Settings",
  },
  mw = {
    dashboard: "Your nursery overview.",
    children: "Manage children profiles and information",
    staff: "View and manage staff members",
    classes: "Manage class schedules and groups",
    finance: "Track payments and finances",
    transport: "Monitor transport routes and drivers",
    recruitment: "Review job applications and manage hiring pipeline",
    settings:
      "Configure school profile, calendar, roles, notifications, and view logs",
  };
function gw({ activeItem: n, setActiveItem: r, isOpen: s, setIsOpen: a }) {
  const l = [
    { id: "dashboard", icon: Bm, label: "Dashboard" },
    { id: "children", icon: _s, label: "Children" },
    { id: "staff", icon: oa, label: "Staff" },
    { id: "classes", icon: Zi, label: "Classes" },
    { id: "finance", icon: Bh, label: "Finance" },
    { id: "transport", icon: Mh, label: "Transport" },
    { id: "recruitment", icon: Cl, label: "Recruitment" },
    { id: "settings", icon: Jm, label: "Settings" },
  ];
  return m.jsxs("div", {
    className: "fixed top-0 left-0 h-full w-[260px] z-50",
    children: [
      s &&
        m.jsx("div", {
          className: "fixed inset-0 bg-black/30 z-40 lg:hidden",
          onClick: () => a(!1),
        }),
      m.jsxs("div", {
        className: `
        h-full glass-card border-r-0 rounded-none
        transform transition-transform duration-300 ease-in-out
        ${s ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `,
        children: [
          m.jsx("div", {
            className: "h-20 flex items-center px-5 border-b border-gray-100",
            children: m.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                m.jsx("div", {
                  className:
                    "w-11 h-11 rounded-2xl btn-gradient flex items-center justify-center shadow-lg",
                  children: m.jsx("span", {
                    className: "text-white text-xl",
                    children: "🌈",
                  }),
                }),
                m.jsxs("div", {
                  children: [
                    m.jsx("h1", {
                      className: "font-heading font-bold text-lg text-gray-800",
                      children: "My Nursery",
                    }),
                    m.jsx("p", {
                      className: "text-[11px] text-gray-500",
                      children: "Nursery Dashboard",
                    }),
                  ],
                }),
              ],
            }),
          }),
          m.jsx("nav", {
            className: "p-4 space-y-1",
            children: l.map((u) => {
              const d = u.icon,
                f = n === u.id;
              return m.jsxs(
                "button",
                {
                  onClick: () => r(u.id),
                  className: `
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${f ? "bg-gradient-to-r from-primary-blue to-primary-coral text-white shadow-lg glow-mint transform scale-[1.02]" : "text-gray-600 hover:bg-gray-50 hover:scale-[1.01] glow-mint"}
                `,
                  children: [
                    m.jsx(d, { size: 20 }),
                    m.jsx("span", {
                      className: "font-medium",
                      children: u.label,
                    }),
                  ],
                },
                u.id,
              );
            }),
          }),
          m.jsx("div", {
            className:
              "absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100",
            children: m.jsxs("div", {
              className: "glass-card p-4 rounded-xl",
              children: [
                m.jsx("p", {
                  className: "text-xs text-gray-500 mb-3",
                  children: "Need help?",
                }),
                m.jsx("button", {
                  className:
                    "w-full py-2 px-4 bg-gradient-to-r from-primary-blue to-primary-coral text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all",
                  children: "Contact Support",
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
function yw() {
  const [n, r] = C.useState("dashboard"),
    [s, a] = C.useState(!1),
    [l, u] = C.useState(""),
    { signOut: d } = ma(),
    f = async () => {
      await d();
    },
    p = () => {
      switch (n) {
        case "dashboard":
          return m.jsx($h, {});
        case "children":
          return m.jsxs("div", {
            className: "glass-card rounded-3xl p-12 text-center",
            children: [
              m.jsx("h3", {
                className: "font-heading text-xl font-bold text-gray-800 mb-4",
                children: "Children Management",
              }),
              m.jsx("p", {
                className: "text-gray-600",
                children: "Coming soon...",
              }),
            ],
          });
        case "staff":
          return m.jsx(StaffManagement, {});
        case "classes":
          return m.jsx(ClassesManagement, {});
        case "finance":
          return m.jsx(FinanceManagement, {});
        case "transport":
          return m.jsxs("div", {
            className: "glass-card rounded-3xl p-12 text-center",
            children: [
              m.jsx("h3", {
                className: "font-heading text-xl font-bold text-gray-800 mb-4",
                children: "Transport",
              }),
              m.jsx("p", {
                className: "text-gray-600",
                children: "Coming soon...",
              }),
            ],
          });
        case "recruitment":
          return m.jsx(Recruitment, {});
        case "settings":
          return m.jsx(SettingsPage, {});
        default:
          return m.jsx($h, {});
      }
    };
  return m.jsxs("div", {
    className:
      "min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70",
    children: [
      m.jsx(gw, { activeItem: n, setActiveItem: r, isOpen: s, setIsOpen: a }),
      m.jsxs("div", {
        className: "lg:ml-[260px]",
        children: [
          m.jsxs("header", {
            className:
              "h-20 glass-card border-b border-gray-100 flex items-center justify-between px-6",
            children: [
              m.jsxs("div", {
                className: "flex items-center gap-4",
                children: [
                  m.jsx("button", {
                    onClick: () => a(!0),
                    className: "lg:hidden p-2 hover:bg-gray-100 rounded-lg",
                    children: m.jsx(qm, {
                      size: 24,
                      className: "text-gray-600",
                    }),
                  }),
                  m.jsxs("div", {
                    className: "relative hidden sm:block",
                    children: [
                      m.jsx(Gm, {
                        className:
                          "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
                        size: 20,
                      }),
                      m.jsx("input", {
                        type: "text",
                        placeholder: "Search...",
                        value: l,
                        onChange: (y) => u(y.target.value),
                        className:
                          "pl-12 pr-4 py-3 w-80 rounded-xl bg-gray-50 border-0 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue/30",
                      }),
                    ],
                  }),
                ],
              }),
              m.jsxs("div", {
                className: "flex items-center gap-4",
                children: [
                  m.jsxs("button", {
                    className:
                      "relative p-3 hover:bg-gray-100 rounded-xl transition-colors",
                    children: [
                      m.jsx(Im, { size: 22, className: "text-gray-600" }),
                      m.jsx("span", {
                        className:
                          "absolute top-2 right-2 w-2.5 h-2.5 bg-primary-coral rounded-full border-2 border-white",
                      }),
                    ],
                  }),
                  m.jsxs("div", {
                    className:
                      "flex items-center gap-3 pl-4 border-l border-gray-200",
                    children: [
                      m.jsxs("div", {
                        className: "text-right hidden sm:block",
                        children: [
                          m.jsx("p", {
                            className: "font-medium text-gray-800",
                            children: "Admin User",
                          }),
                          m.jsx("p", {
                            className: "text-xs text-gray-500",
                            children: "Administrator",
                          }),
                        ],
                      }),
                      m.jsxs("div", {
                        className: "flex items-center gap-2 pl-4",
                        children: [
                          m.jsx("div", {
                            className:
                              "w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center shadow-lg",
                            children: m.jsx("span", {
                              className: "text-white text-lg",
                              children: "👤",
                            }),
                          }),
                          m.jsx("button", {
                            className:
                              "p-2 hover:bg-red-100 rounded-xl transition-colors",
                            onClick: f,
                            children: m.jsx("svg", {
                              className: "w-5 h-5 text-red-500",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                              children: m.jsx("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
                              }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          m.jsxs("div", {
            className: "p-6 pb-0",
            children: [
              m.jsx("h2", {
                className: "font-heading font-bold text-2xl text-gray-800",
                children: pw[n],
              }),
              m.jsx("p", { className: "text-gray-500 mt-1", children: mw[n] }),
            ],
          }),
          m.jsx("div", { className: "p-6", children: p() }),
        ],
      }),
    ],
  });
}
function vw() {
  const [n, r] = C.useState("overview"),
    s = [
      { label: "Today Attendance", value: "42/45", icon: $m, color: "green" },
      { label: "My Classes", value: "2", icon: Zi, color: "blue" },
      { label: "Children Assigned", value: "28", icon: _s, color: "purple" },
      { label: "Check-ins Today", value: "38", icon: Um, color: "orange" },
    ],
    a = [
      {
        time: "10 min ago",
        action: "Marked attendance for Sunbeam class",
        type: "attendance",
      },
      {
        time: "2 hours ago",
        action: "Updated parent contact info",
        type: "update",
      },
      { time: "Yesterday", action: "Submitted daily report", type: "report" },
    ];
  return m.jsxs("div", {
    className: "space-y-6 p-6",
    children: [
      m.jsx("div", {
        className: "flex items-center justify-between",
        children: m.jsxs("div", {
          children: [
            m.jsx("h1", {
              className: "text-3xl font-heading font-bold text-gray-800",
              children: "Welcome Back!",
            }),
            m.jsx("p", {
              className: "text-gray-600 mt-1",
              children: "Here's what's happening today",
            }),
          ],
        }),
      }),
      m.jsx("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        children: s.map((l, u) => {
          const d = l.icon;
          return m.jsxs(
            "div",
            {
              className:
                "glass-card-inner p-6 rounded-2xl text-center hover:shadow-xl transition-all",
              children: [
                m.jsx("div", {
                  className: `w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${l.color}-400 to-${l.color}-500 flex items-center justify-center`,
                  children: m.jsx(d, { className: "w-7 h-7 text-white" }),
                }),
                m.jsx("p", {
                  className: "text-2xl font-bold text-gray-800 mb-1",
                  children: l.value,
                }),
                m.jsx("p", {
                  className: "text-sm text-gray-600",
                  children: l.label,
                }),
              ],
            },
            u,
          );
        }),
      }),
      m.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
        children: [
          m.jsxs("div", {
            className: "lg:col-span-2 glass-card rounded-2xl p-6",
            children: [
              m.jsx("h2", {
                className: "font-heading font-bold text-xl text-gray-800 mb-6",
                children: "Quick Actions",
              }),
              m.jsxs("div", {
                className:
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                children: [
                  m.jsxs("button", {
                    className:
                      "glass-card-inner p-6 rounded-xl text-center hover:shadow-xl transition-all group",
                    children: [
                      m.jsx(oa, {
                        className:
                          "w-12 h-12 mx-auto mb-4 text-primary-blue group-hover:scale-110 transition-transform",
                      }),
                      m.jsx("h3", {
                        className: "font-semibold text-gray-800 mb-1",
                        children: "Take Attendance",
                      }),
                      m.jsx("p", {
                        className: "text-sm text-gray-600",
                        children: "Mark children present",
                      }),
                    ],
                  }),
                  m.jsxs("button", {
                    className:
                      "glass-card-inner p-6 rounded-xl text-center hover:shadow-xl transition-all group",
                    children: [
                      m.jsx(Zi, {
                        className:
                          "w-12 h-12 mx-auto mb-4 text-accent-purple group-hover:scale-110 transition-transform",
                      }),
                      m.jsx("h3", {
                        className: "font-semibold text-gray-800 mb-1",
                        children: "My Schedule",
                      }),
                      m.jsx("p", {
                        className: "text-sm text-gray-600",
                        children: "View today's classes",
                      }),
                    ],
                  }),
                  m.jsxs("button", {
                    className:
                      "glass-card-inner p-6 rounded-xl text-center hover:shadow-xl transition-all group",
                    children: [
                      m.jsx(_s, {
                        className:
                          "w-12 h-12 mx-auto mb-4 text-accent-green group-hover:scale-110 transition-transform",
                      }),
                      m.jsx("h3", {
                        className: "font-semibold text-gray-800 mb-1",
                        children: "Child Profiles",
                      }),
                      m.jsx("p", {
                        className: "text-sm text-gray-600",
                        children: "View assigned children",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          m.jsxs("div", {
            className: "glass-card rounded-2xl p-6",
            children: [
              m.jsx("h2", {
                className: "font-heading font-bold text-xl text-gray-800 mb-6",
                children: "Recent Activity",
              }),
              m.jsx("div", {
                className: "space-y-4",
                children: a.map((l, u) =>
                  m.jsxs(
                    "div",
                    {
                      className:
                        "flex items-start gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all",
                      children: [
                        m.jsx("div", {
                          className: `w-2 h-2 rounded-full mt-2 flex-shrink-0 ${l.type === "attendance" ? "bg-accent-green" : l.type === "update" ? "bg-primary-blue" : "bg-accent-purple"}`,
                        }),
                        m.jsxs("div", {
                          className: "flex-1",
                          children: [
                            m.jsx("p", {
                              className: "font-medium text-sm text-gray-800",
                              children: l.action,
                            }),
                            m.jsx("p", {
                              className: "text-xs text-gray-500",
                              children: l.time,
                            }),
                          ],
                        }),
                      ],
                    },
                    u,
                  ),
                ),
              }),
            ],
          }),
        ],
      }),
      m.jsxs("div", {
        className: "glass-card rounded-2xl p-6",
        children: [
          m.jsxs("h2", {
            className:
              "font-heading font-bold text-xl text-gray-800 mb-6 flex items-center gap-2",
            children: [
              m.jsx(Zi, { className: "w-6 h-6 text-accent-purple" }),
              "My Classes Today",
            ],
          }),
          m.jsxs("div", {
            className: "space-y-4",
            children: [
              m.jsxs("div", {
                className:
                  "bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50",
                children: [
                  m.jsxs("div", {
                    className: "flex items-center justify-between mb-3",
                    children: [
                      m.jsxs("div", {
                        children: [
                          m.jsx("h3", {
                            className: "font-semibold text-gray-800",
                            children: "Sunbeam (9:00 AM - 11:30 AM)",
                          }),
                          m.jsx("p", {
                            className: "text-sm text-gray-600",
                            children: "12 children • Room 101",
                          }),
                        ],
                      }),
                      m.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          m.jsx("span", {
                            className:
                              "px-3 py-1 bg-accent-green/20 text-accent-green text-xs font-medium rounded-full",
                            children: "Present: 11",
                          }),
                          m.jsx("span", {
                            className:
                              "px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full",
                            children: "Absent: 1",
                          }),
                        ],
                      }),
                    ],
                  }),
                  m.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      m.jsx("button", {
                        className:
                          "flex-1 bg-primary-blue text-white py-2.5 px-4 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all",
                        children: "Take Attendance",
                      }),
                      m.jsx("button", {
                        className:
                          "flex-1 bg-white border border-gray-200 py-2.5 px-4 rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all",
                        children: "View Children",
                      }),
                    ],
                  }),
                ],
              }),
              m.jsxs("div", {
                className:
                  "bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50",
                children: [
                  m.jsxs("div", {
                    className: "flex items-center justify-between mb-3",
                    children: [
                      m.jsxs("div", {
                        children: [
                          m.jsx("h3", {
                            className: "font-semibold text-gray-800",
                            children: "Rainbow (1:00 PM - 3:30 PM)",
                          }),
                          m.jsx("p", {
                            className: "text-sm text-gray-600",
                            children: "15 children • Room 102",
                          }),
                        ],
                      }),
                      m.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          m.jsx("span", {
                            className:
                              "px-3 py-1 bg-accent-green/20 text-accent-green text-xs font-medium rounded-full",
                            children: "Present: 14",
                          }),
                          m.jsx("span", {
                            className:
                              "px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full",
                            children: "Absent: 1",
                          }),
                        ],
                      }),
                    ],
                  }),
                  m.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      m.jsx("button", {
                        className:
                          "flex-1 bg-primary-blue text-white py-2.5 px-4 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all",
                        children: "Take Attendance",
                      }),
                      m.jsx("button", {
                        className:
                          "flex-1 bg-white border border-gray-200 py-2.5 px-4 rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all",
                        children: "View Children",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function ww() {
  const { isAuthenticated: n, isLoading: r, profile: s } = ma(),
    a = Ft(),
    l = Rn(),
    [u, d] = C.useState(!1),
    [f, p] = C.useState(!1),
    [y, v] = C.useState(!1);
  (C.useEffect(() => {
    const S = localStorage.getItem("terms-accepted") === "true";
    (d(S), v(!localStorage.getItem("tour-completed")));
  }, []),
    C.useEffect(() => {
      if (
        (console.log(
          "[FlowManager] authLoading:",
          r,
          "isAuthenticated:",
          n,
          "profile:",
          s,
        ),
        !r)
      ) {
        if (!n)
          a.pathname !== "/splash" &&
            a.pathname !== "/login" &&
            a.pathname !== "/terms" &&
            l("/splash", { replace: !0 });
        else if (!r && s) {
          if (!u) {
            p(!0);
            return;
          }
          switch (
            (console.log("[FlowManager] Redirecting with role:", s.role),
            s.role)
          ) {
            case "ADMIN":
              l("/admin/dashboard", { replace: !0 });
              break;
            case "STAFF":
              l("/staff/dashboard", { replace: !0 });
              break;
            case "DRIVER":
            case "PARENT":
              l("/mobile-only", { replace: !0 });
              break;
            default:
              console.log("[FlowManager] No valid role, staying on page");
          }
        }
      }
    }, [n, r, s, u, a.pathname, l]));
  const x = () => {
      (localStorage.setItem("terms-accepted", "true"),
        d(!0),
        p(!1),
        l("/splash"));
    },
    _ = n && s && !r;
  return r
    ? m.jsx(Oy, { message: "Verifying authentication..." })
    : f && !u
      ? m.jsx("div", {
          className:
            "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-orange-300 to-rose-400",
          children: m.jsx(ra, { isOpen: !0, onAccept: x, onClose: () => {} }),
        })
      : m.jsxs(m.Fragment, {
          children: [
            m.jsxs(Yg, {
              children: [
                m.jsx(Xt, { path: "/splash", element: m.jsx(Ay, {}) }),
                m.jsx(Xt, { path: "/login", element: m.jsx(cw, {}) }),
                m.jsx(Xt, {
                  path: "/terms",
                  element: m.jsx(ra, { onAccept: x }),
                }),
                _ &&
                  m.jsxs(m.Fragment, {
                    children: [
                      m.jsx(Xt, {
                        path: "/admin/*",
                        element: m.jsxs(Lh, {
                          allowedRoles: ["ADMIN"],
                          children: [m.jsx(yw, {}), y && m.jsx(dw, {})],
                        }),
                      }),
                      m.jsx(Xt, {
                        path: "/staff/*",
                        element: m.jsx(Lh, {
                          allowedRoles: ["STAFF"],
                          children: m.jsx(vw, {}),
                        }),
                      }),
                    ],
                  }),
                m.jsx(Xt, { path: "/mobile-only", element: m.jsx(Ef, {}) }),
                m.jsx(Xt, {
                  path: "/",
                  element: m.jsx(oh, { to: "/splash", replace: !0 }),
                }),
                m.jsx(Xt, {
                  path: "*",
                  element: m.jsx(oh, { to: "/splash", replace: !0 }),
                }),
              ],
            }),
            f && m.jsx(ra, { isOpen: !0, onAccept: x }),
          ],
        });
}
function xw() {
  return m.jsx(ww, {});
}
function _w() {
  return m.jsx(_y, { children: m.jsx(xw, {}) });
}
Tm.createRoot(document.getElementById("root")).render(
  m.jsx(C.StrictMode, { children: m.jsx(_w, {}) }),
);
